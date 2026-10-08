// Run after the full build. Requests are fulfilled from local docs files; no preview server or external source requests are needed.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext();
 await context.route('http://course.test/**',async route=>{
  const pathname=new URL(route.request().url()).pathname;
  const file=path.join(path.resolve('docs'),pathname);
  if(!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
  await route.fulfill({status:200,contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const prefix of ['', 'pt/']){
  await page.goto('http://course.test/'+prefix+'learn/lessons/01.html');
  assert.equal(await page.locator('.learning-development').count(),3);
  assert.equal(await page.locator('[data-optional-source]').getAttribute('open'),null);
  assert.equal(await page.locator('.learning-meaning').isVisible(),true);
  const quiz=page.locator('.learning-quiz').first(),answer=Number(await quiz.getAttribute('data-answer'));
  await quiz.locator('input[type=radio]').nth((answer+1)%3).check();await quiz.locator('[data-check-answer]').click();
  assert.equal(await quiz.getAttribute('data-feedback'),'retry');
  await quiz.locator('[data-retry]').click();await quiz.locator('input[type=radio]').nth(answer).check();await quiz.locator('[data-check-answer]').click();
  assert.equal(await quiz.getAttribute('data-feedback'),'correct');
  await page.locator('[data-learning-save]').check();await page.locator('[data-learning-note]').fill('Explain Steiner’s educational and philosophical work.');
  await page.locator('[data-learning-complete]').click();await page.reload();
  assert.equal(await page.locator('[data-learning-note]').inputValue(),'Explain Steiner’s educational and philosophical work.');
 }
 await page.goto('http://course.test/higher-worlds/lessons/01.html');
 assert.equal(await page.locator('#book-passage').isVisible(),false);
 assert.equal(await page.locator('#study-explanation').isVisible(),true);
 await page.locator('[data-optional-source] > summary').click();assert.equal(await page.locator('#book-passage blockquote').isVisible(),true);
 const nojs=await browser.newContext({javaScriptEnabled:false});
 await nojs.route('http://course.test/**',async route=>{const file=path.join(path.resolve('docs'),new URL(route.request().url()).pathname);await route.fulfill({contentType:path.extname(file)==='.html'?'text/html':'text/css',body:fs.readFileSync(file)});});
 const plain=await nojs.newPage();await plain.goto('http://course.test/learn/lessons/01.html');assert.equal(await plain.locator('.learning-development').first().isVisible(),true);
 await plain.locator('.answer-explanation').first().locator('summary').click();assert.equal(await plain.locator('.answer-explanation').first().locator('p').first().isVisible(),true);
 assert.deepEqual(errors,[]);await browser.close();console.log('Browser passed: English/PT explanations, optional real excerpts, quiz correction/retry, saved notes after reload and no-JavaScript answer access.');
})().catch(e=>{console.error(e);process.exit(1)});
