import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {loadConceptCourse} from '../content/theosophy-concept-course.mjs';
// The approved novice revisions change teaching prose, not source provenance or saved-study identities.
const baseline='62b44bdfa6d6dc7c156e1e0f39825c96fbf6b3ea';
const model=loadConceptCourse(),rows=JSON.parse(fs.readFileSync('content/theosophy-clear-lessons.json','utf8'));
assert.deepEqual(rows.map(r=>r.id),model.course.lessonIds,'One clear reading per course unit in order');
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
for(const row of rows){
 assert.equal(row.en.paragraphs.length,row.pt.paragraphs.length,'Bilingual steps '+row.id);
 assert.equal(Boolean(row.en.roleMap),Boolean(row.pt.roleMap),'Bilingual role map '+row.id);
 if(row.en.roleMap){
  assert.equal(row.en.roleMap.afterParagraph,row.pt.roleMap.afterParagraph,'Bilingual map position '+row.id);
  assert.equal(row.en.roleMap.entries.length,row.pt.roleMap.entries.length,'Bilingual map roles '+row.id);
 }
 for(const lang of ['en','pt']){
  const v=row[lang],file=`docs/${lang==='pt'?'pt/':''}theosophy/lessons/${row.id}.html`,html=fs.readFileSync(file,'utf8');
  assert.ok(v.paragraphs.length>=4);assert.equal(v.checks.length,2);
  for(const text of [...v.paragraphs,...v.checks.flat()])assert.ok(typeof text==='string'&&text.trim()&&plain(html).includes(plain(text)),`Missing new text ${file}`);
  assert.ok(html.includes('<details class="cp-deeper cp-retained-depth">'),'Detailed explanation optional');
  assert.ok(html.indexOf('data-clarity-first')<html.indexOf('cp-retained-depth'),'First reading before depth');
  if(v.roleMap){
   assert.match(html,/<figure class="cp-reading-role-map"><figcaption>/,'Semantic role map '+file);
   for(const text of [v.roleMap.caption,...v.roleMap.entries.flat()])assert.ok(plain(html).includes(plain(text)),'Rendered map text '+file);
  }
  if(row.id==='whole-picture'){
   assert.ok(html.indexOf('data-concept-section="worked-example"')<html.indexOf('cp-retained-depth'),'Synthesis case in main lesson');
   for(let i=1;i<=7;i++)assert.ok(html.includes(`id="depth-section-${i}"`),'Existing synthesis deep link '+i);
  }
 }
}
const before=file=>execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'});
// Strip only bilingual prose. Keep IDs, sequence, modules, graph edges, reciprocal
// practice associations, source assignments and capture/note references exact.
const structure=value=>Array.isArray(value)?value.map(structure):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>!['en','pt'].includes(key)).map(([key,item])=>[key,structure(item)])):value;
for(const file of ['content/theosophy-concept-course.json','content/theosophy-concept-constitution.json','content/theosophy-concept-destiny-knowledge.json','content/theosophy-concept-worlds.json']){
 const old=JSON.parse(before(file)),current=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.deepEqual(structure(current),structure(old),'Source and study graph preserved '+file);
 for(const kind of ['lessons','concepts','practices'])for(const entry of current[kind]??[]){
  const original=old[kind].find(item=>item.id===entry.id);
  for(const lang of ['en','pt'])for(const field of ['title','term','alsoCalled','sourceBasis'])if(original[lang][field]!==undefined)assert.deepEqual(entry[lang][field],original[lang][field],'Identity/attribution text preserved '+entry.id+'/'+lang+'/'+field);
 }
}
const sourceMap='content/theosophy-guided-source-map.json';
assert.equal(fs.readFileSync(sourceMap,'utf8'),before(sourceMap),'Original capture ledger unchanged');
console.log('Passed: 24 bilingual Theosophy readings, explained answers, accessible role map, main synthesis case, preserved study/source graph and synthesis anchors. Not a fresh original-PDF verification.');
