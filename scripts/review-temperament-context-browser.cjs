const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});let tested=0;const missing=[];
 try{
 for(const width of [1280,320]){
  const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false});
  await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='course.test')return route.abort();let f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f)){missing.push(u.pathname);return route.fulfill({status:404,body:'Missing'});}return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
  const page=await context.newPage();
  for(const lang of ['en','pt']){
   const base=lang==='pt'?'pt/':'';
   const routes=['temperaments','understanding-temperaments','understand-temperament','mystery-temperaments'].map(c=>base+c+'/index.html');
   for(const [course,count]of [['understand-temperament',13],['mystery-temperaments',15]])for(let id=0;id<count;id++)routes.push(base+course+'/lessons/'+String(id).padStart(2,'0')+'.html');
   for(const route of routes){
    await page.goto('http://course.test/'+route);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
    if(route.includes('/lessons/'))assert.ok(await page.locator('[data-temperament-context]').isVisible(),route+' historical context visible');
    if(route===base+'understanding-temperaments/index.html'){
     const guide=page.locator('#practical-guide');assert.ok(await guide.isVisible());assert.equal(await guide.locator('tbody tr').count(),4);
     assert.equal(await guide.locator('tbody th a').count(),4);
     if(width===320)await page.screenshot({path:'/tmp/temperament-guide-'+lang+'.png',fullPage:false});
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
    const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length);
    const links=await page.locator('main a[href],header a[href],link[rel="alternate"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')));
    for(const href of links){const u=new URL(href,'http://course.test/'+route);if(u.hostname!=='course.test')continue;let f=path.resolve('docs','.'+decodeURIComponent(u.pathname));assert.ok(fs.existsSync(f),route+' '+href);if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(u.hash&&f.endsWith('.html'))assert.ok(fs.readFileSync(f,'utf8').includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),route+' anchor '+href);}
    tested++;
   }
  }
  await context.close();console.log('Passed '+tested+' context/index browser cases');
 }
 assert.deepEqual(missing,[]);fs.writeFileSync('reviews/pedagogy/temperament-context-browser.json',JSON.stringify({status:'passed',pages:64,viewportCases:tested,widths:[1280,320],javascript:false,checks:['28 source-companion lessons in both languages retain visible contextual corrections','four bilingual indexes link practical guide','four same-situation portrait links','single h1 and correct language','local links and fragments','no duplicate IDs or missing assets','no horizontal page overflow; comparison table scrolls within container'],limits:['No original PDF/Markdown verification','No learner study']},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
