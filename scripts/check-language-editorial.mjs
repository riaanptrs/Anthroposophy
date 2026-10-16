import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {applyDocumentedLanguageCorrections} from './editorial-language-exceptions.mjs';
const previous=JSON.parse(execFileSync('git',['show','79de129:content/passage-study.json'],{encoding:'utf8'}));
const current=JSON.parse(fs.readFileSync('content/passage-study.json'));
assert.equal(current.length,previous.length);
const omitNotes=v=>Array.isArray(v)?v.map(omitNotes):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>k!=='note').map(([k,x])=>[k,omitNotes(x)])):v;
for(let i=0;i<current.length;i++){
 assert.deepEqual(omitNotes(current[i]),omitNotes(previous[i]),'All quotation/attribution/locator fields remain exact '+i);
 assert.deepEqual(current[i],JSON.parse(applyDocumentedLanguageCorrections(JSON.stringify(previous[i]))),'Only documented note corrections '+i);
}
const rows=JSON.parse(fs.readFileSync('content/nutrition-clear-lessons.json'));
for(const [id,en,pt]of [[5,'sugar','açúcar'],[7,'plant','planta'],[10,'Grinding','Moer'],[13,'etheric','etérico']]){
 assert.ok(rows[id].en.checks[0][1].includes(en));assert.ok(rows[id].pt.checks[0][1].includes(pt));
 assert.notEqual(rows[id].en.checks[0][1],rows[id].en.paragraphs[1],'Do not reintroduce unrelated answer copy '+id);
}
const originals=['01-12','13-24','25-36'].flatMap(n=>JSON.parse(fs.readFileSync('content/learning-lessons-'+n+'.json')));
const foundations=JSON.parse(fs.readFileSync('content/foundations-introduction-clear-lessons.json')).filter(r=>r.course==='foundations');
for(const r of foundations)for(const lang of ['en','pt']){const q=originals.find(o=>o.id===r.id)[lang].checks[0];assert.ok(r[lang].checks[0][1].startsWith(q.options[q.answer]),'Standalone answer names correct response '+r.id);}
const food=JSON.parse(fs.readFileSync('content/foodwise/course.json'));
for(const lang of ['en','pt'])for(const recipe of food.recipes){
 // All recipe pages must visibly qualify the original, untested course material.
 const paths=fs.readdirSync(`docs/${lang==='pt'?'pt/':''}foodwise/kitchen`).filter(x=>x.endsWith('.html'));
 for(const p of paths){const h=fs.readFileSync(`docs/${lang==='pt'?'pt/':''}foodwise/kitchen/${p}`,'utf8');assert.match(h,lang==='pt'?/Não foram testadas|não testad|nenhuma receita foi testada/:/untested|not been kitchen-tested/);}
}
console.log('Passed: all 177 passage quotation records unchanged; documented note corrections; Nutrition answer-topic regressions; 72 standalone Foundations answers; visible recipe qualifications.');
