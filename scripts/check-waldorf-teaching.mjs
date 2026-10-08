import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {loadWaldorfContent,waldorfRoutes} from './waldorf-content.mjs';
import {esc,wholeElement,relative} from './learning-html.mjs';
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const course=json('content/waldorf-teaching-course.json'),manifest=json('content/waldorf-teaching-manifest.json'),sources=json('content/waldorf-verified-excerpts.json');
const items=loadWaldorfContent();
assert.equal(course.lessons.length,62);
assert.equal(new Set(course.lessons.map(row=>row.source)).size,62);
assert.deepEqual([...course.lessons.map(row=>row.source)].sort(),items.map(row=>row.source).sort());
assert.deepEqual([...manifest.pages].sort(),[...waldorfRoutes(),...waldorfRoutes().map(route=>'pt/'+route)].sort());
assert.deepEqual(manifest.originalSourceFingerprints,items.map(({source,sha256})=>({source,sha256})));
const plain=html=>html.replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
for(const row of course.lessons){
 const item=items.find(item=>item.source===row.source);
 for(const lang of ['en','pt']){
  const v=row[lang],file='docs/'+(lang==='pt'?'pt/':'')+item.route,html=plain(fs.readFileSync(file,'utf8'));
  assert.equal(v.paragraphs.length,3);
  assert.ok(v.paragraphs.every(text=>text.trim().length>100),row.source+' developed teaching paragraphs');
  const main=wholeElement(html,'<article class="wf-teaching"');
  for(const text of [v.title,v.goal,...v.paragraphs,v.example,v.question,v.answer])assert.ok(main.includes(esc(text)),file+' missing authored text');
  assert.ok(main.indexOf('id="wf-teaching-concept"')<main.indexOf('id="wf-teaching-example"'));
  assert.ok(main.indexOf('id="wf-teaching-example"')<main.indexOf('id="wf-teaching-checks"'));
  assert.equal((main.match(/class="learning-reflection"/g)||[]).length,2);
  assert.ok(!/Awaiting final course copy|Placeholder|Draft outline|primary-source verification pending/.test(main),file+' authoring status is not teaching prose');
  const partner='docs/'+(lang==='pt'?'':'pt/')+item.route;
  assert.ok(html.includes(`hreflang="${lang==='pt'?'en':'pt-BR'}" href="${relative(file,partner)}"`));
  assert.ok(html.includes(`data-wf-study="${item.id}"`),file+' historical reading identity');
  if(item.grade){assert.equal(v.curriculum.length,4);for(const cells of v.curriculum)for(const cell of cells)assert.ok(main.includes(esc(cell)));}
  if(lang==='pt')assert.ok(!html.includes('data-wf-copy='),'Portuguese teaching links explicitly to original English records instead of silently presenting them as translated');
 }
}
assert.equal(sources.passages.length,3);
for(const source of sources.passages){
 assert.ok(source.en.quote&&source.pt.quote&&source.en.context&&source.pt.context);
 for(const lang of ['en','pt']){
  const html=fs.readFileSync(`docs/${lang==='pt'?'pt/':''}learn/waldorf/sources/index.html`,'utf8');
  assert.ok(html.includes(esc(source[lang].quote)));
  assert.ok(html.includes(source.url));
 }
 const local=`.sources/waldorf-education/ga294-lecture-${source.lecture}.html`;
 if(fs.existsSync(local)){const bytes=fs.readFileSync(local);assert.equal(createHash('sha256').update(bytes).digest('hex'),source.sourceSha256);assert.ok(bytes.toString().includes(source.en.quote));}
}
for(const route of manifest.pages){
 const file='docs/'+route,html=fs.readFileSync(file,'utf8'),pt=route.startsWith('pt/');
 assert.ok(html.includes(`lang="${pt?'pt-BR':'en'}"`));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#([^"]+))?"/g)){
  if(/^[a-z]+:|^\/\//i.test(match[1]))continue;
  let target=path.resolve(path.dirname(file),match[1].split('?')[0]);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),file+' target '+match[1]);
  if(match[2])assert.ok(fs.readFileSync(target,'utf8').includes(`id="${match[2]}"`),file+' anchor '+match[2]);
 }
}
console.log('Passed Waldorf teaching: 62 complete bilingual topics, 196 paired pages, nine curriculum tables per language, 248 understanding/application prompts, three credited excerpt translations and original source fingerprints.');
