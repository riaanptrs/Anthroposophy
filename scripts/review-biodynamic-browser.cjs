#!/usr/bin/env node
'use strict';

// Run only after the six parts and practice library have been generated:
//   node scripts/preview-biodynamic-agriculture.mjs
//   node scripts/review-biodynamic-browser.cjs
// Rerun only native no-JavaScript checks after a full run has finished:
//   node scripts/review-biodynamic-browser.cjs --suite no-javascript
// Optional runtime overrides:
//   --playwright-module /path/to/playwright
//   --chromium-executable /path/to/chromium
// Environment equivalents: BIODYNAMIC_PLAYWRIGHT_MODULE and
// BIODYNAMIC_CHROMIUM_EXECUTABLE. The repo defaults to this script's parent.
// Keep the staged tree unchanged during the run. This harness never launches a
// server, builds content, or uses a persistent profile.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Missing value for ' + name);
  return args[i + 1];
};
const repo = path.resolve(option('--repo', path.join(__dirname, '..')));
const configuredPlaywright = option('--playwright-module', process.env.BIODYNAMIC_PLAYWRIGHT_MODULE || '');
const runtimePlaywright = '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
let playwrightModule;
if (configuredPlaywright) {
  const moduleRequest = path.isAbsolute(configuredPlaywright) || configuredPlaywright.startsWith('.')
    ? path.resolve(configuredPlaywright) : configuredPlaywright;
  playwrightModule = require.resolve(moduleRequest, {paths:[repo, __dirname]});
}
else {
  try { playwrightModule = require.resolve('playwright', {paths:[repo, __dirname]}); }
  catch { playwrightModule = require.resolve(runtimePlaywright); }
}
const {chromium} = require(playwrightModule);
const browserExecutable = path.resolve(option('--chromium-executable', process.env.BIODYNAMIC_CHROMIUM_EXECUTABLE || '/usr/bin/chromium'));
const staged = path.join(repo, '.sites-runtime/biodynamic-course-preview/docs');
const selectedSuite = option('--suite', 'all');
assert.ok(['all','no-javascript'].includes(selectedSuite), 'Choose --suite all or --suite no-javascript');
const output = path.resolve(option('--output', selectedSuite === 'all' ? '/tmp/biodynamic-course-browser-review' : '/tmp/biodynamic-course-browser-review-no-javascript'));
const base = new URL(option('--base-url', 'http://127.0.0.1:4174/'));
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'The test server must be loopback');
assert.equal(base.protocol, 'http:', 'Use the isolated local HTTP preview');
assert.equal(base.pathname, '/', 'Serve the staged docs directory as the origin root');
assert.equal(base.port, '4174', 'Use the isolated draft port 4174, separate from the published-site preview');
assert.ok(output.startsWith('/tmp/'), 'Browser output must remain under /tmp');
fs.mkdirSync(output, {recursive:true});

const reportFile = path.join(output, 'report.json');
const report = {
  harnessVersion:2, selectedSuite, started:new Date().toISOString(), status:'running',
  repo, stagedRoot:staged, baseURL:base.href, browserExecutable, playwrightModule,
  freshContexts:true, externalNetworkAllowed:false,
  viewports:[320,390,1280], expectedCoursePages:68,
  results:[], pageErrors:[], consoleErrors:[], failedRequests:[], badResponses:[],
  blockedExternalRequests:[], incidentalBrowserRequests:[], prefixRequestRemappings:[], screenshots:[], downloads:[], coverage:{}
};
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const isMissingImplicitFavicon = value => {
  try { const url=new URL(value); return url.origin===base.origin && url.pathname==='/favicon.ico' && !fs.existsSync(path.join(staged,'favicon.ico')); }
  catch { return false; }
};
const readJSON = name => JSON.parse(fs.readFileSync(path.join(repo, 'content', name), 'utf8'));
const pad = id => String(id).padStart(2, '0');
const prefix = lang => lang === 'pt' ? 'pt/' : '';
const coursePath = (lang, tail='index.html') => prefix(lang) + 'biodynamics/' + tail;
const lessonPath = (lang, id) => coursePath(lang, 'lessons/' + pad(id) + '.html');
const absolute = relative => new URL(relative, base).href;
const expectedLang = lang => lang === 'pt' ? 'pt-BR' : 'en';
const noteFields = ['first','source','after','session1','session2','session3'];
const noteKey = id => 'anthro-study-v1:biodynamics/' + pad(id);
const enabledKey = 'anthro-study-v1:enabled';
const ownLastKey = 'anthro-study-v1:biodynamics:last';
const globalLastKey = 'anthro-study-v1:last';
let browser, course, parts, manifest;
const javascriptDisabledContexts = new WeakSet();

async function check(name, action, meta={}) {
  const started = Date.now();
  try {
    const details = await action();
    report.results.push({name, passed:true, durationMs:Date.now()-started, ...meta, ...(details === undefined ? {} : {details})});
    return true;
  } catch (error) {
    report.results.push({name, passed:false, durationMs:Date.now()-started, ...meta,
      error:error.message, stack:String(error.stack || '').split('\n').slice(0,9).join('\n')});
    process.stderr.write('FAIL ' + name + ': ' + error.message + '\n');
    return false;
  }
}

async function context(options={}) {
  const ctx = await browser.newContext({viewport:{width:390,height:900}, acceptDownloads:true, ...options});
  if (options.javaScriptEnabled === false) javascriptDisabledContexts.add(ctx);
  await ctx.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith(base.origin + '/') || /^(data:|blob:|about:)/.test(url)) return route.continue();
    report.blockedExternalRequests.push({url, resourceType:route.request().resourceType()});
    return route.abort('blockedbyclient');
  });
  return ctx;
}

async function newPage(ctx, label) {
  const page = await ctx.newPage();
  page.setDefaultTimeout(6000);
  page.setDefaultNavigationTimeout(15000);
  page.on('pageerror', error => report.pageErrors.push({label, url:page.url(), message:error.message}));
  page.on('console', message => {
    if (message.type() === 'error') {
      const entry={label,url:page.url(),text:message.text(),location:message.location()};
      // An implicit browser favicon is not an authored course resource.
      if (isMissingImplicitFavicon(entry.location.url)) report.incidentalBrowserRequests.push(entry);
      else report.consoleErrors.push(entry);
    }
  });
  page.on('requestfailed', request => {
    if (request.url().startsWith(base.origin + '/')) {
      const entry={label,url:request.url(),error:request.failure()?.errorText};
      if (isMissingImplicitFavicon(entry.url)) report.incidentalBrowserRequests.push(entry);
      else report.failedRequests.push(entry);
    }
  });
  page.on('response', response => {
    if (response.url().startsWith(base.origin + '/') && response.status() >= 400) {
      const entry={label,url:response.url(),status:response.status()};
      if (isMissingImplicitFavicon(entry.url)) report.incidentalBrowserRequests.push(entry);
      else report.badResponses.push(entry);
    }
  });
  return page;
}

async function go(page, relative, verifyStaged=false) {
  const errorsBefore = report.pageErrors.length;
  const response = await page.goto(absolute(relative), {waitUntil:'load'});
  assert.ok(response, 'Navigation must return an HTTP response');
  assert.equal(response.status(), 200, relative + ' HTTP status');
  if (verifyStaged) assert.equal(sha(await response.body()), sha(fs.readFileSync(path.join(staged, relative))), 'Server must return the exact staged HTML: ' + relative);
  // Disabled-script documents cannot reliably settle page-side font/rAF promises.
  // Their HTTP load event and subsequent locator assertions provide the wait.
  if (!javascriptDisabledContexts.has(page.context())) {
    await page.evaluate(async () => {
      if (document.fonts) await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
  }
  assert.equal(report.pageErrors.length, errorsBefore, 'No page errors while opening ' + relative);
  return response;
}

async function screenshot(page, name, locator) {
  const file = path.join(output, name + '.png');
  if (locator) await locator.screenshot({path:file});
  else await page.screenshot({path:file, fullPage:true});
  report.screenshots.push({file, url:page.url(), viewport:page.viewportSize()});
}

async function values(page) {
  return page.locator('[data-note-field]').evaluateAll(elements => Object.fromEntries(elements.map(el => [el.dataset.noteField,el.value])));
}

async function fillNotes(page, text) {
  for (const field of noteFields) await page.locator('[data-note-field="' + field + '"]').fill(text[field]);
}

async function rawStorage(page, keys) {
  return page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), keys);
}

async function waitSaved(page, id, lang, expected) {
  await page.waitForFunction(({key,lang,expected}) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Object.entries(expected).every(([field,text]) => value?.[lang]?.[field] === text);
    } catch { return false; }
  }, {key:noteKey(id),lang,expected}, {timeout:6000});
}

async function auditPage(page, entry, width) {
  await go(page, entry.path, true);
  const info = await page.evaluate(() => {
    const allIDs = [...document.querySelectorAll('[id]')].map(el => el.id);
    const seen = new Set(), duplicateIDs = [];
    for (const id of allIDs) { if (seen.has(id)) duplicateIDs.push(id); seen.add(id); }
    const unlabeled = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select')].filter(el => {
      if ([...(el.labels || [])].some(label => label.textContent.trim())) return false;
      if (el.getAttribute('aria-label')?.trim()) return false;
      return !(el.getAttribute('aria-labelledby') || '').split(/\s+/).some(id => document.getElementById(id)?.textContent.trim());
    }).map(el => ({tag:el.tagName,id:el.id,type:el.type}));
    const viewport = document.documentElement.clientWidth;
    const documentWidth = Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);
    const overflowElements = [...document.querySelectorAll('main *,header *')].filter(el => {
      if (el.closest('[data-table-scroll],.learning-table-scroll')) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.right > viewport + 2 || rect.left < -2);
    }).slice(0,12).map(el => ({tag:el.tagName,class:el.className,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right}));
    return {lang:document.documentElement.lang,duplicateIDs,unlabeled,viewport,documentWidth,overflowElements,
      alternate:[...document.querySelectorAll('link[rel="alternate"]')].map(el => ({href:el.href,lang:el.hreflang})),
      languageLinks:[...document.querySelectorAll('header a[lang]')].map(el => ({href:el.href,lang:el.lang})),
      nav:[...document.querySelectorAll('nav.system-nav a')].map(el => ({href:el.href,current:el.getAttribute('aria-current'),text:el.textContent.trim()})),
      h1Count:document.querySelectorAll('h1').length,
      fields:[...document.querySelectorAll('[data-note-field]')].map(el => el.dataset.noteField),
      studyId:document.querySelector('[data-study-id]')?.dataset.studyId};
  });
  assert.equal(info.lang, expectedLang(entry.lang), 'Document language');
  assert.equal(info.h1Count, 1, 'Exactly one primary heading');
  assert.deepEqual(info.duplicateIDs, [], 'Unique IDs');
  assert.deepEqual(info.unlabeled, [], 'All form fields have an accessible label');
  assert.ok(info.documentWidth <= info.viewport + 2, 'Document overflow at ' + width + ': ' + JSON.stringify(info));
  const opposite = entry.lang === 'pt' ? 'en' : 'pt';
  const partner = absolute(coursePath(opposite, entry.tail));
  assert.deepEqual(info.alternate, [{href:partner,lang:expectedLang(opposite)}], 'EN/PT alternate points to its exact partner');
  assert.ok(info.languageLinks.some(link => link.href === partner && link.lang === expectedLang(opposite)), 'Visible partner language link');
  assert.equal(info.nav.length, 4, 'Four main destinations');
  assert.ok(info.nav.every(link => link.text), 'Main navigation labels');
  assert.equal(info.nav.filter(link => link.current === 'true').length, 1, 'One current main destination');
  assert.ok(info.nav.some(link => link.current === 'true' && link.href === absolute(prefix(entry.lang)+'books/index.html')), 'Books is current');
  assert.ok(await page.locator('main[data-biodynamics-owned="true"]').isVisible(), 'Owned course root');
  assert.ok(await page.locator('.bio-draft').isVisible(), 'Private draft provenance remains visible');
  if (entry.lessonId) {
    assert.equal(info.studyId, 'biodynamics/' + pad(entry.lessonId), 'Distinct course notebook identity');
    assert.deepEqual([...info.fields].sort(), [...noteFields].sort(), 'All six note fields, once each');
    assert.equal(await page.locator('[data-biodynamic-source]').count(), 1, 'One attributed primary source');
    for (const control of ['save-notes','note-status','reading-view','complete','export','delete','first-preview']) assert.equal(await page.locator('[data-'+control+']').count(), 1, 'Required shared controller control '+control);
  }
  return {documentWidth:info.documentWidth,viewport:info.viewport,formLabelsChecked:true,partner};
}

async function pageMatrix() {
  for (const width of report.viewports) {
    const ctx = await context({viewport:{width,height:900}});
    const page = await newPage(ctx, 'matrix-' + width);
    for (const entry of manifest) await check('page ' + width + ' ' + entry.path, () => auditPage(page,entry,width), {suite:'page-matrix',width,path:entry.path});
    await ctx.close();
    process.stdout.write('Completed page matrix width ' + width + '\n');
  }
  report.coverage.pageMatrixAttempts = manifest.length * report.viewports.length;
}

async function quizFlows() {
  const ctx = await context();
  const page = await newPage(ctx, 'quizzes');
  for (const part of parts) for (const lang of ['en','pt']) {
    const id = part.lessonIds[0], relative = lessonPath(lang,id);
    await check('quiz flow part ' + part.id + ' ' + lang, async () => {
      await go(page, relative);
      const quizzes = page.locator('fieldset.learning-quiz');
      assert.equal(await quizzes.count(), 2, 'Two comprehension checks');
      for (let i=0;i<2;i++) {
        const quiz = quizzes.nth(i), radios = quiz.locator('input[type="radio"]');
        const correct = Number(await quiz.getAttribute('data-answer'));
        assert.ok(Number.isInteger(correct) && correct >= 0 && correct < await radios.count(), 'Valid correct option');
        await quiz.locator('[data-check-answer]').click();
        assert.equal(await quiz.getAttribute('data-feedback'), 'waiting');
        assert.ok(await radios.first().evaluate(el => el === document.activeElement), 'Waiting focuses first choice');
        await radios.nth((correct+1) % await radios.count()).check();
        await quiz.locator('[data-check-answer]').click();
        assert.equal(await quiz.getAttribute('data-feedback'), 'retry');
        assert.ok(await quiz.locator('[data-retry]').isVisible());
        assert.ok(await quiz.locator('details.answer-explanation').evaluate(el => el.open));
        assert.ok(await quiz.locator('details.answer-explanation p').isVisible(), 'Explanation visible after incorrect choice');
        assert.ok((await quiz.locator('details.answer-explanation p').innerText()).trim().length > 10);
        await quiz.locator('[data-retry]').click();
        assert.equal(await quiz.locator('input[type="radio"]:checked').count(), 0, 'Retry clears choices');
        assert.equal(await quiz.getAttribute('data-feedback'), null);
        assert.equal(await quiz.locator('details.answer-explanation').evaluate(el => el.open), false);
        assert.equal(await quiz.locator('[data-retry]').isVisible(), false);
        assert.ok(await radios.first().evaluate(el => el === document.activeElement));
        await radios.nth(correct).check();
        await quiz.locator('[data-check-answer]').click();
        assert.equal(await quiz.getAttribute('data-feedback'), 'correct');
        assert.match(await quiz.locator('[data-quiz-feedback]').innerText(), lang === 'pt' ? /Isso corresponde à leitura/ : /That matches the reading/);
        assert.ok(await quiz.locator('details.answer-explanation p').isVisible());
      }
      const reflection = page.locator('.learning-reflection details');
      assert.equal(await reflection.count(), 1);
      await reflection.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.ok(await reflection.evaluate(el => el.open), 'Transfer answer opens from keyboard');
      assert.ok(await reflection.locator('p').isVisible());
      return {path:relative,comprehensionQuestions:2,incorrectRetryCorrect:true,keyboardTransferAnswer:true};
    }, {suite:'quizzes',lang,part:part.id,lessonId:id});
  }
  await ctx.close();
  report.coverage.quizLessonFlows = 12;
  report.coverage.comprehensionQuestionFlows = 24;
}

async function mobileTablesAndDetails() {
  const ctx = await context({viewport:{width:320,height:900}});
  const page = await newPage(ctx, 'mobile-tables');
  for (const lang of ['en','pt']) {
    await check('keyboard table and details ' + lang, async () => {
      await go(page, coursePath(lang,'sources.html'));
      const table = page.locator('[data-table-scroll]').first();
      assert.equal(await table.getAttribute('tabindex'), '0');
      assert.equal(await table.getAttribute('role'), 'region');
      assert.ok((await table.getAttribute('aria-label'))?.trim());
      assert.ok(await table.evaluate(el => el.scrollWidth > el.clientWidth + 20), 'Table overflows its own region on mobile');
      await table.evaluate(el => {el.scrollLeft=0});
      await table.focus();
      assert.ok(await table.evaluate(el => el === document.activeElement));
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('[data-table-scroll]').scrollLeft > 0, undefined, {timeout:3000});
      const scrollLeft = await table.evaluate(el => el.scrollLeft);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), 'Scrolling does not widen document');
      const details = page.locator('details[data-deep-study]').first();
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.ok(await details.evaluate(el => el.open));
      assert.ok(await details.locator('ul').isVisible());
      await page.keyboard.press('Enter');
      assert.equal(await details.evaluate(el => el.open), false);
      await screenshot(page, 'source-table-keyboard-' + lang + '-320', table);
      return {scrollLeft,detailsKeyboardOpenAndClose:true};
    }, {suite:'mobile-tables',lang});
  }
  await check('substantial preparation tables', async () => {
    const part = parts.find(part => part.id === 4);
    const targets = [coursePath('en','parts/'+part.slug+'.html'), ...part.lessonIds.map(id=>lessonPath('en',id))];
    const tables = [];
    for (const relative of targets) {
      await go(page,relative);
      const regions = page.locator('[data-table-scroll]');
      for (let i=0;i<await regions.count();i++) {
        const region = regions.nth(i), text = await region.innerText();
        const rows = await region.locator('tbody tr').count();
        if (/502/.test(text) && /507/.test(text) && rows >= 6) tables.push({path:relative,index:i,rows,nineRoles:/500/.test(text)&&/508/.test(text)&&rows>=9});
      }
    }
    assert.ok(tables.length, 'Find a substantial 502–507 preparation comparison');
    assert.ok(tables.some(table=>table.nineRoles), 'Find the nine-role 500–508 map');
    const selected = tables.find(table=>table.nineRoles) || tables[0];
    await go(page,selected.path);
    await screenshot(page,'preparation-role-table-en-320',page.locator('[data-table-scroll]').nth(selected.index));
    await page.setViewportSize({width:1280,height:1000});
    await screenshot(page,'preparation-role-table-en-1280',page.locator('[data-table-scroll]').nth(selected.index));
    return {tables};
  }, {suite:'mobile-tables'});
  await ctx.close();
}

async function mobileFarmCycles() {
  const ctx=await context({viewport:{width:320,height:1000}});
  const page=await newPage(ctx,'mobile-farm-cycles');
  const part=parts.find(part=>part.id===3),lesson=part.lessons.find(lesson=>lesson.id===11);
  for(const lang of ['en','pt']){
    const targets=[
      {name:'lesson 11',path:lessonPath(lang,11),data:lesson[lang].cycle},
      {name:'Part III synthesis',path:coursePath(lang,'parts/'+part.slug+'.html'),data:part[lang].synthesis.cycle}
    ];
    for(const target of targets)await check('branched farm cycle '+target.name+' '+lang+' at 320',async()=>{
      await go(page,target.path,true);
      const figure=page.locator('figure[data-farm-cycle]');
      assert.equal(await figure.count(),1,'One actual branched figure replaces the single chain');
      assert.ok(await figure.isVisible());
      assert.equal((await figure.locator('figcaption').innerText()).trim(),target.data.caption);
      const paths=figure.locator('.bio-cycle-paths > section');
      assert.equal(await paths.count(),2,'Separate animal and plant-residue paths');
      const animal=paths.nth(0),residue=paths.nth(1);
      assert.equal((await animal.locator('h3').innerText()).trim(),target.data.paths[0].title);
      assert.equal((await residue.locator('h3').innerText()).trim(),target.data.paths[1].title);
      const manureReturns=await animal.locator('.bio-cycle-returns > li').allTextContents();
      assert.equal(manureReturns.length,2,'Two alternative manure returns');
      assert.notEqual(manureReturns[0],manureReturns[1],'Return alternatives are distinct');
      const compost=lang==='pt'?/composto/i:/compost/i;
      const soil=lang==='pt'?/solo/i:/soil/i;
      assert.ok(soil.test(manureReturns[0])&&!compost.test(manureReturns[0]),'Direct manure-to-soil route stays separate');
      assert.ok(soil.test(manureReturns[1])&&compost.test(manureReturns[1]),'Optional manure-through-compost route remains available');
      const residueReturns=await residue.locator('.bio-cycle-returns > li').allTextContents();
      assert.equal(residueReturns.length,1);
      assert.ok(compost.test(residueReturns[0])&&soil.test(residueReturns[0]),'Plant residue compost has its own soil return');
      assert.equal(await animal.locator('.bio-cycle-steps > li').last().innerText(),lang==='pt'?'Esterco':'Manure');
      const layout=await figure.evaluate(el=>{
        const routes=[...el.querySelectorAll('.bio-cycle-paths > section')];
        const rects=routes.map(route=>{const r=route.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,clientWidth:route.clientWidth,scrollWidth:route.scrollWidth}});
        const figureRect=el.getBoundingClientRect();
        return {viewport:document.documentElement.clientWidth,documentWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
          figureLeft:figureRect.left,figureRight:figureRect.right,rects,
          alternativeArrowContents:[...el.querySelectorAll('.bio-cycle-returns > li')].map(li=>getComputedStyle(li,'::after').content)};
      });
      assert.ok(layout.rects[1].top>=layout.rects[0].bottom-1,'Mobile paths stack as separate sections');
      assert.ok(Math.abs(layout.rects[0].left-layout.rects[1].left)<=1,'Stacked paths share a mobile column');
      assert.ok(layout.documentWidth<=layout.viewport+2,'No page overflow at 320px');
      assert.ok(layout.figureLeft>=-1&&layout.figureRight<=layout.viewport+2,'Cycle figure fits the viewport');
      assert.ok(layout.rects.every(rect=>rect.scrollWidth<=rect.clientWidth+2),'No overflow within either path');
      assert.ok(layout.alternativeArrowContents.every(content=>['none','normal','""'].includes(content)),'Alternative returns are not drawn as a sequential arrow chain');
      assert.match(await figure.innerText(),lang==='pt'?/não é uma etapa obrigatória/i:/not a compulsory step/i);
      assert.match(await figure.locator('.bio-credit').innerText(),lang==='pt'?/Diagrama original.*não uma reconstrução/i:/Original course diagram.*not a reconstruction/i);
      if((lang==='en'&&target.name==='lesson 11')||(lang==='pt'&&target.name==='Part III synthesis'))await screenshot(page,lang==='en'?'farm-cycle-lesson-11-en-320':'farm-cycle-part-iii-pt-320',figure);
      return {twoPaths:true,directAndCompostedManureReturns:true,separateResidueReturn:true,stackedAt320:true,layout};
    },{suite:'farm-cycle',lang,path:target.path,width:320});
  }
  await ctx.close();
}

async function noJavaScript() {
  const ctx = await context({javaScriptEnabled:false});
  const page = await newPage(ctx, 'no-javascript');
  for (const part of parts) for (const lang of ['en','pt']) {
    const relative = lessonPath(lang,part.lessonIds[0]);
    await check('no JavaScript source and answers part ' + part.id + ' ' + lang, async () => {
      await go(page,relative,true);
      assert.ok(!/(?:^|\s)(?:study-js|learning-js)(?:\s|$)/.test(await page.locator('html').getAttribute('class') || ''), 'Study scripts did not execute');
      const source = page.locator('[data-biodynamic-source] blockquote');
      assert.ok(await source.isVisible());
      assert.ok((await source.innerText()).trim().length > 10);
      const answers = page.locator('#understanding details.answer-explanation');
      assert.equal(await answers.count(),3);
      for (let i=0;i<3;i++) {
        const answer = answers.nth(i);
        assert.equal(await answer.getAttribute('open'),null,'Native answer begins collapsed');
        await answer.locator('summary').click();
        assert.notEqual(await answer.getAttribute('open'),null,'Native details opens without scripts');
        assert.ok(await answer.locator('p').isVisible(), 'Native answer remains available without scripts');
      }
      assert.equal(await page.locator('[data-save-notes]').isVisible(),false);
      assert.equal(await page.locator('[data-complete]').isVisible(),false);
      assert.ok(await page.locator('noscript').count());
      return {sourceVisible:true,nativeAnswersOpened:3};
    }, {suite:'no-javascript',lang,part:part.id});
  }
  await ctx.close();
  report.coverage.noJavaScriptSourcePages = 12;
}

async function notebook() {
  const ctx = await context(), page = await newPage(ctx,'notebook'), id=7;
  const enText = Object.fromEntries(noteFields.map(field => [field,'Browser review EN '+field]));
  const ptText = Object.fromEntries(noteFields.map(field => [field,'Revisão do navegador PT '+field]));
  const protectedRecords = {
    'anthro-study-v1:theosophy/00':'{"en":{"first":"Theosophy sentinel"},"future":9}',
    'anthro-study-v1:agriculture/01':'{"pt":{"source":"Agriculture sentinel"},"complete":true}',
    'anthro-study-v1:what-is-biodynamics/01':'{"en":{"after":"Courtney sentinel"}}',
    'anthro-learning-v1:lesson:32':'{"en":{"notes":"Beginner sentinel"},"extra":true}',
    'anthro-learning-v1:enabled':'yes',
    'legacy-unrelated-record':'raw legacy value'
  };
  await check('notebook opt-in and bilingual reload', async () => {
    await go(page,lessonPath('en',id));
    assert.equal(await page.locator('[data-save-notes]').isChecked(),false);
    await fillNotes(page,enText);
    await page.locator('[data-complete]').click();
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),noteKey(id)),null,'No note stored without consent');
    await page.reload({waitUntil:'load'});
    assert.deepEqual(await values(page),Object.fromEntries(noteFields.map(field=>[field,''])));
    assert.equal(await page.locator('[data-complete]').getAttribute('aria-pressed'),'false');
    await fillNotes(page,enText);
    await page.locator('[data-save-notes]').check();
    await waitSaved(page,id,'en',enText);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),enabledKey),'yes');
    await page.locator('[data-complete]').click();
    await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.complete===true,noteKey(id));
    await page.reload({waitUntil:'load'});
    assert.deepEqual(await values(page),enText);
    assert.equal(await page.locator('[data-complete]').getAttribute('aria-pressed'),'true');
    await page.locator('header a[lang="pt-BR"]').click();
    await page.waitForLoadState('load');
    assert.equal(new URL(page.url()).pathname,'/'+lessonPath('pt',id));
    assert.equal(await page.locator('[data-save-notes]').isChecked(),true);
    assert.deepEqual(await values(page),Object.fromEntries(noteFields.map(field=>[field,''])),'PT starts independently of EN');
    assert.equal(await page.locator('[data-complete]').getAttribute('aria-pressed'),'true','Study mark is shared');
    await fillNotes(page,ptText);
    await waitSaved(page,id,'pt',ptText);
    await page.reload({waitUntil:'load'});
    assert.deepEqual(await values(page),ptText);
    await page.locator('header a[lang="en"]').click();
    await page.waitForLoadState('load');
    assert.deepEqual(await values(page),enText);
    const record = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),noteKey(id));
    assert.deepEqual(record.en,enText); assert.deepEqual(record.pt,ptText);
    return {noteKey:noteKey(id),allSixFieldsRestoredBothLanguages:true,sharedComplete:true};
  }, {suite:'notebook'});

  await check('notebook unknown fields and legacy preservation', async () => {
    await go(page,lessonPath('en',id));
    await page.evaluate(({key,protectedRecords})=>{
      const record=JSON.parse(localStorage.getItem(key));
      record.future={keep:1}; record.en.futureField='Keep EN extra';record.pt.futureField='Manter extra PT';
      localStorage.setItem(key,JSON.stringify(record));
      for(const [key,value] of Object.entries(protectedRecords))localStorage.setItem(key,value);
    },{key:noteKey(id),protectedRecords});
    await page.reload({waitUntil:'load'});
    await page.locator('[data-note-field="first"]').fill('Changed EN explanation');
    await waitSaved(page,id,'en',{first:'Changed EN explanation'});
    const record=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),noteKey(id));
    assert.deepEqual(record.future,{keep:1});assert.equal(record.en.futureField,'Keep EN extra');
    assert.deepEqual(record.pt,{...ptText,futureField:'Manter extra PT'});
    assert.deepEqual(await rawStorage(page,Object.keys(protectedRecords)),protectedRecords);
    const downloadPromise=page.waitForEvent('download');
    await page.locator('[data-export]').click();
    const download=await downloadPromise,file=path.join(output,download.suggestedFilename());
    await download.saveAs(file);report.downloads.push(file);
    const exported=fs.readFileSync(file,'utf8');
    assert.ok(exported.includes('Changed EN explanation')&&exported.includes(enText.session3));
    return {unknownTopLevelAndLanguageFieldsPreserved:true,otherLanguagePreserved:true,legacyKeys:Object.keys(protectedRecords),exportFile:file};
  },{suite:'notebook'});

  await check('notebook opt-out flush and saved-record retention', async () => {
    await page.locator('[data-note-field="after"]').fill('Flush this pending EN revision');
    await page.locator('[data-save-notes]').uncheck();
    await waitSaved(page,id,'en',{after:'Flush this pending EN revision'});
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),enabledKey),null);
    const before=await page.evaluate(key=>localStorage.getItem(key),noteKey(id));
    await page.locator('[data-note-field="after"]').fill('Unsaved after opt-out');
    await page.reload({waitUntil:'load'});
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),noteKey(id)),before,'Opt-out preserves the record without saving later edits');
    assert.deepEqual(await values(page),Object.fromEntries(noteFields.map(field=>[field,''])));
    assert.equal(await page.locator('[data-save-notes]').isChecked(),false);
    assert.deepEqual(await rawStorage(page,Object.keys(protectedRecords)),protectedRecords);
    return {pendingEditFlushed:true,postOptOutEditsNotSaved:true,existingRecordKept:true};
  },{suite:'notebook'});
  await ctx.close();

  const malformedCtx=await context(), malformedPage=await newPage(malformedCtx,'malformed-notes');
  for(const raw of ['{invalid JSON','{"en":[]}']) await check('malformed notebook preserved '+raw,async()=>{
    await go(malformedPage,coursePath('en'));
    await malformedPage.evaluate(({key,raw,enabledKey})=>{localStorage.setItem(enabledKey,'yes');localStorage.setItem(key,raw)}, {key:noteKey(2),raw,enabledKey});
    await go(malformedPage,lessonPath('en',2));
    assert.match(await malformedPage.locator('[data-note-status]').innerText(),/could not be read.*kept unchanged/i);
    await malformedPage.locator('[data-note-field="first"]').fill('Keep the unreadable record safe');
    await malformedPage.locator('[data-complete]').click();
    assert.equal(await malformedPage.evaluate(key=>localStorage.getItem(key),noteKey(2)),raw);
    await malformedPage.reload({waitUntil:'load'});
    assert.equal(await malformedPage.evaluate(key=>localStorage.getItem(key),noteKey(2)),raw);
    await malformedPage.locator('[data-delete]').click();
    assert.equal(await malformedPage.evaluate(key=>localStorage.getItem(key),noteKey(2)),null,'Only explicit deletion removes an unreadable record');
    return {rawPreservedUntilExplicitDeletion:true};
  },{suite:'notebook-malformed'});
  await malformedCtx.close();
}

async function resume() {
  const ctx=await context(),page=await newPage(ctx,'resume');
  await check('course Continue survives another course global-last',async()=>{
    await go(page,coursePath('en'));
    await page.evaluate(key=>localStorage.setItem(key,'yes'),enabledKey);
    await go(page,lessonPath('en',7));
    const own=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),ownLastKey);
    assert.equal(own.course,'biodynamics');assert.equal(own.url,absolute(lessonPath('en',7)));
    await go(page,'philosophy-of-freedom/lessons/01.html');
    const global=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),globalLastKey);
    assert.ok(global&&global.course!=='biodynamics','A retained course overwrites global last');
    for(const lang of ['en','pt']){
      await go(page,coursePath(lang));
      const link=page.locator('[data-biodynamic-resume]');
      assert.equal(await link.evaluate(el=>el.href),absolute(lessonPath(lang,7)));
      assert.match(await link.innerText(),lang==='pt'?/Continuar a lição 7/:/Continue lesson 7/);
    }
    return {biodynamicLesson:7,globalCourse:global.course,bothLanguageResumeURLsCorrect:true};
  },{suite:'resume'});
  const invalid=[
    {name:'external origin',value:{course:'biodynamics',url:'https://outside.invalid/biodynamics/lessons/12.html'}},
    {name:'zero lesson',value:{course:'biodynamics',url:absolute(lessonPath('en',0))}},
    {name:'lesson 25',value:{course:'biodynamics',url:absolute(lessonPath('en',25))}},
    {name:'one digit',value:{course:'biodynamics',url:absolute('biodynamics/lessons/1.html')}},
    {name:'other prefix',value:{course:'biodynamics',url:absolute('preview/biodynamics/lessons/12.html')}},
    {name:'wrong course',value:{course:'agriculture',url:absolute(lessonPath('en',12))}},
    {name:'malformed JSON',raw:'{broken JSON'}
  ];
  for(const lang of ['en','pt'])for(const item of invalid)await check('resume refuses '+item.name+' '+lang,async()=>{
    await go(page,coursePath(lang));
    await page.evaluate(({enabledKey,ownLastKey,globalLastKey,raw,other})=>{
      localStorage.setItem(enabledKey,'yes');localStorage.setItem(ownLastKey,raw);localStorage.setItem(globalLastKey,JSON.stringify(other));
    },{enabledKey,ownLastKey,globalLastKey,raw:item.raw||JSON.stringify(item.value),other:{course:'agriculture',url:absolute('agriculture/lessons/01.html')}});
    await page.reload({waitUntil:'load'});
    assert.equal(await page.locator('[data-biodynamic-resume]').evaluate(el=>el.href),absolute(lessonPath(lang,1)));
    return {defaultLesson:1};
  },{suite:'resume-invalid',lang});
  for(const lang of ['en','pt'])await check('resume strips query/hash and uses correct language '+lang,async()=>{
    await go(page,coursePath(lang));
    await page.evaluate(({enabledKey,ownLastKey,globalLastKey,url})=>{
      localStorage.setItem(enabledKey,'yes');localStorage.setItem(ownLastKey,JSON.stringify({course:'biodynamics',url}));localStorage.removeItem(globalLastKey);
    },{enabledKey,ownLastKey,globalLastKey,url:absolute(lessonPath('en',12))+'?review=1#source'});
    await page.reload({waitUntil:'load'});
    assert.equal(await page.locator('[data-biodynamic-resume]').evaluate(el=>el.href),absolute(lessonPath(lang,12)));
    return {queryAndHashRemoved:true};
  },{suite:'resume',lang});
  await ctx.close();
}

async function githubPagesResume() {
  const ctx=await context(),page=await newPage(ctx,'github-pages-resume');
  const mount='Anthroposophy/';
  const mounted=relative=>mount+relative;
  // Preserve /Anthroposophy/ in document.location and in every browser-visible
  // link. Only the local HTTP lookup loses the prefix because the draft server
  // serves its docs tree at /. No external origin or remote GitHub request occurs.
  await ctx.route(base.origin+'/Anthroposophy/**',async route=>{
    const original=new URL(route.request().url());
    const stripped=new URL(original.href);
    stripped.pathname=original.pathname.slice('/Anthroposophy'.length);
    report.prefixRequestRemappings.push({requested:original.href,fetched:stripped.href});
    const response=await route.fetch({url:stripped.href});
    await route.fulfill({response});
  });
  async function mountedGo(relative){
    const response=await go(page,mounted(relative));
    assert.equal(new URL(page.url()).pathname,'/'+mounted(relative),'Actual browser location retains GitHub Pages prefix');
    assert.equal(sha(await response.body()),sha(fs.readFileSync(path.join(staged,relative))),'Prefix remapping returns the exact staged page');
  }
  await check('GitHub Pages Continue survives another course global-last',async()=>{
    await mountedGo(coursePath('en'));
    await page.evaluate(key=>localStorage.setItem(key,'yes'),enabledKey);
    await mountedGo(lessonPath('en',7));
    const own=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),ownLastKey);
    assert.equal(own.url,absolute(mounted(lessonPath('en',7))));
    await mountedGo('philosophy-of-freedom/lessons/01.html');
    const global=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),globalLastKey);
    assert.ok(global&&global.course!=='biodynamics');
    for(const lang of ['en','pt']){
      await mountedGo(coursePath(lang));
      const link=page.locator('[data-biodynamic-resume]');
      assert.equal(await link.evaluate(el=>el.href),absolute(mounted(lessonPath(lang,7))));
      await link.click();
      await page.waitForLoadState('load');
      assert.equal(new URL(page.url()).pathname,'/'+mounted(lessonPath(lang,7)));
      assert.equal(await page.locator('html').getAttribute('lang'),expectedLang(lang));
    }
    return {biodynamicLesson:7,globalCourse:global.course,bothLanguageLinksNavigated:true};
  },{suite:'resume-github'});
  for(const lang of ['en','pt']){
    await check('GitHub Pages resume strips query and fragment '+lang,async()=>{
      await mountedGo(coursePath(lang));
      await page.evaluate(({enabledKey,ownLastKey,url})=>{
        localStorage.setItem(enabledKey,'yes');
        localStorage.setItem(ownLastKey,JSON.stringify({course:'biodynamics',url}));
      },{enabledKey,ownLastKey,url:absolute(mounted(lessonPath('en',12)))+'?review=1#source'});
      await page.reload({waitUntil:'load'});
      assert.equal(await page.locator('[data-biodynamic-resume]').evaluate(el=>el.href),absolute(mounted(lessonPath(lang,12))));
      assert.equal(await page.locator('header a[lang="'+expectedLang(lang==='pt'?'en':'pt')+'"]').evaluate(el=>el.href),absolute(mounted(coursePath(lang==='pt'?'en':'pt'))),'Header language partner preserves mount');
      return {language:lang,queryAndFragmentRemoved:true};
    },{suite:'resume-github',lang});
    const invalid=[
      {name:'external origin',url:'https://outside.invalid/Anthroposophy/biodynamics/lessons/12.html'},
      {name:'root-only URL on prefixed site',url:absolute(lessonPath('en',12))},
      {name:'another project prefix',url:absolute('OtherProject/'+lessonPath('en',12))},
      {name:'invalid lesson 25',url:absolute(mounted(lessonPath('en',25)))}
    ];
    for(const item of invalid)await check('GitHub Pages refuses '+item.name+' '+lang,async()=>{
      await mountedGo(coursePath(lang));
      await page.evaluate(({enabledKey,ownLastKey,globalLastKey,url,otherURL})=>{
        localStorage.setItem(enabledKey,'yes');
        localStorage.setItem(ownLastKey,JSON.stringify({course:'biodynamics',url}));
        localStorage.setItem(globalLastKey,JSON.stringify({course:'agriculture',url:otherURL}));
      },{enabledKey,ownLastKey,globalLastKey,url:item.url,otherURL:absolute(mounted('agriculture/lessons/01.html'))});
      await page.reload({waitUntil:'load'});
      assert.equal(await page.locator('[data-biodynamic-resume]').evaluate(el=>el.href),absolute(mounted(lessonPath(lang,1))));
      return {defaultWithinMount:true};
    },{suite:'resume-github',lang});
  }
  await ctx.close();
}

async function discoveryAndProject() {
  const ctx=await context({viewport:{width:1280,height:1000}}),page=await newPage(ctx,'discovery');
  for(const lang of ['en','pt']){
    const p=prefix(lang),target=absolute(coursePath(lang));
    await check('staged book hub primary and companions '+lang,async()=>{
      await go(page,p+'books/index.html');
      const cards=page.locator('a.course-card');
      const links=await cards.evaluateAll(els=>els.map(el=>el.href));
      assert.equal(links.filter(url=>url===target).length,1,'One primary biodynamic card');
      for(const route of ['what-is-biodynamics','agriculture'])assert.equal(links.filter(url=>url===absolute(p+route+'/index.html')).length,0,'Source companion is outside primary cards');
      const companions=page.locator('#biodynamic-source-companions');
      assert.ok(await companions.isVisible());
      const retained=await companions.locator('a').evaluateAll(els=>els.map(el=>el.href));
      for(const route of ['agriculture','what-is-biodynamics'])assert.ok(retained.includes(absolute(p+route+'/index.html')));
      const card=page.locator('a.course-card[href="../biodynamics/index.html"]');
      await card.click();assert.equal(page.url(),target);
      await screenshot(page,'course-index-'+lang+'-1280');
      await page.locator('.bio-actions a[href="lessons/01.html"]').first().click();
      assert.equal(page.url(),absolute(lessonPath(lang,1)));
      return {primaryCardAndCompanionsCorrect:true,beginCourseReachedLesson1:true};
    },{suite:'discovery',lang});
    await check('staged theme onward '+lang,async()=>{
      await go(page,p+'themes/index.html');
      const link=page.locator('#biodynamics [data-biodynamic-onward] a');
      assert.equal(await link.count(),1);assert.ok(await link.isVisible());assert.equal(await link.evaluate(el=>el.href),target);
      await link.click();assert.equal(page.url(),target);
    },{suite:'discovery',lang});
    for(const route of ['what-is-biodynamics','agriculture'])await check('retained companion onward '+route+' '+lang,async()=>{
      await go(page,p+route+'/index.html');
      const onward=page.locator('[data-biodynamic-companion]');
      assert.equal(await onward.count(),1);assert.ok(await onward.isVisible());
      assert.equal(await onward.locator('a').evaluate(el=>el.href),target);
      assert.ok(await page.locator('#structured-readings').isVisible(),'Retained reading hierarchy remains');
    },{suite:'discovery',lang});
    for(const tail of ['learn/lessons/32.html','learn/lessons/36.html','introduction-to-anthroposophy/lessons/25.html'])await check('staged student onward '+tail+' '+lang,async()=>{
      await go(page,p+tail);
      const onward=page.locator('[data-biodynamic-onward]');
      assert.equal(await onward.count(),1);assert.ok(await onward.isVisible(),'Onward link is visible outside optional study');
      assert.equal(await onward.locator('a').evaluate(el=>el.href),target);
    },{suite:'discovery',lang});
    await check('final project visible '+lang,async()=>{
      await go(page,lessonPath(lang,24));
      const project=page.locator('#portrait-of-a-living-place');
      assert.ok(await project.isVisible());
      assert.ok((await project.locator('h2').innerText()).trim().length>8);
      assert.ok(await project.locator(':scope > ul > li').count()>=4,'Longitudinal project tasks');
      const model=project.locator('details');
      await model.locator('summary').click();
      assert.ok(await model.locator('p').first().isVisible());
      assert.ok(await model.locator('p').count()>=3,'Substantial worked model');
      assert.equal(await page.locator('.lesson-navigation a').last().evaluate(el=>el.href),absolute(coursePath(lang,'practice/index.html')),'Final onward leads to observation library');
      await page.setViewportSize({width:390,height:900});
      await screenshot(page,'final-project-'+lang+'-390',project);
      await page.setViewportSize({width:1280,height:1000});
      return {projectVisible:true,modelVisible:true,practiceLibraryOnward:true};
    },{suite:'project',lang});
  }
  await check('draft warning survives printing',async()=>{
    await go(page,lessonPath('en',12));
    await page.emulateMedia({media:'print'});
    assert.ok(await page.locator('.bio-draft').isVisible(),'Printed draft must retain its provenance');
    await page.emulateMedia({media:'screen'});
    await page.setViewportSize({width:390,height:900});
    await screenshot(page,'lesson-12-en-390');
  },{suite:'draft-provenance'});
  await ctx.close();
}

(async()=>{
  try{
    course=readJSON('biodynamic-agriculture-course.json');
    assert.equal(course.route,'biodynamics');assert.equal(course.parts.length,6);
    parts=course.parts.map(meta=>({...meta,...readJSON('biodynamic-part-'+meta.id+'.json')}));
    const library=readJSON('biodynamic-practice-library.json');
    assert.equal(library.categories.length,5,'Practice library must exist before browser review');
    assert.deepEqual(parts.flatMap(part=>part.lessons.map(lesson=>lesson.id)),Array.from({length:24},(_,i)=>i+1));
    manifest=[];
    for(const lang of ['en','pt']){
      const tails=['index.html','sources.html','background.html','practice/index.html',...parts.map(part=>'parts/'+part.slug+'.html'),...Array.from({length:24},(_,i)=>'lessons/'+pad(i+1)+'.html')];
      const files=fs.readdirSync(path.join(staged,prefix(lang),'biodynamics'),{recursive:true}).filter(file=>file.endsWith('.html')).map(file=>file.replaceAll('\\','/')).sort();
      assert.deepEqual(files,[...tails].sort(),'Exact 34-page manifest '+lang);
      for(const tail of tails){const lesson=tail.match(/^lessons\/(\d{2})\.html$/);manifest.push({lang,tail,path:coursePath(lang,tail),...(lesson?{lessonId:Number(lesson[1])}: {})});}
    }
    assert.equal(manifest.length,68);
    report.manifest=manifest.map(entry=>({path:entry.path,sha256:sha(fs.readFileSync(path.join(staged,entry.path)))}));
    report.sourceHashes=Object.fromEntries(['biodynamic-agriculture-course.json',...parts.map(part=>'biodynamic-part-'+part.id+'.json'),'biodynamic-practice-library.json'].map(name=>[name,sha(fs.readFileSync(path.join(repo,'content',name)))]));
    browser=await chromium.launch({headless:true,executablePath:browserExecutable,args:['--no-sandbox','--disable-dev-shm-usage']});
    report.browserVersion=browser.version();
    if (selectedSuite === 'all') {
      await pageMatrix();
      await quizFlows();
      await mobileTablesAndDetails();
      await mobileFarmCycles();
    }
    await noJavaScript();
    if (selectedSuite === 'all') {
      await notebook();
      await resume();
      await githubPagesResume();
      await discoveryAndProject();
    }
    await check('zero browser page errors',async()=>assert.deepEqual(report.pageErrors,[]),{suite:'runtime'});
    await check('zero failed local requests',async()=>assert.deepEqual(report.failedRequests,[]),{suite:'runtime'});
    await check('zero local HTTP errors',async()=>assert.deepEqual(report.badResponses,[]),{suite:'runtime'});
    await check('zero browser console errors',async()=>assert.deepEqual(report.consoleErrors,[]),{suite:'runtime'});
    await check('zero external network attempts',async()=>assert.deepEqual(report.blockedExternalRequests,[]),{suite:'runtime'});
  }catch(error){
    report.results.push({name:'harness prerequisites or fatal execution',passed:false,error:error.message,stack:error.stack});
    process.stderr.write(error.stack+'\n');
  }finally{
    if(browser)await browser.close();
    report.finished=new Date().toISOString();
    report.passed=report.results.filter(result=>result.passed).length;
    report.failed=report.results.filter(result=>!result.passed).length;
    report.coverage.pageMatrixPassed=report.results.filter(result=>result.suite==='page-matrix'&&result.passed).length;
    report.coverage.quizLessonFlowsPassed=report.results.filter(result=>result.suite==='quizzes'&&result.passed).length;
    report.coverage.noJavaScriptSourcePagesPassed=report.results.filter(result=>result.suite==='no-javascript'&&result.passed).length;
    report.coverage.githubPagesResumeChecksPassed=report.results.filter(result=>result.suite==='resume-github'&&result.passed).length;
    report.coverage.branchedFarmCycleChecksPassed=report.results.filter(result=>result.suite==='farm-cycle'&&result.passed).length;
    report.status=report.failed?'failed':'passed';
    fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
    process.stdout.write(JSON.stringify({status:report.status,suite:selectedSuite,passed:report.passed,failed:report.failed,reportFile,screenshots:report.screenshots.length,coverage:report.coverage},null,2)+'\n');
    if(report.failed)process.exitCode=1;
  }
})();
