const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const lessons=JSON.parse(fs.readFileSync('content/phases/course.json'));
 const routes=['index.html','sources.html','glossary.html','workbook.html','print.html',...lessons.map(l=>'lessons/'+String(l.id).padStart(2,'0')+'.html')];
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let cases=0;const errors=[];
 try{
 for(const width of [1280,320])for(const js of [true,false]){
  const context=await browser.newContext({viewport:{width,height:940},javaScriptEnabled:js});
  await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.md':'text/plain'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
  const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const prefix of ['','pt/'])for(const route of js?routes:['index.html','lessons/04.html','print.html']){
   const url='http://course.test/'+prefix+'learn/phases/'+route;await p.goto(url);await p.locator('h1').first().waitFor();
   assert.equal(await p.locator('h1').count(),1,url);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow '+width);
   assert.equal(await p.locator('html').getAttribute('lang'),prefix?'pt-BR':'en');
   if(route==='index.html'&&js){const input=p.locator('[data-phases-search]');await input.fill(prefix?'organização':'organization');assert.ok(await p.locator('[data-phases-entry]:visible').count()<18);assert.ok(await p.locator('[data-phases-entry]:visible').count()>0);await input.fill('zzzzxxyy');assert.equal(await p.locator('[data-phases-entry]:visible').count(),0);await input.fill('');assert.equal(await p.locator('[data-phases-entry]:visible').count(),18);}
   if(route.startsWith('lessons/')){assert.ok(await p.locator('[data-phases-lesson]').isVisible());const d=p.locator('.phases-question details');await d.locator('summary').click();assert.ok(await d.locator('p').isVisible());}
   if(route==='print.html'){await p.emulateMedia({media:'print'});assert.equal(await p.locator('[data-phases-lesson]').count(),18);assert.ok(await p.locator('.phases-question details p').first().isVisible(),'print answer hidden');await p.emulateMedia({media:'screen'});}
   if(js&&!prefix&&width===1280&&route==='lessons/04.html')await p.screenshot({path:'/tmp/phases-lesson-desktop.png',fullPage:true});
   if(js&&prefix&&width===320&&route==='index.html')await p.screenshot({path:'/tmp/phases-home-mobile.png',fullPage:true});
   cases++;
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);const report={pageCases:cases,widths:[1280,320],languages:['en','pt-BR'],allRoutesWithJS:true,noJS:['index','lesson','print'],checks:['headings','language','no horizontal overflow','search and zero results','answer disclosure','print includes answers'],errors};fs.writeFileSync('reviews/phases-browser.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
