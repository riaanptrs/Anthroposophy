const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const units=JSON.parse(fs.readFileSync('content/freedom-revision/units.json'));
const chapterParents=[0,1,2,4,5,7,9,10,11,12,14,15,16,18,20,21,21];
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const errors=[];let count=0;
 try{
  for(const javascript of [false,true])for(const width of [320,1280]){
   const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:javascript});
   await context.route('**/*',async route=>{
    const u=new URL(route.request().url());if(u.hostname!=='freedom.test')return route.abort();
    let file=path.resolve('docs','.'+decodeURIComponent(u.pathname.replace(/^\/Anthroposophy/,'')));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.existsSync(file)){errors.push(u.pathname);return route.fulfill({status:404,body:'missing'});}
    await route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   const cases=[];
   for(const lang of ['en','pt']){
    const prefix=lang==='pt'?'pt/':'';
    // Every new study and resource in both languages without JS; integration samples with JS.
    const selected=javascript?units.filter(l=>[1,7,18,23,29,35,36].includes(l.id)):units;
    for(const l of selected)cases.push({route:prefix+'philosophy-of-freedom/studies/'+String(l.id).padStart(2,'0')+'.html',lang,unit:l});
    for(const route of ['index','coverage','sources','glossary','workbook','print'])cases.push({route:prefix+'philosophy-of-freedom/'+route+'.html',lang});
    const ids=javascript?[0,4,12,16,18,20,21]:[...new Set(chapterParents)];
    for(const id of ids)cases.push({route:prefix+'philosophy-of-freedom/lessons/'+String(id).padStart(2,'0')+'.html',lang,parent:id});
   }
   for(const c of cases){
    await page.goto('http://freedom.test/Anthroposophy/'+c.route,{waitUntil:'load'});
    assert.equal(await page.locator('h1').count(),1,c.route+' h1');
    assert.equal(await page.locator('html').getAttribute('lang'),c.lang==='pt'?'pt-BR':'en');
    assert.equal(await page.locator('[data-platform-nav]').count(),1,c.route+' platform nav');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),c.route+' overflow '+width);
    if(c.route.endsWith('philosophy-of-freedom/index.html'))assert.ok(await page.locator('#detailed-studies').isVisible(),c.route+' detailed study discovery visible with JavaScript');
    if(javascript&&c.parent!==undefined)assert.ok((await page.locator('.cw-position').innerText()).includes('16'),c.route+' sixteen core stages');
    if(c.unit||c.parent!==undefined){
     const expected=c.unit?[c.unit]:units.filter(l=>chapterParents[l.chapter]===c.parent);
     for(const l of expected){
      const section=page.locator('[data-freedom-study="'+l.id+'"]');
      for(const p of l[c.lang].steps){
       const text=section.locator('.freedom-study-step').filter({hasText:p});
       assert.ok(await text.isVisible(),c.route+' full explanation visible');
       assert.equal(await text.evaluate(el=>!!el.closest('details:not([open])')),false);
      }
     }
     const answer=page.locator('.freedom-study-answer').first();
     assert.equal(await answer.getAttribute('open'),null);
     await answer.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await answer.locator('p').isVisible(),c.route+' keyboard answer');
    }
    const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,c.route+' duplicate IDs');
    if(c.route.endsWith('/print.html'))assert.equal(await page.locator('.freedom-model-answer:visible').count(),36);
    count++;
   }
   if(javascript&&width===1280){
    await page.goto('http://freedom.test/Anthroposophy/philosophy-of-freedom/index.html');
    await page.locator('#detailed-studies a[href="coverage.html"]').click();
    await page.locator('a[href="studies/06.html"]').click();
    assert.ok(page.url().endsWith('/studies/06.html'));
    await page.locator('.cw-pagination a[href="07.html"]').click();
    assert.ok(page.url().endsWith('/studies/07.html'));
    await page.goto('http://freedom.test/Anthroposophy/philosophy-of-freedom/lessons/12.html');await page.screenshot({path:'reviews/pedagogy/freedom-detailed-desktop.png',fullPage:false});}
   if(!javascript&&width===320){await page.goto('http://freedom.test/Anthroposophy/pt/philosophy-of-freedom/studies/23.html');await page.screenshot({path:'reviews/pedagogy/freedom-detailed-mobile.png',fullPage:false});}
   await context.close();console.log('Browser cases passed:',count);
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync('reviews/pedagogy/freedom-detailed-browser.json',JSON.stringify({status:'passed',cases:count,widths:[320,1280],javascript:[false,true],checks:['every new study and resource in both languages without JavaScript','all main chapter explanations visible without disclosures','integration samples with JavaScript and course workspace','keyboard answer disclosures','one h1 and correct language','no duplicate IDs','no document horizontal overflow','local assets load under GitHub Pages path prefix','overview to study and next-study navigation','all print answers visible'],limits:['No learner study','External links not visited','Original PDF wording checked selectively, not as a browser test']},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
