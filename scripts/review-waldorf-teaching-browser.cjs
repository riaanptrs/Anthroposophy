// Run after the full build. Browser requests are fulfilled from local files.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const manifest=JSON.parse(fs.readFileSync('content/waldorf-teaching-manifest.json','utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[],requests=[];
 const {Marked}=await import('./vendor/marked/marked.mjs');
 const {loadWaldorfContent,waldorfPresentation}=await import('./waldorf-content.mjs');
 const originalItems=loadWaldorfContent();
 const normalize=text=>text.replace(/\s/g,'');
 async function context(options={}){
  const ctx=await browser.newContext(options);
  await ctx.route('**/*',async route=>{
   const url=new URL(route.request().url());if(url.hostname!=='course.test')return route.abort();
   const local=url.pathname.replace(/^\/Anthroposophy\//,'/');
   let file=path.join(process.cwd(),'docs',local);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   if(!fs.existsSync(file)){requests.push(url.pathname);return route.fulfill({status:404,body:'Not found'});}
   return route.fulfill({contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
  });return ctx;
 }
 const desktop=await context({viewport:{width:1280,height:900}}),page=await desktop.newPage();page.on('pageerror',error=>errors.push(error.message));
 for(const route of manifest.pages){
  const response=await page.goto('http://course.test/Anthroposophy/'+route);assert.equal(response.status(),200);
  assert.equal(await page.locator('h1').count(),1,route);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desktop overflow '+route);
  const original=originalItems.find(item=>item.route===route);
  if(original){
   const presentation=waldorfPresentation(original),parser=new Marked({gfm:true});
   for(const [selector,copy] of [['[data-wf-copy]',presentation.reading],['[data-wf-editorial]',presentation.editorial]]){
    if(!copy.trim())continue;
    const actual=await page.locator(selector).evaluate(node=>{
     const clone=node.cloneNode(true);
     for(const h of clone.querySelectorAll('[data-original-heading]'))h.textContent=h.dataset.originalHeading;
     for(const label of clone.querySelectorAll('[data-original-label]'))label.textContent=label.dataset.originalLabel;
     for(const citation of clone.querySelectorAll('[data-citation-index]'))citation.textContent=citation.dataset.citationFormat==='short'?'[unresolved conversation citation '+citation.dataset.citationIndex+']':'[Unresolved conversation citation '+citation.dataset.citationIndex+' — primary-source check pending]';
     for(const preview of clone.querySelectorAll('[data-original-preview-html]'))preview.innerHTML=preview.dataset.originalPreviewHtml;
     return clone.textContent;
    });
    const expectedHtml=parser.parse(copy.replace(/:chatgpt-content-reference\{index="(\d+)"\}/g,'[Unresolved conversation citation $1 — primary-source check pending]'));
    const expected=await page.evaluate(html=>new DOMParser().parseFromString(html,'text/html').body.textContent,expectedHtml);
    assert.equal(normalize(actual),normalize(expected),'Original public record preserved: '+original.source);
   }
  }
  const article=page.locator('article.wf-teaching');if(await article.count()){
   assert.ok(await article.locator('#wf-teaching-concept p').first().isVisible());
   assert.ok(await article.locator('#wf-teaching-example p').isVisible());
   assert.equal(await article.locator('.learning-reflection').count(),2);
   await article.locator('.answer-explanation > summary').first().click();assert.ok(await article.locator('.answer-explanation p').first().isVisible());
  }
 }
 for(const width of [390,320]){
  const ctx=await context({viewport:{width,height:900}}),p=await ctx.newPage();
  for(const route of ['learn/waldorf/index.html','pt/learn/waldorf/index.html','pt/learn/waldorf/grades/grade-6/index.html','pt/learn/waldorf/grades/grade-6/curriculum.html','pt/learn/waldorf/parents/home-life.html','learn/waldorf/foundations/what-is-waldorf.html']){
   await p.goto('http://course.test/Anthroposophy/'+route);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile overflow '+width+' '+route);
  }
  await p.goto('http://course.test/pt/learn/waldorf/index.html');await p.locator('[data-wf-search]').fill('leitura');
  assert.ok(await p.locator('[data-wf-item]:visible').count()>0);assert.ok((await p.locator('[data-wf-results]').textContent()).includes('temas exibidos'));
  await ctx.close();
 }
 await page.goto('http://course.test/learn/waldorf/foundations/what-is-waldorf.html');
 await page.evaluate(()=>{localStorage.setItem('anthro-waldorf-v1:enabled','yes');localStorage.setItem('anthro-waldorf-v1:foundations-01-what-is-waldorf','read');localStorage.setItem('other-course-keep','preserved');});
 await page.reload();assert.equal(await page.locator('[data-wf-mark]').getAttribute('aria-pressed'),'true');
 await page.goto('http://course.test/pt/learn/waldorf/foundations/what-is-waldorf.html');assert.equal(await page.locator('[data-wf-mark]').getAttribute('aria-pressed'),'true');assert.ok((await page.locator('[data-wf-mark]').textContent()).includes('Lição lida'));
 await page.locator('[data-wf-mark]').click();await page.locator('[data-wf-mark]').click();await page.reload();assert.equal(await page.locator('[data-wf-mark]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.evaluate(()=>localStorage.getItem('other-course-keep')),'preserved');
 assert.equal(await page.locator('[data-optional-source]').getAttribute('open'),null);await page.locator('[data-optional-source] > summary').click();assert.ok(await page.locator('.wf-verified-source blockquote').isVisible());
 await page.locator('nav[aria-label="Idioma"] a').click();assert.ok(page.url().includes('/learn/waldorf/foundations/what-is-waldorf.html'));
 const nojs=await context({javaScriptEnabled:false,viewport:{width:320,height:900}}),plain=await nojs.newPage();
 await plain.goto('http://course.test/pt/learn/waldorf/parents/home-life.html');assert.ok(await plain.locator('#wf-teaching-concept').isVisible());await plain.locator('.answer-explanation > summary').first().click();assert.ok(await plain.locator('.answer-explanation p').first().isVisible());
 const blocked=await context();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));
 const blockedPage=await blocked.newPage();await blockedPage.goto('http://course.test/pt/learn/waldorf/parents/home-life.html');await blockedPage.locator('[data-wf-save]').check();await blockedPage.locator('[data-wf-mark]').click();assert.ok((await blockedPage.locator('[data-wf-study-status]').textContent()).includes('indisponível'));
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);await browser.close();
 console.log(`Passed Waldorf browser: ${manifest.pages.length} routes, English/PT models, 320/390px layouts, Portuguese search, inherited reading marks across languages, real source excerpts, no-JavaScript and blocked-storage access.`);
})().catch(error=>{console.error(error);process.exit(1)});
