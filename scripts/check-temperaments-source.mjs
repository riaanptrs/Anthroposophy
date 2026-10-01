import assert from 'node:assert/strict';
import fs from 'node:fs';
import {temperamentsLessons} from '../content/temperaments.mjs';
import {temperamentCourse} from '../content/temperament-course.mjs';
import {fourTemperamentsSourceGuides} from '../content/four-temperaments-source-guides.mjs';
import {fourTemperamentsUploadReview as review} from '../content/four-temperaments-upload.mjs';

assert.equal(review.pdf.pages,23);
assert.equal(review.markdown.pageMarkers,23);
assert.equal(review.publicationYear,2012);
assert.equal(review.translationRevisionCopyrightYear,2008);
assert.equal(review.firstEnglishPublicationYear,1987);
assert.equal(review.translator,'B. Kelly');
assert.equal(review.reviser,'Matthew Barton');
assert.equal(review.isbn,'9781855842885');
assert.equal(review.editionEvidence.pdfPage,4);
assert.equal(review.lecture.date,'1909-03-04');
assert.deepEqual([review.lecture.from,review.lecture.to],[6,13]);
assert.deepEqual(review.coverage.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)),Array.from({length:23},(_,i)=>i+1));
assert.deepEqual(fourTemperamentsSourceGuides.map(g=>g.id),Array.from({length:11},(_,i)=>i));
const ledgerRows=review.notes.flatMap(name=>[...fs.readFileSync(`content/${name}`,'utf8').matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m=>Number(m[1])));
assert.deepEqual(ledgerRows,Array.from({length:23},(_,i)=>i+1),'Every PDF capture has a page-note record');
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const source of [review.pdf,review.markdown]){
 const entry=registry.find(r=>r.sha256===source.sha256);
 assert.equal(entry?.filename,source.filename);
 assert.equal(entry.bytes,source.bytes);
 assert.equal(entry.capture_pages,23);
 assert.equal(entry.contents_in_repository,false);
 assert.equal(entry.publication_year,2012);
}
const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8'));
const book=passages.filter(p=>p.course==='temperaments');
assert.deepEqual(book.flatMap(p=>p.ids).sort((a,b)=>a-b),Array.from({length:11},(_,i)=>i));
const core=passages.filter(p=>p.course==='understanding-temperaments'&&p.author==='Rudolf Steiner');
assert.deepEqual(core.flatMap(p=>p.ids).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,10,11]);
for(const p of [...book,...core]){
 assert.equal(p.originalLanguage,'en');
 assert.equal(p.en.quote,p.original);
 assert.equal(p.sourceSha256,review.pdf.sha256);
 assert.ok(p.pdfPage>=6&&p.pdfPage<=13&&p.pdfColumn>=1&&p.pdfColumn<=3);
 assert.ok(p.edition.includes('2012')&&p.edition.includes('B. Kelly')&&p.edition.includes('Matthew Barton')&&p.edition.includes('2008'));
 assert.match(p.locator,/printed folio not visible/);
 assert.match(p.locatorPt,/^Palestra/);
}
for(const p of core)assert.equal(p.referenceEdition?.originalLanguage,'de','Earlier German source remains separately credited');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
let checked=0;
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt';
 const index=fs.readFileSync(`${base}/temperaments/index.html`,'utf8');
 assert.equal((index.match(/id="upload-coverage"/g)||[]).length,1);
 for(const lesson of temperamentsLessons){
  const file=`${base}/temperaments/lessons/${String(lesson.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8');
  const guide=fourTemperamentsSourceGuides.find(g=>g.id===lesson.id)[lang];
  assert.equal((html.match(/id="temperaments-source-guide"/g)||[]).length,1,file);
  const start=html.indexOf('id="temperaments-source-guide"');
  assert.ok(html.indexOf('id="book-passage"')<start&&start<html.indexOf('class="worked-example"'),file+' must teach before application');
  assert.ok(guide.sections.length>=3&&guide.question&&guide.answer);
  assert.equal(lesson[lang].checks.length,3);
  for(const s of guide.sections){
   // The guide renderer escapes double quotes; punctuation apostrophes remain ordinary text.
   assert.ok(html.includes(s.title.replaceAll('&','&amp;').replaceAll('"','&quot;')),file+' missing source section');
   assert.ok(s.reading&&s.paragraphs.length&&s.paragraphs.every(p=>p.trim()&&!p.includes('\uFFFD')));
  }
  assert.ok(!lesson[lang].reading.includes('capture has gaps')&&!lesson[lang].reading.includes('captura tem lacunas'),file+' stale source gaps');
  const p=book.find(p=>p.ids.includes(lesson.id));
  if(lang==='pt')assert.ok(html.includes(esc(p.locatorPt)),file+' missing Portuguese source location');
  checked++;
 }
 for(const lesson of temperamentCourse){
  if([8,9].includes(lesson.id))continue;
  assert.ok(!lesson[lang].reading.includes('capture has gaps')&&!lesson[lang].reading.includes('captura tem lacunas'),'Combined course retains superseded gap claim');
  const html=fs.readFileSync(`${base}/understanding-temperaments/lessons/${String(lesson.id).padStart(2,'0')}.html`,'utf8');
  assert.ok(html.includes('2012')&&html.includes('Matthew Barton'),'Combined course lacks supplied-edition credit');
 }
}
console.log(`Passed: The Four Temperaments 23 page records, complete lecture and notes, verified 2012/2008 edition, eleven bilingual book guides, ten supplied-source main-course uses and ${checked} book lesson pages.`);
