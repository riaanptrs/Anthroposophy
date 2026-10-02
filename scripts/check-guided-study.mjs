import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {guidedCounts} from '../content/guided-prompts.mjs';
import {mysteryLessons} from '../content/mystery-temperaments.mjs';
import {isIntroductionOwned} from './link-constitution.mjs';
import {isPracticalThinkingOwned} from './practical-thinking-owned.mjs';
import {isBiodynamicOwned} from './biodynamic-owned.mjs';
const catalogue=JSON.parse(fs.readFileSync('content/learning-system-catalogue.json','utf8'));
const docsOption=process.argv.indexOf('--docs-dir');
if(docsOption>=0&&!process.argv[docsOption+1])throw new Error('--docs-dir requires a docs directory.');
const root=path.resolve(docsOption>=0?process.argv[docsOption+1]:'docs');
// New source readings use the shared learning controls, not the retained notebook format.
const files=fs.readdirSync(root,{recursive:true}).filter(f=>/lessons[\\/]\d{2}\.html$/.test(f)&&!/(?:^|[\\/])(?:learn|what-is-biodynamics|toward-threefold-society|agriculture)[\\/]/.test(f)&&!/^(?:pt[\\/])?lessons[\\/]\d{2}\.html$/.test(f)&&!isIntroductionOwned(f,fs.readFileSync(path.join(root,f),'utf8'))&&!isPracticalThinkingOwned(f,fs.readFileSync(path.join(root,f),'utf8'))&&!isBiodynamicOwned(f,fs.readFileSync(path.join(root,f),'utf8')));
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
for(const prefix of ['', 'pt/']){
 const p=path.join(root,prefix,'books/index.html');
 const html=fs.readFileSync(p,'utf8');
 const index=prefix+'biodynamics/index.html',nativeFile=path.join(root,index);
 const integrated=fs.existsSync(nativeFile)&&isBiodynamicOwned(index,fs.readFileSync(nativeFile,'utf8'));
 const primaryCourses=catalogue.courses.filter(c=>!companionRoutes.has(c.route)&&(!integrated||!biodynamicCompanions.has(c.route)));
 assert.equal((html.match(/class="course-card"/g)||[]).length,primaryCourses.length+(integrated?1:0),p);
 for(const course of primaryCourses)assert.equal((html.match(new RegExp(`href="\\.\\./${course.route}/index\\.html"`,'g'))||[]).length,1,p+' primary card '+course.route);
 if(integrated){
  assert.equal((html.match(/<!-- biodynamic-course-card:start -->/g)||[]).length,1,p+' native Biodynamic primary card');
  assert.equal((html.match(/href="\.\.\/biodynamics\/index\.html"/g)||[]).length,1,p+' native Biodynamic route');
  const companions=html.match(/<section id="biodynamic-source-companions">[\s\S]*?<\/section>/)?.[0];
  assert.ok(companions,p+' optional agricultural companions section');
  for(const route of biodynamicCompanions){
   assert.equal((companions.match(new RegExp(`href="\\.\\./${route}/index\\.html"`,'g'))||[]).length,1,p+' retained companion '+route);
   assert.ok(!new RegExp(`<a class="course-card" href="\\.\\./${route}/index\\.html"`).test(html),p+' companion still primary '+route);
  }
 }
}
for(const [file,lab] of [['philosophy-of-freedom/lessons/04.html','arithmetic'],['colour/lessons/02.html','colour'],['encountering-the-self/lessons/03.html','dialogue'],['encountering-the-self/lessons/15.html','reflection'],['according-to-luke/lessons/07.html','map']])for(const prefix of ['', 'pt/'])assert.ok(fs.readFileSync(path.join(root,prefix,file),'utf8').includes(`data-lab="${lab}"`),prefix+file);
console.log('Passed: 143 retained bilingual notebook pairs, primary course/source-companion cards, guided sequence, note controls, lab coverage and static fallback. Explicitly owned Theosophy, Practical Thinking and Biodynamic Agriculture pages have separate checks.');
