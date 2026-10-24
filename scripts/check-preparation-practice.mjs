import fs from 'node:fs';
import assert from 'node:assert/strict';
import {esc} from './learning-html.mjs';
const d=JSON.parse(fs.readFileSync('content/preparation-practice.json','utf8'));
assert.deepEqual(d.pages.map(p=>p.id).sort(),['index','500','501','502','503','504','505','506','507','508','application','compost','calendar','storage'].sort());
const sources=new Set(d.sources.map(s=>s.id));assert.equal(sources.size,d.sources.length);
for(const p of d.pages){
 assert.ok(p.sources.every(s=>sources.has(s)));
 assert.ok(p.sections.length>=3);
 assert.equal(new Set(p.sections.map(s=>s.id)).size,p.sections.length);
 for(const lang of ['en','pt']){
  const file=`docs/${lang==='pt'?'pt/':''}what-is-biodynamics/practical/${p.id}.html`,h=fs.readFileSync(file,'utf8').replace(/<a\b[^>]*>|<\/a>/g,'');
  for(const s of [p.title[lang],p.lead[lang],...p.sections.flatMap(s=>[s.title[lang],...(s.paragraphs?.[lang]||[]),...(s.items?.[lang]||[]),...(s.steps?.[lang]||[])])])assert.ok(h.includes(esc(s)),file+' complete authored teaching');
  assert.ok(h.includes('preparation-practice.css')&&h.includes('preparation-practice.js'));
  for(const section of p.sections)for(const key of ['paragraphs','steps','items'])if(section[key])assert.equal(section[key].en.length,section[key].pt.length,'Parallel translation '+p.id+'/'+section.id+'/'+key);
 }
}
assert.deepEqual(d.calculator.gramsPerHectare,{'500':100,'501':4});assert.equal(d.calculator.waterLitresPerHectare,50);assert.equal(d.calculator.referenceArea,10000);
for(const [area,prep,grams,litres] of [[100,'500',1,.5],[100,'501',.04,.5],[1000,'500',10,5],[1000,'501',.4,5],[10000,'500',100,50],[10000,'501',4,50]]){
 assert.equal(d.calculator.gramsPerHectare[prep]*area/d.calculator.referenceArea,grams);assert.equal(d.calculator.waterLitresPerHectare*area/d.calculator.referenceArea,litres);
}
for(const lang of ['en','pt']){
 const base=`docs/${lang==='pt'?'pt/':''}`;
 assert.ok(fs.readFileSync(base+'what-is-biodynamics/index.html','utf8').includes('practical/index.html'));
 assert.ok(fs.readFileSync(base+'agriculture/index.html','utf8').includes('what-is-biodynamics/practical/index.html'));
 for(const id of [1,8,10,12])assert.ok(fs.readFileSync(base+'what-is-biodynamics/lessons/'+String(id).padStart(2,'0')+'.html','utf8').includes('../practical/'));
}
console.log('Passed: 14 complete bilingual practical guides, identified source protocols, consistent translations, metric calculations and discoverable course/lesson links.');
