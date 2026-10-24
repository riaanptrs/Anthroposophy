import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {wholeElement,esc} from './learning-html.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const rows=read('content/agriculture-clear-lessons.json').filter(r=>r.course==='what-is-biodynamics');
const images=read('content/what-is-biodynamics-illustrations.json');
assert.equal(rows.length,14);assert.equal(images.source.pages,139);assert.equal(images.figures.length,7);
const used=rows.flatMap(r=>[...(r.biodynamicsFigures||[]).map(f=>f.id),...(r.biodynamicsFurtherFigures||[])]);
assert.deepEqual([...used].sort(),images.figures.map(f=>f.id).sort(),'Each source figure has one purposeful placement');
for(const f of images.figures){
 const bytes=fs.readFileSync('docs/'+f.file);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256,'Exact extracted image '+f.id);
 assert.equal(bytes.length,f.bytes);assert.equal(bytes.readUInt32BE(16),f.width);assert.equal(bytes.readUInt32BE(20),f.height);
 assert.equal(f.captionPdfPage,f.pdfPage+1);
 for(const lang of ['en','pt']){assert.ok(f[lang].alt.length>40);assert.equal(f[lang].steps.length,3);assert.ok(f[lang==='pt'?'creditPt':'creditEn'].includes('Courtney'));}
}
for(const r of rows)for(const lang of ['en','pt']){
 const file=`docs/${lang==='pt'?'pt/':''}what-is-biodynamics/lessons/${String(r.id).padStart(2,'0')}.html`;
 const html=fs.readFileSync(file,'utf8'),first=wholeElement(html,'<section class="batch-first-reading"'),v=r[lang];
 const clean=first.replace(/<a\b[^>]*>|<\/a>/g,'');
 assert.equal(v.paragraphs.length,6);assert.equal(v.paragraphHeadings.length,6);assert.equal(v.workedExample.steps.length,3);assert.equal(v.checks.length,2);
 for(const s of [v.goal,...v.paragraphHeadings,v.workedExample.title,...v.workedExample.steps])assert.ok(clean.includes(esc(s)),file+' complete beginner teaching');
 assert.ok(html.includes('biodynamics-illustrations.css'));
 for(const id of [...(r.biodynamicsFigures||[]).map(f=>f.id),...(r.biodynamicsFurtherFigures||[])]){
  const f=images.figures.find(f=>f.id===id);assert.ok(first.includes(`data-biodynamics-figure="${id}"`));
  for(const s of [f[lang].alt,...f[lang].steps,f[lang==='pt'?'creditPt':'creditEn']])assert.ok(clean.includes(esc(s)),file+' complete image context '+id);
 }
}
console.log('Passed: 14 bilingual beginner readings with visible goals, six explained steps, worked examples and questions; seven exact source images with bilingual guides and separate 139-page provenance.');
