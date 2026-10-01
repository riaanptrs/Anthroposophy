import assert from 'node:assert/strict';
import fs from 'node:fs';
import {understandLessons} from '../content/understand-temperament.mjs';
import {temperamentCourse} from '../content/temperament-course.mjs';
import {childsTemperamentSourceGuides} from '../content/childs-temperament-source-guides.mjs';
import {childsTemperamentUploadReview as review} from '../content/childs-temperament-upload.mjs';
assert.equal(review.pdf.pages,97);
assert.equal(review.markdown.pageMarkers,97);
assert.equal(review.author,'Gilbert Childs');
assert.equal(review.publicationYear,2012);
assert.equal(review.firstPublicationYear,1995);
assert.equal(review.copyrightYear,1995);
assert.equal(review.isbn,'9781855843585');
assert.equal(review.editionEvidence.pdfPage,4);
assert.deepEqual(review.chapters.map(c=>[c.from,c.to]),[[9,14],[15,25],[26,30],[31,35],[36,41],[42,46],[47,52],[53,68],[69,77]]);
assert.deepEqual(review.appendices.map(c=>[c.from,c.to]),[[78,82],[83,95]]);
assert.deepEqual(review.coverage.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)),Array.from({length:97},(_,i)=>i+1));
assert.deepEqual(understandLessons.map(l=>l.id),Array.from({length:13},(_,i)=>i));
assert.deepEqual(childsTemperamentSourceGuides.map(g=>g.id),Array.from({length:13},(_,i)=>i));
const rows=review.notes.flatMap(name=>[...fs.readFileSync(`content/${name}`,'utf8').matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m=>Number(m[1])));
assert.deepEqual(rows,Array.from({length:97},(_,i)=>i+1),'Every capture has a page-note record');
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const source of [review.pdf,review.markdown]){
 const entry=registry.find(r=>r.sha256===source.sha256);
 assert.equal(entry?.filename,source.filename);
 assert.equal(entry.bytes,source.bytes);
 assert.equal(entry.capture_pages,97);
 assert.equal(entry.contents_in_repository,false);
 assert.equal(entry.author,'Gilbert Childs');
 assert.equal(entry.publication_year,2012);
 assert.equal(entry.copyright_year,1995);
}
const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8'));
const book=passages.filter(p=>p.course==='understand-temperament');
const core=passages.filter(p=>p.course==='understanding-temperaments'&&p.author==='Gilbert Childs');
assert.deepEqual(book.flatMap(p=>p.ids).sort((a,b)=>a-b),Array.from({length:13},(_,i)=>i));
assert.deepEqual(core.flatMap(p=>p.ids).sort((a,b)=>a-b),[8,9]);
for(const p of [...book,...core]){
 assert.equal(p.originalLanguage,'en');
 assert.equal(p.en.quote,p.original);
 assert.equal(p.author,'Gilbert Childs');
 assert.equal(p.sourceSha256,review.pdf.sha256);
 assert.ok(p.pdfPage>=9&&p.pdfPage<=95&&Number.isInteger(p.pdfColumn)&&p.pdfColumn>=1&&p.pdfColumn<=3);
 assert.ok(p.edition.includes('2012')&&p.edition.includes('1995')&&p.edition.includes('Gilbert Childs'));
 assert.match(p.locator,/printed folio not visible/);
 assert.ok(p.locatorPt&&p.editionPt&&p.pt.quote&&p.pt.note);
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stale=/capture has gaps|captura tem lacunas|complete replacement edition has not been obtained|edição integral substituta|incomplete diagrams|diagramas incompletos/;
let checked=0;
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt';
 const index=fs.readFileSync(`${base}/understand-temperament/index.html`,'utf8');
 assert.equal((index.match(/id="upload-coverage"/g)||[]).length,1);
 assert.ok(index.includes('9781855843585')&&!stale.test(index));
 for(const l of understandLessons){
  const file=`${base}/understand-temperament/lessons/${String(l.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8'),guide=childsTemperamentSourceGuides.find(g=>g.id===l.id)[lang];
  assert.equal((html.match(/id="childs-temperament-source-guide"/g)||[]).length,1,file);
  const start=html.indexOf('id="childs-temperament-source-guide"');
  assert.ok(html.indexOf('id="book-passage"')<start&&start<html.indexOf('class="worked-example"'),file+' teaches before application');
  assert.equal(l[lang].checks.length,3);
  assert.equal(guide.sections.length,4);
  assert.ok(guide.question&&guide.answer&&!stale.test(l[lang].reading));
  for(const section of guide.sections){
   assert.ok(section.reading&&section.paragraphs.length&&section.paragraphs.every(p=>p.trim()&&!p.includes('\uFFFD')));
   assert.ok(html.includes(section.title.replaceAll('&','&amp;').replaceAll('"','&quot;')),file+' missing source section');
  }
  if(lang==='pt')assert.ok(html.includes(esc(book.find(p=>p.ids.includes(l.id)).locatorPt)),file+' missing Portuguese location');
  const visual={1:'childs-attention-map',2:'childs-psychological-map',9:'childs-fourfold-map',11:'childs-body-type-proposal'}[l.id];
  if(visual){assert.ok(html.includes(`id="${visual}"`));assert.ok(html.includes('role="region"')&&html.includes('tabindex="0"'));}
  if(l.id===8)assert.equal((html.match(/<th scope="row">/g)||[]).length,10);
  checked++;
 }
 for(const id of [8,9]){
  const l=temperamentCourse[id][lang],html=fs.readFileSync(`${base}/understanding-temperaments/lessons/${String(id).padStart(2,'0')}.html`,'utf8');
  assert.ok(!stale.test(l.reading)&&html.includes('Gilbert Childs')&&html.includes('2012')&&html.includes('1995'));
  assert.equal(l.checks.length,3,'Primary Childs lessons include a source comprehension check');
 }
}
console.log(`Passed: Childs 97 page records, nine chapters and two appendices, verified 2012/1995 edition, thirteen bilingual source guides, four teaching tables, two updated primary-source uses and ${checked} companion lesson pages.`);
