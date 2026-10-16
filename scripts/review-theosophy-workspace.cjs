const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const out=process.env.PREVIEW_OUTPUT||'/workspace/theosophy-ux-preview';fs.mkdirSync(out,{recursive:true});
const ids=JSON.parse(fs.readFileSync('content/theosophy-clear-lessons.json')).map(r=>r.id);
const routes=['theosophy/index.html',...ids.map(id=>'theosophy/lessons/'+id+'.html')].flatMap(r=>[r,'pt/'+r]);
const report={pages:routes.length,widths:[390,1440],cases:[],checks:[],errors:[]};
const root=path.resolve('docs');
async function setup(browser,options={}) {
 const context=await browser.newContext(options);
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='course.test')return route.abort();const f=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){report.errors.push('Missing '+u.pathname);return route.fulfill({status:404,body:'Missing'});}return route.fulfill({contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 return context;
}
(async()=>{
 // Generated lesson bodies, source references, text, hooks and links are byte-identical.
 for(const r of routes){const before=cp.execFileSync('git',['show','350061a:docs/'+r],{encoding:'utf8'}),after=fs.readFileSync('docs/'+r,'utf8');assert.equal(after.match(/<main[\s\S]*<\/main>/)[0],before.match(/<main[\s\S]*<\/main>/)[0],r+' preserved main document');}
 report.checks.push('All 50 generated main documents byte-identical to baseline: content, anchors, source references and storage hooks');
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 for(const width of report.widths){const ctx=await setup(browser,{viewport:{width,height:width===390?844:1000}});const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  for(const route of routes){await page.goto('https://course.test/'+route);await page.waitForSelector('body.tw-ready');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
   const ids=await page.locator('[id]').evaluateAll(es=>es.map(e=>e.id));assert.equal(new Set(ids).size,ids.length,route+' duplicate ids');
   assert.equal(await page.locator('h1').count(),1);
   // Every authored paragraph and heading survives enhancement (including closed panels).
   const original=fs.readFileSync('docs/'+route,'utf8');
   const preservation=await page.evaluate(original=>{const src=new DOMParser().parseFromString(original,'text/html');const counts=nodes=>{const m={};for(const n of nodes){if(n.closest('noscript'))continue;if(n.matches('[data-concept-progress-summary],[data-concept-status],[data-concept-module-summary]'))continue;const k=n.textContent.trim();if(k)m[k]=(m[k]||0)+1;}return m;};const old=counts(src.querySelectorAll('main p, main h1, main h2, main h3, main dd, main dt')),now=counts(document.querySelectorAll('main p,main h1,main h2,main h3,main dd,main dt'));return Object.entries(old).filter(([k,v])=>(now[k]||0)<v).map(([k])=>k);},original);assert.deepEqual(preservation,[],route+' authored content');
   const links=await page.locator('main a[href],.tw-toolbar a[href],header a[href]').evaluateAll(es=>es.map(e=>e.href));
   for(const href of links){const u=new URL(href);if(u.hostname!=='course.test')continue;const f=path.resolve(root,'.'+u.pathname);assert.ok(fs.existsSync(f),route+' link '+href);if(u.hash){if(u.pathname===new URL(page.url()).pathname)assert.ok(await page.locator('[id]').evaluateAll((es,id)=>es.some(e=>e.id===id),decodeURIComponent(u.hash.slice(1))),href);else assert.ok(fs.readFileSync(f,'utf8').includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),href);}}
   const isLesson=route.includes('/lessons/');
   if(isLesson){assert.match(await page.locator('.tw-position').innerText(), /^(Lesson|Lição) [0-9]+ (of|de) 24$/);
    const depth=page.locator('.cp-retained-depth');await depth.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.ok(await depth.evaluate(e=>e.open));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' depth overflow');
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
    const bottom=await page.evaluate(()=>({bar:document.querySelector('.tw-pagination').getBoundingClientRect().top,footer:document.querySelector('footer').getBoundingClientRect().bottom}));assert.ok(bottom.footer<=bottom.bar+1,route+' footer covered by bottom navigation');
    if(width===390){const trigger=page.locator('.tw-chapters');await trigger.focus();await page.keyboard.press('Enter');assert.ok(await page.locator('dialog').evaluate(e=>e.open));assert.equal(await page.locator('dialog .cp-module-navigation [aria-current]').count(),1);
     for(let i=0;i<35;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)),'focus escaped drawer');}
     await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('.tw-chapters').getAttribute('aria-expanded')==='false');assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.ok(await trigger.evaluate(e=>e===document.activeElement),'focus return');
    }
   }
   report.cases.push({route,width,passed:true,height:await page.evaluate(()=>document.documentElement.scrollHeight)});
  }
  await ctx.close();console.log('Passed '+report.cases.length+' layout cases');
 }
 report.checks.push('100 EN/PT viewport cases: preserved authored paragraphs/headings, links/anchors, single H1, unique IDs, expanded depth, no horizontal overflow, footer clear of bottom bar','48 mobile lesson drawers: keyboard opening, modal focus containment, Escape and focus return');
 const ctx=await setup(browser,{viewport:{width:390,height:844},acceptDownloads:true}),page=await ctx.newPage();
 await page.goto('https://course.test/theosophy/lessons/body-soul-spirit.html');
 await page.locator('a[href="#personal-study"]').click();await page.locator('[data-concept-reflection]').fill('English review note');await page.waitForTimeout(450);
 assert.equal(await page.evaluate(()=>localStorage.length),0,'no persistence before consent');
 await page.locator('[data-concept-save]').check();await page.locator('[data-concept-state]').selectOption('studied');await page.locator('[data-concept-bookmark]').click();await page.waitForTimeout(500);
 const key='anthro-concept-v1:theosophy:body-soul-spirit';let rec=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));assert.equal(rec.en.reflection,'English review note');assert.equal(rec.state,'studied');assert.equal(rec.bookmarked,true);
 await page.locator('header a[lang]').click();assert.ok(page.url().includes('/pt/theosophy/lessons/body-soul-spirit.html'));await page.locator('a[href="#personal-study"]').click();assert.equal(await page.locator('[data-concept-reflection]').inputValue(),'');assert.equal(await page.locator('[data-concept-state]').inputValue(),'studied');await page.locator('[data-concept-reflection]').fill('Reflexão portuguesa');await page.waitForTimeout(500);
 rec=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));assert.equal(rec.en.reflection,'English review note');assert.equal(rec.pt.reflection,'Reflexão portuguesa');
 const download=page.waitForEvent('download');await page.locator('[data-concept-export]').click();await (await download).saveAs(out+'/export-test.txt');const exported=fs.readFileSync(out+'/export-test.txt','utf8');assert.ok(exported.includes('English review note')&&exported.includes('Reflexão portuguesa'));
 await page.reload();await page.locator('a[href="#personal-study"]').click();assert.equal(await page.locator('[data-concept-reflection]').inputValue(),'Reflexão portuguesa');await page.locator('[data-concept-delete]').click();assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);
 report.checks.push('Opt-in saving only; original storage keys; study state/bookmark; EN/PT independent notes; reload, export and delete');
 // Hash entry opens nested retained content; resizing closes modal without stranding focus.
 await page.goto('https://course.test/pt/theosophy/lessons/whole-picture.html');await page.locator('.tw-chapters').click();await page.screenshot({path:out+'/mobile-portuguese-chapters.png'});await page.setViewportSize({width:1440,height:1000});assert.equal(await page.locator('dialog').evaluate(e=>e.open),false);assert.ok(await page.locator('.tw-sidebar .cp-module-navigation').isVisible());
 await page.goto('https://course.test/theosophy/lessons/body-soul-spirit.html#building-the-concept');assert.ok(await page.locator('#building-the-concept').isVisible());
 // 200% zoom-equivalent reflow: a 1440x1000 viewport becomes 720x500 CSS pixels.
 await page.setViewportSize({width:720,height:500});await page.goto('https://course.test/pt/theosophy/lessons/whole-picture.html');await page.locator('.cp-retained-depth > summary').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.tw-chapters').click();await page.keyboard.press('Escape');await page.screenshot({path:out+'/portuguese-200-percent-reflow.png'});
 report.checks.push('Direct deep anchors; mobile-to-desktop drawer resize; Portuguese long labels; 200% zoom-equivalent reflow at 720x500 CSS px');
 const screenStates=await page.locator('details').evaluateAll(es=>es.map(e=>e.open));await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));assert.ok(await page.locator('details').evaluateAll(es=>es.every(e=>e.open)));await page.emulateMedia({media:'print'});assert.equal(await page.locator('.tw-pagination').isVisible(),false);await page.pdf({path:out+'/theosophy-portuguese-full-lesson-print.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});await page.evaluate(()=>dispatchEvent(new Event('afterprint')));assert.deepEqual(await page.locator('details').evaluateAll(es=>es.map(e=>e.open)),screenStates);
 report.checks.push('Print expands all authored content, hides fixed chrome, restores disclosure state afterward');
 await ctx.close();
 const nojs=await setup(browser,{javaScriptEnabled:false,viewport:{width:390,height:844}});const fallback=await nojs.newPage();await fallback.goto('https://course.test/theosophy/lessons/body-soul-spirit.html');assert.ok(await fallback.locator('.cp-first-reading').isVisible());await fallback.locator('.cp-retained-depth > summary').click();assert.ok(await fallback.locator('#building-the-concept').isVisible());await nojs.close();report.checks.push('No-JavaScript original reading, depth disclosure and navigation fallback');
 assert.deepEqual(report.errors,[]);report.status='passed';
 } finally {await browser.close();fs.writeFileSync(out+'/validation.json',JSON.stringify(report,null,2)+'\n');}
 console.log(report.checks.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1;});
