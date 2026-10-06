import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {lessons} from '../content/esoteric-christianity/course.mjs';
import {checksFor} from '../content/esoteric-christianity/quizzes.mjs';
for(let i=1;i<=6;i++)await import(`../content/esoteric-christianity/module-${i}.mjs`);
assert.equal(lessons.length,24);
assert.equal(new Set(lessons.map(l=>l.id)).size,24);
for(const lang of ['en','pt']) {
 const base=`docs/${lang==='pt'?'pt/':''}learn/esoteric-christianity`,catalogue=fs.readFileSync(`docs/${lang==='pt'?'pt/':''}learn/index.html`,'utf8');
 assert.ok(catalogue.includes('esoteric-christianity/index.html'),'Learn catalogue link');
 for(let m=1;m<=6;m++)assert.equal(lessons.filter(l=>l.module===m).length,4);
 for(const l of lessons){
  const v=l[lang],file=`${base}/lessons/${l.id}.html`,html=fs.readFileSync(file,'utf8');
  assert.ok(v.objectives.length>=2&&v.objectives.length<=3);
  assert.ok(v.teaching.length>=5,`${lang}/${l.id} developed sections`);
  assert.ok(v.teaching.join(' ').split(/\s+/).length>=250,`${lang}/${l.id} teaching integrity`);
  for(const k of ['example','complication','exercise','paraphrase'])assert.ok(v[k]?.length>80,`${lang}/${l.id}/${k}`);
  for(const q of checksFor(l.number,lang)){
   assert.ok(q.question&&q.options.length===3&&q.reasons.length===3);
   assert.ok(q.reasons.every(r=>typeof r==='string'&&r.length>12),`${lang}/${l.id} choice explanations`);
   assert.ok(q.answer>=0&&q.answer<3);
  }
  assert.equal((html.match(/<fieldset/g)||[]).length,l.number===24?6:l.number===18?3:2);
  assert.ok(!/<textarea|data-note-field/.test(html),'No written response required');
  assert.ok(html.includes('hreflang=')&&html.includes(l.sources.replaceAll('&','&amp;')));
  if(l.number>1)assert.ok(html.includes(`rel="prev" href="${lessons[l.number-2].id}.html"`));
  if(l.number<24)assert.ok(html.includes(`rel="next" href="${lessons[l.number].id}.html"`));
 }
 for(const file of fs.readdirSync(base,{recursive:true}).filter(f=>f.endsWith('.html'))){
  const full=path.join(base,file),html=fs.readFileSync(full,'utf8');
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,full+' unique IDs');
  assert.ok(!/coming soon|\bTODO\b|\bTBD\b|\[TEXT UNCERTAIN\]/.test(html),full+' no visible placeholders');
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|data:)/.test(m[1]))continue;
   const [target,anchor]=m[1].split('#'),dest=path.resolve(path.dirname(full),target.split('?')[0]||path.basename(full));
   assert.ok(fs.existsSync(dest),`${full}: ${m[1]}`);
   if(anchor&&dest.endsWith('.html'))assert.ok(fs.readFileSync(dest,'utf8').includes(`id="${anchor}"`),`${full}: anchor ${anchor}`);
  }
 }
}
console.log('Esoteric Christianity: 48 complete lessons, matching languages, 106 rendered questions, six final checks per language, all local links and source locators verified.');
