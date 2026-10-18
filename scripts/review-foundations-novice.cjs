// Capture the complete rendered sequence for a separate editorial learner review.
// Automated navigation checks are not evidence of actual learner outcomes.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=process.env.REVIEW_OUTPUT||'/workspace/foundations-novice-review/before';
const base='https://course.test/Anthroposophy/',root=path.resolve('docs');
const plans=JSON.parse(fs.readFileSync('content/learning-system-sources.json'));
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const entries=[],errors=[];
 try{
  for(const lang of ['en','pt']){
   const context=await browser.newContext({viewport:{width:1280,height:1000}});
   await context.route('**/*',route=>{
    const url=new URL(route.request().url());if(!url.href.startsWith(base))return route.abort();
    const file=path.resolve(root,decodeURIComponent(url.pathname.slice('/Anthroposophy/'.length)));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){errors.push('Missing '+url.pathname);return route.fulfill({status:404,body:'Missing'});}
    return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   const prefix=lang==='pt'?'pt/':'';
   await page.goto(base+prefix+'learn/foundations/index.html');
   await page.locator('a.cw-start').click();
   for(const plan of plans){
    const id=String(plan.id).padStart(2,'0');
    await page.waitForSelector('body.cw-ready');
    assert.equal(page.url(),base+prefix+'learn/lessons/'+id+'.html','Sequential route');
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
    const first=page.locator('.batch-first-reading');
    await first.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
    const mainReading=await first.innerText();
    await page.locator('main details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
    const depth=page.locator('.batch-retained-depth');
    const entry={id:plan.id,lang,title:await page.locator('h1').innerText(),route:page.url(),mainReading,depth:await depth.innerText(),fullText:await page.locator('main').innerText()};
    entries.push(entry);
    fs.writeFileSync(path.join(out,lang+'-'+id+'.txt'),entry.title+'\n\n'+entry.mainReading+'\n\n'+entry.depth+'\n');
    if([2,6,17,25,36].includes(plan.id)){
     await page.locator('main details').evaluateAll(es=>es.forEach(e=>e.open=false));await page.locator('h1').scrollIntoViewIfNeeded();
     await page.screenshot({path:path.join(out,lang+'-'+id+'-desktop.png')});
    }
    if(plan.id<36)await page.locator('.cw-pagination a').last().click();
   }
   await context.close();console.log('Captured '+lang+' sequence: '+plans.length+' lessons');
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'sequence.json'),JSON.stringify(entries,null,2)+'\n');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
