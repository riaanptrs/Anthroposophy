import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {guidedCounts} from '../content/guided-prompts.mjs';
import {mysteryLessons} from '../content/mystery-temperaments.mjs';
import {isIntroductionOwned} from './link-constitution.mjs';
import {isPracticalThinkingOwned} from './practical-thinking-owned.mjs';
import {isBiodynamicOwned} from './biodynamic-owned.mjs';
import {esc,wholeElement} from './learning-html.mjs';
import {platformNav,platformSupportNav,platformArea,platformSite} from './platform-architecture.mjs';
import {isConceptPlatformOwned} from './concept-platform-owned.mjs';
const catalogue=JSON.parse(fs.readFileSync('content/learning-system-catalogue.json','utf8'));
const docsOption=process.argv.indexOf('--docs-dir');
if(docsOption>=0&&!process.argv[docsOption+1])throw new Error('--docs-dir requires a docs directory.');
const root=path.resolve(docsOption>=0?process.argv[docsOption+1]:'docs');
// New source readings use the shared learning controls, not the retained notebook format.
const htmlFiles=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
const files=htmlFiles.filter(f=>/lessons[\\/]\d{2}\.html$/.test(f)&&!/(?:^|[\\/])(?:learn|what-is-biodynamics|toward-threefold-society|agriculture|foodwise)[\\/]/.test(f)&&!/^(?:pt[\\/])?lessons[\\/]\d{2}\.html$/.test(f)&&!isIntroductionOwned(f,fs.readFileSync(path.join(root,f),'utf8'))&&!isPracticalThinkingOwned(f,fs.readFileSync(path.join(root,f),'utf8'))&&!isBiodynamicOwned(f,fs.readFileSync(path.join(root,f),'utf8'))&&!isConceptPlatformOwned(f.split(path.sep).join('/'),fs.readFileSync(path.join(root,f),'utf8')));
assert.equal(files.length,286,'Retain every legacy notebook outside the explicitly owned, independently checked courses');
assert.equal(Object.values(guidedCounts).reduce((a,b)=>a+b,0),131);
assert.deepEqual(mysteryLessons.map(l=>l.id),Array.from({length:15},(_,i)=>i));
const counts={};
for(const f of files){
 const h=fs.readFileSync(path.join(root,f),'utf8'),id=h.match(/data-study-id="([^"]+)"/)?.[1];
 assert.ok(id,'Missing study identity: '+f);counts[id]=(counts[id]||0)+1;
 for(const field of ['first','source','after'])assert.equal((h.match(new RegExp(`data-note-field="${field}"`,'g'))||[]).length,1,f+' '+field);
 for(const control of ['save-notes','reading-view','note-status','complete','export','delete','first-preview'])assert.ok(h.includes('data-'+control),f+' '+control);
 assert.equal((h.match(/class="guided-reveal"/g)||[]).length,1,f);
 if(h.includes('data-passage-study')){
  assert.ok(h.indexOf('id="book-passage"')<h.indexOf('id="study-explanation"'),f+' passage follows explanation');
  assert.ok(h.indexOf('id="study-explanation"')<h.indexOf('data-note-field="first"'),f+' attempt precedes source teaching');
  assert.ok(h.includes('<details class="guided-reveal" open'),f+' explanation hidden at start');
 }else assert.ok(h.indexOf('data-note-field="first"')<h.indexOf('id="study-explanation"'),f+' explanation precedes attempt');
 assert.ok(h.includes('<noscript>'),f+' missing fallback');
 assert.ok(h.includes('guided-study.v1.css')&&h.includes('guided-study.v1.js'),f+' missing assets');
 assert.ok(!/C:\\Users\\|Starting in|capture-software/.test(h),f+' private capture noise');
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,f+' duplicate id');
}
assert.equal(Object.keys(counts).length,143);assert.ok(Object.values(counts).every(c=>c===2));
const companionRoutes=new Set(['temperaments','understand-temperament','mystery-temperaments']);
assert.equal(catalogue.courses.filter(c=>companionRoutes.has(c.route)).length,3,'Retained temperament source companions');
const biodynamicCompanions=new Set(['agriculture','what-is-biodynamics']);
const readingCollections=platformSite.collections.filter(collection=>collection.group!=='beginner');
assert.equal(new Set(readingCollections.map(collection=>collection.id)).size,readingCollections.length,'Unique source-bearing collection identities');
for(const course of catalogue.courses)assert.ok(readingCollections.some(collection=>collection.id===course.route),'Reading manifest lost retained collection '+course.route);
for(const prefix of ['', 'pt/']){
 const index=prefix+'biodynamics/index.html',nativeFile=path.join(root,index);
 const integrated=fs.existsSync(nativeFile)&&isBiodynamicOwned(index,fs.readFileSync(nativeFile,'utf8'));
 const lang=prefix?'pt':'en';
 for(const hub of ['books/index.html','read/index.html']){
  const p=path.join(root,prefix,hub),html=fs.readFileSync(p,'utf8'),main=wholeElement(html,'<main');
  assert.ok(main,p+' reading hub main landmark');
  let collectionLinks=0;
  for(const collection of readingCollections){
   const target=collection.readingRoute||collection.route;
   const href=path.relative(path.dirname(p),path.join(root,prefix,target)).replaceAll('\\','/');
   const count=[...main.matchAll(/<a\b[^>]*href="([^"]+)"/g)].filter(match=>match[1]===href).length;
   assert.equal(count,1,p+' retained reading entry '+collection.id);
   assert.ok(fs.existsSync(path.join(root,prefix,target)),p+' missing reading destination '+collection.id);
   assert.ok(main.includes(esc(collection[lang].credit)),p+' lost author/source credit '+collection.id);
   collectionLinks+=count;
  }
  assert.equal(collectionLinks,readingCollections.length,p+' exact source-bearing collection discovery');
  const related=wholeElement(html,'<section id="related-authors"');
  assert.ok(related,p+' related authors distinguished from Steiner');
  for(const collection of readingCollections.filter(collection=>collection.group==='related')){
   const href=path.relative(path.dirname(p),path.join(root,prefix,collection.route)).replaceAll('\\','/');
   assert.ok(related.includes('href="'+href+'"')&&related.includes(esc(collection[lang].credit)),p+' related source attribution '+collection.id);
  }
  if(integrated){
   assert.equal([...main.matchAll(/<a\b[^>]*href="([^"]+)"/g)].filter(match=>match[1]===path.relative(path.dirname(p),nativeFile).replaceAll('\\','/')).length,1,p+' native Biodynamic route');
   const companionOpening=/<([a-z][\w:-]*)\b[^>]*\bid="biodynamic-source-companions"[^>]*>/i.exec(main);
   assert.ok(companionOpening,p+' retained agricultural source-companion anchor');
   const companionContext=wholeElement(main.slice(companionOpening.index),companionOpening[0]);
   const agricultureHref=path.relative(path.dirname(p),path.join(root,prefix,'agriculture/index.html')).replaceAll('\\','/');
   assert.ok(companionContext.includes('href="'+agricultureHref+'"')&&companionContext.includes('GA 327'),p+' anchor must lead to the full GA 327 reading companion');
   for(const route of biodynamicCompanions){
    const collection=readingCollections.find(collection=>collection.id===route);
    assert.ok(collection&&main.includes(esc(collection[lang].description)),p+' explicit source companion scope '+route);
   }
  }
 }
}
// New conceptual pages have their own teaching/progress validator. Their exact
// ownership exemption still requires the same platform navigation as old pages.
for(const file of htmlFiles){
 const route=file.split(path.sep).join('/'),h=fs.readFileSync(path.join(root,file),'utf8'),lang=route.startsWith('pt/')?'pt':'en';
 assert.equal((h.match(/class="system-nav"/g)||[]).length,1,file+' one primary navigation');
 assert.equal(wholeElement(h,'<nav class="system-nav"'),platformNav('docs/'+route,lang,platformArea(route,h)),file+' exact primary navigation');
 assert.equal((h.match(/data-platform-support(?:\s|=|>)/g)||[]).length,1,file+' one supporting navigation');
 assert.equal(wholeElement(h,'<nav class="platform-support-nav"'),platformSupportNav('docs/'+route,lang),file+' exact supporting navigation');
 assert.ok(h.includes('concept-platform.css'),file+' shared navigation styles');
 if(h.includes('data-concept-platform-owned="true"'))assert.ok(isConceptPlatformOwned(route,h),file+' conceptual exemption outside the exact authored manifest');
}
for(const [file,lab] of [['philosophy-of-freedom/lessons/04.html','arithmetic'],['colour/lessons/02.html','colour'],['encountering-the-self/lessons/03.html','dialogue'],['encountering-the-self/lessons/15.html','reflection'],['according-to-luke/lessons/07.html','map']])for(const prefix of ['', 'pt/'])assert.ok(fs.readFileSync(path.join(root,prefix,file),'utf8').includes(`data-lab="${lab}"`),prefix+file);
console.log(`Passed: 143 retained bilingual notebook pairs, ${readingCollections.length} source-bearing collections and their explicit credits in both reading hubs, guided sequence, note controls, lab coverage, static fallback and exact platform navigation. Explicitly owned Theosophy, Practical Thinking, Biodynamic Agriculture and conceptual pages have separate teaching checks.`);
