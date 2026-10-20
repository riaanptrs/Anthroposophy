const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const lessons=JSON.parse(fs.readFileSync('content/foundations-introduction-clear-lessons.json')).filter(r=>r.course==='foundations');
const plain=s=>s.replace(/\s+/g,' ').trim();

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const errors=[],missing=[];let cases=0;
 try{
  // Exercise both the document alone and the enhanced course workspace.
  for(const javaScriptEnabled of [false,true]){
   const width=javaScriptEnabled?390:1280;
   const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled});
   await context.route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.hostname!=='course.test')return route.abort();
    const file=path.resolve('docs','.'+decodeURIComponent(u.pathname));
    if(!file.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(file)){missing.push(u.pathname);return route.fulfill({status:404,body:'Missing'});}
    const contentType=({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream';
    return route.fulfill({contentType,body:fs.readFileSync(file)});
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
   for(const lesson of lessons)for(const lang of ['en','pt']){
    const route=`${lang==='pt'?'pt/':''}learn/lessons/${String(lesson.id).padStart(2,'0')}.html`,v=lesson[lang];
    await page.goto('http://course.test/'+route);
    if(javaScriptEnabled)await page.locator('body.cw-ready').waitFor();
    assert.equal(await page.locator('h1').count(),1,route);
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
    const first=page.locator('[data-batch-clarity-first]');
    assert.equal(await first.locator(':scope > h2').count(),5,route+' four taught steps and questions');
    for(let i=0;i<4;i++){
     assert.equal(plain(await first.locator(':scope > h2').nth(i).innerText()),plain(v.paragraphHeadings[i]));
     assert.ok(await first.locator(':scope > h2').nth(i).isVisible(),route+' visible heading');
    }
    const paragraphs=await first.locator(':scope > p:not(.clarity-introduction-link)').allInnerTexts();
    assert.deepEqual(paragraphs.map(plain),v.paragraphs.map(plain),route+' complete explanation');
    for(const p of await first.locator(':scope > p').all())assert.ok(await p.isVisible(),route+' no explanation behind a disclosure');
    assert.ok(await page.locator('.foundation-orientation').isVisible());
    const next=page.locator('.foundation-next');assert.ok(await next.isVisible(),route+' visible continuation');
    if(lesson.id<36)assert.equal(await next.locator('a').getAttribute('href'),String(lesson.id+1).padStart(2,'0')+'.html');
    const depth=page.locator('details.batch-retained-depth');assert.equal(await depth.getAttribute('open'),null);
    for(const check of await first.locator('.batch-clarity-check').all()){
     const answer=check.locator('details');assert.equal(await answer.getAttribute('open'),null);
     await answer.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await answer.locator('p').isVisible());
    }
    assert.equal(await depth.getAttribute('open'),null,route+' answers do not require opening sources');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' no horizontal overflow');
    if(javaScriptEnabled&&lang==='en'&&lesson.id===5)await page.screenshot({path:'/tmp/foundations-body-soul-spirit.png',fullPage:true});
    cases++;
   }
   await context.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  const report={status:'passed',lessons:36,languages:['en','pt-BR'],cases,configurations:[{javascript:false,width:1280},{javascript:true,width:390}],checks:['complete visible explanation and topic headings','learning question and prerequisite context','next lesson before optional sources','keyboard answer disclosures with source notes closed','enhanced course workspace','language and single title','no horizontal overflow','no script errors or missing local assets'],limits:['No learner-comprehension study','No fresh original-source verification']};
  fs.writeFileSync('reviews/pedagogy/foundations-teaching-browser.json',JSON.stringify(report,null,2)+'\n');
  console.log(`Passed ${cases} beginner teaching browser cases.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
