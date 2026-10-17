const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=process.env.REVIEW_OUTPUT||'/workspace/course-ui-rollout';fs.mkdirSync(out,{recursive:true});
const coverage=JSON.parse(fs.readFileSync('reviews/ux/course-workspace-coverage.json'));
const root=path.resolve('docs'),cases=process.env.REVIEW_ROUTES?JSON.parse(fs.readFileSync(process.env.REVIEW_ROUTES)).map(page=>coverage.pages.find(c=>c.page===page)):process.env.REVIEW_LIMIT?coverage.pages.slice(0,Number(process.env.REVIEW_LIMIT)):coverage.pages;
const errors=[],failures=[],results=[],screenshots=[];let tested=0;
const representatives=new Set(coverage.courses.flatMap(c=>{const lesson=coverage.pages.find(x=>x.course===c.id&&x.role==='lesson'&&!x.page.startsWith('pt/'));return[c.home,'pt/'+c.home,lesson?.page,'pt/'+lesson?.page];}));representatives.add('learn/index.html');representatives.add('pt/learn/index.html');representatives.add('books/index.html');
async function context(browser,options){const ctx=await browser.newContext(options);await ctx.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){errors.push('Missing '+u.pathname);return r.fulfill({status:404,body:'Missing'});}return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});return ctx;}
(async()=>{
 for(const c of cases){const old=fs.readFileSync('/tmp/course-layout-baseline/docs/'+c.page,'utf8'),now=fs.readFileSync('docs/'+c.page,'utf8');assert.equal(now.match(/<main\b[\s\S]*?<\/main>/)?.[0],old.match(/<main\b[\s\S]*?<\/main>/)?.[0],c.page+' main markup unchanged');}
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 for(const width of [390,1440]){
  const ctx=await context(browser,{viewport:{width,height:width===390?844:1000}});let cursor=0;
  await Promise.all(Array.from({length:4},async()=>{const p=await ctx.newPage();p.on('pageerror',e=>errors.push(p.url()+': '+e.message));while(cursor<cases.length){const c=cases[cursor++];try{
   await p.goto('https://course.test/'+c.page);await p.waitForSelector('body.cw-ready',{timeout:5000});
   const before=fs.readFileSync('docs/'+c.page,'utf8');
   const measurement=await p.evaluate(original=>{
    const source=new DOMParser().parseFromString(original,'text/html');const counts=doc=>{const map={};for(const e of doc.querySelectorAll('main p,main h1,main h2,main h3,main dt,main dd,main blockquote')){if(e.querySelector('[data-study-resume],[data-ec-resume],[data-learning-resume]')||e.closest('noscript')||[...e.attributes].some(a=>a.name.startsWith('data-'))||e.matches('[role="status"]'))continue;const text=e.textContent.replace(/\s+/g,' ').trim();if(text)map[text]=(map[text]||0)+1;}return map;};const a=counts(source),b=counts(document);
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
    return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,missing:Object.keys(a).filter(k=>(b[k]||0)<a[k]),duplicateIds:ids.filter((v,i)=>ids.indexOf(v)!==i),h1:document.querySelectorAll('h1').length};
   },before);
   assert.ok(measurement.scrollWidth<=width+1,'overflow '+measurement.scrollWidth);assert.deepEqual(measurement.missing,[],'authored prose/headings preserved');assert.deepEqual(measurement.duplicateIds,[],'unique IDs');assert.equal(measurement.h1,1);
   if(['lesson','reference','section'].includes(c.role)){
    const links=await p.locator('.cw-curriculum a,.cw-pagination a').evaluateAll(es=>es.map(e=>e.href));for(const href of links){const u=new URL(href);assert.ok(fs.existsSync(path.resolve(root,'.'+u.pathname)),'navigation target '+href);}
    const bar=p.locator('.cw-pagination');assert.ok(await bar.isVisible());
   }
   if(representatives.has(c.page)){
    const filename=c.page.replaceAll('/','--')+'-'+width+'.png';await p.screenshot({path:path.join(out,filename)});screenshots.push({page:c.page,width,file:filename});
    if(c.role==='lesson'){
     const depth=p.locator('.cw-reading .batch-retained-depth').first();if(await depth.count()){await depth.locator(':scope > summary').focus();await p.keyboard.press('Enter');assert.ok(await depth.evaluate(e=>e.open));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'expanded depth overflow');}
     await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));assert.ok(await p.evaluate(()=>document.querySelector('body > footer').getBoundingClientRect().bottom<=document.querySelector('.cw-pagination').getBoundingClientRect().top+1),'bottom navigation covers footer');
     if(width===390){const trigger=p.locator('.cw-chapters');await trigger.focus();await p.keyboard.press('Enter');assert.ok(await p.locator('dialog').evaluate(e=>e.open));await p.locator('dialog button').first().focus();await p.keyboard.press('Shift+Tab');assert.ok(await p.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));await p.keyboard.press('Tab');assert.ok(await p.locator('dialog button').first().evaluate(e=>e===document.activeElement));await p.keyboard.press('Escape');await p.waitForFunction(()=>document.querySelector('.cw-chapters').getAttribute('aria-expanded')==='false');assert.ok(await trigger.evaluate(e=>e===document.activeElement));}
    }
   }
   results.push({page:c.page,width,status:'passed',height:measurement.height});
  }catch(e){failures.push({page:c.page,width,error:e.message});console.log('FAIL '+c.page+' '+width+': '+e.message.slice(0,450));}tested++;if(tested%100===0)console.log('Reviewed '+tested+' cases; failures '+failures.length);}
  await p.close();}));await ctx.close();
 }
 // Representative no-JavaScript fallback across every course family.
 const ctx=await context(browser,{viewport:{width:390,height:844},javaScriptEnabled:false});const p=await ctx.newPage();for(const route of representatives){await p.goto('https://course.test/'+route);assert.ok(await p.locator('main h1').isVisible(),route+' fallback');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' fallback overflow');}await ctx.close();
 }finally{await browser.close();fs.writeFileSync(out+'/browser-validation.json',JSON.stringify({status:errors.length||failures.length?'failed':'passed',pages:cases.length,cases:results.length,mainMarkupPreserved:cases.length,widths:[390,1440],representatives:[...representatives],screenshots,errors,failures,results},null,2));}
 console.log(JSON.stringify({tested,errors:errors.length,failures:failures.length,first:failures.slice(0,12)}));if(errors.length||failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
