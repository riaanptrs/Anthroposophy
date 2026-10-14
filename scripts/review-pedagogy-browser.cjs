// Run after build-all; no server or external network required.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const course=JSON.parse(fs.readFileSync('content/theosophy-concept-course.json'));
 const routes=['','pt/'].flatMap(prefix=>[...course.lessonIds.map(id=>prefix+'theosophy/lessons/'+id+'.html'),...Array.from({length:9},(_,i)=>prefix+'meditation/'+String(i).padStart(2,'0')+'.html')]);
 let checks=0;const errors=[];
 try {
  for(const width of [1280,320]){
   const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false});
   await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.hostname!=='course.test')return route.abort();
    const file=path.resolve('docs','.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(file)) {errors.push(url.pathname);return route.fulfill({status:404,body:'Missing'});}
    return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
   });
   const page=await context.newPage();
   for(const route of routes){
    await page.goto('http://course.test/'+route);
    const section=page.locator('[data-concept-section="worked-example"], [data-meditation-case]');
    assert.equal(await section.count(),1,route);
    assert.ok(await section.locator(':scope > p').isVisible(),route+' direct teaching visible');
    const optional=section.locator(':scope > details');
    assert.equal(await optional.getAttribute('open'),null,route+' optional prompt starts closed');
    await optional.locator(':scope > summary').click();
    const answer=optional.locator('details');
    assert.equal(await answer.getAttribute('open'),null,route+' answer remains optional');
    await answer.locator('summary').focus();await page.keyboard.press('Enter');
    assert.ok(await answer.locator('p').isVisible(),route+' keyboard/no-JS answer');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
    const language=await page.locator('html').getAttribute('lang');assert.equal(language,route.startsWith('pt/')?'pt-BR':'en');
    checks++;
   }
   await context.close();
  }
  assert.deepEqual(errors,[],'Missing local assets');
  console.log(`Pedagogy browser passed: ${routes.length} bilingual pages, ${checks} desktop/mobile no-JavaScript cases; keyboard disclosures, language, overflow and local assets.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
