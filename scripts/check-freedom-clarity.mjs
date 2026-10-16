import {applyDocumentedLanguageCorrections} from './editorial-language-exceptions.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {freedomConsolidated as lessons} from '../content/philosophy-of-freedom-consolidated.mjs';
const baseline='b933e03bb3f161f7f3b262157571572a29792ae4';
const previous=execFileSync('git',['show',baseline+':content/philosophy-of-freedom-consolidated.mjs'],{encoding:'utf8'});
const {freedomConsolidated:old}=await import('data:text/javascript;base64,'+Buffer.from(previous).toString('base64'));
const clear=JSON.parse(fs.readFileSync('content/philosophy-of-freedom-clear-lessons.json','utf8'));
assert.deepEqual(clear.map(l=>l.id),Array.from({length:22},(_,i)=>i));
const plain=s=>s.replace(/<[^>]*>/g,'').replaceAll('**','').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
for(const l of lessons){
 const before=old.find(x=>x.id===l.id);
 for(const key of ['id','chapter','source','sourceUrl'])assert.deepEqual(l[key],before[key]);
 assert.equal(l.en.paragraphs.length,l.pt.paragraphs.length,'Bilingual explanation steps');
 for(const lang of ['en','pt']){
  const v=l[lang],file=`docs/${lang==='pt'?'pt/':''}philosophy-of-freedom/lessons/${String(l.id).padStart(2,'0')}.html`;
  for(const key of ['paragraphs','checks','activity','takeaway','terms'])assert.deepEqual(v.deeper[key],before[lang][key],`Retained ${l.id}/${lang}/${key}`);
  assert.equal(v.reading,before[lang].reading,'Reading references unchanged');
  assert.equal(v.checks.length,3);
  const html=fs.readFileSync(file,'utf8'),text=plain(html);
  for(const p of [...v.paragraphs,v.takeaway,v.activity,...v.checks.flat(),...v.deeper.paragraphs,...v.deeper.checks.flat(),v.deeper.activity,v.deeper.terms,v.deeper.takeaway])assert.ok(text.includes(plain(p)),`Missing rendered content ${file}: ${p.slice(0,60)}`);
  assert.ok(html.includes('<details class="freedom-deeper">'),'Deeper argument closed by default');
  assert.ok(html.includes('<details class="freedom-source-check">'),'Legacy comparison quiz optional');
  if(html.includes('id="lecture-guide"'))assert.ok(html.includes('<details class="freedom-deeper-lecture">'),'Lecture separate and optional');
 }
}
for(const file of ['content/passage-study.json','content/philosophy-of-freedom-lecture-guides.mjs','content/philosophy-of-freedom-page-notes-front-and-appendix.md','content/philosophy-of-freedom-page-notes-chapters1-4.md','content/philosophy-of-freedom-page-notes-chapters5-9.md','content/philosophy-of-freedom-page-notes-chapters10-14.md'])assert.equal(fs.readFileSync(file,'utf8'),applyDocumentedLanguageCorrections(execFileSync('git',['show',baseline+':'+file]).toString()),`Source record unchanged: ${file}`);
console.log('Passed: 22 bilingual short readings; all earlier explanations, questions, terms and activities retained; chapter/source IDs, quotations, lecture guides and page ledgers unchanged. This verifies preservation, not fresh source fidelity.');
