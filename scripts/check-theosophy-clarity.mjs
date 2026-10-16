import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {loadConceptCourse} from '../content/theosophy-concept-course.mjs';
const baseline='8bae0c249b044d0713d0a828507cce5e0a81601d';
const model=loadConceptCourse(),rows=JSON.parse(fs.readFileSync('content/theosophy-clear-lessons.json','utf8'));
assert.deepEqual(rows.map(r=>r.id),model.course.lessonIds,'One clear reading per course unit in order');
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
for(const row of rows){
 assert.equal(row.en.paragraphs.length,row.pt.paragraphs.length,'Bilingual steps '+row.id);
 for(const lang of ['en','pt']){
  const v=row[lang],file=`docs/${lang==='pt'?'pt/':''}theosophy/lessons/${row.id}.html`,html=fs.readFileSync(file,'utf8');
  assert.ok(v.paragraphs.length>=4);assert.equal(v.checks.length,2);
  for(const text of [...v.paragraphs,...v.checks.flat()])assert.ok(typeof text==='string'&&text.trim()&&plain(html).includes(plain(text)),`Missing new text ${file}`);
  assert.ok(html.includes('<details class="cp-deeper cp-retained-depth">'),'Detailed explanation optional');
  assert.ok(html.indexOf('data-clarity-first')<html.indexOf('cp-retained-depth'),'First reading before depth');
 }
}
for(const file of ['content/theosophy-concept-course.json','content/theosophy-concept-constitution.json','content/theosophy-concept-destiny-knowledge.json','content/theosophy-concept-worlds.json','content/theosophy-guided-source-map.json'])assert.deepEqual(fs.readFileSync(file),execFileSync('git',['show',baseline+':'+file]),'Retained original teaching and sources '+file);
console.log('Passed: 24 bilingual Theosophy first readings, two explained questions each, original detailed teaching and source map unchanged; depth optional. Not a fresh original-source verification.');
