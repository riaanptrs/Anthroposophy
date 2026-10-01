import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {esc} from './learning-html.mjs';

const read=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
// Values recorded in the pre-integration content inventory. Keep this check
// reproducible in saved environments without depending on ignored working files.
const retainedHashes={
 'content/passage-study.json':'f63c5c1d21c2a81f20ed4b93054aa0ddb9390890699fc2e035fd14c24364570f',
 'content/learning-book-checks.json':'37c3c7d96d754717713ba4ce67d1cdb5a6a4cca37f39bd6143820023d167df22'
};
for(const [file,expected] of Object.entries(retainedHashes))assert.equal(sha(file),expected,file+' changed during anthology integration');
assert.equal(read('passage-study.json').length,177,'Retained source registry');
assert.equal(read('learning-book-checks.json').length,185,'Retained bilingual question bank');

const map=read('what-is-biodynamics-source-map.json');
const course=read('what-is-biodynamics.json');
const passages=read('what-is-biodynamics-passages.json');
const checks=read('what-is-biodynamics-checks.json');
const catalogue=read('learning-system-catalogue.json').courses.find(c=>c.route==='what-is-biodynamics');
const ids=Array.from({length:14},(_,i)=>i);
const normal=value=>String(value).toLowerCase().replace(/[^a-z0-9]/g,'');
assert.equal(map.schemaVersion,1);
assert.equal(map.source.title,'What Is Biodynamics? A Way to Heal and Revitalize the Earth');
assert.equal(map.source.publisher,'SteinerBooks');
assert.equal(map.source.pdfCaptures,135);
assert.equal(map.source.electronicEditionDate,null,'No electronic publication date supplied');
assert.equal(normal(map.source.introductionAuthor),'hughjcourtney');
assert.equal(map.source.introductionCopyright,2005);
assert.equal(normal(map.source.editor),'marciamerrymanmeans');
assert.equal(map.source.credits.length,3,'Three separately credited lecture sources');
const spiritualCredit=map.source.credits.find(c=>c.sections.includes('spiritual-beings-1'));
const elementalCredit=map.source.credits.find(c=>c.sections.includes('elementals-1'));
const agricultureCredit=map.source.credits.find(c=>c.sections.includes('agriculture-1'));
assert.equal(spiritualCredit.sourceTitle,'Spiritual Beings in the Heavenly Bodies and in the Kingdoms of Nature');
assert.equal(spiritualCredit.copyright,1992);
assert.equal(spiritualCredit.translator,null,'The supplied imprint does not name this translator');
assert.equal(elementalCredit.sourceTitle,'Harmony of the Creative Word');
assert.equal(elementalCredit.copyright,2001);
assert.equal(elementalCredit.revisedTranslator,'Matthew Barton');
assert.equal(agricultureCredit.sourceTitle,'Spiritual Foundations for the Renewal of Agriculture');
assert.equal(agricultureCredit.copyright,1993);
assert.deepEqual(agricultureCredit.translators,['Catherine Creeger','Malcolm Gardner']);
assert.equal(agricultureCredit.editorialNotes,'Malcolm Gardner');
for(const [fileKey,hashKey] of [['pdfFile','pdfSha256'],['markdownFile','markdownSha256']]){
 const registered=read('source-register.json').filter(s=>s.filename===map.source[fileKey]);
 assert.equal(registered.length,1,'One registered uploaded source '+fileKey);
 assert.equal(registered[0].sha256,map.source[hashKey],'Uploaded-source identity '+fileKey);
 assert.ok(/^[a-f0-9]{64}$/.test(map.source[hashKey])&&registered[0].bytes>0,'Recorded uploaded-source fingerprint '+fileKey);
 assert.equal(registered[0].contents_in_repository,false,'Private source excluded from publication');
}
assert.equal(course.schemaVersion,1);
assert.equal(course.reviewed,map.reviewed,'Course and page review agree');
assert.equal(course.titleEn,'What Is Biodynamics?');
assert.ok(/GA 136/.test(course.scopeEn)&&/GA 230/.test(course.scopeEn)&&/GA 327/.test(course.scopeEn),'Three-cycle course scope');
assert.ok(/complete eight-lecture Agriculture Course is now available/.test(course.scopeEn),'Full GA 327 has its own companion review');
assert.ok(/oito palestras/.test(course.scopePt)&&/curso complementar/.test(course.scopePt),'Portuguese full-course scope');
assert.ok(/selects GA 327 lectures 4–6/.test(map.scopeLimit),'Anthology selection retained');
assert.ok(/No printed pagination/.test(map.locatorContract),'Capture locators are distinct from printed pages');
assert.deepEqual(map.captureLedger.map(row=>row.capture).sort((a,b)=>a-b),Array.from({length:135},(_,i)=>i+1),'Every PDF capture has one review entry');
for(const row of map.captureLedger){
 assert.ok(typeof row.summary==='string'&&row.summary.trim(),'Missing capture review '+row.capture);
 assert.ok(Array.isArray(row.corrections)||typeof row.corrections==='string','Recorded corrections '+row.capture);
}

const sectionRanges=[[1,4],[5,34],[35,44],[45,55],[56,66],[67,76],[77,95],[96,113],[114,130],[131,135]];
assert.deepEqual(map.sections.map(s=>[s.pdfStart,s.pdfEnd]),sectionRanges,'Front matter, introduction, seven anthology chapters and bibliography');
const expectedLectures=[
 [35,136,1,'1912-04-03'],[45,136,2,'1912-04-04'],
 [56,230,7,'1923-11-02'],[67,230,8,'1923-11-03'],
 [77,327,4,'1924-06-12'],[96,327,5,'1924-06-13'],[114,327,6,'1924-06-14']
];
for(const [start,ga,number,date] of expectedLectures){
 const section=map.sections.find(s=>s.pdfStart===start);
 assert.equal(Number(String(section.ga).replace(/^GA\s*/i,'')),ga,section.title+' GA');
 assert.equal(section.sourceLecture,number,section.title+' original lecture number');
 assert.equal(new Date(section.date).toISOString().slice(0,10),date,section.title+' date');
 assert.equal(section.editorHeadnoteCapture,start,section.title+' must distinguish the editor’s opening headnote');
 assert.equal(section.author,'Rudolf Steiner',section.title+' lecture author');
}
assert.deepEqual(map.sections.filter(s=>s.kind==='lecture').map(s=>s.anthologyChapter),[1,2,3,4,5,6,7],'Seven anthology chapters, independently of original lecture numbering');
assert.equal(map.sections.filter(s=>Number(String(s.ga).replace(/^GA\s*/i,''))===327).length,3,'This anthology selects three Agricultural Course lectures');
assert.deepEqual(map.lessons.map(l=>l.id),ids);
assert.deepEqual(course.lessons.map(l=>l.id),ids);
assert.equal(map.passageCount,14);
assert.equal(passages.length,14);
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),ids);
assert.deepEqual(checks.map(c=>c.studyId).sort(),ids.map(id=>'what-is-biodynamics/'+String(id).padStart(2,'0')).sort());
assert.ok(catalogue,'Anthology course is in the public catalogue');
assert.deepEqual(catalogue.lessonIds,ids);
assert.equal(catalogue.parts.flatMap(p=>p.groups).filter(g=>g.lessonIds.length>1||g.sourceChapterNumber).length,8,'Orientation and seven numbered anthology chapter landings');
assert.deepEqual(catalogue.parts.flatMap(p=>p.groups).flatMap(g=>g.lessonIds),ids,'Every reading appears once in the course structure');
assert.deepEqual(catalogue.parts.flatMap(p=>p.groups).filter(g=>g.sourceChapterNumber).map(g=>g.sourceChapterNumber),[1,2,3,4,5,6,7],'Anthology chapter numbering preserved');

for(const passage of passages){
 assert.equal(passage.course,'what-is-biodynamics');
 assert.equal(passage.ids.length,1);
 const id=passage.ids[0],lesson=map.lessons.find(l=>l.id===id);
 assert.equal(normal(passage.author),normal(lesson.sourceAuthor.split(';')[0]),'Quotation author distinct from editorial contributors '+id);
 assert.equal(normal(passage.author),[0,1,2,13].includes(id)?'hughjcourtney':'rudolfsteiner','Introduction and lecture voices '+id);
 assert.equal(passage.originalLanguage,'en');
 assert.equal(passage.en.quote,passage.original,'Preserved supplied English wording '+id);
 assert.ok(passage.original.trim().split(/\s+/).length<50,'Short source selection '+id);
 assert.ok(Number.isInteger(passage.pdfPage)&&passage.pdfPage>=1&&passage.pdfPage<=135,'Capture locator '+id);
 assert.ok(Number.isInteger(passage.pdfColumn)&&passage.pdfColumn>=1&&passage.pdfColumn<=3,'Column locator '+id);
 assert.ok(Number.isInteger(passage.kindleLocation)&&passage.kindleLocation>=1&&passage.kindleLocation<=2871,'Kindle locator '+id);
 assert.ok(Array.isArray(lesson.captures)&&lesson.captures.length&&lesson.captures.every(n=>Number.isInteger(n)&&n>=1&&n<=135),'Reviewed lesson captures '+id);
 assert.ok(lesson.captures.includes(passage.pdfPage),'Quotation within lesson source assignment '+id);
 assert.equal(passage.sourceFile,map.source.pdfFile,'Supplied quotation witness '+id);
 assert.ok(/visually|native/i.test(passage.verification),'Native wording verification '+id);
 for(const lang of ['en','pt']){
  const locator=lang==='pt'?passage.locatorPt:passage.locator;
  assert.ok(locator.includes(String(passage.pdfPage))&&/captur/i.test(locator),'Capture-based displayed locator '+id+' '+lang);
  assert.ok(locator.includes((lang==='pt'?'coluna ':'column ')+passage.pdfColumn),'Displayed source column '+id+' '+lang);
  assert.ok(/Kindle/i.test(locator)&&locator.includes(String(passage.kindleLocation)),'Displayed Kindle location '+id+' '+lang);
  assert.ok(!/(?:printed\s+(?:page|folio)|página\s+impressa)\s*(?:p\.?\s*)?\d/i.test(locator),'Invented printed pagination '+id+' '+lang);
  assert.ok(passage[lang].quote.trim()&&passage[lang].note.trim(),'Quotation and interpretation '+id+' '+lang);
  assert.ok((lang==='pt'?passage.editionPt:passage.edition)?.trim(),'Separate edition credit '+id+' '+lang);
 }
 if(id>=7&&id<=12)assert.ok(/Creeger/.test(passage.edition)&&/Gardner/.test(passage.edition),'Agriculture translation credit '+id);
 if(id===5||id===6)assert.ok(/Matthew Barton/.test(passage.edition),'Elementals translation credit '+id);
 if(id===3||id===4)assert.ok(/Translator not named/.test(passage.edition),'Unknown Spiritual Beings translator remains explicit '+id);
}

for(const entry of checks)for(const lang of ['en','pt']){
 const q=entry[lang];
 assert.ok(q.question.trim()&&q.explanation.trim(),entry.studyId+' '+lang+' explained question');
 assert.equal(q.options.length,3,entry.studyId+' '+lang+' choices');
 assert.equal(new Set(q.options).size,3,entry.studyId+' '+lang+' unique choices');
 assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3,entry.studyId+' '+lang+' answer');
 assert.equal(q.answer,entry[lang==='en'?'pt':'en'].answer,entry.studyId+' paired answer');
}

for(const lesson of course.lessons){
 const sourceAssignment=map.lessons.find(l=>l.id===lesson.id),passage=passages.find(p=>p.ids.includes(lesson.id)),check=checks.find(q=>q.studyId==='what-is-biodynamics/'+String(lesson.id).padStart(2,'0'));
 assert.deepEqual(lesson.pdfCaptures,sourceAssignment.captures,'Course source assignment '+lesson.id);
 assert.equal(lesson.author,sourceAssignment.sourceAuthor,'Course contributors '+lesson.id);
 assert.equal(lesson.passage.capture,passage.pdfPage,'Course capture locator '+lesson.id);
 assert.equal(lesson.passage.column,passage.pdfColumn,'Course column locator '+lesson.id);
 assert.equal(lesson.passage.kindleLocation,passage.kindleLocation,'Course Kindle locator '+lesson.id);
 for(const lang of ['en','pt']){
 const v=lesson[lang],suffix=lang==='pt'?'Pt':'En';
 for(const key of ['title','goal','question'])assert.ok(lesson[key+suffix]?.trim(),'Bilingual reading '+key+' '+lesson.id+' '+lang);
 for(const key of ['intro','keyConcept','example','distinction','connection'])assert.ok(v[key]?.trim(),'Bilingual teaching '+key+' '+lesson.id+' '+lang);
 assert.ok(Array.isArray(v.meaning)&&v.meaning.length>=2&&v.meaning.every(p=>p.trim()),'Connected source explanation '+lesson.id+' '+lang);
 assert.equal(v.checks.length,3,'Two retrieval checks and one unscored reflection '+lesson.id+' '+lang);
 assert.deepEqual(v.checks.map(c=>c.type==='reflection'),[false,false,true],'Retrieval precedes reflection '+lesson.id+' '+lang);
 for(const q of v.checks)assert.ok(q.question.trim()&&q.explanation.trim(),'Explained comprehension check '+lesson.id+' '+lang);
 for(const key of ['question','options','answer','explanation'])assert.deepEqual(check[lang][key],v.checks[0][key],'First retrieval bank agrees with course '+lesson.id+' '+lang+' '+key);
 assert.equal(lesson.passage['quote'+suffix],passage[lang].quote,'Course quotation matches registry '+lesson.id+' '+lang);
 assert.equal(lesson.passage['credit'+suffix],lang==='pt'?passage.editionPt:passage.edition,'Separate quotation credit '+lesson.id+' '+lang);
 }
}

for(const lesson of course.lessons)for(const lang of ['en','pt']){
 const v=lesson[lang],suffix=lang==='pt'?'Pt':'En',passage=passages.find(p=>p.ids.includes(lesson.id));
 const file=path.join('docs',lang==='pt'?'pt':'','what-is-biodynamics','lessons',String(lesson.id).padStart(2,'0')+'.html');
 const html=fs.readFileSync(file,'utf8'),clean=html.replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
 assert.ok(html.includes('id="book-passage"'),file+' source passage');
 assert.ok(clean.includes(esc(passage[lang].quote).replaceAll('\n','<br>')),file+' preserved source wording');
 assert.ok(clean.includes(esc(lesson.passage['locator'+suffix]))&&clean.includes((lang==='pt'?'Captura do PDF ':'PDF capture ')+passage.pdfPage),file+' displayed source locator');
 assert.ok(clean.includes(esc(passage.author)),file+' author attribution');
 assert.ok(clean.includes(esc(v.checks[1].question))&&clean.includes(esc(v.checks[2].question)),file+' second retrieval and reflection');
 assert.ok(!/data-note-field="(?:first|source|after)"|data-study-id=/.test(html),file+' legacy notebook collision');
 assert.ok(html.includes('learning-system.js')&&html.includes('learning-system.css'),file+' shared learning controls');
}
console.log('Passed: 135 reviewed captures, seven anthology chapters from three lecture cycles, 14 short attributed bilingual source selections/readings, and unchanged 177-record registry/185-pair question bank.');
