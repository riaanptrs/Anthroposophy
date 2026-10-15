const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const requests=[];
 await context.route('**/*',route=>{
  const u=new URL(route.request().url());if(u.hostname!=='course.test'){requests.push(u.href);return route.abort();}
  const file=path.resolve('docs','.'+u.pathname);
  assert.ok(file.startsWith(path.resolve('docs')+path.sep)&&fs.existsSync(file),u.pathname);
  return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(let i=0;i<18;i++){
  await page.goto('http://course.test/pt/nutrition/'+String(i).padStart(2,'0')+'.html');
  const q=page.locator('.nutrition-quiz').first(),feedback=q.locator('[data-nutrition-feedback]'),button=q.locator('[data-nutrition-check]');
  await button.click();assert.match(await feedback.textContent(),/Escolha uma resposta/);
  const answer=Number(await q.getAttribute('data-answer'));
  await q.locator('input').nth((answer+1)%3).check();await button.click();
  assert.equal(await q.getAttribute('data-feedback'),'retry');assert.match(await feedback.textContent(),/Retome o trecho/);
  await q.locator('[data-nutrition-retry]').click();assert.equal(await q.locator('input:checked').count(),0);
  assert.match(await feedback.textContent(),/Tente novamente/);
  await q.locator('input').nth(answer).check();await button.click();
  assert.equal(await q.getAttribute('data-feedback'),'correct');assert.match(await feedback.textContent(),/Isso corresponde à leitura/);
  await page.locator('textarea').first().fill('Resposta temporária de teste');
  await page.reload();assert.equal(await page.locator('textarea').first().inputValue(),'');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const result={pages:18,width:390,javaScript:true,status:'passed',checks:['Portuguese empty/wrong/correct/retry feedback','native answer disclosure','responses unsaved after reload','no browser errors','no external requests']};
 fs.writeFileSync('reviews/pedagogy/nutrition-portuguese-browser.json',JSON.stringify(result,null,2)+'\n');console.log(result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
