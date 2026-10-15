// Generated-page delivery checks for the individually audited conceptual batch.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=f=>JSON.parse(fs.readFileSync(f));
async function loadCases(){
 if(process.argv.includes('--anthology')){
  const course=read('content/what-is-biodynamics.json');
  const ledger=read('reviews/pedagogy/anthology-revision-ledger.json');
  return course.lessons.flatMap(row=>{
   const route='what-is-biodynamics/lessons/'+String(row.id).padStart(2,'0')+'.html';
   assert.ok(ledger['docs/'+route]?.learningCriterion);
   return ['en','pt'].map(lang=>({route:(lang==='pt'?'pt/':'')+route,text:row[lang].example,lang}));
  });
 }

 const {colourLessons:c}=await import('../content/colour.mjs');
 const {selfLessons:s}=await import('../content/encountering-the-self.mjs');
 const {mysteryLessons:m}=await import('../content/mystery-temperaments.mjs');
 const {temperamentsLessons:t}=await import('../content/temperaments.mjs');
 const {understandLessons:u}=await import('../content/understand-temperament.mjs');
 const {temperamentCourse:p}=await import('../content/temperament-course.mjs');
 const ledger=read('reviews/pedagogy/six-course-revision-ledger.json'),cases=[];
 const routes={c:'colour',s:'encountering-the-self',m:'mystery-temperaments',t:'temperaments',u:'understand-temperament',p:'understanding-temperaments'};
 for(const [key,rows]of Object.entries({c,s,m,t,u,p}))for(const row of rows){
  const route=routes[key]+'/lessons/'+String(row.id).padStart(2,'0')+'.html';
  const audit=ledger['docs/'+route];assert.ok(audit?.learningCriterion,route+' individual learning criterion');
  for(const lang of ['en','pt'])cases.push({route:(lang==='pt'?'pt/':'')+route,text:row[lang].explanation,lang});
 }
 const intro=read('content/introduction-anthroposophy-lesson-07.json');
 for(const lang of ['en','pt'])cases.push({route:(lang==='pt'?'pt/':'')+'introduction-to-anthroposophy/lessons/07.html',text:intro[lang].explanation.at(-1),lang});
 for(const lang of ['en','pt'])cases.push({route:(lang==='pt'?'pt/':'')+'learn/lessons/11.html',text:lang==='en'?'In the grouped sevenfold list, soul body and sentient soul become one entry, as do consciousness soul and spirit self: nine distinctions become seven entries through two pairings. In the developmental list, astral, life and physical members are transformed toward spirit self, life spirit and spirit man through the I’s work. One operation groups; the other describes transformation. Equal totals conceal different relationships.':'Na lista setenária agrupada, corpo anímico e alma senciente formam uma entrada, assim como alma da consciência e si-mesmo espiritual: nove distinções tornam-se sete entradas por dois agrupamentos. Na lista do desenvolvimento, membros astral, vital e físico são transformados em direção ao si-mesmo espiritual, ao espírito vital e ao homem-espírito pelo trabalho do Eu. Uma operação agrupa; a outra descreve transformação. Totais iguais ocultam relações diferentes.',lang});
 const {loadWaldorfContent}=await import('./waldorf-content.mjs');
 const physics=loadWaldorfContent().find(r=>r.source==='subjects/physics.md');assert.ok(physics);
 for(const lang of ['en','pt'])cases.push({route:(lang==='pt'?'pt/':'')+physics.route,text:lang==='en'?'Interpret position data and distinguish a description of motion from an explanation of its causes.':'Interprete dados de posição e distinga a descrição do movimento de uma explicação de suas causas.',lang});
 return cases;
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
    const paragraph=page.getByText(c.text,{exact:true}).first();assert.ok(await paragraph.isVisible(),c.route+' new explanation visible without JS');
    assert.equal(await paragraph.evaluate(el=>!!el.closest('details:not([open])')),false,c.route+' core teaching not hidden');
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
  fs.writeFileSync('reviews/pedagogy/'+(process.argv.includes('--anthology')?'anthology-browser.json':'six-course-browser.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
