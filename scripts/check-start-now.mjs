import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chapters,lessons} from '../content/start-now/course.mjs';
import {practiceLocations} from '../content/start-now/practice-locations.mjs';
const pages=JSON.parse(fs.readFileSync('content/start-now/source-pages.json','utf8'));
assert.equal(chapters.length,17);assert.equal(lessons.length,38);
assert.equal(new Set(lessons.map(l=>l.id)).size,38);
assert.equal(new Set(pages.map(p=>p.page)).size,pages.length);
for(const c of chapters){
 assert.ok(lessons.some(l=>l.chapter===c.id),c.id+' has teaching');
 for(const [page] of practiceLocations[c.id]||[]){assert.ok(page>=c.start&&page<=c.end);assert.ok(pages.some(p=>p.page===page),c.id+' locator '+page);}
}
for(const l of lessons){
 const c=chapters.find(c=>c.id===l.chapter);assert.ok(c,l.id);
 assert.ok(l.pages[0]>=c.start&&l.pages[1]<=c.end,l.id+' source range');
 for(const lang of ['en','pt']){
  const v=l[lang];for(const k of ['title','purpose','when','preparation','example','question','answer'])assert.ok(v[k]?.length>10,l.id+' '+lang+' '+k);
  assert.ok(v.teaching.length>=2);assert.ok(v.steps.length>=3);
  const html=fs.readFileSync(`docs/${lang==='pt'?'pt/':''}start-now/lessons/${l.id}.html`,'utf8');
  assert.ok(html.includes(`data-start-now-lesson="${l.id}"`));assert.ok(html.includes('class="sn-example"'));assert.ok(html.includes('class="sn-answer"'));
 }
 if(l.passage)assert.ok(l.passage.page>=l.pages[0]&&l.passage.page<=l.pages[1],l.id+' passage range');
}
for(const p of pages){assert.ok(p.text.length>0);if(p.image)for(const dir of ['scripts/assets/start-now','docs/start-now/assets'])assert.ok(fs.statSync(dir+'/'+p.image).size>1000);}
for(let n=144;n<=166;n++)assert.ok(pages.some(p=>p.page===n),'Calendar source '+n);
for(let n=174;n<=208;n++)assert.ok(pages.some(p=>p.page===n),'School source '+n);
for(const prefix of ['','pt/']){
 const index=fs.readFileSync('docs/'+prefix+'start-now/index.html','utf8');assert.equal((index.match(/data-sn-entry/g)||[]).length,38);
 for(const c of chapters){const html=fs.readFileSync('docs/'+prefix+'start-now/chapters/'+c.id+'.html','utf8');for(const [p] of practiceLocations[c.id]||[])assert.ok(html.includes(`id="source-page-${p}"`));}
 assert.ok(fs.readFileSync('docs/'+prefix+'meditation/index.html','utf8').includes('start-now/index.html'));
}
console.log(`Start Now passed: 17 sections, 38 bilingual lessons, 112 routes, ${pages.length} selected source pages, ${pages.filter(p=>p.image).length} source images, practice locators and companion links.`);
