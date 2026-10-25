const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
const {chapters,lessons}=await import('../content/start-now/course.mjs');
const routes=['index.html',...chapters.map(c=>'chapters/'+c.id+'.html'),...lessons.map(l=>'lessons/'+l.id+'.html')];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checked=0;const errors=[];
try{for(const width of [1280,320])for(const js of [true,false]){
 const context=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:js});
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 for(const prefix of ['','pt/'])for(const route of (js?routes:['index.html','lessons/seed-and-plant.html','chapters/school.html'])){
  const url='http://course.test/'+prefix+'start-now/'+route;await p.goto(url);await p.waitForLoadState('load');await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('h1').count(),1,url);assert.equal(await p.locator('html').getAttribute('lang'),prefix?'pt-BR':'en');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow '+width);
  const ids=await p.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size,url+' IDs');
  if(route==='index.html'){
   assert.ok(await p.locator('[data-start-now-orientation]').isVisible(),url+' orientation');
   assert.equal(await p.locator('[data-sn-entry]').count(),38);assert.equal(await p.locator('#sn-search').isDisabled(),!js);
   if(js){await p.goto(url+'#practice-directory');await p.locator('#sn-search').fill(prefix?'semente':'seed');const visible=await p.locator('[data-sn-entry]:visible').count();assert.ok(visible>0&&visible<38,'filter');await p.locator('#sn-search').fill('');assert.equal(await p.locator('[data-sn-entry]:visible').count(),38);}
  }
  if(route.startsWith('lessons/')){assert.ok(await p.locator('[data-start-now-lesson]').isVisible());await p.locator('.sn-answer summary').click();assert.ok(await p.locator('.sn-answer p').isVisible());}
  if(route==='chapters/school.html'){
   await p.locator('#source-page-180 > summary').click();const img=p.locator('#source-page-180 img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.naturalWidth>500));
   await p.locator('#source-page-180 .sn-transcription summary').click();assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'reader overflow');
   if(width===320&&js&&!prefix)await p.screenshot({path:'/tmp/start-now-source-mobile.png'});
  }
  checked++;
 }
 await context.close();
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({pageCases:checked,widths:[1280,320],allRoutesWithJS:true,noJS:['home','lesson','source reader'],checks:['language','single heading','no overflow','unique IDs','visible teaching','search','explained answers','original page image and OCR'],pageErrors:errors}));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
