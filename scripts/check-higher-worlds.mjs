import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {higherWorlds} from '../content/higher-worlds.mjs';
import {applyFreedomConnections} from '../content/philosophy-of-freedom-connections.mjs';
import {higherWorldsConnections} from '../content/higher-worlds-connections.mjs';

const ids=Array.from({length:19},(_,id)=>id);
assert.deepEqual(higherWorlds.map(l=>l.id),ids,'Retain the complete nineteen-lesson route and notebook identities');
for(const l of higherWorlds){
  assert.ok(l.pages.trim()&&l.section.includes(' / '),'Missing bilingual source assignment');
  assert.ok(Number.isInteger(l.bridge)&&l.bridge>=0&&l.bridge<=22,'Broken Theosophy bridge');
  const supplemented=applyFreedomConnections([l],'higherWorlds')[0];
  for(const lang of ['en','pt']){
    assert.equal(l[lang].length,9,`Incomplete lesson ${l.id}/${lang}`);
    assert.ok(l[lang][2].length>=5&&l[lang][2].every(p=>typeof p==='string'&&p.trim()),`Missing substantive chapter teaching ${l.id}/${lang}`);
    assert.equal(l[lang][6].length,3,'Three comprehension questions must remain');
    assert.equal(supplemented[lang][5],l[lang][5],'A supplemental course replaced the main book activity');
  }
}

const ledgers=[
  ['front-and-appendix',[1,2,3,4,...Array.from({length:7},(_,i)=>i+102)]],
  ['preparation',Array.from({length:30},(_,i)=>i+5)],
  ['initiation',Array.from({length:33},(_,i)=>i+35)],
  ['consciousness',Array.from({length:34},(_,i)=>i+68)]
];
const reviewed=[];
for(const [suffix,expected] of ledgers){
  const text=fs.readFileSync(`content/higher-worlds-page-notes-${suffix}.md`,'utf8');
  let inTable=false;const pages=[];
  for(const line of text.split('\n')){
    if(/^\| PDF page \|/.test(line)){inTable=true;continue;}
    if(!line.startsWith('|')){inTable=false;continue;}
    const row=inTable&&line.match(/^\|\s*(\d+)\s*\|/);
    if(row)pages.push(Number(row[1]));
  }
  assert.deepEqual(pages,expected,`Missing or duplicate source page records in ${suffix}`);
  reviewed.push(...pages);
}
assert.deepEqual(reviewed.sort((a,b)=>a-b),Array.from({length:108},(_,i)=>i+1),'Every supplied GA 10 PDF page needs a separate reading record');

const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8')).filter(p=>p.course==='higher-worlds');
assert.equal(passages.length,19,'Each lesson needs its own contextualized selection');
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),ids);
assert.equal(passages.filter(p=>p.originalLanguage==='en').length,13,'Retain thirteen visually verified supplied-English selections');
assert.deepEqual(passages.filter(p=>p.originalLanguage==='de').flatMap(p=>p.ids),[11,12,13,14,15,16],'Identify the six retained German parallel readings');
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({'amp':'&','lt':'<','gt':'>','quot':'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
let checked=0;
for(const p of passages){
  const suppliedEnglish=p.originalLanguage==='en';
  const readingPage=suppliedEnglish?p.pdfPage:p.pdfReadingPage;
  assert.ok(Number.isInteger(readingPage)&&readingPage>=1&&readingPage<=108,'Invalid PDF reading locator');
  if(suppliedEnglish){
    assert.equal(p.original,p.en.quote,'English selection changed from recorded source wording');
    assert.equal(p.sourceFile,'How to know Higher Worlds2.pdf');
    assert.ok(p.edition.includes('2018')&&p.edition.includes('Dead Authors Society')&&p.edition.includes('translator'),'Missing identified edition or translator limitation');
    assert.ok(Number.isInteger(p.pdfColumn)&&p.pdfColumn>=1&&p.pdfColumn<=3,'Invalid screenshot column');
    assert.ok(p.locator.includes(String(p.pdfPage))&&p.verification.includes('image'),'Missing source verification or locator');
  }else{
    assert.equal(p.originalLanguage,'de');
    assert.ok(p.url.includes('/German/')&&p.locator.startsWith('§'),'Preserve the original German quotation source');
    assert.ok(p.edition.includes('Original German')&&p.edition.includes('study translations')&&p.edition.includes('Related discussion'),'Distinguish translated passages from their English PDF context');
    assert.ok(!Object.hasOwn(p,'pdfPage')&&!Object.hasOwn(p,'sourceFile'),'Do not misattribute German passages to the English PDF');
  }
  assert.ok(!Object.hasOwn(p,'printedPage'),'Do not infer invisible printed folios');
  const lesson=higherWorlds.find(l=>l.id===p.ids[0]);
  const ranges=[...lesson.pages.matchAll(/\b(\d+)(?:[–-](\d+))?/g)].map(m=>[Number(m[1]),Number(m[2]||m[1])]);
  assert.ok(ranges.some(([first,last])=>readingPage>=first&&readingPage<=last),'The selection or corresponding discussion falls outside its wider reading assignment');
  for(const lang of ['en','pt']){
    const file=path.join(lang==='en'?'docs':'docs/pt','higher-worlds/lessons',String(lesson.id).padStart(2,'0')+'.html');
    const html=fs.readFileSync(file,'utf8'),visible=plain(html);
    const excerpt=html.match(/<blockquote class="source-excerpt">([\s\S]*?)<\/blockquote>/);
    assert.ok(excerpt,`${file} missing book passage`);
    assert.equal(plain(excerpt[1]),p[lang].quote.replace(/\s+/g,' ').trim(),`${file} selection differs from reviewed source`);
    assert.ok(visible.includes(p.locator),`${file} lost source location`);
    for(const text of [lesson[lang][0],lesson[lang][1],...lesson[lang][2],lesson[lang][5]])assert.ok(visible.includes(text.replace(/\s+/g,' ').trim()),`${file} lost revised lesson content`);
    assert.ok(!/107-page transcription|transcrição de 107 páginas/.test(visible),`${file} retains obsolete main source credit`);
    assert.equal((html.match(/<link\b[^>]*href="[^">]*passage-study\.css"[^>]*>/g)||[]).length,1,`${file} duplicates stylesheet`);
    checked++;
  }
}
for(const lang of ['en','pt']){
  const base=lang==='en'?'docs':'docs/pt';
  const index=plain(fs.readFileSync(`${base}/higher-worlds/index.html`,'utf8'));
  assert.ok(index.includes('108')&&index.includes('2018')&&index.includes('Dead Authors Society'),'Course index lacks the current source');
  for(const id of [2,17,19,20]){
    const html=plain(fs.readFileSync(`${base}/lessons/${String(id).padStart(2,'0')}.html`,'utf8'));
    assert.ok(html.includes(higherWorldsConnections[id].pages),'Theosophy supplement lost current GA 10 locator');
    assert.ok(!/107-page transcription|transcrição de 107 páginas/.test(html),'Theosophy supplement has obsolete source credit');
  }
}
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
assert.ok(registry.some(s=>s.sha256==='c07bf68bdf7c99135b17a0e9bf1173cbd3a7a6a99da01ddab6b1172a57313238'&&s.pdf_pages===108&&s.contents_in_repository===false),'Primary PDF provenance missing');
assert.ok(registry.some(s=>s.sha256==='24bc2070f4cb9ef8557cb1a4f2345a1f1085b7d8a09228dd43bbee0a069d6c2c'&&s.use.startsWith('Excluded')),'Mislabelled alternate PDF must remain excluded');
assert.ok(registry.some(s=>s.sha256==='a2d5c1a64f2c654b08e784181f4f3c02f6185db704098ca2d51d767c9172670d'&&s.upload_count===2),'Duplicate Markdown diagnosis missing');
console.log(`Passed: 108 page records, nineteen source selections, ${checked} bilingual lessons, current PDF credits and four updated Theosophy connections.`);
