import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {lessons,title} from '../content/bees/course.mjs';
import {sections} from '../content/bees/reference.mjs';
const map=JSON.parse(fs.readFileSync('content/bees/source-map.json','utf8'));
assert.equal(lessons.length,23);
assert.deepEqual(map.pages.map(p=>p.capture),Array.from({length:119},(_,i)=>i+1),'Every supplied capture appears exactly once');
for(let i=1;i<=8;i++)assert.ok(lessons.some(l=>l.section===`lecture-${i}`),'Every main lecture has teaching');
for(const section of sections)assert.equal(section.ideasEn.length,section.ideasPt.length);
const seenTitles=new Set();
for(const l of lessons){assert.ok(l.start>=1&&l.end<=119&&l.end>=l.start);for(const lang of ['en','pt']){
 const v=l[lang];assert.ok(!seenTitles.has(v.title),'Distinct lesson titles');seenTitles.add(v.title);
 assert.ok(v.teaching.length>=2&&v.teaching.join(' ').length>450,'Substantive explanation before assessment');
 assert.equal(v.check.options.length,3);assert.equal(v.check.feedback.length,3);assert.ok(v.check.answer>=0&&v.check.answer<3);
 assert.ok(v.example&&v.exercise&&v.context);
}}
const manifest=['index.html','chapters.html','sources.html','glossary.html','print.html',...lessons.map(l=>`lessons/${String(l.id).padStart(2,'0')}.html`)];
const docs=path.resolve('docs');
let pages=0;
for(const lang of ['en','pt'])for(const route of manifest){
 const file=path.resolve(`docs/${lang==='pt'?'pt/':''}learn/bees/${route}`),html=fs.readFileSync(file,'utf8');pages++;
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+' has one main title');
 assert.ok(html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Unique anchors '+file);
 assert.ok(html.includes('data-platform-nav'),'Shared navigation '+file);
 assert.ok(html.includes('visual-identity.css'),'Shared visual identity '+file);
 assert.ok(html.includes('id="cw-data"'),'Course workspace '+file);
 assert.ok(!/sediment:\/\/|\/workspace\/attachments\/|file_000000/.test(html),'No private upload pointers');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1];if(/^(?:https?:|data:|mailto:)/.test(url))continue;
  const [resource,anchor]=url.split('#');const target=resource?path.resolve(path.dirname(file),resource.split('?')[0]):file;
  assert.ok(target.startsWith(docs+path.sep),'Resource remains inside docs');assert.ok(fs.existsSync(target),'Existing resource '+url);
  if(anchor)assert.ok(fs.readFileSync(target,'utf8').includes(`id="${anchor}"`),'Existing anchor '+url);
 }
 const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);assert.ok(alternate);
 const expected=path.resolve(`docs/${lang==='pt'?'':'pt/'}learn/bees/${route}`);assert.equal(path.resolve(path.dirname(file),alternate[1]),expected);
 if(route.startsWith('lessons/')){
  const id=Number(path.basename(route,'.html')),l=lessons[id-1];
  assert.ok(html.indexOf('bees-teaching')<html.indexOf('bees-quiz'),'Teaching precedes assessment');
  const q=JSON.parse(html.match(/<script type="application\/json" data-bees-answer>(.*?)<\/script>/s)[1]);assert.deepEqual(q,l[lang].check);
  assert.ok(html.includes('<details class="answer-explanation">'),'Native no-JavaScript feedback');
 }
}
for(const lang of ['en','pt']){
 const prefix=lang==='pt'?'docs/pt/':'docs/';const html=fs.readFileSync(prefix+'learn/bees/sources.html','utf8');
 for(let i=1;i<=119;i++)assert.ok(html.includes(`id="capture-${i}"`));
 assert.ok(fs.readFileSync(prefix+'learn/index.html','utf8').includes('bees/index.html'),'Discoverable in Learn');
 assert.ok(fs.readFileSync(prefix+'read/index.html','utf8').includes('bees/index.html'),'Discoverable in Read Steiner');
 assert.ok(fs.readFileSync(prefix+'learn/bees/bees-study-guide.md','utf8').includes(title[lang]));
}
console.log(`Bees checks passed: ${pages} bilingual pages, 23 lessons, eight main lectures, 119 captures, explained questions, partner links, shared workspace, public/private source boundary.`);
