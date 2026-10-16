// Generated-page delivery checks for the individually audited conceptual batch.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=f=>JSON.parse(fs.readFileSync(f));
async function loadCases(){
 if(process.env.REVIEW_ROUTES_JSON)return read(process.env.REVIEW_ROUTES_JSON).map(route=>({route,lang:route.startsWith('pt/')?'pt':'en'}));
 const coverage=read('reviews/pedagogy/chapter-coverage.json').records;
 const routes=new Set(coverage.flatMap(r=>[r.path.slice(5),r.partner.slice(5)]));
 for(const lang of ['','pt/']){
  for(const file of fs.readdirSync('docs/'+lang+'foodwise/ingredients'))if(file.endsWith('.html'))routes.add(lang+'foodwise/ingredients/'+file);
  for(const file of fs.readdirSync('docs/'+lang+'foodwise/kitchen'))if(file.endsWith('.html'))routes.add(lang+'foodwise/kitchen/'+file);
  for(const file of ['index.html','sources.html','glossary.html'])routes.add(lang+'foodwise/'+file);
  for(const file of ['index.html','sources.html','print.html','first-readings.html'])routes.add(lang+'nutrition/'+file);
 }
 return [...routes].map(route=>({route,lang:route.startsWith('pt/')?'pt':'en'}));
}

(async()=>{
 const cases=await loadCases();
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const failures=[];let tested=0;
 try{
  for(const width of [1280,320]){
   const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false});
   await context.route('**/*',async route=>{
    const url=new URL(route.request().url());if(url.hostname!=='course.test')return route.abort();
    const file=path.resolve('docs','.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(file)){failures.push(url.pathname);return route.fulfill({status:404,body:'Missing'});}
    return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
   });
   const page=await context.newPage();
   for(const c of cases){
    await page.goto('http://course.test/'+c.route);
    assert.equal(await page.locator('h1').count(),1,c.route);
    assert.equal(await page.locator('html').getAttribute('lang'),c.lang==='pt'?'pt-BR':'en',c.route);
    const paragraph=page.locator('main p').filter({hasText:/\S/}).first();assert.ok(await paragraph.isVisible(),c.route+' teaching visible without JS');
    assert.equal(await paragraph.evaluate(el=>!!el.closest('details:not([open])')),false,c.route+' core teaching not hidden');
    const links=await page.locator('main a[href], header a[href], link[rel="alternate"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
    for(const href of links){
     const u=new URL(href,'http://course.test/'+c.route);if(u.hostname!=='course.test')continue;
     const target=path.resolve('docs','.'+decodeURIComponent(u.pathname));
     assert.ok(fs.existsSync(target),c.route+' missing link '+href);
     if(u.hash&&target.endsWith('.html')){
      const html=fs.readFileSync(target,'utf8'),id=decodeURIComponent(u.hash.slice(1));
      assert.ok(html.includes('id="'+id+'"')||html.includes("id='"+id+"'"),c.route+' missing fragment '+href);
     }
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),c.route+' horizontal overflow '+width);
    const answer=page.locator('main details').first();
    if(await answer.count()){
     await answer.locator(':scope > summary').focus();await page.keyboard.press('Enter');
     assert.notEqual(await answer.getAttribute('open'),null,c.route+' keyboard disclosure');
    }
    const broken=await page.locator('main a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('#')&&!document.getElementById(h.slice(1))));
    assert.deepEqual(broken,[],c.route+' local fragments');tested++;if(tested%50===0)console.log('Browser cases passed: '+tested);
   }
   await context.close();
  }
  assert.deepEqual(failures,[],'missing local assets');
  const result={pages:cases.length,viewportCases:tested,widths:[1280,320],javaScript:false,checks:['visible core teaching','language','keyboard disclosure','overflow','local and linked fragments','all main/header links','loaded assets'],status:'passed'};
  fs.writeFileSync(process.env.REVIEW_ROUTES_JSON?'reviews/pedagogy/remaining-final-changed-browser.json':'reviews/pedagogy/full-course-release-browser.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
