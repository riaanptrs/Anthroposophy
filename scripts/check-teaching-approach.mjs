import fs from 'node:fs';
import assert from 'node:assert/strict';
import {esc,wholeElement} from './learning-html.mjs';
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const development=json('content/foundations-concept-development.json');
assert.deepEqual(development.lessons.map(row=>row.id),Array.from({length:36},(_,i)=>i+1));
for(const row of development.lessons)for(const lang of ['en','pt']){
 const html=fs.readFileSync(`docs/${lang==='pt'?'pt/':''}learn/lessons/${String(row.id).padStart(2,'0')}.html`,'utf8').replace(/<a class="constitution-ref"[^>]*>([^<]*)<\/a>/g,'$1');
 assert.equal(row[lang].stages.length,3);
 for(const stage of row[lang].stages){assert.ok(stage.text.length>120);assert.ok(html.includes(esc(stage.title)));assert.ok(html.includes(esc(stage.text)));}
 assert.ok(html.includes(esc(row[lang].transfer.question)),'Applied concept question must be rendered');
 assert.ok(html.includes(esc(row[lang].transfer.explanation)),'A model explanation must be available');
 assert.ok(html.indexOf('class="learning-development"')<html.indexOf('class="learning-checks"'));
}
const report=json('content/course-teaching-review.json');
assert.ok(report.pages.length>=700);
for(const page of report.pages){
 const html=fs.readFileSync('docs/'+page.path,'utf8');
 assert.ok(html.includes('data-teaching-approach="concept-first"'));
 const sourceDetails=[...html.matchAll(/<details class="course-source-study" data-optional-source>/g)];
 assert.equal(sourceDetails.length,page.includedExcerptSections+page.referenceOnlySections,page.path+' coverage');
 for(const match of sourceDetails){
  const block=wholeElement(html.slice(match.index),match[0]);
  assert.ok(!/^<details[^>]*\bopen\b/.test(block),'Source study starts closed');
  if(/excerpt included|trecho incluído/.test(block.match(/<summary>(.*?)<\/summary>/)[1]))assert.ok(block.includes('<blockquote'),'Close reading needs an actual excerpt');
 }
 if(html.includes('class="bio-proposal"')){
  assert.ok(html.indexOf('class="bio-proposal"')<html.indexOf('class="study-attempt"'));
  assert.ok(html.indexOf('class="bio-example"')<html.indexOf('class="study-attempt"'));
 }
 assert.ok(!html.includes('Read the complete assigned passage before answering.'));
 assert.ok(!html.includes('Read this identified section in the source alongside the explanation below.'));
}
const waldorf=json('content/waldorf-teaching-support.json');
assert.equal(waldorf.lessons.length,6);
const copies=fs.readdirSync('docs/learn/waldorf/foundations').filter(file=>file.endsWith('.html')).map(file=>fs.readFileSync('docs/learn/waldorf/foundations/'+file,'utf8')).join('');
for(const lesson of waldorf.lessons){assert.ok(copies.includes(esc(lesson.question)));assert.ok(copies.includes(esc(lesson.answer)));}
console.log(`Teaching approach passed: ${report.pages.length} pages; 36 bilingual lessons with three concept steps and applied checks; six Waldorf teaching supports.`);
