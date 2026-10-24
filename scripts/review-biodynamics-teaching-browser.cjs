const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const rows=JSON.parse(fs.readFileSync('content/agriculture-clear-lessons.json')).filter(r=>r.course==='what-is-biodynamics');
const figures=JSON.parse(fs.readFileSync('content/what-is-biodynamics-illustrations.json')).figures;
const plain=s=>s.replace(/\s+/g,' ').trim();
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let cases=0,imageCases=0;const missing=[];
 try{
 for(const width of [1280,320]){
 const context=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:false,reducedMotion:'reduce'});
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='course.test')return r.abort();const f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve('docs')+path.sep)||!fs.existsSync(f)){missing.push(u.pathname);return r.fulfill({status:404,body:'Missing'});}return r.fulfill({contentType:({'.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});});
 const page=await context.newPage();
 for(const row of rows)for(const lang of ['en','pt']){
 const route=`${lang==='pt'?'pt/':''}what-is-biodynamics/lessons/${String(row.id).padStart(2,'0')}.html`,v=row[lang];await page.goto('http://course.test/'+route);
 const first=page.locator('[data-batch-clarity-first]');assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt'?'pt-BR':'en');
 assert.equal(plain(await first.locator('.clarity-learning-goal').innerText()).endsWith(plain(v.goal)),true);
 assert.deepEqual((await first.locator(':scope > p:not(.clarity-learning-goal)').allTextContents()).map(plain),v.paragraphs.map(plain),route+' ordered prose');
 for(const p of await first.locator(':scope > p').all())assert.ok(await p.isVisible());
 const example=first.locator('[data-biodynamics-worked-example]');assert.ok(await example.isVisible());assert.deepEqual((await example.locator('li').allInnerTexts()).map(plain),v.workedExample.steps.map(plain));
 for(const d of await first.locator('.guided-biodynamics-figure').all()){assert.equal(await d.getAttribute('open'),null);await d.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.ok(await d.locator('figure').isVisible());}
 for(const f of await first.locator('[data-biodynamics-figure]').all()){
 const id=await f.getAttribute('data-biodynamics-figure'),meta=figures.find(x=>x.id===id),img=f.locator('img');
 await img.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0));assert.equal(await img.getAttribute('alt'),meta[lang].alt);assert.equal(await f.locator('a').getAttribute('href'),await img.getAttribute('src'));assert.deepEqual((await f.locator('li').allInnerTexts()).map(plain),meta[lang].steps.map(plain));imageCases++;
 }
 const checks=first.locator('.batch-clarity-check');assert.equal(await checks.count(),2);
 for(let i=0;i<2;i++){const d=checks.nth(i).locator('details');assert.equal(await d.getAttribute('open'),null);await d.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await d.locator('p').isVisible());assert.equal(plain(await d.locator('p').innerText()),plain(v.checks[i][1]));}
 const depth=page.locator('.batch-retained-depth');assert.equal(await depth.getAttribute('open'),null);await depth.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.ok(await depth.locator('p').first().isVisible());const source=depth.locator('details.course-source-study');await source.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.ok(await depth.locator('#book-passage').isVisible());
 assert.ok(await page.locator('main > nav.lesson-navigation').isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' horizontal overflow '+width);
 const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(ids.length,new Set(ids).size);
 for(const href of await page.locator('main a[href],link[rel="alternate"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')))){const u=new URL(href,'http://course.test/'+route);if(u.hostname!=='course.test')continue;let f=path.resolve('docs','.'+decodeURIComponent(u.pathname));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');assert.ok(fs.existsSync(f),route+' missing '+href);if(u.hash&&f.endsWith('.html'))assert.ok(fs.readFileSync(f,'utf8').includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),route+' missing anchor '+href);}
 if(row.id===2&&lang==='pt'){await first.locator('.biodynamics-figure-grid').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await page.screenshot({path:`/tmp/what-biodynamics-revision/lesson02-pt-${width}.png`,fullPage:false,animations:'disabled'});}
 cases++;console.log('Checked '+width+' '+route);
 }
 await context.close();console.log('Passed '+cases+' browser cases');
 }
 assert.deepEqual(missing,[]);fs.writeFileSync('reviews/pedagogy/what-is-biodynamics-browser.json',JSON.stringify({reviewed:'2026-10-24',status:'passed',pages:28,viewportCases:cases,imageCases,widths:[1280,320],javascript:false,checks:['visible ordered bilingual teaching and learning goals','three-step worked examples','seven source images decoded with full-size links and localized alternatives','optional advanced figures open with keyboard','two keyboard-operable explained questions','retained source depth and navigation','local links and anchors','unique IDs','no horizontal overflow'],limits:['No learner study','Original handwriting remains English; bilingual guides explain it']},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
