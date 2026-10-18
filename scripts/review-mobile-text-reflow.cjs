const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=process.env.REVIEW_OUTPUT||'/workspace/mobile-regression';fs.mkdirSync(out,{recursive:true});
const coverage=JSON.parse(fs.readFileSync('reviews/ux/course-workspace-coverage.json'));
const representatives=coverage.courses.map(c=>coverage.pages.find(p=>p.course===c.id&&p.role==='lesson'&&!p.page.startsWith('pt/')).page);
const routes=process.env.MOBILE_ROUTES?JSON.parse(process.env.MOBILE_ROUTES):(process.env.FULL_MOBILE?representatives:['learn/lessons/01.html','introduction-to-anthroposophy/lessons/01.html','learn/waldorf/subjects/physics.html','nutrition/05.html','practical-thinking/lessons/01.html','foodwise/lessons/01.html']).concat(['theosophy/lessons/body-soul-spirit.html','introduction-to-anthroposophy/lessons/02.html']).flatMap(p=>[p,'pt/'+p]);
const results=[],failures=[];
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
for(const width of [320,360,390,412])for(const factor of [1,1.5,2]){
 const c=await browser.newContext({viewport:{width,height:900},isMobile:true,deviceScaleFactor:2.625,colorScheme:'dark'});
 await c.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+u.pathname);if(!fs.existsSync(f))return r.fulfill({status:404,body:'missing'});return r.fulfill({body:fs.readFileSync(f),contentType:({'.css':'text/css','.js':'text/javascript','.html':'text/html','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream'});});
 const p=await c.newPage();const devtools=await c.newCDPSession(p);await devtools.send('Emulation.setAutoDarkModeOverride',{enabled:true});
 for(const route of routes){try{await p.goto('https://course.test/'+route);await p.waitForSelector('body.cw-ready,body.tw-ready');
 // Chromium mobile text autosizing; unlike pinch zoom this must reflow the text.
 await p.addStyleTag({content:`html{scroll-behavior:auto!important;-webkit-text-size-adjust:${factor*100}%;text-size-adjust:${factor*100}%}`});
 const inspect=()=>{
  const issues=[];const roots=[document.querySelector('.cw-reading,.cp-main>article'),document.querySelector('body>header'),document.querySelector('.cw-toolbar,.tw-toolbar'),document.querySelector('.cw-pagination,.tw-pagination')].filter(Boolean);
  for(const root of roots){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){
   const e=n.parentElement;if(!n.textContent.trim()||!e.checkVisibility()||e.closest('script,style,textarea,select,option'))continue;
   // checkVisibility alone does not exclude descendants of closed disclosures.
   if([...function*(e){for(;e;e=e.parentElement)yield e;}(e)].some(a=>a.tagName==='DETAILS'&&!a.open&&!a.querySelector(':scope>summary')?.contains(e)))continue;
   const range=document.createRange();range.selectNodeContents(n);
   // Mobile Chromium can enlarge innerWidth after overflow. The layout viewport
   // remains the constraint; using innerWidth would miss the overflowing word.
   for(const r of range.getClientRects()){if(!r.width||!r.height)continue;let left=0,right=document.documentElement.clientWidth;
    for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(s.overflowX)){const b=a.getBoundingClientRect();left=Math.max(left,b.left+a.clientLeft);right=Math.min(right,b.left+a.clientLeft+a.clientWidth);}}
    if(r.left<left-1||r.right>right+1){issues.push({text:n.textContent.trim().slice(0,85),left:r.left,right:r.right,clipLeft:left,clipRight:right,element:e.tagName+'.'+e.className});break;}
   }
  }}return {innerWidth,visualWidth:visualViewport.width,scrollWidth:document.documentElement.scrollWidth,issues};
 };
 const measurement=await p.evaluate(inspect);
 if(route===routes[0]&&width===320&&factor===1){
 await p.evaluate(()=>{const e=document.querySelector(".batch-first-reading>p,.cp-first-reading>p");e.dataset.originalStyle=e.getAttribute("style")||"";e.style.whiteSpace="nowrap";e.style.overflow="hidden";});
 const clipped=await p.evaluate(inspect);assert.equal(clipped.scrollWidth,measurement.scrollWidth,'clipping negative control should preserve document width');assert.ok(clipped.issues.length>0,"detector misses clipped paragraph");
 await p.evaluate(()=>{const e=document.querySelector(".batch-first-reading>p,.cp-first-reading>p");e.setAttribute("style",e.dataset.originalStyle);delete e.dataset.originalStyle;});
 }
 assert.equal(measurement.issues.length,0,JSON.stringify(measurement));assert.ok(measurement.scrollWidth<=width+1,'document overflow');
 if(route.includes('theosophy/lessons/')||/(?:learn\/lessons\/01|introduction-to-anthroposophy\/lessons\/02)\.html$/.test(route)){
 await p.evaluate(()=>document.querySelectorAll('main details').forEach(e=>{if(!e.closest('dialog,aside'))e.open=true;}));const expanded=await p.evaluate(inspect);assert.equal(expanded.issues.length,0,'expanded '+JSON.stringify(expanded));
 await p.evaluate(()=>document.querySelectorAll('.batch-retained-depth').forEach(e=>e.open=false));
 }
 const drawer=p.locator('.cw-chapters,.tw-chapters');await drawer.click();assert.ok(await p.locator('dialog').evaluate(e=>e.open));assert.ok(await p.evaluate(()=>document.querySelector('dialog').scrollWidth<=document.querySelector('dialog').clientWidth+1),'drawer overflow');await p.keyboard.press('Escape');
 if(width===360&&[1,2].includes(factor)&&/learn\/lessons\/01.html$/.test(route)){await p.locator('h1').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,route.replaceAll('/','--')+'-'+factor+'.png')});await p.locator('.batch-first-reading>p').first().evaluate(e=>{e.scrollIntoView({block:'start'});scrollBy(0,-document.querySelector('.cw-toolbar').getBoundingClientRect().height-16);});await p.screenshot({path:path.join(out,route.replaceAll('/','--')+'-reading-'+factor+'.png')});}
 results.push({route,width,factor,status:'passed'});
 }catch(e){failures.push({route,width,factor,error:e.message});}}
 await c.close();console.log(width+'px '+factor+'x: '+failures.length+' failures');
}
}finally{await browser.close();fs.writeFileSync(out+'/text-reflow.json',JSON.stringify({status:failures.length?'failed':'passed',results,failures},null,2));}console.log(JSON.stringify({passed:results.length,failed:failures.length,examples:failures.slice(0,3)}));if(failures.length)process.exitCode=1;})();
