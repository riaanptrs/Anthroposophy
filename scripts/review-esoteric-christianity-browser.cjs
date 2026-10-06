const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const origin=`http://127.0.0.1:${process.env.EC_PREVIEW_PORT||4173}`,course='/Anthroposophy/learn/esoteric-christianity';
 const errors=[],results=[];let quizzesChecked=0;
 try {
  for(const width of [1280,390,320]){
   const ctx=await browser.newContext({viewport:{width,height:850},hasTouch:width!==1280});
   await ctx.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
   for(const lang of ['en','pt'])for(const tail of ['index.html','glossary.html','sources.html','sequence.html',...Array.from({length:24},(_,i)=>'lessons/ec1-'+String(i+1).padStart(2,'0')+'.html')]){
    const url=origin+course.replace('/learn/',lang==='pt'?'/pt/learn/':'/learn/')+'/'+tail;
    const r=await page.goto(url);assert.equal(r.status(),200,url);await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('h1').count(),1);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Overflow ${width}: ${url}`);
    if(tail.includes('lessons/')&&width===1280){
     for(const q of await page.locator('.learning-quiz').all()){
      quizzesChecked++;
      const answer=Number(await q.getAttribute('data-answer')),choices=q.locator('input[type=radio]');
      // Native radios and buttons: keyboard choice, wrong feedback, retry, correct.
      await choices.nth((answer+1)%3).focus();await page.keyboard.press('Space');
      await q.locator('[data-check-answer]').focus();await page.keyboard.press('Enter');
      assert.equal(await q.getAttribute('data-feedback'),'retry');assert.equal(await q.locator('details').getAttribute('open'),'');
      await q.locator('[data-retry]').click();assert.equal(await q.locator('input:checked').count(),0);
      await choices.nth(answer).check();await q.locator('[data-check-answer]').click();assert.equal(await q.getAttribute('data-feedback'),'correct');
      assert.equal(await q.locator('details li').count(),3);
     }
    }
    results.push({width,lang,tail});
   }
   if(width!==1280){await page.goto(origin+course+'/lessons/ec1-04.html');const q=page.locator('.learning-quiz').first();await q.locator('label').nth(0).tap();await q.locator('[data-check-answer]').tap();assert.ok(await q.locator('[data-quiz-feedback]').textContent());}
   if(width===390){await page.goto(origin+course+'/lessons/ec1-18.html');await page.screenshot({path:'/tmp/esoteric-christianity-mobile.png',fullPage:true});}
   await ctx.close();
  }
  const ctx=await browser.newContext(),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto(origin+course+'/lessons/ec1-18.html');await p.locator('[data-ec-save]').check();await p.locator('[data-ec-complete]').click();await p.reload();assert.equal(await p.locator('[data-ec-complete]').getAttribute('aria-pressed'),'true');
  await p.goto(origin+course.replace('/learn/','/pt/learn/')+'/lessons/ec1-18.html');assert.equal(await p.locator('[data-ec-complete]').getAttribute('aria-pressed'),'true');
  await p.goto(origin+course+'/index.html');assert.equal(await p.locator('[data-ec-resume]').getAttribute('href'),'lessons/ec1-18.html');assert.match(await p.locator('[data-ec-progress]').textContent(),/1 of 24/);
  await p.goto(origin+course+'/lessons/ec1-18.html');await p.evaluate(()=>localStorage.setItem('anthro-study-v1:esoteric-christianity-1/ec1-18','unreadable'));await p.reload();await p.locator('[data-ec-complete]').click();assert.equal(await p.evaluate(()=>localStorage.getItem('anthro-study-v1:esoteric-christianity-1/ec1-18')),'unreadable');
  await ctx.close();
  const nojs=await browser.newContext({javaScriptEnabled:false}),np=await nojs.newPage();await np.goto(origin+course+'/lessons/ec1-18.html');await np.locator('.learning-quiz details summary').first().click();assert.ok(await np.locator('.learning-quiz details li').first().isVisible());await nojs.close();
  assert.deepEqual(errors,[],'No browser errors');
  fs.writeFileSync('/tmp/esoteric-christianity-browser-review.json',JSON.stringify({status:'passed',pagesAtViewports:results.length,widths:[1280,390,320],checks:`${quizzesChecked} quizzes: wrong, retry, correct, option explanations; keyboard and touch; bilingual progress/resume; unreadable record preservation; no-JavaScript answers`,errors},null,2));
  console.log(`Passed ${results.length} page/viewport visits; all ${quizzesChecked} quizzes; keyboard, touch, progress, language and no-JavaScript checks.`);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
