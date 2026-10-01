import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {esc} from './learning-html.mjs';

const read=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const map=read('agriculture-source-map.json'),course=read('agriculture.json');
const passages=read('agriculture-passages.json'),checks=read('agriculture-checks.json');
const registered=read('source-register.json');
const catalogue=read('learning-system-catalogue.json').courses.find(c=>c.route==='agriculture');
const ids=Array.from({length:18},(_,i)=>i);
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const normalize=value=>value.trim().replace(/\s+/g,' ');
assert.equal(course.schemaVersion,1);
assert.equal(map.schemaVersion,1);
assert.equal(course.reviewed,map.reviewed);
assert.equal(map.sourceWitnesses.length,2);
for(const [id,count] of [['creeger',192],['adams',178]]){
 const witness=map.sourceWitnesses.find(s=>s.id===id);
 assert.equal(witness.markdownCaptures,count);
 assert.equal(witness.pdfVisualVerification,false,'PDF images were unavailable');
 assert.equal(witness.pdfStatus,'unavailable-transfer-limit');
 const source=registered.filter(s=>s.filename===witness.filename);
 assert.equal(source.length,1);
 assert.equal(source[0].sha256,witness.sha256);
 assert.equal(source[0].bytes,witness.bytes);
 assert.equal(source[0].contents_in_repository,false);
 const rows=map.captureLedgers[id];
 assert.deepEqual(rows.map(r=>r.capture),Array.from({length:count},(_,i)=>i+1),'Complete supplied Markdown review '+id);
 for(const row of rows)assert.ok(row.summary?.trim(),'Missing authored capture note '+id+'/'+row.capture);
}
assert.deepEqual(map.lectures.map(l=>[l.number,l.date,l.creeger.first,l.creeger.last,l.adams.first,l.adams.last]),[
 [1,'1924-06-07',18,28,18,29],[2,'1924-06-10',29,41,30,42],[3,'1924-06-11',42,54,43,57],
 [4,'1924-06-12',55,65,66,77],[5,'1924-06-13',75,86,88,101],[6,'1924-06-14',93,105,108,120],
 [7,'1924-06-15',111,120,126,136],[8,'1924-06-16',121,134,137,152]
]);
assert.equal(map.discussions.length,4);
assert.equal(map.address.date,'1924-06-11');
assert.equal(map.report.date,'1924-06-20');
assert.ok(map.limitations.some(s=>/bibliograph/i.test(s)&&/incomplete|partial|ends/i.test(s)),'Captured bibliography limit');
assert.ok(map.limitations.some(s=>/diagram|drawing|plate/i.test(s)),'Unverified illustrations');
assert.deepEqual(course.lessons.map(l=>l.id),ids);
assert.deepEqual(passages.flatMap(p=>p.ids),ids);
assert.deepEqual(checks.map(c=>c.studyId),ids.map(id=>'agriculture/'+String(id).padStart(2,'0')));
assert.deepEqual(catalogue.lessonIds,ids);
assert.deepEqual(catalogue.parts.flatMap(p=>p.groups).flatMap(g=>g.lessonIds),ids);
const lectureGroups=catalogue.parts.flatMap(p=>p.groups).filter(g=>g.sourceLectureNumber);
assert.deepEqual(lectureGroups.map(g=>g.sourceLectureNumber),Array.from({length:8},(_,i)=>i+1));
for(const g of lectureGroups){assert.equal(g.lessonIds.length,2);assert.equal(g.sourceChapterNumber,null,'Lectures are not invented book chapters');}
for(const lesson of course.lessons){
 const p=passages.find(p=>p.ids.includes(lesson.id)),q=checks.find(c=>c.studyId==='agriculture/'+String(lesson.id).padStart(2,'0'));
 assert.equal(p.course,'agriculture');
 assert.equal(p.author,'Rudolf Steiner');
 assert.equal(p.originalLanguage,'en');
 assert.equal(p.original,p.en.quote);
 assert.ok(p.original.trim().split(/\s+/).length<50,'Concise attributed excerpt '+lesson.id);
 assert.equal(p.sourceFile,'Agriculture.md');
 assert.ok(lesson.pdfCaptures.includes(p.markdownCapture),'Source excerpt within assigned Markdown span '+lesson.id);
 assert.equal(p.markdownCapture,lesson.passage.capture);
 assert.equal(p.en.quote,lesson.passage.quoteEn);
 assert.equal(p.pt.quote,lesson.passage.quotePt);
 const review=map.reviewedExcerpts.find(r=>r.id===lesson.id);
 assert.equal(hash(normalize(p.original)),review.sha256,'Retained source-reviewed wording '+lesson.id);
 assert.equal(review.capture,p.markdownCapture);
 assert.ok(/OCR|Markdown/.test(p.verification)&&!/visually verified/i.test(p.verification),'Honest text verification '+lesson.id);
 for(const lang of ['en','pt']){
  const v=lesson[lang],suffix=lang==='pt'?'Pt':'En';
  for(const field of ['title','question','goal'])assert.ok(lesson[field+suffix]?.trim(),'Bilingual teaching metadata '+lesson.id);
  for(const field of ['intro','keyConcept','example','distinction','connection'])assert.ok(v[field]?.trim(),'Bilingual teaching '+lesson.id+'/'+field);
  assert.ok(Array.isArray(v.meaning)&&v.meaning.length>=2,'Source explanation '+lesson.id);
  assert.equal(v.checks.length,3);assert.equal(v.checks[2].type,'reflection');
  for(const check of v.checks.slice(0,2)){
   assert.notEqual(check.type,'reflection');assert.ok(check.options.length>=2&&check.options.length<=3);
   assert.ok(check.question&&check.explanation&&Number.isInteger(check.answer)&&check.answer>=0&&check.answer<check.options.length);
  }
  assert.deepEqual(q[lang],Object.fromEntries(Object.entries(v.checks[0]).filter(([key])=>key!=='type')),'Retrieval bank matches reviewed lesson '+lesson.id);
  assert.ok(p[lang].quote&&p[lang].note&&p['edition'+(lang==='pt'?'Pt':'')]);
  const file=`docs/${lang==='pt'?'pt/':''}agriculture/lessons/${String(lesson.id).padStart(2,'0')}.html`;
  const h=fs.readFileSync(file,'utf8').replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
  assert.equal((h.match(/id="book-passage"/g)||[]).length,1,file+' source section');
  assert.ok(h.includes(esc(p[lang].quote)),file+' excerpt');
  assert.ok(h.includes(esc(course['edition'+suffix])),file+' credit');
  assert.ok(h.includes(esc(v.checks[1].question)),file+' second retrieval');
  assert.ok(h.includes('learning-reflection'),file+' reflection');
  assert.ok(h.includes('Markdown'),file+' honest source witness');
  assert.ok(!/(?:PDF capture|Captura do PDF)\s+\d/.test(h),file+' invented image verification');
 }
 assert.equal(lesson.en.checks[0].answer,lesson.pt.checks[0].answer);
 assert.equal(lesson.en.checks[1].answer,lesson.pt.checks[1].answer);
}
for(const lang of ['en','pt']){
 const base='docs/'+(lang==='pt'?'pt/':'');
 assert.ok(fs.readFileSync(base+'agriculture/index.html','utf8').includes('what-is-biodynamics/index.html'));
 assert.ok(fs.readFileSync(base+'what-is-biodynamics/index.html','utf8').includes('agriculture/index.html'));
}
console.log('Agriculture source checks passed: 370 Markdown captures, eight lectures, four discussions, 18 bilingual readings and honest OCR-only provenance.');
