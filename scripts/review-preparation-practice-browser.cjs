const {chromium}=require('playwright');const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const d=JSON.parse(fs.readFileSync('content/preparation-practice.json'));const plain=s=>s.replace(/\s+/g,' ').trim();
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let cases=0,calculatorChecks=0;const errors=[];
try{
for(const javascript of [false,true])for(const width of [1280,320]){
 const c=await b.newContext({viewport:{width,height:950},javaScriptEnabled:javascript,reducedMotion:'reduce'});
 await c.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();let f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 for(const course of ['what-is-biodynamics','agriculture'])for(const lang of ['en','pt']){
 const url=`http://course.test/${lang==='pt'?'pt/':''}${course}/index.html`;await p.goto(url);await p.waitForLoadState('networkidle');const entry=p.locator('.preparation-guide-entry');assert.ok(await entry.isVisible(),url+' practical guide visible');assert.ok(await entry.locator('a').isVisible());assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overview overflow');
 if(javascript)assert.equal(await entry.evaluate(el=>Boolean(el.closest('.cw-hero'))),true,url+' practical guide survives enhanced overview');
}
 for(const page of d.pages)for(const lang of ['en','pt']){
  const url=`http://course.test/${lang==='pt'?'pt/':''}what-is-biodynamics/practical/${page.id}.html`;await p.goto(url);await p.waitForLoadState('networkidle');
  assert.equal(await p.locator('h1').count(),1,url);assert.equal(await p.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
  const text=plain(await p.locator('main').innerText());for(const s of page.sections){assert.ok(text.includes(plain(s.title[lang])),url+' heading '+s.id);for(const v of [...(s.paragraphs?.[lang]||[]),...(s.steps?.[lang]||[]),...(s.items?.[lang]||[])])assert.ok(text.includes(plain(v)),url+' visible explanation '+s.id);}
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' document overflow '+width);
  const ids=await p.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size,url+' unique IDs');
  for(const href of await p.locator('main a[href],link[rel="alternate"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')))){const u=new URL(href,url);if(u.hostname!=='course.test')continue;let f=path.resolve('docs','.'+decodeURIComponent(u.pathname));assert.ok(fs.existsSync(f),url+' missing '+href);if(u.hash&&f.endsWith('.html')){const id=decodeURIComponent(u.hash.slice(1));if(u.pathname===new URL(url).pathname)assert.ok((await p.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id))).includes(id),url+' missing live anchor '+href);else assert.ok(fs.readFileSync(f,'utf8').includes('id="'+id+'"'),url+' missing anchor '+href);}}
  if(page.id==='application'){
   const form=p.locator('[data-preparation-calculator]'),area=form.locator('[name="area"]'),prep=form.locator('[name="preparation"]');
   if(!javascript){assert.ok(await area.isDisabled());assert.ok(text.includes(lang==='pt'?'A calculadora exige JavaScript':'The calculator requires JavaScript'));}
   else{
    assert.ok(await area.isEnabled());
    for(const [a,n,g,w] of [[1000,'500','10 g','5 L'],[1000,'501',lang==='pt'?'0,4 g':'0.4 g','5 L'],[100,'501',lang==='pt'?'0,04 g':'0.04 g',lang==='pt'?'0,5 L':'0.5 L'],[10000,'500','100 g','50 L']]){
     await area.fill(String(a));await prep.selectOption(n);assert.equal(await form.locator('[data-dose]').innerText(),g);assert.equal(await form.locator('[data-water]').innerText(),w);calculatorChecks++;
    }
    await area.fill('0');assert.equal(await form.locator('[data-dose]').innerText(),'—');await area.fill('');assert.equal(await form.locator('[data-water]').innerText(),'—');calculatorChecks+=2;
    await area.fill('1000');await area.press('Enter');assert.equal(p.url(),url,'Enter does not submit/reload');
    if(lang==='pt'&&width===320){await form.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await p.screenshot({path:'/tmp/preparations-practical/calculator-pt-mobile.png',animations:'disabled'});}
   }
  }
  if(javascript&&width===1280&&page.id==='compost'&&lang==='en'){await p.locator('.preparation-compost-diagram').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await p.screenshot({path:'/tmp/preparations-practical/compost-en-desktop.png',animations:'disabled'});}
  cases++;
 }
 
 await c.close();console.log('Passed '+cases+' page cases');
}
assert.deepEqual(errors,[]);fs.writeFileSync('reviews/pedagogy/preparation-practice-browser.json',JSON.stringify({reviewed:'2026-10-24',status:'passed',pages:28,viewportAndJavascriptCases:cases,calculatorChecks,overviewEntryCases:16,widths:[1280,320],javascript:[false,true],checks:['complete visible bilingual instructions','correct document language and single title','all local links and section anchors','no duplicate IDs or document overflow','calculator disabled with readable static examples without JavaScript','calculator area/identity changes, metric arithmetic, zero/empty validation and no form submission','course-workspace integration with JavaScript enabled','practical companion links visible on both course overviews with and without JavaScript'],limits:['No field experiment or learner study','Recipe correctness reviewed separately from UI arithmetic']},null,2)+'\n');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
