import {withPortugueseSourceLabels} from './portuguese-source-labels.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {freedomCore,freedomPractice,freedomConsolidated as lessons,freedomReadingSpans} from '../content/philosophy-of-freedom-consolidated.mjs';

assert.deepEqual(lessons.map(l=>l.id),Array.from({length:22},(_,id)=>id),'Preserve all existing course and notebook identities');
assert.deepEqual(freedomCore.map(id=>lessons.find(l=>l.id===id).chapter),Array.from({length:16},(_,chapter)=>chapter),'Keep the complete book sequence');
for(const [id,parent] of Object.entries(freedomPractice))assert.equal(lessons.find(l=>l.id===Number(id)).chapter,lessons.find(l=>l.id===parent).chapter,'Optional practice must stay with its chapter');
for(const l of lessons)for(const lang of ['en','pt']){
  const v=l[lang];
  assert.ok(v.paragraphs.length>=(freedomCore.includes(l.id)?7:5),`Missing chapter teaching ${l.id}/${lang}`);
  assert.ok(v.paragraphs.every(p=>typeof p==='string'&&p.trim()));
  assert.equal(v.checks.length,3,'Retain three explained comprehension questions');
  assert.ok(v.activity.trim()&&v.reading.includes('PDF')&&typeof v.terms==='string'&&v.terms.trim(),'Missing source, activity or terminology');
  assert.ok(!/Basis\s+\d|147-page|147 páginas/.test(v.reading),'Do not retain obsolete main reading references');
}

const ledgers=[
  ['front-and-appendix',[...Array.from({length:24},(_,i)=>i+1),...Array.from({length:12},(_,i)=>i+155)]],
  ['chapters1-4',Array.from({length:35},(_,i)=>i+25)],
  ['chapters5-9',Array.from({length:49},(_,i)=>i+60)],
  ['chapters10-14',Array.from({length:46},(_,i)=>i+109)]
];
const reviewed=[];
for(const [suffix,expected] of ledgers){
  const text=fs.readFileSync(`content/philosophy-of-freedom-page-notes-${suffix}.md`,'utf8');
  let inTable=false;const pages=[];
  for(const line of text.split('\n')){
    if(/^\| PDF page \|/.test(line)){inTable=true;continue;}
    if(!line.startsWith('|')){inTable=false;continue;}
    const match=inTable&&line.match(/^\|\s*(\d+)\s*\|/);
    if(match)pages.push(Number(match[1]));
  }
  assert.deepEqual(pages,expected,`Missing or duplicate page records in ${suffix}`);
  reviewed.push(...pages);
}
assert.deepEqual(reviewed.sort((a,b)=>a-b),Array.from({length:166},(_,i)=>i+1),'Every PDF page needs an individual review record');

const passages=withPortugueseSourceLabels(JSON.parse(fs.readFileSync('content/passage-study.json','utf8'))).filter(p=>p.course==='philosophy-of-freedom');
assert.equal(passages.length,16,'Keep one chapter selection per core step with optional reuse');
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),Array.from({length:22},(_,id)=>id));
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({'amp':'&','lt':'<','gt':'>','quot':'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
const withoutMarkup=s=>s.replaceAll('**','').replace(/\s+/g,' ').trim();
let checked=0;
for(const p of passages){
  assert.equal(p.originalLanguage,'en');
  assert.equal(p.original,p.en.quote);
  assert.equal(p.sourceFile,'The philosophy of freedom 3rd edition.pdf');
  assert.ok(p.edition.includes('Wilson')&&p.edition.includes('2012')&&p.edition.includes('eighth'),'Identify the actual quoted edition');
  assert.ok(Number.isInteger(p.pdfPage)&&p.pdfPage>=1&&p.pdfPage<=162,'Invalid book quotation locator');
  assert.ok(Number.isInteger(p.pdfColumn)&&p.pdfColumn>=1&&p.pdfColumn<=3);
  assert.ok(p.verification.includes('image')&&p.locator.includes(String(p.pdfPage)));
  assert.ok(!Object.hasOwn(p,'printedPage'),'Do not invent printed folios');
  for(const id of p.ids){
    const lesson=lessons.find(l=>l.id===id);
    const ranges=[...freedomReadingSpans[lesson.chapter].matchAll(/(\d+)(?:[–-](\d+))?/g)].map(m=>[Number(m[1]),Number(m[2]||m[1])]);
    assert.ok(ranges.some(([first,last])=>p.pdfPage>=first&&p.pdfPage<=last),'Passage is outside its chapter reading');
    for(const lang of ['en','pt']){
      const file=`${lang==='en'?'docs':'docs/pt'}/philosophy-of-freedom/lessons/${String(id).padStart(2,'0')}.html`;
      const html=fs.readFileSync(file,'utf8'),visible=plain(html);
      const excerpt=html.match(/<blockquote class="source-excerpt">([\s\S]*?)<\/blockquote>/);
      assert.ok(excerpt,`${file} missing passage`);
      assert.equal(plain(excerpt[1]),p[lang].quote.replace(/\s+/g,' ').trim());
      assert.ok(visible.includes(lang==='pt'?p.locatorPt:p.locator)&&visible.includes(freedomReadingSpans[lesson.chapter]),`${file} missing current source location`);
      for(const text of [...lesson[lang].paragraphs,lesson[lang].activity])assert.ok(visible.includes(withoutMarkup(text)),`${file} lost revised chapter teaching or activity`);
      assert.ok(!/147-page|147 páginas|Basis\s+\d/.test(visible),`${file} retains old main reference`);
      assert.equal((html.match(/<link\b[^>]*href="[^">]*passage-study\.css"[^>]*>/g)||[]).length,1,'Duplicate source stylesheet');
      checked++;
    }
  }
}
for(const prefix of ['docs','docs/pt']){
  const index=plain(fs.readFileSync(`${prefix}/philosophy-of-freedom/index.html`,'utf8'));
  assert.ok(index.includes('166')&&index.includes('2012')&&index.includes('Wilson')&&index.includes('Barton'),'Missing current edition or editorial voice');
  const thinking=plain(fs.readFileSync(`${prefix}/philosophy-of-freedom/lessons/04.html`,'utf8'));
  assert.ok(thinking.includes('((3 × 3) + 1) ÷ 2'),'Lost the supported arithmetic study');
  const moral=fs.readFileSync(`${prefix}/philosophy-of-freedom/lessons/16.html`,'utf8');
  assert.ok(moral.includes('data-study-id="philosophy-of-freedom/16"'),'Lost the accessibility study notebook');
}
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const sha of ['2ab71f61fac26589da4bad23139310ff7ffc735e15122e4247ee41551faaa3ff','1e652430e172ddce7a314f4ec76d007a7851f0cc47830abd3a8bdc4b191c6e8c'])assert.ok(registry.some(s=>s.sha256===sha&&s.pdf_pages===166&&s.contents_in_repository===false),'Missing uploaded source provenance');
console.log(`Passed: 166 page records, fourteen chapters and appendix, sixteen Wilson source selections, ${checked} bilingual lesson pages and preserved study identities.`);
