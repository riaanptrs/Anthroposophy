// Run after node scripts/build-all.mjs. Uses only local files via intercepted requests.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checked=0;const errors=[];
try{for(const width of [1280,320])for(const js of [true,false]){
 const c=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:js});
 await c.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 for(const prefix of ['', 'pt/'])for(const id of ['index','00','01','02','03','04','05','06','07','08']){
  const url='http://course.test/'+prefix+'meditation/'+id+'.html';await p.goto(url);await p.waitForLoadState('load');await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('h1').count(),1,url);assert.equal(await p.locator('html').getAttribute('lang'),prefix?'pt-BR':'en');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow at '+width);
  const ids=await p.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size,url+' IDs');
  if(['00','01','02','03','05','08'].includes(id))assert.ok(await p.locator('[data-practical-guide]').isVisible(),url+' guide visible');
  if(id==='02')assert.equal(await p.locator('.practice-table-wrap tbody tr').count(),6);
  if(id==='04'){
   assert.ok(await p.locator('[data-weekly-study]').isVisible(),url+' weekly teaching visible');
   assert.equal(await p.locator('[data-weekly-commentary]').count(),4);
   assert.equal(await p.locator('[data-reading-week]').count(),52);
   assert.equal(await p.locator('#year-rhythm li').count(),4);
   assert.equal(await p.locator('[data-weekly-mirror]').isDisabled(),!js);
   if(js){
    for(const n of [1,14,26,39,52]){
     await p.locator('[data-weekly-mirror]').selectOption(String(n));
     assert.ok((await p.locator('#mirror-result').innerText()).includes(`${n} ↔ ${prefix?'Semana':'Week'} ${53-n}`));
    }
    await p.locator('#year-rhythm').screenshot({path:`/tmp/weekly-rhythm-${prefix?'pt':'en'}-${width}.png`});
   }
   await p.locator('.weekly-map-details > summary').click();
   assert.ok(await p.locator('[data-reading-week="52"]').isVisible());
   const q=p.locator('.weekly-understanding').first();await q.locator('summary').click();assert.ok(await q.locator('p').isVisible());
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' expanded map overflow '+width);
  }

  if(id==='index'){
   await p.locator('[data-practice-choice]').waitFor({state:'visible',timeout:5000});
   assert.equal(await p.locator('.practice-choice-card').count(),6);
   assert.equal(await p.locator('.practice-choice-card dt').count(),36);
   for(const href of await p.locator('[data-practice-choice] a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')))){
    const u=new URL(href,url),f=path.resolve('docs','.'+u.pathname);
    assert.ok(fs.existsSync(f),url+' missing choice link '+href);
    if(u.hash)assert.ok(fs.readFileSync(f,'utf8').includes('id="'+u.hash.slice(1)+'"'),url+' choice anchor '+href);
   }

   for(const a of await p.locator('.practical-guide a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')))){
    const u=new URL(a,url),f=path.resolve('docs','.'+u.pathname);assert.ok(fs.existsSync(f),url+' missing practical link '+a);if(u.hash)assert.ok(fs.readFileSync(f,'utf8').includes('id="'+u.hash.slice(1)+'"'));
   }
  }
  if(id==='06'){
   assert.ok(await p.locator('[data-foundation-study]').isVisible(),url+' Foundation study visible');
   assert.equal(await p.locator('.foundation-map-card').count(),3);
   assert.equal(await p.locator('#foundation-translations tbody tr').count(),3);
   const variant=p.locator('.foundation-variant');await variant.locator('summary').click();assert.ok(await variant.locator('p').isVisible());
   if(js)await p.locator('#foundation-map').screenshot({path:`/tmp/foundation-map-${prefix?'pt':'en'}-${width}.png`});
  }
  if(id==='07'){
   assert.ok(await p.locator('[data-foundation-practice]').isVisible(),url+' Foundation practice visible');
   assert.equal(await p.locator('.foundation-plan li').count(),4);
   assert.ok(await p.locator('.foundation-practice-excerpt').isVisible());
  }
  if(['01','06'].includes(id)&&js){
   const toggle=p.locator('.verse-focus');await toggle.click();assert.equal(await p.locator('body').getAttribute('class').then(x=>x.includes('verse-mode')),true);
   const guide=p.locator(id==='06'?'[data-foundation-study]':'[data-practical-guide]');assert.equal(await guide.isVisible(),false);assert.equal(await p.locator('.meditation-text.active .verse').isVisible(),true);await toggle.click();assert.equal(await guide.isVisible(),true);
   await p.locator('[data-download]').click();assert.ok((await p.locator('.download-status').innerText()).length>0);
   await p.locator('#reflection').fill('A practice reflection / Uma reflexão.');const downloaded=p.waitForEvent('download');await p.locator('[data-download]').click();const d=await downloaded;assert.ok(d.suggestedFilename().endsWith(prefix?'pt.txt':'en.txt'));
   if(width===320)await p.screenshot({path:'/tmp/start-now-'+(prefix?'pt':'en')+'-mobile.png',fullPage:true});
  }
  checked++;
 }
 await c.close();
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({pageCases:checked,widths:[1280,320],javascript:[true,false],checks:['Foundation Stone study, diagram, translation comparison and variant note','four-session Foundation practice with visible excerpt','verse focus preserves the complete Foundation meditation','weekly routine, four verse commentaries and 52-week map','mirror comparisons and non-JavaScript fallback','annual diagram at desktop and mobile widths','visible practice choice with and without JavaScript','six choices with purpose, preparation, rhythm and review criteria','all practice-selection links and anchors','visible bilingual guidance','single title','no horizontal document overflow','unique IDs','six-month table','entry links','verse focus and return','reflection validation and download'],pageErrors:errors},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
