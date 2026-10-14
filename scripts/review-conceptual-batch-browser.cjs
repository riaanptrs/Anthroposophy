// Generated-page delivery checks for the individually audited conceptual batch.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=f=>JSON.parse(fs.readFileSync(f));
const development=read('content/foundations-concept-development.json');
const social=read('content/toward-threefold-society.json');
const cases=[];
for(const lang of ['en','pt']){
 const prefix=lang==='pt'?'pt/':'';
 for(const row of development.lessons)cases.push({route:prefix+`learn/lessons/${String(row.id).padStart(2,'0')}.html`,text:row[lang].stages[2].text,lang});
 for(let id=1;id<=28;id++){
  const n=String(id).padStart(2,'0'),row=read(`content/introduction-anthroposophy-lesson-${n}.json`);
  const developedIndex=({2:1,15:2,16:3,17:3,18:3})[id];
  cases.push({route:prefix+`introduction-to-anthroposophy/lessons/${n}.html`,text:developedIndex===undefined?row[lang].explanation.at(-1):row[lang].explanation[developedIndex],lang});
 }
 for(const row of social.lessons)cases.push({route:prefix+`toward-threefold-society/lessons/${String(row.id).padStart(2,'0')}.html`,text:row[lang].meaning.at(-1),lang});
}
(async()=>{
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
    const paragraph=page.getByText(c.text,{exact:true});assert.ok(await paragraph.isVisible(),c.route+' new explanation visible without JS');
    assert.equal(await paragraph.evaluate(el=>!!el.closest('details')),false,c.route+' core teaching not hidden');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),c.route+' horizontal overflow '+width);
    const answer=page.locator('main details').first();
    if(await answer.count()){
     await answer.locator(':scope > summary').focus();await page.keyboard.press('Enter');
     assert.notEqual(await answer.getAttribute('open'),null,c.route+' keyboard disclosure');
    }
    const broken=await page.locator('main a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('#')&&!document.getElementById(h.slice(1))));
    assert.deepEqual(broken,[],c.route+' local fragments');tested++;
   }
   await context.close();
  }
  assert.deepEqual(failures,[],'missing local assets');
  const result={pages:cases.length,viewportCases:tested,widths:[1280,320],javaScript:false,checks:['visible core teaching','language','keyboard disclosure','overflow','local fragments','loaded assets'],status:'passed'};
  fs.writeFileSync('reviews/pedagogy/conceptual-batch-browser.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
