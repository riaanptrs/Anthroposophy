import assert from 'node:assert/strict';
import fs from 'node:fs';
import {colourLessons,colourSources} from '../content/colour.mjs';
import {colourSourceGuides} from '../content/colour-source-guides.mjs';
import {colourUploadReview as review,colourCollectionContents} from '../content/colour-upload.mjs';

assert.equal(review.pdf.pages,158);
assert.equal(review.markdown.pageMarkers,158);
assert.equal(review.translationCopyrightYear,1992);
assert.equal(review.publicationYear,null,'Translation copyright does not establish publication year');
assert.equal(review.isbn,'9781855842755');
assert.equal(review.editionEvidence.pdfPage,3);
assert.deepEqual(review.translators,[{name:'John Salter',lectures:[1,2,3]},{name:'Pauline Wehrle',lectures:[4,5,6,7,8,9,10,11,12]}]);
assert.deepEqual(review.coverage.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)),Array.from({length:158},(_,i)=>i+1));
assert.deepEqual(colourSources.map(s=>s.pages),['15–23','24–33','34–45','47–58','59–69','70–77','78–89','90–101','102–111','112–122','123–135','136–145']);
assert.deepEqual(colourSources.map(s=>s.ga),['291','291','291','286','275','202','202','349','276','276','228','233a']);
assert.deepEqual(colourCollectionContents.map(c=>c.lecture),Array.from({length:12},(_,i)=>i+1));
assert.deepEqual(colourSourceGuides.map(g=>g.id),Array.from({length:14},(_,i)=>i));

const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const source of [review.pdf,review.markdown]){
 const entry=registry.find(r=>r.sha256===source.sha256);
 assert.equal(entry?.filename,source.filename);
 assert.equal(entry.bytes,source.bytes);
 assert.equal(entry.contents_in_repository,false);
 assert.equal(entry.capture_pages,158);
 assert.equal(entry.translation_copyright_year,1992);
}
const rows=review.notes.flatMap(name=>[...fs.readFileSync(`content/${name}`,'utf8').matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m=>Number(m[1])));
assert.deepEqual(rows,Array.from({length:158},(_,i)=>i+1),'Every source capture has exactly one page-note record');

const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8')).filter(p=>p.course==='colour');
for(const passage of passages){
 assert.equal(passage.author,'Rudolf Steiner');
 assert.equal(passage.originalLanguage,'en');
 assert.equal(passage.en.quote,passage.original);
 assert.equal(passage.sourceSha256,review.pdf.sha256);
 assert.ok(Number.isInteger(passage.pdfPage)&&passage.pdfPage>=15&&passage.pdfPage<=145);
 assert.ok(passage.pdfColumn>=1&&passage.pdfColumn<=3);
 assert.match(passage.locator,/printed folio not visible/);
 assert.match(passage.locatorPt,/^Palestra \d+; captura \d+ do PDF fornecido/);
 const sourceLecture=passage.ids[0]===0?1:passage.ids[0];
 assert.ok(passage.edition.includes(sourceLecture<=3?'John Salter':'Pauline Wehrle'));
 assert.ok(passage.edition.includes('translation copyright 1992'));
}
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),Array.from({length:14},(_,i)=>i));

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let checked=0;
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt';
 const index=fs.readFileSync(`${base}/colour/index.html`,'utf8');
 assert.equal((index.match(/id="upload-coverage"/g)||[]).length,1);
 for(const heading of colourCollectionContents)assert.ok(index.includes(esc(heading[lang])),`Missing collection heading ${heading.lecture}/${lang}`);
 for(const lesson of colourLessons){
  const file=`${base}/colour/lessons/${String(lesson.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8');
  const guide=colourSourceGuides.find(g=>g.id===lesson.id)[lang];
  const selection=passages.find(p=>p.ids.includes(lesson.id));
  if(lang==='pt')assert.ok(html.includes(esc(selection.locatorPt)),file+' missing Portuguese source location');
  assert.equal((html.match(/id="colour-source-guide"/g)||[]).length,1,file);
  const start=html.indexOf('id="colour-source-guide"');
  assert.ok(html.indexOf('id="book-passage"')<start&&start<html.indexOf('class="worked-example"'),file+' source explanation must precede application');
  assert.ok(guide.sections.length>=3&&guide.question&&guide.answer,file+' incomplete source explanation');
  for(const section of guide.sections){
   assert.ok(section.title&&section.reading&&section.paragraphs.length);
   assert.ok(html.includes(esc(section.title)),file+' missing source argument section');
   assert.ok(section.paragraphs.every(p=>p.trim()&&!p.includes('\uFFFD')));
  }
  assert.equal(lesson[lang].checks.length,3);
  if(lesson.lecture){
   assert.ok(html.includes(`GA ${colourSources[lesson.lecture-1].ga}`),file+' missing correct original GA');
   assert.ok(html.includes(colourSources[lesson.lecture-1].pages),file+' missing corrected source range');
  }
  checked++;
 }
 for(const [id,marker] of [[1,'image-colour-relations'],[3,'matter-colour-relations'],[11,'colour-and-measure'],[12,'hierarchy-colour-relations']]){
  const html=fs.readFileSync(`${base}/colour/lessons/${String(id).padStart(2,'0')}.html`,'utf8');
  assert.ok(html.includes(`id="${marker}"`),`Missing accessible source relationship table ${id}/${lang}`);
 }
}
console.log(`Passed: Colour 158 page records, verified edition and translator credits, twelve corrected lecture ranges, fourteen bilingual reading guides, attributed diagrams and ${checked} lesson pages.`);
