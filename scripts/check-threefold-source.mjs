import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {esc,n,wholeElement} from './learning-html.mjs';

const read=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
// Recorded before integrating the separately supplied introduction and preface.
// These constants also work in an isolated saved build without private source files.
const retainedHashes={
 'content/passage-study.json':'f63c5c1d21c2a81f20ed4b93054aa0ddb9390890699fc2e035fd14c24364570f',
 'content/learning-book-checks.json':'37c3c7d96d754717713ba4ce67d1cdb5a6a4cca37f39bd6143820023d167df22'
};
for(const [file,expected] of Object.entries(retainedHashes))assert.equal(sha(file),expected,file+' changed during threefold source integration');
assert.equal(read('passage-study.json').length,177,'Retained passage registry');
assert.equal(read('learning-book-checks.json').length,185,'Retained bilingual question bank');

const route='toward-threefold-society';
const course=read(route+'.json'),map=read(route+'-source-map.json');
const passages=read(route+'-passages.json'),checks=read(route+'-checks.json');
const catalogue=read('learning-system-catalogue.json').courses.find(c=>c.route===route);
const ids=Array.from({length:7},(_,i)=>i);
const normal=value=>String(value).toLowerCase().replace(/[^a-z0-9]/g,'');
// Excerpts independently compared with the uploaded OCR text; whitespace only is
// normalized here. These fingerprints preserve that review without claiming PDF verification.
const reviewedExcerptHashes=[
 'f803a1ac3829210ce14fe111e998492780cc3b5e83168d3b1cfc503a76823ffb',
 '5c07a699815b3f36b022961ecba63c4458ebf35401e00fc4f172e3cce2c935cf',
 '16791afd67b331a60e6d845b8e328930cc7f53302d1af01284fc310a70755daa',
 '809989b345b2a0843b4e892dfbe76fcb6eb5adacdd21ed9f91edca8f88f6802a',
 '95984dda1d6f54e59f0dfc96870357527250eb5266149fa7099bd187effde4e6',
 'd5dd2079ad770263ba135a7257effaea5b37f04bd26681fb87ca5c61d2d30711',
 '5d73b09f44252b7a05396c0a0b54618c23e32d1c80173591065360ae2dba30b5'
];
assert.equal(course.schemaVersion,1);
assert.equal(map.schemaVersion,1);
assert.equal(course.reviewed,map.reviewed,'Course and source review agree');
assert.equal(map.source.title,'Toward a Threefold Society: Basic Issues of the Social Question');
assert.equal(map.source.format,'OCR Markdown');
assert.equal(map.source.markdownPageCount,14);
assert.equal(map.source.sourceLines,690);
assert.equal(map.source.pdfSupplied,false,'A named PDF in OCR metadata is not a supplied PDF witness');
assert.equal(map.source.author,'Rudolf Steiner');
assert.equal(map.source.translator,'Frank Thomas Smith');
assert.equal(map.source.introductionAuthor,'Frank Thomas Smith');
assert.equal(map.source.historicalFootnotesAuthor,'Frank Thomas Smith');
assert.equal(map.source.publisher,'Rudolf Steiner Publications');
assert.equal(map.source.copyrightYear,2019);
assert.equal(map.source.firstPrinting,'October 2019');
assert.equal(map.source.paperbackIsbn,'978-1-948302-16-6');
assert.equal(map.source.kindleIsbn,'978-1-948302-17-3');
assert.equal(map.source.ga,'23');
assert.equal(map.source.originalWorkYearReportedByTranslator,1919);
assert.equal(map.source.prefaceYear,1920);
assert.equal(map.source.bibliographicalSurveyReferenceYear,1961,'Bibliographical survey date is not the English edition date');
assert.ok(/OCR Markdown only/.test(map.source.metadataVerification),'Edition metadata remains transcription-based');
for(const flag of ['mainChaptersSupplied','fullBookReviewed','preliminaryRemarksSupplied','closingAppealSupplied','historicalNotesSupplied','nativeImagesReviewed'])assert.equal(map.scope[flag],false,'Source scope '+flag);
assert.deepEqual(map.sections.map(s=>[s.id,s.pageStart,s.pageEnd]),[
 ['front-matter',1,5],['translator-introduction',6,7],['preface-1920',8,14]
],'Reviewed front matter, introduction and preface only');
assert.equal(map.sections[1].author,'Frank Thomas Smith');
assert.equal(map.sections[1].date,'October 2019');
assert.equal(map.sections[2].author,'Rudolf Steiner');
assert.equal(map.sections[2].date,'1920');
assert.ok(/Fourth German Edition/.test(map.sections[2].sourceTitle));
assert.deepEqual(map.pageLedger.map(p=>p.pageMarker).sort((a,b)=>a-b),Array.from({length:14},(_,i)=>i+1),'Every supplied Markdown page reviewed exactly once');
for(const page of map.pageLedger)for(const field of ['sourceAuthor','summary','limits'])assert.ok(page[field]?.trim(),'Page review '+page.pageMarker+' '+field);
assert.ok(/native images absent/.test(map.locatorContract),'No native quotation verification implied');
assert.ok(/No PDF\/printed page or column assignment/.test(map.locatorContract),'Markdown page markers are not native pagination');
const registered=read('source-register.json').filter(s=>s.filename===map.source.filename);
assert.equal(registered.length,1,'One registered Markdown upload');
assert.ok(!read('source-register.json').some(s=>s.filename===map.source.pdfDeclaredByMarkdown),'A transcription filename is not a registered PDF upload');
assert.equal(registered[0].sha256,map.source.sha256);
assert.equal(registered[0].bytes,map.source.bytes);
assert.equal(map.source.sha256,'3aed98c1ac9c3c150ea33a1e9cce0ceb5af69ae2548523211ab1eb5c0f16bca8','Supplied fourteen-page transcription identity');
assert.equal(map.source.bytes,30999);
assert.equal(registered[0].contents_in_repository,false,'Uploaded source remains private');
assert.deepEqual(map.lessons.map(l=>l.id),ids,'Source-map assignments cover all seven readings');
assert.equal(map.passageCount,7);
assert.ok(/main chapters[^.]*\b(?:not (?:supplied|provided|included|reviewed)|absent)/i.test(course.scopeEn),'English course scope identifies absent main chapters');
assert.ok(/capítulos principais[^.]*\b(?:não|ausentes)/i.test(course.scopePt),'Portuguese course scope identifies absent main chapters');
assert.deepEqual(course.lessons.map(l=>l.id),ids,'Seven bounded source readings');
assert.equal(passages.length,7,'Seven separate quotation records');
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),ids,'One quotation for each reading');
assert.deepEqual(checks.map(q=>q.studyId).sort(),ids.map(id=>route+'/'+n(id)).sort(),'Seven paired retrieval checks');
assert.ok(catalogue,'Source course in public catalogue');
assert.deepEqual(catalogue.lessonIds,ids);
assert.deepEqual(catalogue.parts.flatMap(p=>p.groups).flatMap(g=>g.lessonIds),ids,'Each reading appears once');
assert.equal(catalogue.parts.flatMap(p=>p.groups).filter(g=>g.lessonIds.length>1||g.sourceChapterNumber).length,1,'One landing groups the preface readings');
assert.ok(catalogue.parts.flatMap(p=>p.groups).every(g=>!g.sourceChapterNumber),'Teaching divisions are not invented main chapters');

for(const passage of passages){
 assert.equal(passage.course,route);
 assert.equal(passage.ids.length,1);
 const id=passage.ids[0],lesson=course.lessons.find(l=>l.id===id);
 assert.equal(normal(passage.author),id===1?'frankthomassmith':'rudolfsteiner','Smith introduction distinct from Steiner source '+id);
 assert.equal(passage.author,lesson.author,'Quotation voice '+id);
 assert.equal(passage.originalLanguage,'en');
 assert.equal(passage.original,passage.en.quote,'Supplied English transcription '+id);
 assert.equal(crypto.createHash('sha256').update(passage.original.trim().replace(/\s+/g,' ')).digest('hex'),reviewedExcerptHashes[id],'English wording retained from independent OCR review '+id);
 assert.ok(passage.original.trim().split(/\s+/).length<50,'Short source selection '+id);
 assert.ok(Number.isInteger(lesson.passage.pageMarker)&&lesson.passage.pageMarker>=1&&lesson.passage.pageMarker<=14,'Markdown page marker '+id);
 assert.equal(passage.markdownPageMarker,lesson.passage.pageMarker,'Registered Markdown page marker '+id);
 assert.equal(passage.sourceFile,map.source.filename,'Supplied source witness '+id);
 assert.ok(Array.isArray(lesson.markdownPages)&&lesson.markdownPages.includes(lesson.passage.pageMarker),'Quotation lies in source assignment '+id);
 const assigned=map.lessons.find(l=>l.id===id);
 assert.deepEqual(assigned.markdownPages,lesson.markdownPages,'Source-map/course page assignment '+id);
 assert.equal(assigned.sourceAuthor,lesson.author,'Source-map/course voice '+id);
 assert.equal(assigned.sourceSection,lesson.sourceSection,'Source-map/course section '+id);
 assert.ok(lesson.markdownPages.every(p=>Number.isInteger(p)&&p>=1&&p<=14),'Reviewed source pages '+id);
 assert.ok(/OCR Markdown only/.test(passage.verification)&&/native PDF not supplied/.test(passage.verification),'Quotation verification limited to supplied transcription '+id);
 for(const field of ['pdfPage','pdfColumn','pdfCapture'])assert.ok(!(field in passage),'No invented native PDF locator '+id+' '+field);
 for(const lang of ['en','pt']){
  const suffix=lang==='pt'?'Pt':'En',locator=passage[lang==='pt'?'locatorPt':'locator'];
  assert.ok(locator?.includes('Markdown'),'Transcription witness in locator '+id+' '+lang);
  assert.ok(locator.includes(String(lesson.passage.pageMarker)),'Page-marker locator '+id+' '+lang);
  assert.ok(!/(?:PDF capture|Captura do PDF|printed page|página impressa)\s+\d/.test(locator),'No invented printed/native pagination '+id+' '+lang);
  assert.ok(passage[lang].quote.trim()&&passage[lang].note.trim(),'Quote and attributed explanation '+id+' '+lang);
  assert.equal(passage[lang].quote,lesson.passage['quote'+suffix],'Course/registry quotation agreement '+id+' '+lang);
  assert.equal(passage[lang==='pt'?'editionPt':'edition'],course['edition'+suffix],'Course/registry edition agreement '+id+' '+lang);
  assert.equal(passage[lang].note,lesson.passage['credit'+suffix],'Course/registry attribution note agreement '+id+' '+lang);
 }
}

for(const lesson of course.lessons){
 const matched=checks.find(q=>q.studyId===route+'/'+n(lesson.id));
 for(const lang of ['en','pt']){
  const v=lesson[lang],suffix=lang==='pt'?'Pt':'En';
  for(const key of ['title','goal','question'])assert.ok(lesson[key+suffix]?.trim(),'Bilingual reading '+key+' '+lesson.id+' '+lang);
  for(const key of ['intro','keyConcept','example','distinction','connection'])assert.ok(v[key]?.trim(),'Bilingual teaching '+key+' '+lesson.id+' '+lang);
  assert.ok(Array.isArray(v.meaning)&&v.meaning.length>=2&&v.meaning.every(p=>p.trim()),'Source explanation '+lesson.id+' '+lang);
  assert.equal(v.checks.length,3,'Two retrieval checks and a reflection '+lesson.id+' '+lang);
  assert.deepEqual(v.checks.map(q=>q.type==='reflection'),[false,false,true],'Reflection follows retrieval '+lesson.id+' '+lang);
  for(const q of v.checks)assert.ok(q.question?.trim()&&q.explanation?.trim(),'Explained check '+lesson.id+' '+lang);
  for(const [i,q] of v.checks.slice(0,2).entries()){
   if(!q.options){assert.equal(i,1,'First retrieval needs choices '+lesson.id+' '+lang);continue;}
   assert.ok(Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=4,'Retrieval choices '+lesson.id+' '+lang+' '+i);
   assert.equal(new Set(q.options).size,q.options.length,'Distinct retrieval choices '+lesson.id+' '+lang+' '+i);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,'Retrieval answer '+lesson.id+' '+lang+' '+i);
   assert.equal(q.answer,lesson[lang==='pt'?'en':'pt'].checks[i].answer,'Paired retrieval answer '+lesson.id+' '+i);
  }
  for(const key of ['question','options','answer','explanation'])assert.deepEqual(matched[lang][key],v.checks[0][key],'First retrieval bank agreement '+lesson.id+' '+lang+' '+key);
  assert.equal(matched[lang].options.length,3,'Three distinct retrieval choices '+lesson.id+' '+lang);
  assert.equal(new Set(matched[lang].options).size,3,'Distinct choices '+lesson.id+' '+lang);
  assert.ok(Number.isInteger(matched[lang].answer)&&matched[lang].answer>=0&&matched[lang].answer<3,'Answer index '+lesson.id+' '+lang);
  assert.equal(matched[lang].answer,matched[lang==='pt'?'en':'pt'].answer,'Aligned language answer '+lesson.id);
 }
}

const beginner=read('learning-system-sources.json').find(s=>s.id===35);
assert.equal(beginner.sourceStatus,'reviewed-supplied-markdown-preface');
assert.equal(beginner.existingSource.recordCollection,route);
assert.equal(beginner.existingSource.course,route);
assert.equal(beginner.existingSource.id,6);
assert.ok(passages[beginner.existingSource.recordIndex]?.ids.includes(6),'Beginner references the registered page-14 preface passage');

for(const lesson of course.lessons)for(const lang of ['en','pt']){
 const file=path.join('docs',lang==='pt'?'pt':'',route,'lessons',n(lesson.id)+'.html');
 const html=fs.readFileSync(file,'utf8'),clean=html.replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1'),suffix=lang==='pt'?'Pt':'En';
 const source=wholeElement(clean,'<section class="learning-source');
 assert.ok(source?.includes('id="book-passage"'),file+' source passage');
 assert.ok(source.includes(esc(lesson.passage['quote'+suffix]).replaceAll('\n','<br>')),file+' preserved transcription');
 assert.ok(source.includes(esc(lesson.author)),file+' source voice');
 assert.ok(source.includes(esc(lesson.passage['locator'+suffix])),file+' Markdown locator');
 assert.ok(source.includes(lang==='pt'?'Não foi fornecido PDF':'No PDF was supplied'),file+' visual verification limit');
 assert.ok(source.includes(lang==='pt'?'não são números de páginas impressas':'not printed page numbers'),file+' page-marker distinction');
 assert.ok(!/(?:PDF capture|Captura do PDF)\s+\d/.test(source),file+' invented PDF locator');
 assert.equal((html.match(/class="learning-quiz"/g)||[]).length,1,file+' one interactive retrieval');
 assert.ok(html.includes('class="learning-reflection"'),file+' unscored reflection');
 assert.ok(!/data-note-field="(?:first|source|after)"|data-study-id=|data-learning-id=/.test(html),file+' legacy/beginner storage collision');
 assert.ok(!/Conversion review:|Voltar para 264|extraction: OCR|Q 0 Aa|sediment:\/\//.test(html),file+' raw extraction/interface noise');
}

console.log('Passed: seven bilingual introduction/preface readings and retrieval checks, distinct source voices, Markdown-only locators, bounded beginner source, and unchanged 177-record registry/185-pair bank.');
