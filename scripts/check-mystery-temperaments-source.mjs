import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mysteryLessons} from '../content/mystery-temperaments.mjs';
import {mysteryTemperamentsSourceGuides} from '../content/mystery-temperaments-source-guides.mjs';
import {mysteryTemperamentsUploadReview as review} from '../content/mystery-temperaments-upload.mjs';
import {temperamentCourse} from '../content/temperament-course.mjs';
import {mysteryTemperamentsCoreAdditions,mysteryTemperamentsCoreChecks,mysteryTemperamentsCoreLinks} from '../content/mystery-temperaments-core-additions.mjs';
assert.equal(review.pdf.pages,33);
assert.equal(review.markdown.pageMarkers,33);
assert.equal(review.author,'Rudolf Steiner');
assert.equal(review.title,'The Mystery of Temperaments');
for(const key of ['translator','publisher','publicationYear','isbn','lectureDate','lecturePlace','ga'])assert.equal(review[key],null,'Uploaded identity must not borrow parallel catalogue details');
assert.deepEqual(review.identityEvidence.pdfPages,[1,2]);
assert.deepEqual(review.discussion,{from:3,to:31,teachingDivisions:15});
assert.deepEqual(review.coverage.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)),Array.from({length:33},(_,i)=>i+1));
assert.deepEqual(review.coverage.at(-1),{from:32,to:33,kind:'advertising-excluded'});
assert.deepEqual(review.sourceDefects.incompleteSentence,{pdfPage:26,pdfColumn:2});
assert.equal(review.parallel.translator,'Frances E. Dawson');
assert.equal(review.parallel.cataloguedDate,'1909-01-19');
assert.equal(review.parallel.cataloguedGa,'68d');
const ids=Array.from({length:15},(_,i)=>i);
assert.deepEqual(mysteryLessons.map(l=>l.id),ids);
assert.deepEqual(mysteryTemperamentsSourceGuides.map(g=>g.id),ids);
assert.deepEqual(mysteryLessons.map(l=>l.span),['3–31','3–5','5–9','9–10','10–13','14–16','16–19','19–20','21–23','23–24','24–25','26–27','23–29','29–31','3–31']);
const rows=review.notes.flatMap(name=>[...fs.readFileSync(`content/${name}`,'utf8').matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m=>Number(m[1])));
assert.deepEqual(rows,Array.from({length:33},(_,i)=>i+1),'Every capture has exactly one page-note record');
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const source of [review.pdf,review.markdown]){
 const entries=registry.filter(r=>r.sha256===source.sha256);assert.equal(entries.length,1);
 const entry=entries[0];assert.equal(entry.filename,source.filename);assert.equal(entry.bytes,source.bytes);
 assert.equal(entry.capture_pages,33);assert.equal(entry.contents_in_repository,false);
 for(const key of ['translator','publisher','publication_year','lecture_date','ga'])assert.equal(entry[key],null);
}
const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8'));
const book=passages.filter(p=>p.course==='mystery-temperaments');
assert.deepEqual(book.flatMap(p=>p.ids),ids);
assert.deepEqual(book.map(p=>[p.pdfPage,p.pdfColumn]),[[3,1],[3,2],[5,1],[10,1],[13,1],[15,2],[17,2],[19,3],[21,1],[24,2],[25,2],[26,2],[25,3],[30,1],[31,2]]);
for(const p of book){
 assert.equal(p.originalLanguage,'en');assert.equal(p.en.quote,p.original);assert.equal(p.author,'Rudolf Steiner');
 assert.equal(p.sourceSha256,review.pdf.sha256);assert.equal(p.referenceEdition,undefined);
 assert.match(p.edition,/Translator, publisher, publication year, lecture date\/place and GA volume unidentified/);
 assert.match(p.locator,/printed folio not visible/);
 assert.ok(p.locatorPt&&p.editionPt&&p.pt.quote&&p.pt.note);
 assert.ok(p.original.split(/\s+/).length<=35,'Use short, accurately credited excerpts');
}
assert.deepEqual(mysteryTemperamentsCoreAdditions.map(a=>a.id),[0,1,7]);
assert.deepEqual(mysteryTemperamentsCoreChecks.map(a=>a.id),[7]);
assert.deepEqual(mysteryTemperamentsCoreLinks.map(a=>[a.coreId,a.lesson]),[[0,2],[1,3],[6,7]]);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let checked=0;
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt';
 const index=fs.readFileSync(`${base}/mystery-temperaments/index.html`,'utf8');
 assert.equal((index.match(/id="upload-coverage"/g)||[]).length,1);
 assert.ok(index.includes('3–31')&&index.includes('32–33')&&index.includes('33'));
 assert.ok(!/32-page capture|captura fornecida de 32 páginas|pages 2–30|páginas 2–30/.test(index));
 for(const l of mysteryLessons){
  const file=`${base}/mystery-temperaments/lessons/${String(l.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8'),guide=mysteryTemperamentsSourceGuides[l.id][lang];
  assert.equal((html.match(/id="mystery-temperaments-source-guide"/g)||[]).length,1,file);
  const start=html.indexOf('id="mystery-temperaments-source-guide"');
  assert.ok(html.indexOf('id="book-passage"')<start&&start<html.indexOf('class="worked-example"'),file+' teaches from the book before applying it');
  assert.equal(l[lang].checks.length,3);assert.equal(guide.sections.length,4);
  assert.ok(guide.question&&guide.answer&&l[lang].reading&&html.includes(l.span));
  for(const section of guide.sections){
   assert.ok(section.reading&&section.paragraphs.length&&section.paragraphs.every(p=>p.trim()&&!p.includes('\uFFFD')));
   assert.ok(html.replace(/<[^>]+>/g,'').includes(esc(section.title)),file+' missing source teaching');
  }
  assert.ok(html.includes(esc(lang==='pt'?book[l.id].locatorPt:book[l.id].locator)));
  assert.ok(html.includes('temperaments.css'));
  const visual={4:'mystery-four-member-map',7:'mystery-child-education-map'}[l.id];
  if(visual){assert.ok(html.includes(`id="${visual}"`));assert.ok(html.includes('<caption>')&&html.includes('role="region"')&&html.includes('tabindex="0"'));assert.equal((html.match(/<th scope="row">/g)||[]).length,4);}
  checked++;
 }
 assert.equal(temperamentCourse[7][lang].checks.length,3);
 for(const link of mysteryTemperamentsCoreLinks){
  const url='../../mystery-temperaments/lessons/'+String(link.lesson).padStart(2,'0')+'.html';
  assert.equal(temperamentCourse[link.coreId][lang].sources.filter(s=>s.url===url).length,1);
 }
}
console.log(`Passed: Mystery 33 page records, unidentified uploaded edition kept separate from its parallel, fifteen bilingual source guides and exact-source selections, two teaching tables, scoped combined-course additions and ${checked} companion lesson pages.`);
