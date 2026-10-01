import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selfLessons,selfConnections} from '../content/encountering-the-self.mjs';
import {encounteringSelfSourceGuides} from '../content/encountering-self-source-guides.mjs';
import {encounteringSelfUploadReview as review,encounteringSelfLessonAssignments} from '../content/encountering-self-upload.mjs';
assert.equal(review.pdf.pages,76);assert.equal(review.markdown.pageMarkers,76);
assert.equal(review.author,'Hermann Koepke');assert.equal(review.translator,'Jesse Darrell');
assert.equal(review.publicationYear,1989);assert.equal(review.copyrightYear,1989);assert.equal(review.ebookPublicationYear,null);
assert.equal(review.isbn,'9780880102797');assert.deepEqual(review.editionEvidence.pdfPages,[2,3]);
assert.deepEqual(review.germanEdition,{translatedEdition:2,editionYear:1985,firstAppearanceYear:1983,firstAppearanceEvidence:5});
assert.deepEqual(review.parts.map(p=>[p.divider,p.from,p.to]),[[10,11,43],[44,45,64],[65,66,71]]);
assert.deepEqual(review.coverage.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)),Array.from({length:76},(_,i)=>i+1));
assert.equal(review.conversations.kind,'free representations');assert.equal(review.conversations.evidencePdfPage,72);
assert.equal(review.ending.pdfPage,76);assert.equal(review.ending.pdfColumn,3);
const ids=Array.from({length:17},(_,i)=>i);
for(const values of [selfLessons,encounteringSelfSourceGuides,encounteringSelfLessonAssignments])assert.deepEqual(values.map(v=>v.id),ids);
const rows=review.notes.flatMap(name=>[...fs.readFileSync(`content/${name}`,'utf8').matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m=>Number(m[1])));
assert.deepEqual(rows,Array.from({length:76},(_,i)=>i+1),'Every capture has exactly one page-note record');
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const source of [review.pdf,review.markdown]){
 const found=registry.filter(r=>r.sha256===source.sha256);assert.equal(found.length,1);
 const entry=found[0];assert.equal(entry.filename,source.filename);assert.equal(entry.bytes,source.bytes);
 assert.equal(entry.capture_pages,76);assert.equal(entry.contents_in_repository,false);
 assert.equal(entry.author,'Hermann Koepke');assert.equal(entry.translator,'Jesse Darrell');
 assert.equal(entry.publication_year,1989);assert.equal(entry.ebook_publication_year,null);assert.equal(entry.isbn,'9780880102797');
}
const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8'));
const book=passages.filter(p=>p.course==='encountering-the-self');
assert.deepEqual(book.flatMap(p=>p.ids),ids);
assert.deepEqual(book.map(p=>[p.pdfPage,p.pdfColumn]),[[8,1],[19,2],[21,2],[33,1],[39,3],[46,1],[49,2],[56,2],[56,3],[60,2],[62,1],[63,3],[66,2],[67,1],[69,1],[70,2],[72,1]]);
for(const p of book){
 assert.equal(p.originalLanguage,'en');assert.equal(p.en.quote,p.original);assert.equal(p.sourceSha256,review.pdf.sha256);
 assert.equal(p.author,p.ids[0]===11?'Walter Holtzapfel':p.ids[0]===15?'Rudolf Steiner':'Hermann Koepke');
 assert.match(p.edition,/Jesse Darrell/);assert.match(p.edition,/copyright 1989/);assert.match(p.edition,/Electronic publication date unstated/);
 assert.match(p.locator,/printed folio not visible/);assert.ok(p.locatorPt&&p.editionPt&&p.pt.quote&&p.pt.note);
 assert.ok(p.original.split(/\s+/).length<=35);assert.equal(p.referenceEdition,undefined);
}
assert.match(book[15].edition,/as quoted in Hermann Koepke/);assert.match(book[15].en.note,/not independently/);
assert.match(book[1].en.note,/free representation/);assert.match(book[2].en.note,/constructed/);
assert.deepEqual(selfConnections.map(c=>[c.target,c.lesson]),[['higher-worlds/lessons/03.html',1],['temperaments/lessons/08.html',8],['colour/lessons/01.html',6]]);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const stale=/supplied incomplete capture|captura incompleta fornecida|capture has gaps|captura contém lacunas|diagramas incompletos|incomplete diagrams|Richard and Rita Darrell|Richard e Rita Darrell/;
const maps={0:['self-reading-layers',3],5:['self-developmental-phases',3],6:['self-seven-twelve-map',3],7:['self-house-crossings',3],14:['self-grade-form-map',3],15:['self-form-drawing-map',4]};
let checked=0;
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt';
 const index=fs.readFileSync(`${base}/encountering-the-self/index.html`,'utf8');
 assert.equal((index.match(/id="upload-coverage"/g)||[]).length,1);
 assert.ok(index.includes('76')&&index.includes('72–76')&&index.includes('9780880102797')&&!stale.test(index));
 for(const l of selfLessons){
  const file=`${base}/encountering-the-self/lessons/${String(l.id).padStart(2,'0')}.html`,html=fs.readFileSync(file,'utf8');
  const guide=encounteringSelfSourceGuides[l.id][lang],plain=html.replace(/<[^>]+>/g,'');
  assert.equal((html.match(/id="encountering-self-source-guide"/g)||[]).length,1,file);
  const positions=['id="book-passage"','id="study-explanation"','id="encountering-self-source-guide"','class="worked-example"','data-note-field="first"'].map(v=>html.indexOf(v));
  assert.ok(positions.every((v,i)=>v>=0&&(!i||v>positions[i-1])),file+' must teach before application');
  assert.equal(l[lang].checks.length,3);assert.equal(guide.sections.length,4);
  assert.ok(guide.question&&guide.answer&&l[lang].reading&&!stale.test(html));
  assert.ok(html.includes(esc(l[lang].reading))&&html.includes(esc(lang==='pt'?book[l.id].locatorPt:book[l.id].locator)));
  for(const section of guide.sections){
   assert.ok(section.reading&&section.paragraphs.length&&section.paragraphs.every(p=>p.trim()&&!p.includes('\uFFFD')));
   assert.ok(plain.includes(esc(section.title)),file+' missing source teaching');
  }
  if(maps[l.id]){const [id,rows]=maps[l.id];assert.ok(html.includes(`id="${id}"`));assert.ok(html.includes('<caption>')&&html.includes('role="region"')&&html.includes('tabindex="0"'));assert.equal((html.match(/<th scope="row">/g)||[]).length,rows);}
  if(l.id===15)assert.ok(html.includes('reflection-desc')&&html.includes('role="img"'));
  checked++;
 }
 for(const connection of selfConnections){
  const html=fs.readFileSync(`${base}/${connection.target}`,'utf8');
  assert.equal((html.match(/<!-- self-connection:start -->/g)||[]).length,1);assert.ok(html.includes(esc(connection[lang][1])));
  assert.ok(html.includes('/encountering-the-self/lessons/'));
 }
}
console.log(`Passed: Encountering the Self 76 page records, verified 1989 English edition particulars, distinct author voices, 17 bilingual source guides/selections, six teaching tables and retained drawing, three paired connections and ${checked} lesson pages.`);
