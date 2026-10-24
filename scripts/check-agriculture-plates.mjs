import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {agriculturePlates} from './render-agriculture-plates.mjs';
import {wholeElement,esc} from './learning-html.mjs';
const rows=JSON.parse(fs.readFileSync('content/agriculture-clear-lessons.json','utf8'));
const {source,plates}=agriculturePlates;
assert.equal(source.pdfPages,180);assert.equal(plates.length,8);
assert.deepEqual(plates.map(p=>p.pdfPage),[171,172,173,174,175,176,177,178]);
assert.equal(source.editionYear,2012);assert.match(source.transformation,/No AI redrawing/);
assert.deepEqual(plates[4].sourceContexts,['Second Discussion']);
assert.deepEqual(plates[5].sourceContexts,['Lecture 6','Third Discussion']);
assert.deepEqual(plates[7].sourceContexts,['Lecture 8','Fourth Discussion']);
const pngSignature=Buffer.from([137,80,78,71,13,10,26,10]);
for(const p of plates){
 const file='docs/'+p.file,b=fs.readFileSync(file);
 assert.ok(b.subarray(0,8).equals(pngSignature));assert.equal(b.length,p.bytes);
 assert.equal(createHash('sha256').update(b).digest('hex'),p.sha256,file+' extraction fingerprint');
 assert.equal(b.readUInt32BE(16),p.width);assert.equal(b.readUInt32BE(20),p.height);
 assert.equal(p.cropBoxPixels[2]-p.cropBoxPixels[0],p.width);assert.equal(p.cropBoxPixels[3]-p.cropBoxPixels[1],p.height);
 for(const lang of ['en','pt']){assert.ok(p[lang].alt.length>40);assert.equal(p[lang].steps.length,3);}
}
let pages=0,placements=0;
for(const row of rows.filter(r=>['agriculture','biodynamics'].includes(r.course))){
 for(const lang of ['en','pt']){
  const file=`docs/${lang==='pt'?'pt/':''}${row.course}/lessons/${String(row.id).padStart(2,'0')}.html`,html=fs.readFileSync(file,'utf8');
  const first=wholeElement(html,'<section class="batch-first-reading"');
  assert.equal((first.match(/class="clarity-activity"/g)||[]).length,1,file+' worked activity');
  for(const value of Object.values(row[lang].activity))assert.ok(first.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(value)),file+' activity wording');
  for(const image of row.sourcePlates||[]){
   const p=plates.find(p=>p.id===image.id);assert.ok(p);
   const fig=wholeElement(first,`<figure class="agriculture-source-plate" data-source-plate="${p.id}"`);
   assert.ok(fig,file+' correct plate');assert.ok(fig.includes(esc(p[lang].alt)));
   assert.ok(fig.includes('How to read the plate')||fig.includes('Como ler a prancha'));
   const src=fig.match(/<img src="([^"]+)"/)[1];assert.equal(path.resolve(path.dirname(file),src),path.resolve('docs/'+p.file));placements++;
  }
  pages++;
 }
}
assert.equal(pages,84);assert.equal(placements,32);
// The anthology is a separate book and retains its original first readings.
const before=process.argv.indexOf('--before');
if(before>=0){const old=JSON.parse(fs.readFileSync(process.argv[before+1]));assert.deepEqual(rows.filter(r=>r.course==='what-is-biodynamics'),old.filter(r=>r.course==='what-is-biodynamics'));}
console.log(`Agriculture visuals passed: eight fingerprinted source extracts; ${placements} bilingual placements; ${pages} lessons with complete worked activities.`);
