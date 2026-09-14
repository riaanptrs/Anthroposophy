import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {linkTerms,targetFor} from './link-constitution.mjs';
const strip=h=>h.replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
const fixture='<html><head><title>Astral body</title></head><body><p title="etheric body">Physical body, astral body, etheric body; astral body again.</p><a href="source.html">astral body</a><textarea>etheric body</textarea><script>if (a < b) { text = "astral body"; }</script><svg><text>physical body</text></svg><!-- astral body --></body></html>';
const result=linkTerms(fixture,'reference/human-constitution.html');
assert.equal(result.count,4);
assert.equal(strip(result.html),fixture,'Linking must preserve wording and attributes');
assert.equal(linkTerms(result.html,'reference/human-constitution.html').html,result.html,'Linking must be idempotent');
assert.equal(linkTerms('<body><p>Corpo físico, corpo etérico, corpo astral, corpo vital, corpos astrais.</p></body>','ref').count,5);
for(const [term,target] of [['mineral world','mineral-world'],['plant kingdom','plant-world'],['animal world','animal-world'],['reino mineral','mineral-world'],['mundo vegetal','plant-world'],['reino dos animais','animal-world']]){
 assert.equal(targetFor(term),target);
 assert.equal(linkTerms(`<body><p>${term}</p></body>`,'ref').html,`<body><p><a class="constitution-ref" href="ref#${target}">${term}</a></p></body>`);
}
let links=0,pages=0;
for(const rel of fs.readdirSync('docs',{recursive:true}).filter(f=>f.endsWith('.html'))){
 const file=path.join('docs',rel),h=fs.readFileSync(file,'utf8');
 if(rel.replaceAll('\\','/').includes('reference/human-constitution.html')){
  for(const id of ['physical-body','etheric-body','astral-body','i','terminology','sleep','sources','natural-worlds','mineral-world','plant-world','animal-world'])assert.ok(h.includes(`id="${id}"`),file+' missing '+id);
  assert.equal((h.match(/<svg\b/g)||[]).length,2);
  assert.equal((h.match(/<details>/g)||[]).length,11);
  for(const id of ['mineral-world','plant-world','animal-world'])assert.ok(h.includes(`href="human-constitution.html#${id}"`));
  assert.ok(h.includes('GA013_c02.html')&&h.includes('GA009_c01.html'));
  continue;
 }
 if(rel==='learning-review.html')continue;
 assert.equal(linkTerms(h,'unused').count,0,file+' has unlinked terminology');
 const refs=[...h.matchAll(/<a class="constitution-ref" href="([^"]+)"/g)];
 if(refs.length)pages++;
 for(const [,href] of refs){
  const [url,id]=href.split('#');const target=path.resolve(path.dirname(file),url);
  const pt=h.includes('<html lang="pt-BR"');
  assert.equal(target,path.resolve(pt?'docs/pt/reference/human-constitution.html':'docs/reference/human-constitution.html'));
  assert.ok(fs.readFileSync(target,'utf8').includes(`id="${id}"`));links++;
 }
 assert.ok(!/<a\b[^>]*>[^<]*<a\b/.test(h),'Nested anchors: '+file);
}
assert.ok(links>200&&pages>40,'Expected course-wide coverage');
for(const base of ['docs','docs/pt'])for(const suffix of ['index.html','lessons/00.html','lessons/03.html','lessons/06.html'])assert.ok(fs.readFileSync(`${base}/${suffix}`,'utf8').includes('class="constitution-entry"'));
console.log(`Passed: ${links} terminology links on ${pages} pages; bilingual targets, anchors, teaching diagrams, text preservation and idempotence.`);
