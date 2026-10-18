const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve('docs'),out=process.env.REVIEW_OUTPUT||'/workspace/foundations-novice-review/controls',base='https://course.test/Anthroposophy/';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const checks=[];
 async function context(options={}){
  const c=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true,...options});
  await c.route('**/*',r=>{const u=new URL(r.request().url());if(!u.href.startsWith(base))return r.abort();const f=path.resolve(root,u.pathname.slice('/Anthroposophy/'.length));if(!f.startsWith(root+path.sep)||!fs.existsSync(f))return r.abort();return r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream'});});return c;
 }
 const reveal=async p=>{await p.waitForSelector('body.cw-ready');await p.locator('[data-learning-note]').evaluate(e=>{for(let a=e;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});};
 try{
  const c=await context(),p=await c.newPage();await p.goto(base+'learn/lessons/11.html');await reveal(p);
  const note=p.locator('[data-learning-note]'),save=p.locator('[data-learning-save]'),complete=p.locator('[data-learning-complete]');
  assert.equal(await p.evaluate(()=>localStorage.length),0);await note.fill('Nine distinctions, seven groups.');await p.waitForTimeout(600);assert.equal(await p.evaluate(()=>localStorage.length),0);
  await save.check();await complete.click();await p.waitForTimeout(600);assert.equal(await complete.getAttribute('aria-pressed'),'true');
  await p.locator('body>header a[lang="pt-BR"]').click();await reveal(p);assert.equal(await note.inputValue(),'');assert.equal(await complete.getAttribute('aria-pressed'),'true');
  await note.fill('Nove distinções, sete grupos.');await p.waitForTimeout(600);await p.reload();await reveal(p);assert.equal(await note.inputValue(),'Nove distinções, sete grupos.');
  const download=p.waitForEvent('download');await p.locator('[data-learning-export]').click();const d=await download;await d.saveAs(out+'/exported-note.txt');assert.ok(fs.readFileSync(out+'/exported-note.txt','utf8').includes('Nove distinções, sete grupos.'));
  await p.locator('[data-learning-delete]').click();assert.equal(await note.inputValue(),'');assert.equal(await complete.getAttribute('aria-pressed'),'false');assert.equal(await p.evaluate(()=>localStorage.getItem('anthro-learning-v1:lesson:11')),null);
  checks.push('No storage before consent; shared completion, language-specific notes, reload, export and deletion in both languages');
  await p.goto(base+'learn/lessons/36.html');await p.locator('.cw-pagination a').last().click();assert.equal(p.url(),base+'learn/foundations/index.html');checks.push('Final navigation returns to Foundations overview');
  for(const lang of ['en','pt'])for(const id of ['11','27','36']){
   await p.goto(base+(lang==='pt'?'pt/':'')+'learn/lessons/'+id+'.html');await p.waitForSelector('body.cw-ready');
   const table=p.locator('.foundation-relationships');assert.ok(await table.isVisible());assert.equal(await table.locator('caption').count(),1);assert.equal(await table.locator('thead th[scope="col"]').count(),2);
   await table.scrollIntoViewIfNeeded();await p.screenshot({path:out+'/'+lang+'-'+id+'-table.png'});
   await p.locator('.cw-chapters').click();await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').evaluate(e=>e.open),false);assert.ok(await p.locator('.cw-chapters').evaluate(e=>document.activeElement===e));
  }
  checks.push('Visible captioned relationship aids in both languages; keyboard drawer close returns focus');
  const before=await p.locator('main details').evaluateAll(es=>es.map(e=>e.open));await p.evaluate(()=>dispatchEvent(new Event('beforeprint')));assert.ok(await p.locator('main details').evaluateAll(es=>es.every(e=>e.open)));await p.emulateMedia({media:'print'});assert.equal(await p.locator('.cw-pagination').isVisible(),false);await p.pdf({path:out+'/foundations-36-pt-print.pdf',format:'A4'});await p.emulateMedia({media:'screen'});await p.evaluate(()=>dispatchEvent(new Event('afterprint')));assert.deepEqual(await p.locator('main details').evaluateAll(es=>es.map(e=>e.open)),before);checks.push('Complete print with disclosure state restored');
  await c.close();
  const blocked=await context();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));const bp=await blocked.newPage();await bp.goto(base+'pt/learn/lessons/11.html');await bp.waitForSelector('body.cw-ready');assert.ok(await bp.locator('.batch-first-reading').isVisible());await bp.locator('.cw-pagination a').last().click();assert.equal(bp.url(),base+'pt/learn/lessons/12.html');await blocked.close();checks.push('Blocked storage preserves reading and next navigation');
 }finally{await browser.close();fs.writeFileSync(out+'/results.json',JSON.stringify({checks},null,2)+'\n');}
 console.log('Foundations controls passed: '+checks.length+' groups.');
})().catch(e=>{console.error(e);process.exitCode=1;});
