const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const {Marked}=await import('./vendor/marked/marked.mjs');
 const {loadWaldorfContent,waldorfPresentation}=await import('./waldorf-content.mjs');
 const items=loadWaldorfContent(),manifest=JSON.parse(fs.readFileSync('content/waldorf/manifest.json','utf8'));
 const origin=process.env.WALDORF_PREVIEW_URL||'http://127.0.0.1:4173';
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[],requests=[],checks=[];
 const normalize=s=>s.replace(/\s/g,'');
 try {
  for(const width of [1280,390,320]) {
   const prefix=width===390?'/Anthroposophy/':'/';
   const ctx=await browser.newContext({viewport:{width,height:900}});
   // Serve the same docs beneath a repository prefix to test relative URLs.
   await ctx.route('**/*',async route=>{
    const url=route.request().url();
    if(!url.startsWith(origin))return route.abort();
    if(prefix!=='/'&&new URL(url).pathname.startsWith(prefix))return route.fulfill({response:await route.fetch({url:url.replace(origin+prefix,origin+'/')})});
    return route.continue();
   });
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)requests.push(r.status()+' '+r.url());});
   for(const route of manifest.pages) {
    const response=await page.goto(origin+prefix+route,{waitUntil:'load'});assert.equal(response.status(),200,route);
    assert.equal(await page.locator('h1').count(),1,route);
    assert.ok(!await page.locator('main').textContent().then(t=>t.includes('[BOOK]')),route+' no raw book markers');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Overflow at ${width}: ${route}`);
    assert.ok(await page.getByRole('navigation',{name:'Waldorf course',exact:true}).isVisible(),route+' course navigation');
    assert.ok(await page.evaluate(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0)),route+' artwork decodes');
    const src=items.find(i=>i.route===route);
    if(width===1280&&src) {
     const presentation=waldorfPresentation(src);
     assert.equal(presentation.blocks.map(b=>b.raw).join(''),src.body,'Every original Markdown block retained');
     const parser=new Marked({gfm:true});
     for(const [selector,copy] of [['[data-wf-copy]',presentation.reading],['[data-wf-editorial]',presentation.editorial]]) {
      if(!copy)continue;
      const actual=await page.locator(selector).evaluate(node=>{
       const copy=node.cloneNode(true);
       for(const label of copy.querySelectorAll('[data-original-label]'))label.textContent=label.dataset.originalLabel;
       return copy.textContent;
      });
      const expected=parser.parse(copy.replace(/:chatgpt-content-reference\{index="(\d+)"\}/g,'[Unresolved conversation citation $1 — primary-source check pending]'));
      const expectedText=await page.evaluate(html=>new DOMParser().parseFromString(html,'text/html').body.textContent,expected);
      assert.equal(normalize(actual),normalize(expectedText),'Supplied text preserved in reading/source panel: '+src.source);
     }
     assert.ok(!await page.locator('[data-wf-copy]').textContent().then(t=>t.includes('Status: DRAFT COPY')),'No repeated package status in lesson body');
    }
    if(width===320) {
     for(const detail of await page.locator('.wf-dossier,.wf-sources').all()) {
      await detail.locator(':scope > summary').click();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Expanded overflow: ${route}`);
     }
    }
    checks.push({width,route,prefix});
   }
   await page.goto(origin+prefix+'learn/waldorf/index.html');
   await page.locator('[data-wf-search]').fill('Grade 6');
   assert.ok(await page.locator('[data-wf-item]:visible').count()>0,'Search matches');
   await page.locator('[data-wf-filter]').selectOption('parents');
   assert.equal(await page.locator('[data-wf-item]:visible').count(),0,'Combined filters and no-results state');
   await page.locator('[data-wf-search]').fill('');
   assert.equal(await page.locator('[data-wf-item]:visible').count(),14,'All parent topics');
   await page.locator('[data-wf-filter]').selectOption('');
   assert.equal(await page.locator('[data-wf-item]:visible').count(),62,'Reset shows all topics');
   await page.locator('.wf-timeline a').nth(3).click();
   assert.match(page.url(),/nine-year-change\.html$/,'Timeline navigation');
   await page.goto(origin+prefix+items[0].route);
   if(width===1280){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'/workspace/waldorf-lesson-updated.png',fullPage:false});}
   const sourcePanel=page.locator('.wf-sources > summary');await sourcePanel.focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('.wf-sources').getAttribute('open'),'','Keyboard-accessible source panel');
   assert.equal(await page.evaluate(()=>localStorage.length),0,'No automatic study storage');
   await page.locator('[data-wf-mark]').click();assert.equal(await page.evaluate(()=>localStorage.length),0,'Saving disabled by default');
   await page.locator('[data-wf-save]').check();await page.reload();
   assert.equal(await page.locator('[data-wf-mark]').getAttribute('aria-pressed'),'true','Reading mark survives reload');
   await page.locator('[data-wf-delete]').click();await page.reload();
   assert.equal(await page.locator('[data-wf-mark]').getAttribute('aria-pressed'),'false','Saved mark deleted');
   await page.goto(origin+prefix+'learn/waldorf/grades/grade-6/curriculum.html');
   await page.locator('.wf-prev-next a').last().click();assert.match(page.url(),/grade-7\/index\.html$/,'Next grade');
   await page.goto(origin+prefix+'learn/index.html');assert.ok(await page.locator('#waldorf-course').isVisible());
   await page.locator('#waldorf-course a').click();assert.match(page.url(),/learn\/waldorf\/index\.html$/);
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`/workspace/waldorf-preview-${width}.png`,fullPage:width!==1280});
   await ctx.close();
  }
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}}),page=await ctx.newPage();
  for(const route of ['index.html','subjects/physics.html','grades/grade-1/index.html','parents/religion.html']) {
   await page.goto(origin+'/learn/waldorf/'+route);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No-JS overflow '+route);
   if(route.includes('grade-1')) {await page.locator('.wf-dossier > summary').click();assert.ok(await page.locator('[data-wf-copy]').isVisible(),'No-JS dossier');}
   if(route==='index.html')assert.equal(await page.locator('[data-wf-item]:visible').count(),62,'No-JS directory');
  }
  await ctx.close();
  // Storage failure must not disable reading or controls.
  const blocked=await browser.newContext({viewport:{width:390,height:900}});
  await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
  const blockedPage=await blocked.newPage();await blockedPage.goto(origin+'/'+items[0].route);await blockedPage.locator('[data-wf-save]').check();await blockedPage.locator('[data-wf-mark]').click();assert.ok(await blockedPage.locator('.wf-copy').isVisible());await blocked.close();
  assert.deepEqual(errors,[],'No browser JavaScript errors');assert.deepEqual(requests,[],'No failed resources');
  fs.writeFileSync('/tmp/waldorf-browser-review.json',JSON.stringify({pages:checks.length,contentFilesCompared:items.length,widths:[1280,390,320],repositoryPrefix:true,noJavaScript:true,storageBlocked:true,errors,requests},null,2)+'\n');
  console.log(`Passed Waldorf browser review: ${checks.length} page/viewport checks; full text of all ${items.length} source files preserved; filtering, source panels, links, opt-in storage, prefix, no-JS and blocked storage.`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
