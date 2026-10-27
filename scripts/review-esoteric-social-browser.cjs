const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checked=0;const errors=[];
try{for(const width of [1280,360]){
 const ctx=await browser.newContext({viewport:{width,height:900},acceptDownloads:true});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Missing'});return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 const home='http://course.test/learn/esoteric-social/';
 const routes=['index.html','concepts.html','workbook.html','teaching.html','sources.html','print.html',...Array.from({length:16},(_,i)=>'lessons/'+String(i+1).padStart(2,'0')+'.html')];
 for(const route of routes){await p.goto(home+route);assert.equal(await p.locator('h1').count(),1,route);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: ${route} overflow`);checked++;}
 await p.goto(home+'lessons/01.html');const details=p.locator('.es-check details');await details.locator('summary').click();assert.ok(await details.getAttribute('open')!==null);await p.locator('[data-es-note]').fill('Dignity exceeds a role. <script> is plain text.');await p.locator('[data-es-complete]').check();await p.reload();assert.equal(await p.locator('[data-es-note]').inputValue(),'Dignity exceeds a role. <script> is plain text.');assert.ok(await p.locator('[data-es-complete]').isChecked());
 await p.goto(home+'index.html');assert.match(await p.locator('[data-es-progress]').innerText(),/1 of 16/);
 await p.goto(home+'workbook.html');assert.ok((await p.locator('[data-es-saved]').innerText()).includes('Dignity exceeds a role. <script> is plain text.'));const promise=p.waitForEvent('download');await p.locator('[data-es-export]').click();const download=await promise;const filename=await download.path();assert.match(fs.readFileSync(filename,'utf8'),/Dignity exceeds a role/);
 await p.goto(home+'index.html');if(width===1280)await p.screenshot({path:'/tmp/esoteric-social-desktop.png',fullPage:true});else await p.screenshot({path:'/tmp/esoteric-social-mobile.png',fullPage:true});
 await ctx.close();
}
const ctx=await browser.newContext({javaScriptEnabled:false});await ctx.route('**/*',r=>{const u=new URL(r.request().url());const f=path.resolve('docs','.'+u.pathname);if(u.hostname!=='course.test'||!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f))return r.abort();return r.fulfill({contentType:f.endsWith('.html')?'text/html':f.endsWith('.css')?'text/css':'application/javascript',body:fs.readFileSync(f)});});const p=await ctx.newPage();await p.goto('http://course.test/learn/esoteric-social/lessons/11.html');assert.equal(await p.locator('h1').count(),1);await p.locator('.es-check summary').click();assert.ok(await p.locator('.es-check details').getAttribute('open')!==null);await ctx.close();assert.deepEqual(errors,[]);console.log(`Passed ${checked} responsive page checks; answer disclosure, notes, progress, safe text rendering, export, reload and no-JavaScript reading.`);
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
