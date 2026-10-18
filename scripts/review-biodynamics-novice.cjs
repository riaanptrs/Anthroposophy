// Current generated course, including the shared course workspace.
// Run after build-all; no server or external requests are needed.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=process.env.REVIEW_OUTPUT||'/workspace/biodynamics-novice-review/controls';
fs.mkdirSync(out,{recursive:true});
const root=path.resolve('docs'),base='https://course.test/Anthroposophy/',checks=[],errors=[];
const reveal=async locator=>locator.evaluate(e=>{for(let p=e;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 async function context(extra={}){
  const c=await browser.newContext({viewport:{width:360,height:900},acceptDownloads:true,...extra});
  await c.route('**/*',r=>{
   const u=new URL(r.request().url());if(!u.href.startsWith(base))return r.abort();
   const f=path.resolve(root,decodeURIComponent(u.pathname.slice('/Anthroposophy/'.length)));
   if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){errors.push('Missing '+u.pathname);return r.fulfill({status:404,body:'Missing'});}
   return r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream'});
  });return c;
 }
 try{
  const c=await context(),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['en','pt']){
   const prefix=lang==='pt'?'pt/':'';
   await p.goto(base+prefix+'biodynamics/index.html');await p.locator('.cw-start').click();
   for(let id=1;id<=24;id++){
    await p.waitForSelector('body.cw-ready');assert.equal(p.url(),base+prefix+`biodynamics/lessons/${String(id).padStart(2,'0')}.html`);
    assert.equal(await p.locator('h1').count(),1);
    const questions=p.locator('.batch-clarity-check');assert.equal(await questions.count(),2);
    for(const answer of await questions.locator('details').all()){await answer.locator('summary').focus();await p.keyboard.press('Enter');assert.ok(await answer.locator('p').isVisible());}
    const source=p.locator('[data-biodynamic-source]');await reveal(source);assert.ok(await source.isVisible());
    assert.equal(await p.locator('[data-note-field]').count(),6);
    const quiz=p.locator('.learning-quiz').first();await reveal(quiz);
    await quiz.locator('input[value="'+await quiz.getAttribute('data-answer')+'"]').check();await quiz.locator('[data-check-answer]').click();
    assert.ok((await quiz.locator('[data-quiz-feedback]').innerText()).trim());
    await p.locator('.cw-chapters').click();assert.ok(await p.locator('dialog[open]').isVisible());await p.keyboard.press('Escape');
    if(id<24)await p.locator('.cw-pagination a').last().click();
   }
   const last=p.locator('.cw-pagination a').last();assert.ok((await last.getAttribute('href')).includes('practice/index.html'));await last.click();
   assert.equal(p.url(),base+prefix+'biodynamics/practice/index.html');
   checks.push({language:lang,lessons:24,check:'Overview start; all next routes; optional answers by keyboard; original sources and six fields; quiz feedback; chapter drawer; final practice destination',status:'passed'});
   console.log('Passed '+lang+' learner navigation and controls for all 24 lessons');
  }
  await p.goto(base+'biodynamics/lessons/13.html');const first=p.locator('[data-note-field="first"]');await reveal(first);await first.fill('Unstored first explanation');
  assert.equal(await p.evaluate(()=>localStorage.length),0);
  await p.locator('[data-save-notes]').check();
  const fields=['first','source','after','session1','session2','session3'];
  for(const key of fields){const field=p.locator(`[data-note-field="${key}"]`);await reveal(field);await field.fill('EN '+key+' relationship');}
  const complete=p.locator('[data-complete]');await reveal(complete);await complete.click();
  await p.waitForFunction(()=>JSON.parse(localStorage.getItem('anthro-study-v1:biodynamics/13'))?.complete===true);
  await p.waitForFunction(()=>JSON.parse(localStorage.getItem('anthro-study-v1:biodynamics/13'))?.en?.session3==='EN session3 relationship');
  await p.locator('body > header a[lang="pt-BR"]').click();
  await p.waitForLoadState('load');
  assert.equal(await p.locator('[data-complete]').getAttribute('aria-pressed'),'true');
  for(const key of fields){const field=p.locator(`[data-note-field="${key}"]`);await reveal(field);assert.equal(await field.inputValue(),'');await field.fill('PT '+key+' relação');}
  await p.waitForFunction(()=>JSON.parse(localStorage.getItem('anthro-study-v1:biodynamics/13'))?.pt?.session3==='PT session3 relação');
  await p.reload();assert.equal(await p.locator('[data-note-field="first"]').inputValue(),'PT first relação');
  const exp=p.locator('[data-export]');await reveal(exp);const dlPromise=p.waitForEvent('download');await exp.click();const dl=await dlPromise;const file=path.join(out,dl.suggestedFilename());await dl.saveAs(file);
  const exported=fs.readFileSync(file,'utf8');for(const key of fields)assert.ok(exported.includes('PT '+key+' relação'));assert.ok(!exported.includes('EN first relationship'));
  await p.evaluate(()=>localStorage.setItem('anthro-study-v1:biodynamics/12',JSON.stringify({en:{first:'Neighbour lesson'}})));
  await p.locator('[data-delete]').click();
  assert.equal(await p.evaluate(()=>localStorage.getItem('anthro-study-v1:biodynamics/13')),null);assert.ok(await p.evaluate(()=>localStorage.getItem('anthro-study-v1:biodynamics/12')));
  checks.push({check:'Saving opt-in; all six EN/PT notes separate; completion shared; reload; export current language; deletion limited to this bilingual lesson',status:'passed'});
  for(const [route,target]of [['biodynamics/lessons/05.html','.foundation-relationships'],['pt/biodynamics/lessons/05.html','.foundation-relationships'],['biodynamics/lessons/13.html','.batch-first-reading'],['pt/biodynamics/lessons/22.html','.batch-first-reading']]){
   await p.goto(base+route);await p.addStyleTag({content:'html{-webkit-text-size-adjust:200%;text-size-adjust:200%;scroll-behavior:auto!important}'});
   await p.locator(target).scrollIntoViewIfNeeded();await p.locator(target).screenshot({path:path.join(out,route.replaceAll('/','--')+'.png')});
  }
  await c.close();
  const blocked=await context();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));
  const bp=await blocked.newPage();await bp.goto(base+'biodynamics/lessons/22.html');assert.ok(await bp.locator('h1').isVisible());await bp.locator('.cw-chapters').click();assert.ok(await bp.locator('dialog[open]').isVisible());await blocked.close();
  checks.push({check:'Denied storage preserves reading and chapter navigation',status:'passed'});assert.deepEqual(errors,[]);
 }finally{await browser.close();fs.writeFileSync(out+'/report.json',JSON.stringify({status:checks.length===4&&!errors.length?'passed':'incomplete',checks,errors},null,2)+'\n');}
 console.log('Passed Biodynamics current-course interactions, navigation and note lifecycle.');
})().catch(e=>{console.error(e);process.exitCode=1;});
