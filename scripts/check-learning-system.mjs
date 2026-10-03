import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {esc,n,wholeElement} from './learning-html.mjs';
import {isPracticalThinkingOwned,coreRouteIds,optionalRouteIds,partSlugs} from './practical-thinking-owned.mjs';
import {temperamentComparativeChecks} from '../content/temperament-comparison-practice.mjs';
import {platformNav,platformSupportNav,platformArea,platformSite} from './platform-architecture.mjs';
import {isConceptPlatformOwned} from './concept-platform-owned.mjs';
const json=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const catalogue=json('learning-system-catalogue.json'),sources=json('learning-system-sources.json'),passages=json('passage-study.json');
const biodynamics=json('what-is-biodynamics.json'),biodynamicsPassages=json('what-is-biodynamics-passages.json');
const agriculture=json('agriculture.json'),agriculturePassages=json('agriculture-passages.json');
const threefold=json('toward-threefold-society.json'),threefoldPassages=json('toward-threefold-society-passages.json');
const sourceCourses={'what-is-biodynamics':biodynamics,'agriculture':agriculture,'toward-threefold-society':threefold};
const passageCollections={'passage-study':passages,'what-is-biodynamics':biodynamicsPassages,'agriculture':agriculturePassages,'toward-threefold-society':threefoldPassages};
const lessons=['01-12','13-24','25-36'].flatMap(range=>json('learning-lessons-'+range+'.json'));
const originalChecks=json('learning-book-checks.json'),newChecks=json('what-is-biodynamics-checks.json');
const threefoldChecks=json('toward-threefold-society-checks.json');
const agricultureChecks=json('agriculture-checks.json');
const checks=[...originalChecks,...newChecks,...threefoldChecks,...agricultureChecks];
assert.deepEqual(lessons.map(l=>l.id),Array.from({length:36},(_,i)=>i+1));
assert.deepEqual(sources.map(l=>l.id),lessons.map(l=>l.id));
assert.equal(originalChecks.length,185);assert.equal(passages.length,177);
assert.equal(newChecks.length,biodynamics.lessons.length);
assert.equal(threefoldChecks.length,threefold.lessons.length);
assert.equal(agricultureChecks.length,agriculture.lessons.length);
assert.equal(biodynamics.lessons.length,14);assert.equal(threefold.lessons.length,7);
assert.equal(agriculture.lessons.length,18);
assert.equal(new Set(checks.map(c=>c.studyId)).size,checks.length);
for(const route of Object.keys(sourceCourses))assert.ok(catalogue.courses.some(c=>c.route===route));
assert.equal(catalogue.courses.filter(c=>!sourceCourses[c.route]).length,13);
for(const check of checks) {
 for(const lang of ['en','pt']) {
  const c=check[lang];assert.ok(c.question&&c.explanation,check.studyId+' missing check text');
  assert.equal(c.options.length,3,check.studyId+' options');
  assert.ok(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<c.options.length,check.studyId+' answer');
 }
 assert.equal(check.en.answer,check.pt.answer,check.studyId+' bilingual answer');
}
assert.deepEqual(newChecks.map(c=>c.studyId).sort(),biodynamics.lessons.map(l=>'what-is-biodynamics/'+n(l.id)).sort());
assert.deepEqual(threefoldChecks.map(c=>c.studyId).sort(),threefold.lessons.map(l=>'toward-threefold-society/'+n(l.id)).sort());
assert.deepEqual(agricultureChecks.map(c=>c.studyId).sort(),agriculture.lessons.map(l=>'agriculture/'+n(l.id)).sort());
const expectedChapterPairs=2*catalogue.courses.reduce((total,c)=>total+(c.route==='practical-thinking'?c.parts.length:c.parts.reduce((sum,p)=>sum+p.groups.filter(g=>g.lessonIds.length>1||g.sourceChapterNumber).length,0)),0);
const expectedReadings=2*catalogue.courses.reduce((total,c)=>total+c.lessons.length,0);
const theosophy=catalogue.courses.find(c=>c.route==='theosophy');
const practicalThinking=catalogue.courses.find(c=>c.route==='practical-thinking');
assert.equal(theosophy.lessons.length,28,'Theosophy guided reading inventory');
assert.equal(practicalThinking.lessons.length,13,'Twelve Practical core readings and retained optional forecast');
assert.deepEqual(practicalThinking.lessonIds,coreRouteIds,'Practical sequence follows source order while preserving old routes');
assert.deepEqual(practicalThinking.optionalLessonIds,optionalRouteIds,'Retain forecasting as an optional source exercise');
assert.equal(expectedReadings,2*(185-23-10+theosophy.lessons.length+practicalThinking.lessons.length+biodynamics.lessons.length+threefold.lessons.length+agriculture.lessons.length));
let chapterPairs=0,readings=0;
for(const lang of ['en','pt']) {
 const base=lang==='pt'?'docs/pt':'docs';
 const home=fs.readFileSync(base+'/index.html','utf8');
 assert.equal((home.match(/<h1\b[^>]*>/g)||[]).length,1,'One platform identity');
 assert.equal(wholeElement(home,'<h1').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(),lang==='pt'?'Aprenda antroposofia':'Learn Anthroposophy','Homepage identity text survives decorative emphasis');
 const entryPaths=wholeElement(home,'<section id="path"');
 assert.ok(entryPaths,base+' homepage entry paths');
 for(const route of ['learn/foundations/index.html','learn/index.html','concepts/index.html'])assert.equal((entryPaths.match(new RegExp('href="'+route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"','g'))||[]).length,1,base+' homepage entry '+route);
 assert.equal((entryPaths.match(/<a\b/g)||[]).length,3,base+' three distinct homepage entry paths');
 assert.ok(home.indexOf('id="path"')<home.indexOf('id="courses"'),base+' entry paths precede deeper courses');
 const hub=fs.readFileSync(base+'/learn/index.html','utf8');
 const hubMain=wholeElement(hub,'<main');
 for(const collection of platformSite.collections)assert.ok(hubMain.includes('href="'+path.relative(path.dirname(base+'/learn/index.html'),base+'/'+collection.route).replaceAll('\\','/')+'"'),base+' Learn hub lost '+collection.id);
 const index=fs.readFileSync(base+'/learn/foundations/index.html','utf8');
 assert.equal((index.match(/data-learning-progress=/g)||[]).length,36);
 for(const id of platformSite.foundations.partAnchors){
  assert.ok(index.includes('id="'+id+'"'),base+' Foundations part '+id);
  assert.ok(hubMain.includes('id="'+id+'"')&&hubMain.includes('href="foundations/index.html#'+id+'"'),base+' retained part anchor '+id);
 }
 for(const lesson of lessons) {
  const v=lesson[lang],plan=sources.find(s=>s.id===lesson.id),file=base+'/learn/lessons/'+n(lesson.id)+'.html',h=fs.readFileSync(file,'utf8');
  const sourceText=h.replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
  assert.ok(v.intro&&v.keyConcept&&v.example&&v.distinction&&v.connection&&v.coverageNote,file+' missing teaching');
  assert.ok(v.meaning.length>=2&&v.meaning.length<=5,file+' explanation size');
  assert.equal(v.checks.length,3);assert.equal(v.checks.filter(c=>c.type==='reflection').length,1);
  for(const [i,c] of v.checks.entries()) {
   assert.ok(c.question&&c.explanation);if(c.type!=='reflection') {
    assert.ok(c.options.length>=2&&c.options.length<=4&&Number.isInteger(c.answer)&&c.answer>=0&&c.answer<c.options.length);
    assert.equal(c.answer,lesson[lang==='pt'?'en':'pt'].checks[i].answer,file+' language answers differ');
   }
  }
  for(const section of ['learning-question','learning-source','learning-meaning','learning-key','learning-example','learning-distinction','learning-checks','learning-continue'])assert.ok(h.includes('class="'+section+'"'),file+' '+section);
  assert.ok(h.indexOf('class="learning-source"')<h.indexOf('class="learning-meaning"'));
  assert.ok(h.indexOf('class="learning-meaning"')<h.indexOf('class="learning-example"'));
  assert.ok(h.indexOf('class="learning-example"')<h.indexOf('class="learning-checks"'));
  assert.ok(h.includes('data-learning-id="'+n(lesson.id)+'"')&&!h.includes('data-study-id='));
  const learningMain=wholeElement(h,'<main');
  assert.ok(learningMain.includes('href="../foundations/index.html#part-'+plan.part+'"'),file+' Foundations part return');
  assert.ok(!/href="\.\.\/index\.html(?:#part-[1-8])?"/.test(learningMain),file+' stale beginner contents return');
  assert.equal((h.match(/class="learning-quiz"/g)||[]).length,2);assert.ok(h.includes('class="learning-reflection"'));
  if(Number.isInteger(plan.existingSource?.recordIndex)) {
   const collection=passageCollections[plan.existingSource.recordCollection||'passage-study'];
   assert.ok(collection,file+' unknown source collection');
   const p=collection[plan.existingSource.recordIndex];
   assert.ok(p&&p.course===plan.existingSource.course&&p.ids.includes(plan.existingSource.id),file+' mismatched source');
   assert.ok(sourceText.includes(esc(p[lang].quote).split('\n\n')[0].replaceAll('\n','<br>')),file+' quote changed');
   assert.ok(sourceText.includes(esc(lang==='pt'?p.editionPt||p.edition:p.edition)),file+' edition/translator credit lost');
  }
  else assert.ok(v.sourceSection&&!wholeElement(h,'<section class="learning-source"').includes('<blockquote'),file+' invented excerpt');
  if(lesson.id<36)assert.ok(h.includes('href="'+n(lesson.id+1)+'.html"'));
 }
 for(const course of catalogue.courses) {
  const courseFile=base+'/'+(course.route==='theosophy'?'read/theosophy':course.route)+'/index.html',h=fs.readFileSync(courseFile,'utf8');
  if(course.route==='practical-thinking'){
   assert.ok(isPracticalThinkingOwned(courseFile.slice(5),h),courseFile+' missing exact Practical ownership');
   assert.deepEqual(course.parts.map(p=>p.id),partSlugs,'Four Practical teaching parts');
   assert.deepEqual(course.parts.flatMap(p=>p.groups.flatMap(g=>g.lessonIds)),coreRouteIds,'Practical catalogue includes every core reading exactly once');
   for(const part of course.parts){
    assert.ok(h.includes('id="part-'+part.id+'"'),courseFile+' missing part');
    const landing=base+'/practical-thinking/parts/'+part.id+'.html',ch=fs.readFileSync(landing,'utf8');
    assert.ok(isPracticalThinkingOwned(landing.slice(5),ch),landing+' missing Practical synthesis');
    chapterPairs++;
   }
   for(const item of course.lessons){
    const file=item[lang==='pt'?'pathPt':'pathEn'],html=fs.readFileSync(file,'utf8');
    assert.ok(isPracticalThinkingOwned(file.slice(5),html),file+' missing Practical reading');
    assert.equal((html.match(/class="learning-quiz"/g)||[]).length,2,file+' Practical comprehension count');
    assert.ok(html.includes('data-thought-source')&&html.includes('data-thought-practice'),file+' missing source or practice');
    assert.ok(!html.includes('guided-study.v1.js')&&!html.includes('class="learning-context"'),file+' legacy Practical wrapper returned');
    readings++;
   }
   continue;
  }
  assert.ok(h.includes('id="structured-readings"'));
  for(const part of course.parts)for(const group of part.groups) {
   assert.ok(h.includes('id="chapter-'+part.id+'-'+group.id+'"'));
   if((group.lessonIds.length>1||group.sourceChapterNumber)) {
    const landing=base+'/'+course.route+'/chapters/'+part.id+'-'+group.id+'.html',ch=fs.readFileSync(landing,'utf8');
    assert.ok(ch.includes('class="learning-question"')&&ch.includes('class="chapter-readings"'));chapterPairs++;
   }
   for(const id of group.lessonIds) {
    const item=course.lessons.find(l=>l.id===id),file=item[lang==='pt'?'pathPt':'pathEn'],html=fs.readFileSync(file,'utf8');
    assert.ok(html.includes('class="learning-context"')&&html.includes('class="learning-position"'));
    assert.ok(html.indexOf('class="learning-question"')<html.indexOf('id="book-passage"'),file+' question follows source');
    assert.ok(!html.includes('What is the author saying in this passage?')&&!html.includes('O que o autor está dizendo neste trecho?'));
    if(course.route==='theosophy'){
     assert.ok(html.includes('data-theosophy-owned="true"'),file+' missing scoped guided-course marker');
     assert.equal((html.match(/class="learning-quiz"/g)||[]).length,id===22?0:2,file+' guided comprehension count');
     assert.ok(!html.includes('data-note-field=')&&!html.includes('data-study-id='),file+' legacy notebook returned');
    }else {
     const comparison=course.route==='understanding-temperaments'&&Object.hasOwn(temperamentComparativeChecks,id)?1:0;
     assert.equal((html.match(/class="learning-quiz"/g)||[]).length,1+comparison,file+' choice missing/duplicated');
    }
    readings++;
    if(sourceCourses[course.route]) {
     const sourceCourse=sourceCourses[course.route],source=sourceCourse.lessons.find(l=>l.id===id),v=source[lang];
     const clean=html.replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
     const quote=source.passage[lang==='pt'?'quotePt':'quoteEn'];
     assert.equal((html.match(/id="book-passage"/g)||[]).length,1,file+' passage count');
     assert.ok(clean.includes(esc(quote).split('\n\n')[0].replaceAll('\n','<br>')),file+' changed source passage');
     assert.ok(clean.includes(esc(source.author)),file+' source author');
     assert.ok(clean.includes(esc(sourceCourse[lang==='pt'?'editionPt':'editionEn'])),file+' edition credit');
     assert.ok(html.indexOf('id="book-passage"')<html.indexOf('id="study-explanation"'),file+' source follows explanation');
     assert.ok(html.indexOf('id="study-explanation"')<html.indexOf('class="learning-example"'),file+' teaching follows example');
     assert.ok(html.includes('class="learning-reflection"')&&clean.includes(esc(v.checks[1].question)),file+' missing second retrieval/reflection');
     assert.ok(!html.includes('data-learning-id=')&&!html.includes('data-study-id='),file+' notebook identity collision');
     if(course.route==='what-is-biodynamics')assert.ok(clean.includes(lang==='pt'?'não são números de páginas impressas':'not printed page numbers'),file+' digital locator distinction');
     else {
      assert.ok(clean.includes(esc(source.passage[lang==='pt'?'locatorPt':'locatorEn'])),file+' supplied Markdown locator');
      assert.ok(clean.includes('Markdown'),file+' Markdown witness not identified');
      assert.ok(!/(?:PDF capture|Captura do PDF)\s+\d/.test(wholeElement(clean,'<section class="learning-source')),file+' invented PDF locator');
     }
    }
   }
  }
 }
}
assert.equal(chapterPairs,expectedChapterPairs);assert.equal(readings,expectedReadings);
const agriculturePlan=sources.find(s=>s.id===32);
assert.equal(agriculturePlan.existingSource?.recordCollection,'what-is-biodynamics');
assert.ok(!agriculturePlan.sourceStatus.startsWith('missing-local-source'));
const threefoldPlan=sources.find(s=>s.id===35);
assert.equal(threefoldPlan.sourceStatus,'reviewed-supplied-markdown-preface');
assert.equal(threefoldPlan.existingSource?.recordCollection,'toward-threefold-society');
assert.equal(threefoldPlan.existingSource?.id,6);
assert.ok(sources.every(s=>!s.sourceStatus.startsWith('missing-local-source')),'All beginner readings have reviewed source coverage or explicit collection limits');
for(const [route,sourceCourse] of Object.entries(sourceCourses)){
 const sourcePassages=passageCollections[route];
 for(const p of sourcePassages) {
 assert.equal(p.course,route);
 for(const key of ['author','title','locator','edition','original','originalLanguage'])assert.ok(p[key]?.trim(),'Anthology passage missing '+key);
 for(const lang of ['en','pt'])for(const key of ['quote','note'])assert.ok(p[lang]?.[key]?.trim(),'Anthology passage missing '+lang+' '+key);
 for(const id of p.ids)assert.ok(sourceCourse.lessons.some(l=>l.id===id),'Unknown source passage assignment');
}
for(const l of sourceCourse.lessons) {
 const matched=sourcePassages.filter(p=>p.ids.includes(l.id));
 assert.equal(matched.length,1,'Missing or repeated anthology passage '+l.id);
 assert.equal(matched[0].en.quote,l.passage.quoteEn,'Anthology English registry mismatch '+l.id);
 assert.equal(matched[0].pt.quote,l.passage.quotePt,'Anthology Portuguese registry mismatch '+l.id);
}
}
for(const file of fs.readdirSync('docs',{recursive:true}).filter(f=>f.endsWith('.html'))) {
 const h=fs.readFileSync(path.join('docs',file),'utf8');
 const route=file.split(path.sep).join('/'),lang=route.startsWith('pt/')?'pt':'en',logicalFile='docs/'+route;
 assert.equal((h.match(/class="system-nav"/g)||[]).length,1,file+' navigation count');
 assert.equal(wholeElement(h,'<nav class="system-nav"'),platformNav(logicalFile,lang,platformArea(route,h)),file+' primary navigation/area contract');
 assert.equal((h.match(/data-platform-support(?:\s|=|>)/g)||[]).length,1,file+' supporting navigation count');
 assert.equal(wholeElement(h,'<nav class="platform-support-nav"'),platformSupportNav(logicalFile,lang),file+' supporting navigation contract');
 assert.ok(h.includes('learning-system.css')&&h.includes('learning-system.js')&&h.includes('concept-platform.css'),file+' shared assets');
 if(h.includes('data-concept-platform-owned="true"'))assert.ok(isConceptPlatformOwned(route,h),file+' conceptual page outside exact authored manifest');
 // Authored archive bodies and the search index retain historical wording; it must not become a live grading instruction.
 if(!file.startsWith('research/notes/'))assert.ok(!/0–2 points|0 a 2 pontos|receive full marks|receber a pontuação máxima/.test(h.replace(/<[^>]*>/g,' ')),file+' numerical grades');
}
console.log(`Passed: 36 retained bilingual Foundations lessons, attributed source/section teaching, unscored mixed checks, ${catalogue.courses.length} preserved source structures, ${chapterPairs/2} paired chapter landings, ${readings/2} bilingual readings (185 retained pairs), all ${platformSite.collections.length} collections discoverable, three homepage entries and exact four-area navigation.`);
