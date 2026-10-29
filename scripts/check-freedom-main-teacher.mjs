import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {esc,wholeElement} from './learning-html.mjs';
import {freedomCore,freedomPractice} from '../content/philosophy-of-freedom-consolidated.mjs';
const baseline='cc74e2fb',file='content/philosophy-of-freedom-clear-lessons.json';
const rows=JSON.parse(fs.readFileSync(file)),old=JSON.parse(execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'}));
const revised=[0,2,3,5,7,8,9,10,11,12,13,14,16,19,20,21],retained=[1,4,6,15,17,18];
assert.equal(rows.length,22);
function withoutThird(h){const matches=[...h.matchAll(/<div class="knowledge-check">/g)];assert(matches.length>=3);const i=matches[2].index,b=wholeElement(h.slice(i),matches[2][0]);assert(b);return h.slice(0,i)+'<THIRD-CHECK>'+h.slice(i+b.length);}
for(const r of rows){const before=old.find(x=>x.id===r.id),copy=structuredClone(r);for(const lang of ['en','pt']){
 const f=`docs/${lang==='pt'?'pt/':''}philosophy-of-freedom/lessons/${String(r.id).padStart(2,'0')}.html`,h=fs.readFileSync(f,'utf8'),previous=execFileSync('git',['show',baseline+':'+f],{encoding:'utf8'});
 for(const text of [...r[lang].paragraphs,...r[lang].checks.flat()])assert(h.replaceAll('&#39;',"'").includes(esc(text).replaceAll('&#39;',"'")),f+' authoring text');
 if(revised.includes(r.id)){assert.notDeepEqual(r[lang].checks[2],before[lang].checks[2]);assert.equal(withoutThird(h),withoutThird(previous),f+' all material outside third check preserved');copy[lang].checks[2]=before[lang].checks[2];}else assert.equal(h,previous,f+' retained page unchanged');
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,f+' unique anchors');
 const data=JSON.parse(h.match(/id="cw-data">([\s\S]*?)<\/script>/)[1]);assert.deepEqual(data.course.lessons.map(l=>Number(l.route.match(/\/(\d+)\.html$/)[1])),freedomCore);
 const depth=wholeElement(h,'<details class="freedom-deeper"');assert(depth&&!/^<details[^>]*\bopen\b/.test(depth));
 }assert.deepEqual(copy,before,'Only designated third check changed: '+r.id);}
const out='reviews/pedagogy/teacher-library/freedom-main';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/validation.json',JSON.stringify({status:'passed',baseline,reviewedUnits:22,revised,retained,pages:44,core:freedomCore,optional:freedomPractice,preservation:'Only the third check changes in sixteen bilingual units; all main prose, first two checks, sources, navigation and other page content byte-identical to baseline. Six retained units entirely unchanged.',legacyClarityValidator:'Fails inherited historical content/passage-study.json comparison; that file is unchanged in this review.'},null,2)+'\n');console.log('Passed: 22 units, 44 pages, source/render agreement, unchanged prose and sources, 16 core steps, six optional practices, unique anchors and closed source depth.');
