// Run after node scripts/build-all.mjs. Uses only local files via intercepted requests.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checked=0;const errors=[];
try{for(const width of [1280,320])for(const js of [true,false]){
 const c=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:js});
 await c.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 for(const prefix of ['', 'pt/'])for(const id of ['index','00','01','02','03','04','05','06','07','08']){
  const url='http://course.test/'+prefix+'meditation/'+id+'.html';await p.goto(url);await p.waitForLoadState('load');
  assert.equal(await p.locator('h1').count(),1,url);assert.equal(await p.locator('html').getAttribute('lang'),prefix?'pt-BR':'en');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow at '+width);
  const ids=await p.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size,url+' IDs');
  if(['00','01','02','03','05','08'].includes(id))assert.ok(await p.locator('[data-practical-guide]').isVisible(),url+' guide visible');
  if(id==='02')assert.equal(await p.locator('.practice-table-wrap tbody tr').count(),6);
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
  if(id==='01'&&js){
   const toggle=p.locator('.verse-focus');await toggle.click();assert.equal(await p.locator('body').getAttribute('class').then(x=>x.includes('verse-mode')),true);
   assert.equal(await p.locator('[data-practical-guide]').isVisible(),false);assert.equal(await p.locator('.meditation-text.active .verse').isVisible(),true);await toggle.click();assert.equal(await p.locator('[data-practical-guide]').isVisible(),true);
   await p.locator('[data-download]').click();assert.ok((await p.locator('.download-status').innerText()).length>0);
   await p.locator('#reflection').fill('A practice reflection / Uma reflexão.');const downloaded=p.waitForEvent('download');await p.locator('[data-download]').click();const d=await downloaded;assert.ok(d.suggestedFilename().endsWith(prefix?'pt.txt':'en.txt'));
   if(width===320)await p.screenshot({path:'/tmp/start-now-'+(prefix?'pt':'en')+'-mobile.png',fullPage:true});
  }
  checked++;
 }
 await c.close();
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({pageCases:checked,widths:[1280,320],javascript:[true,false],checks:['visible practice choice with and without JavaScript','six choices with purpose, preparation, rhythm and review criteria','all practice-selection links and anchors','visible bilingual guidance','single title','no horizontal document overflow','unique IDs','six-month table','entry links','verse focus and return','reflection validation and download'],pageErrors:errors},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
