import fs from 'node:fs';
import assert from 'node:assert/strict';
const c=JSON.parse(fs.readFileSync('content/nutrition/course.json','utf8'));
assert.equal(c.chapters.length,12);
assert.equal(c.lessons.length,16);
assert.deepEqual(c.pages.map(p=>p.capture),Array.from({length:118},(_,i)=>i+1));
assert.equal(c.pages[18].kind,'blank');
assert.equal(c.pages[117].kind,'advertisement');
assert.equal(c.edition.published,2012);
assert.equal(c.edition.selectionCopyright,2008);
assert.match(c.edition.sourceSHA256,/^[a-f0-9]{64}$/);
const assigned=new Set();
for(const [i,l] of c.lessons.entries()) {
  assert.equal(l.id,i+1);
  const ch=c.chapters[l.chapter-1];
  assert.ok(l.start>=ch.start&&l.end<=ch.end&&l.start<=l.end);
  for(let p=l.start;p<=l.end;p++)assigned.add(p);
  assert.ok(l.excerpt.capture>=l.start&&l.excerpt.capture<=l.end);
  assert.equal(l.excerpt.verifiedAgainstPDF,true);
  assert.ok(l.excerpt.text.split(/\s+/).length<=35,'Keep source excerpts short');
  assert.equal(l.sections.length,4);
  assert.ok(l.sections.reduce((n,s)=>n+s.text.split(/\s+/).length,0)>=200,'Each lesson needs sustained explanation');
  assert.equal(l.checks.length,3);
  assert.equal(l.written.length,2);
  for(const q of l.checks) {
    assert.equal(q.options.length,3);
    assert.equal(new Set(q.options).size,3);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
    assert.ok(q.explanation.length>60);
  }
  for(const w of l.written)assert.ok(w.model.length>100);
  const html=fs.readFileSync(`docs/nutrition/${String(l.id).padStart(2,'0')}.html`,'utf8');
  assert.equal((html.match(/class="nutrition-quiz"/g)||[]).length,3);
  assert.equal((html.match(/<textarea /g)||[]).length,2);
  assert.ok(html.includes('Compare with a model response'));
  assert.ok(!html.includes('ages 10 to 14 assumed'));
}
for(const ch of c.chapters)for(let p=ch.start;p<=ch.end;p++) {
  assert.ok(assigned.has(p),`Unassigned chapter capture ${p}`);
  assert.equal(c.pages[p-1].chapter,ch.id);
}
let checks=0,responses=0;
for(let i=0;i<=17;i++) {
 const h=fs.readFileSync(`docs/nutrition/${String(i).padStart(2,'0')}.html`,'utf8');
 checks+=(h.match(/class="nutrition-quiz"/g)||[]).length;
 responses+=(h.match(/<textarea /g)||[]).length;
 assert.equal((h.match(/<h1(?:\s|>)/g)||[]).length,1);
 assert.ok(h.includes('nutrition-study.js'));
}
assert.equal(checks,54);assert.equal(responses,37);
const sources=fs.readFileSync('docs/nutrition/sources.html','utf8');
for(let i=1;i<=118;i++)assert.ok(sources.includes(`id="capture-${i}"`));
const print=fs.readFileSync('docs/nutrition/print.html','utf8');
assert.equal((print.match(/class="nutrition-quiz"/g)||[]).length,54);
assert.equal((print.match(/Compare with a model response/g)||[]).length,37);
for(const lang of ['', 'pt/'])for(const hub of ['learn','read','books']) {
 assert.ok(fs.readFileSync(`docs/${lang}${hub}/index.html`,'utf8').includes('nutrition/index.html'));
}
const js=fs.readFileSync('docs/nutrition-study.js','utf8');
assert.ok(!/localStorage|fetch\(|XMLHttpRequest/.test(js),'No automatic storage or response transmission');
// Optional source comparison uses the private upload, never a committed full book.
if(process.env.NUTRITION_SOURCE_MD) {
 const md=fs.readFileSync(process.env.NUTRITION_SOURCE_MD,'utf8');
 const norm=s=>s.replace(/(\w)-\s+(\w)/g,'$1$2').replace(/\s+/g,' ').trim();
 const captures=md.split(/<!-- page: \d+ -->/).slice(1);
 assert.equal(captures.length,118);
 for(const l of c.lessons)assert.ok(norm(captures[l.excerpt.capture-1]).includes(norm(l.excerpt.text)),`Excerpt mismatch in lesson ${l.id}`);
}
console.log('Passed: nutrition chapter/capture coverage, 16 short verified excerpts, 54 checks, 37 response models, paper answers, source locators and discovery links.');
// Translation delivery is distinct from original-source verification.
const pt=JSON.parse(fs.readFileSync('content/nutrition/course-pt.json','utf8'));
assert.deepEqual(pt.lessons.map(l=>l.id),Array.from({length:18},(_,i)=>i));
assert.match(pt.translationStatus,/Condensed pedagogical translation/);
let ptChecks=0,ptResponses=0;
for(const l of pt.lessons){
 const name=String(l.id).padStart(2,'0')+'.html';
 const h=fs.readFileSync('docs/pt/nutrition/'+name,'utf8');
 const en=fs.readFileSync('docs/nutrition/'+name,'utf8');
 assert.match(h,/<html lang="pt-BR">/);
 assert.ok(h.includes('../../nutrition/'+name),'English language partner');
 assert.ok(en.includes('../pt/nutrition/'+name),'Portuguese language partner');
 assert.equal((h.match(/class="nutrition-quiz"/g)||[]).length,3);
 assert.deepEqual([...h.matchAll(/data-answer="(\d)"/g)].map(m=>+m[1]),[...en.matchAll(/data-answer="(\d)"/g)].map(m=>+m[1]));
 assert.ok(l.sections.every(s=>s.title&&s.text.length>80));
 assert.ok(l.checks.every(q=>q.options.length===3&&q.explanation.length>40));
 assert.ok(l.written.every(w=>w.prompt&&w.model.length>60));
 const source=c.lessons.find(x=>x.id===l.id);
 if(source){
  assert.deepEqual([l.chapter,l.start,l.end],[source.chapter,source.start,source.end]);
  assert.match(h,/<blockquote lang="en">/);
  assert.deepEqual(l.table?.rows.map(r=>r.length),source.table?.rows.map(r=>r.length));
 }
 ptChecks+=l.checks.length;ptResponses+=l.written.length;
}
assert.equal(ptChecks,54);assert.equal(ptResponses,37);
const ptPrint=fs.readFileSync('docs/pt/nutrition/print.html','utf8');
assert.equal((ptPrint.match(/<h1>/g)||[]).length,1);
assert.equal((ptPrint.match(/class="nutrition-quiz"/g)||[]).length,54);
assert.equal((ptPrint.match(/<textarea/g)||[]).length,37);
const ptSources=fs.readFileSync('docs/pt/nutrition/sources.html','utf8');
for(let i=1;i<=118;i++)assert.ok(ptSources.includes(`id="capture-${i}"`));
assert.ok(!fs.readFileSync('docs/pt/nutrition/index.html','utf8').includes('As lições completas estão em inglês'));
console.log('Portuguese Nutrition: 18 condensed teaching counterparts, 54 aligned checks, 37 responses, five comparison tables, 118 inherited locators, reciprocal language navigation and paper edition.');
