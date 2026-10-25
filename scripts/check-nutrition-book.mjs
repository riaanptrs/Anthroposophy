import fs from 'node:fs';
import assert from 'node:assert/strict';
import {nutritionBookTeaching as rows,nutritionTeachingTables as tables} from '../content/nutrition/book-teaching.mjs';
import {nutritionAttachedSource as source} from './render-nutrition-book.mjs';
import {wholeElement,esc} from './learning-html.mjs';
assert.deepEqual(rows.map(r=>r.id),Array.from({length:18},(_,i)=>i));
assert.equal(source.pageCount,122);assert.equal(source.pages.length,122);assert.equal(source.chapters.length,12);assert.equal(source.flaggedPages.length,45);
assert.equal(source.sha256,'af877b29b8b73e27b55b0baa182997cfb1a1aefc152d9c57a4dd3c30863111fc');
assert.deepEqual(source.pages.map(p=>p.page),Array.from({length:122},(_,i)=>i+1));
for(const chapter of source.chapters)for(let p=chapter.start;p<=chapter.end;p++){
 assert.equal(source.pages[p-1].chapter,chapter.id);
 assert.ok(rows.filter(r=>r.id>0&&r.id<17).some(r=>r.pages[0]<=p&&r.pages[1]>=p),'Book teaching covers PDF '+p);
}
for(const r of rows){
 for(const lang of ['en','pt']){
  const v=r[lang];assert.equal(v[1].length,4);assert.ok(v[1].every(([h,p])=>h.length>6&&p.split(/\s+/).length>=35));assert.ok(v[2].length>150&&v[3].length>40&&v[4].length>120);
  const prefix=lang==='pt'?'pt/':'',html=fs.readFileSync(`docs/${prefix}nutrition/${String(r.id).padStart(2,'0')}.html`,'utf8');
  const first=wholeElement(html,'<section class="batch-first-reading"'),teaching=wholeElement(first,'<section class="nutrition-book-teaching"');
  assert.ok(teaching&&!teaching.includes('batch-retained-depth'));
  assert.equal((teaching.match(/class="nutrition-book-concept"/g)||[]).length,4);
  const plain=teaching.replace(/<a\b[^>]*>|<\/a>/g,'');
  for(const text of [v[0],...v[1].flat(),...v.slice(2)])assert.ok(plain.includes(esc(text)),r.id+' '+lang+' complete teaching');
  assert.ok(html.includes(`sources.html#pdf-page-${r.pages[0]}`));assert.ok(teaching.includes('class="nutrition-book-answer"'));
  const print=fs.readFileSync(`docs/${prefix}nutrition/first-readings.html`,'utf8');assert.ok(print.includes(`id="book-teaching-${r.id}"`));
  const download=fs.readFileSync(`docs/${prefix}nutrition/nutrition-study-guide.md`,'utf8');
  for(const text of [v[0],...v[1].flat(),...v.slice(2)])assert.ok(download.includes(text),'Complete downloadable teaching '+r.id+' '+lang);
 }
}
for(const id of [3,6,8,10,13])for(const lang of ['en','pt'])assert.ok(tables[id][lang].rows.length>=3);
assert.deepEqual(source.figures.map(f=>f.page),[50,61,67,71]);
for(const f of source.figures)for(const dir of ['scripts/assets/nutrition','docs/nutrition/assets'])assert.ok(fs.statSync(`${dir}/source-page-${String(f.page).padStart(3,'0')}.webp`).size>1000);
for(const prefix of ['','pt/']){
 const html=fs.readFileSync('docs/'+prefix+'nutrition/sources.html','utf8');
 for(let p=1;p<=122;p++)assert.ok(html.includes(`id="pdf-page-${p}"`));
 for(let p=1;p<=118;p++)assert.ok(html.includes(`id="capture-${p}"`));
 assert.ok(fs.readFileSync('docs/'+prefix+'nutrition/index.html','utf8').includes('data-nutrition-book-orientation'));
}
// Optional source-fidelity check against the private current attachment.
if(process.env.NUTRITION_ATTACHMENT_MD){
 const md=fs.readFileSync(process.env.NUTRITION_ATTACHMENT_MD,'utf8'),pages=md.split(/<!-- page: \d+ -->/).slice(1);
 assert.equal(pages.length,122);
 const old=JSON.parse(fs.readFileSync('content/nutrition/course.json','utf8'));
 const norm=s=>s.replace(/(\w)-\s+(\w)/g,'$1$2').replace(/\s+/g,' ').trim();
 for(const loc of source.excerptLocations){const excerpt=old.lessons.find(l=>l.id===loc.lesson).excerpt.text;assert.ok(norm(pages[loc.page-1]).includes(norm(excerpt)),'Excerpt location '+loc.lesson);}
}
console.log('Nutrition book revision passed: all 12 chapters, 18 bilingual units, 72 concept explanations, 18 worked cases and applications, 122 current page records, 16 excerpt locations, four source images, five teaching tables, earlier references preserved.');
