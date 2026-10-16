const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const lessons=JSON.parse(fs.readFileSync('content/agriculture-clear-lessons.json'));
const plain=s=>s.replace(/\s+/g,' ').trim();
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 let tested=0;const missing=[];
 try{
  for(const width of [1280,320]){
   const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false});
   await context.route('**/*',async route=>{
    const u=new URL(route.request().url());if(u.hostname!=='course.test')return route.abort();
    const file=path.resolve('docs','.'+decodeURIComponent(u.pathname));
    if(!file.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(file)){missing.push(u.pathname);return route.fulfill({status:404,body:'Missing'});}
    return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
   });
   const page=await context.newPage();
   for(const lesson of lessons)for(const lang of ['en','pt']){
    const route=`${lang==='pt'?'pt/':''}${lesson.course==='foundations'?'learn/lessons':lesson.course==='meditation'?'meditation':lesson.course+'/lessons'}/${String(lesson.id).padStart(2,'0')}.html`,v=lesson[lang];
    await page.goto('http://course.test/'+route);
    assert.equal(await page.locator('h1').count(),1,route);
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
    const first=page.locator('[data-batch-clarity-first]');
    const paras=await first.locator(':scope > p').allInnerTexts();assert.deepEqual(paras.map(plain),v.paragraphs.map(plain),route+' complete prose in authored order');
    for(const p of await first.locator(':scope > p').all())assert.ok(await p.isVisible(),route+' visible prose without JS');
    const checks=first.locator('.batch-clarity-check');assert.equal(await checks.count(),2);
    for(let i=0;i<2;i++){
     const check=checks.nth(i),answer=check.locator('details');assert.ok(await check.locator(':scope > p').isVisible());
     assert.equal(await answer.getAttribute('open'),null);await answer.locator('summary').focus();await page.keyboard.press('Enter');
     assert.ok(await answer.locator('p').isVisible());assert.equal(plain(await answer.locator('p').innerText()),plain(v.checks[i][1]));
    }
    const deeper=page.locator('details.batch-retained-depth');assert.equal(await deeper.getAttribute('open'),null);
    assert.equal(await deeper.locator('p').first().isVisible(),false);
    await deeper.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.ok(await deeper.locator('p').first().isVisible());
    assert.ok(await page.locator('main > nav.lesson-navigation').isVisible(),route+' navigation outside optional depth');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
    const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,route+' duplicate IDs');
    const links=await page.locator('main a[href],header a[href],link[rel="alternate"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
    for(const href of links){const u=new URL(href,'http://course.test/'+route);if(u.hostname!=='course.test')continue;let f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');assert.ok(fs.existsSync(f),route+' missing '+href);if(u.hash&&f.endsWith('.html')){const h=fs.readFileSync(f,'utf8');assert.ok(h.includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),route+' missing anchor '+href);}}
    tested++;
   }
   await context.close();console.log('Passed '+tested+' browser cases');
  }
  assert.deepEqual(missing,[]);
  fs.writeFileSync('reviews/pedagogy/agriculture-clarity-browser.json',JSON.stringify({status:'passed',pages:112,viewportCases:tested,widths:[1280,320],javascript:false,checks:['complete main prose visible in authored order','two visible questions with keyboard-operable explained answers','retained depth closed and keyboard-operable','language and single heading','local links and anchors','assets','no duplicate IDs','no horizontal overflow'],limits:['No learner study','No fresh source-fidelity verification']},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
