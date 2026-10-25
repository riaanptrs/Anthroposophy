// Run after the full build. All requests are served from local docs files.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checked=0;const errors=[];
try{for(const width of [1280,320]){
 const c=await browser.newContext({viewport:{width,height:950}});await c.route('**/*',async r=>{
  const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const name=u.pathname.replace(/^\/Anthroposophy\//,'');const f=path.resolve('docs',decodeURIComponent(name));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});
  return r.fulfill({contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(f)]||'text/plain',body:fs.readFileSync(f)});
 });
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const base='http://course.test/Anthroposophy/learn/steiner-documentary/index.html';
 for(const route of ['/', '/lessons',...Array.from({length:12},(_,i)=>'/lesson/'+(i+1)),...Array.from({length:43},(_,i)=>'/source/'+(i+1)),'/voices','/workbook','/resources']){
  await p.goto(base+'#'+route);await p.waitForFunction(()=>document.querySelector('#main h1'));
  assert.equal(await p.locator('h1').count(),1,route);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
  assert.ok(!/Page not found|not available/i.test(await p.locator('h1').innerText()),route);checked++;
 }
 await p.goto('http://course.test/Anthroposophy/pt/learn/steiner-documentary/index.html');assert.equal(await p.locator('html').getAttribute('lang'),'pt-BR');assert.ok((await p.locator('main').innerText()).includes('inglês'));
 await c.close();
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({routeCases:checked,widths:[1280,320],pageErrors:errors,checks:['all lessons and source sections render under GitHub Pages repository prefix','single page title','no document overflow','Portuguese English-course notice']},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
