import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {openingTemperamentTeaching,temperamentPortraitOverview,temperamentSourceOverview} from '../content/temperament-refinement.mjs';
import {temperamentComparativeChecks,temperamentFinalComparison} from '../content/temperament-comparison-practice.mjs';
import {temperamentTeaching} from '../content/temperament-teaching.mjs';
import {temperamentCourse} from '../content/temperament-course.mjs';
import {wholeElement} from './learning-html.mjs';

const text=html=>html.replace(/<[^>]*>/g,' ').replace(/&#39;|&apos;/g,"'").replaceAll('&quot;','"').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
const version=createHash('sha256').update(fs.readFileSync('docs/guided-study.v1.js')).digest('hex').slice(0,12);
for(const [file,hash] of Object.entries({
 'content/passage-study.json':'f63c5c1d21c2a81f20ed4b93054aa0ddb9390890699fc2e035fd14c24364570f',
 'content/learning-book-checks.json':'37c3c7d96d754717713ba4ce67d1cdb5a6a4cca37f39bd6143820023d167df22'
}))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,'Historical source/question banks remain unchanged');

let pages=0;
for(const lang of ['en','pt']){
 const base=lang==='pt'?'docs/pt':'docs';
 assert.equal(temperamentCourse.length,12);
 for(const lesson of temperamentCourse){
  const file=`${base}/understanding-temperaments/lessons/${String(lesson.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8');
  assert.ok(html.includes(`data-study-id="understanding-temperaments/${String(lesson.id).padStart(2,'0')}"`),file+' retains notebook identity');
  assert.ok(html.includes('temperament-study.css'),file+' scoped stylesheet');
  assert.ok(html.includes(`guided-study.v1.js?v=${version}`),file+' loads the current notebook controller');
  assert.equal((html.match(/data-note-field=/g)||[]).length,6);
  const core=wholeElement(html,'<section class="temperament-teaching"');
  assert.ok(core,file+' core teaching');
  if(lesson.id<2){
   const concise=openingTemperamentTeaching[lesson.id][lang];
   assert.equal(concise.length,3);
   assert.equal((core.match(/class="temperament-concept"/g)||[]).length,3);
   for(const [title] of concise)assert.ok(text(core).includes(title),file+' concise concept');
   const wordCount=concise.flatMap(row=>row.slice(1)).join(' ').split(/\s+/).length;
   assert.ok(wordCount>=250&&wordCount<=380,file+' bounded opening explanation');
   const deeper=wholeElement(html,'<details class="guided-deep-study temperament-details"');
   assert.ok(deeper&&!/^<details[^>]*\bopen\b/.test(deeper),'Full source teaching is available on demand');
   for(const [title] of temperamentTeaching[lesson.id][lang])assert.ok(text(deeper).includes(title),file+' retains source detail '+title);
   const map=lesson.id===0?temperamentSourceOverview[lang]:temperamentPortraitOverview[lang];
   const id=lesson.id===0?'temperament-source-comparison':'temperament-portrait-comparison';
   const chart=wholeElement(core,`<section class="temperament-overview" id="${id}"`);
   assert.ok(chart&&chart.includes('role="region"')&&chart.includes('tabindex="0"'),'Keyboard-accessible comparison');
   assert.equal(map.rows.length,lesson.id===0?3:4);
   assert.equal((chart.match(/<th scope="row">/g)||[]).length,map.rows.length);
   for(const row of map.rows){assert.equal(row.length,map.headers.length);for(const cell of row)assert.ok(text(chart).includes(cell),'Complete bilingual chart cell');}
   assert.ok(text(chart).includes(map.source),'Attributed chart');
  }
  if(temperamentComparativeChecks[lesson.id]){
   const value=temperamentComparativeChecks[lesson.id][lang];
   const check=wholeElement(html,`<section class="temperament-comparison-check" data-temperament-comparison-check="${lesson.id}"`);
   assert.ok(check&&check.includes(`data-answer="${value.answer}"`));
   assert.equal(value.options.length,3);
   assert.ok(value.answer>=0&&value.answer<3);
   for(const part of [value.question,value.explanation,value.source,...value.options])assert.ok(text(check).includes(part),'Comparison question/explanation/source survives rendering');
   assert.ok(check.includes('<details'),'Comparison explanation works without JavaScript');
  }
  if(lesson.id===11){
   const value=temperamentFinalComparison[lang],model=wholeElement(html,'<section class="temperament-final-model"');
   assert.ok(model&&value.paragraphs.length>=4);
   for(const paragraph of value.paragraphs)assert.ok(text(model).includes(paragraph),'Final comparison is complete');
   for(const source of value.sources)assert.ok(model.includes(`href="${source.href}"`),'Final model source link');
   assert.ok(text(model).includes('Steiner')&&text(model).includes('Childs'),'Final assignment demonstrates two-source comparison');
  }
  pages++;
 }
}
console.log(`Passed: ${pages} temperament pages, concise bilingual openings, preserved deeper sources and notebooks, two attributed comparison charts, comparative checks and complete final model; source/question banks unchanged.`);
