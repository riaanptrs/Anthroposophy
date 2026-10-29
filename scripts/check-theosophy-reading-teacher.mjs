import fs from 'node:fs';
import assert from 'node:assert/strict';
import {esc,wholeElement} from './learning-html.mjs';
import {loadTheosophyCourse} from '../content/theosophy-guided.mjs';
const course=loadTheosophyCourse();
const rows=JSON.parse(fs.readFileSync('content/remaining-course-clear-lessons.json')).filter(r=>r.course==='theosophy-reading');
assert.deepEqual(rows.map(r=>r.id),course.order,'Authored reading order, including inserted legacy IDs');
assert.equal(rows.length,28);assert.deepEqual([...new Set(rows.map(r=>r.id))].sort((a,b)=>a-b),Array.from({length:28},(_,i)=>i));
let pages=0,tables=0;
for(const r of rows)for(const lang of ['en','pt']){
 const f=`docs/${lang==='pt'?'pt/':''}lessons/${String(r.id).padStart(2,'0')}.html`,h=fs.readFileSync(f,'utf8');
 assert.match(h,new RegExp(`<html lang="${lang==='pt'?'pt-BR':'en'}"`));assert.equal((h.match(/<h1\b/g)||[]).length,1);
 const first=wholeElement(h,'<section class="batch-first-reading"');assert(first);assert.equal(r[lang].paragraphs.length,4);assert.equal(r[lang].checks.length,2);
 for(const text of [...r[lang].paragraphs,...r[lang].checks.flat()])assert(first.includes(esc(text)),f+' missing authoring text');
 const depth=wholeElement(h,'<details class="batch-retained-depth"');assert(depth&&!/^<details[^>]*\bopen\b/.test(depth),f+' optional depth initially closed');
 const data=JSON.parse(h.match(/id="cw-data">([\s\S]*?)<\/script>/)[1]);assert.equal(data.course.id,'theosophy-reading');assert.deepEqual(data.course.lessons.map(l=>Number(l.route.match(/\/(\d+)\.html$/)[1])),course.order);
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,f+' duplicate anchors');
 const t=r[lang].relationshipTable;
 if(t){const table=wholeElement(first,'<table class="foundation-relationships"');assert(table,f+' relationship table missing');assert(Number.isInteger(r[lang].relationshipTableAfterParagraph));for(const row of t.rows)assert.equal(row.length,t.headers.length);for(const text of [t.caption,...t.headers,...t.rows.flat()])assert(table.includes(esc(text)),f+' incomplete table');assert.equal((table.match(/scope="col"/g)||[]).length,t.headers.length);assert.equal((table.match(/scope="row"/g)||[]).length,t.rows.length);tables++;}
 pages++;
}
assert.equal(tables,6);console.log(`Passed: ${rows.length} source-ordered readings, ${pages} bilingual pages, six comparison tables, complete primary prose/questions and closed source depth; course graph and legacy URL order retained.`);
