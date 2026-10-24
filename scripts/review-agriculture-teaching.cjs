const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('docs'),out=process.env.REVIEW_OUTPUT||'/tmp/agriculture-revision/browser',base='https://course.test/Anthroposophy/';
const rows=JSON.parse(fs.readFileSync('content/agriculture-clear-lessons.json')).filter(r=>['agriculture','biodynamics'].includes(r.course)).filter(r=>!process.env.REVIEW_LESSONS||process.env.REVIEW_LESSONS.split(',').includes(r.course+'/'+r.id));
fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const errors=[],checks=[];
try{for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(!u.href.startsWith(base))return route.abort();const f=path.resolve(root,decodeURIComponent(u.pathname.slice('/Anthroposophy/'.length)));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){errors.push('Missing '+u.pathname);return route.fulfill({status:404,body:'Missing'});}return route.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream'});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const row of rows)for(const lang of ['en','pt']){
  const url=base+(lang==='pt'?'pt/':'')+row.course+'/lessons/'+String(row.id).padStart(2,'0')+'.html';await page.goto(url);await page.waitForSelector('body.cw-ready');
  assert.equal(await page.locator('h1').count(),1);const first=page.locator('[data-batch-clarity-first]');assert.ok(await first.isVisible());
  const activity=first.locator('.clarity-activity');await activity.locator('summary').first().focus();await page.keyboard.press('Enter');assert.ok(await activity.locator('p').first().isVisible());
  const answer=activity.locator('details');await answer.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await answer.locator('p').isVisible());
  for(const fig of await first.locator('.agriculture-source-plate').all()){
   const im=fig.locator('img');await im.scrollIntoViewIfNeeded();await im.evaluate(e=>e.decode());assert.ok(await im.evaluate(e=>e.naturalWidth>0));assert.ok((await im.getAttribute('alt')).length>40);
   assert.ok(await fig.locator('.agriculture-plate-guide').getAttribute('open')!==null);assert.equal(await fig.locator('li').count(),3);
   assert.equal(await fig.locator(':scope > a').getAttribute('href'),await im.getAttribute('src'));
   if(width===360&&row.course==='agriculture')await fig.screenshot({path:path.join(out,`${lang}-${await fig.getAttribute('data-source-plate')}.png`)});
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow at '+width);
  checks.push({course:row.course,lesson:row.id,lang,width,status:'passed'});
 }
 await context.close();console.log('Passed '+rows.length*2+' bilingual lesson/interaction cases at width '+width);
}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:900}});await nojs.route('**/*',r=>{const u=new URL(r.request().url());if(!u.href.startsWith(base))return r.abort();const f=path.resolve(root,decodeURIComponent(u.pathname.slice('/Anthroposophy/'.length)));if(!f.startsWith(root+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.css':'text/css','.png':'image/png','.js':'text/javascript'})[path.extname(f)]||'application/octet-stream'});});
const np=await nojs.newPage();for(const row of rows.filter(r=>r.sourcePlates))for(const lang of ['en','pt']){await np.goto(base+(lang==='pt'?'pt/':'')+row.course+'/lessons/'+String(row.id).padStart(2,'0')+'.html');assert.ok(await np.locator('[data-batch-clarity-first]').isVisible());assert.ok(await np.locator('.agriculture-plate-guide').isVisible());checks.push({course:row.course,lesson:row.id,lang,javaScript:false,status:'passed'});}await nojs.close();assert.deepEqual(errors,[]);
}finally{await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:checks.length===rows.length*4+rows.filter(r=>r.sourcePlates).length*2&&!errors.length?'passed':'incomplete',cases:checks.length,checks,errors},null,2)+'\n');}console.log('Passed agriculture teaching browser checks.');})().catch(e=>{console.error(e);process.exitCode=1;});
