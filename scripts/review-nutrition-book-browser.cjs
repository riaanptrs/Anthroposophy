const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const figuresOnly=process.argv.includes('--figures');
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checked=0;const errors=[],missing=[];
 try{for(const width of [1280,320])for(const js of [true,false]){
  const context=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:js});
  await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f)){missing.push(u.pathname);return r.fulfill({status:404,body:'Missing'});}return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
  const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const prefix of ['','pt/'])for(const route of (figuresOnly?['06.html','08.html','09.html','10.html']:[...Array.from({length:18},(_,i)=>String(i).padStart(2,'0')+'.html'),'index.html','sources.html','first-readings.html'])){
   const url='http://course.test/'+prefix+'nutrition/'+route;console.log(width,js,url);await p.goto(url);await p.waitForLoadState('load');await p.evaluate(()=>document.fonts.ready);
   assert.equal(await p.locator('h1').count(),1,url);assert.equal(await p.locator('html').getAttribute('lang'),prefix?'pt-BR':'en');
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow '+width);
   const ids=await p.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size,url+' IDs');
   if(/^\d\d/.test(route)){
    assert.ok(await p.locator('[data-nutrition-book-lesson]').isVisible(),url+' detailed teaching visible');
    assert.equal(await p.locator('.nutrition-book-concept').count(),4);assert.ok(await p.locator('.nutrition-book-case').isVisible());
    const q=p.locator('.nutrition-book-answer');await q.locator('summary').focus();await p.keyboard.press('Enter');assert.ok(await q.locator('p').isVisible());
    if(['06.html','08.html','09.html','10.html'].includes(route)){
     await p.locator('.nutrition-book-source > summary').focus();await p.keyboard.press('Enter');const img=p.locator('.nutrition-book-source img');await img.evaluate(el=>el.scrollIntoView({block:"center"}));await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.naturalWidth>1000&&el.getBoundingClientRect().height>30),'Source image has visible dimensions '+url);assert.ok(await img.isVisible());
     assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' figure overflow');
    }
    if(route==='08.html'&&width===320&&js){await p.locator('#book-teaching').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/nutrition-detailed-'+(prefix?'pt':'en')+'-mobile.png'});}
    if(route==='01.html'&&js){await p.locator('.batch-retained-depth > summary').click();const quiz=p.locator('.nutrition-quiz').first();await quiz.locator('[data-nutrition-check]').click();assert.ok((await quiz.locator('[data-nutrition-feedback]').innerText()).length>0);const correct=+(await quiz.getAttribute('data-answer'));await quiz.locator('input').nth(correct).check();await quiz.locator('[data-nutrition-check]').click();assert.equal(await quiz.getAttribute('data-feedback'),'correct');}
   }else if(route==='index.html')assert.ok(await p.locator('[data-nutrition-book-orientation]').isVisible());
   else if(route==='sources.html'){
    assert.equal(await p.locator('.nutrition-current-page-map > li').count(),122);assert.equal(await p.locator('#excerpt-current-locations li').count(),16);
    await p.locator('#capture-concordance > summary').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#capture-concordance tbody tr').count(),118);
   }else{
    assert.equal(await p.locator('[data-nutrition-book-lesson]').count(),18);
    assert.equal(await p.locator('.nutrition-book-answer[open]').count(),18);
   }
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' expanded overflow');checked++;
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 const report={scope:figuresOnly?'source figure pages':'all lesson and resource pages',pageCases:checked,widths:[1280,320],javascript:[true,false],checks:figuresOnly?['four source figures load with visible dimensions','source comparisons and application answers open by keyboard','bilingual teaching and worked cases','language, unique IDs and no document overflow']:['all 36 lesson bodies show detailed teaching','chapter explanations and worked cases','keyboard-operable application answers','four source figures decode and fit','current 122-page map and 16 excerpt locations','legacy concordance','course entry visible','collected print answers open','existing quiz feedback','language, unique IDs and no document overflow'],pageErrors:errors,missingAssets:missing};
 fs.writeFileSync('reviews/pedagogy/'+(figuresOnly?'nutrition-book-figures-browser.json':'nutrition-book-browser.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
