const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const lessons=JSON.parse(fs.readFileSync('content/philosophy-of-freedom-clear-lessons.json'));
const plain=s=>s.replaceAll('**','').replace(/\s+/g,' ').trim();
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
    const route=`${lang==='pt'?'pt/':''}philosophy-of-freedom/lessons/${String(lesson.id).padStart(2,'0')}.html`,v=lesson[lang];
    await page.goto('http://course.test/'+route);
    assert.equal(await page.locator('h1').count(),1,route);
    assert.equal(await page.locator('h1').innerText(),v.title,route);
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
    for(const text of [...v.paragraphs,v.takeaway,v.activity]){
     const p=page.locator('p').filter({hasText:plain(text)}).first();
     assert.ok(await p.isVisible(),route+' visible teaching '+text.slice(0,30));
     assert.equal(await p.evaluate(el=>!!el.closest('details:not([open])')),false,route+' core hidden');
    }
    const paragraphOrder=await page.locator('main p').evaluateAll(nodes=>nodes.map(n=>n.textContent.replace(/\s+/g,' ').trim()));
    const first=paragraphOrder.indexOf(plain(v.paragraphs[0])),second=paragraphOrder.indexOf(plain(v.paragraphs[1]));
    assert.ok(first>=0&&second>first,route+' familiar situation precedes explanation');
    for(const marker of ['.study-attempt','.study-notebook'])assert.equal(await page.locator(marker).isVisible(),false,route+' notebook optional');
    const checks=page.locator('.knowledge-check');assert.equal(await checks.count(),3,route+' short questions retained');
    for(let i=0;i<3;i++){
     const q=checks.nth(i),answer=q.locator('details');assert.ok(await q.locator(':scope > p').isVisible());
     assert.equal(await answer.getAttribute('open'),null);
     await answer.locator('summary').focus();await page.keyboard.press('Enter');
     assert.ok(await answer.locator('p').isVisible(),route+' keyboard answer');
     assert.equal(plain(await answer.locator('p').innerText()),plain(v.checks[i][1]));
    }
    const deeper=page.locator('details.freedom-deeper');assert.equal(await deeper.getAttribute('open'),null);
    assert.equal(await deeper.locator(':scope > p').first().isVisible(),false);
    await deeper.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.ok(await deeper.locator(':scope > p').first().isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
    const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,route+' duplicate IDs');
    const links=await page.locator('main a[href],header a[href],link[rel="alternate"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
    for(const href of links){const u=new URL(href,'http://course.test/'+route);if(u.hostname!=='course.test')continue;const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));assert.ok(fs.existsSync(f),route+' missing '+href);if(u.hash&&f.endsWith('.html')){const h=fs.readFileSync(f,'utf8');assert.ok(h.includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),route+' missing anchor '+href);}}
    tested++;
   }
   await context.close();console.log('Passed '+tested+' browser cases');
  }
  assert.deepEqual(missing,[]);
  const result={status:'passed',pages:44,viewportCases:tested,widths:[1280,320],javascript:false,checks:['all first-reading paragraphs visible','familiar situation precedes explanation','notebook prompts optional','three visible questions and keyboard-operable explained answers','deeper argument closed and keyboard-operable','one h1 and correct language','no duplicate IDs','no horizontal overflow','main/header links and fragments','local assets'],limits:['No learner study','No fresh original-source verification','No external URL availability test']};
  fs.writeFileSync('reviews/pedagogy/freedom-clarity-browser.json',JSON.stringify(result,null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
