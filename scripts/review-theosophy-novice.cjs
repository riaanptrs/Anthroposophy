// Render both complete lesson sequences for an editorial novice pass.
// This captures the material to review; it does not claim to measure learner outcomes.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=process.env.REVIEW_OUTPUT||'/workspace/theosophy-novice-review';
const base='https://course.test/Anthroposophy/',root=path.resolve('docs');
const course=JSON.parse(fs.readFileSync('content/theosophy-concept-course.json'));
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const entries=[],errors=[];
 try{
  for(const lang of ['en','pt']){
   const context=await browser.newContext({viewport:{width:1280,height:1000}});
   await context.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(!url.href.startsWith(base))return route.abort();
    const file=path.resolve(root,decodeURIComponent(url.pathname.slice('/Anthroposophy/'.length)));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){errors.push('Missing '+url.pathname);return route.fulfill({status:404,body:'Missing'});}
    return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   const prefix=lang==='pt'?'pt/':'';
   await page.goto(base+prefix+'theosophy/index.html');
   await page.getByRole('link',{name:lang==='pt'?'Comece com a primeira pergunta':'Begin with the first question',exact:true}).click();
   for(const [index,id] of course.lessonIds.entries()){
    await page.waitForSelector('body.tw-ready');
    assert.equal(page.url(),base+prefix+'theosophy/lessons/'+id+'.html','Sequential next lesson');
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
    const first=page.locator('.cp-first-reading');
    await first.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
    const mainReading=await first.innerText();
    if(id==='whole-picture'){
     const worked=page.locator('[data-concept-section="worked-example"]');
     assert.ok(await worked.isVisible(),'Synthesis example visible before opening depth');
     assert.equal(await worked.evaluate(e=>Boolean(e.closest('.cp-retained-depth'))),false);
     for(let i=1;i<=7;i++)assert.equal(await page.locator('#depth-section-'+i).count(),1,'Preserved synthesis anchor');
    }
    await page.locator('main article details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
    const text=await page.locator('main article').innerText();
    const example=await page.locator('[data-concept-section="worked-example"]').innerText();
    const terminology=await page.locator('#useful-terminology').count()?await page.locator('#useful-terminology').innerText():'';
    const entry={number:index+1,id,lang,title:await page.locator('h1').innerText(),route:page.url(),mainReading,example,terminology,fullText:text};
    entries.push(entry);
    fs.writeFileSync(path.join(out,`${lang}-${String(index+1).padStart(2,'0')}.txt`),entry.title+'\n\n'+text+'\n');
    if([4,9,16,24].includes(index+1)){
     await page.locator('.cp-retained-depth').evaluate(e=>e.open=false);
     await page.locator('h1').scrollIntoViewIfNeeded();
     await page.screenshot({path:path.join(out,`${lang}-${index+1}-desktop.png`)});
    }
    await page.locator('.tw-pagination a').last().click();
   }
   assert.equal(page.url(),base+prefix+'theosophy/index.html','Final link returns to course map');
   await context.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'sequence.json'),JSON.stringify(entries,null,2)+'\n');
  console.log('Captured 48 rendered lessons in sequential EN/PT navigation order; final return, language, synthesis visibility and anchors passed. Editorial review remains separate.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
