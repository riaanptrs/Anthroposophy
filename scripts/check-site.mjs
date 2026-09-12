import fs from 'node:fs';
import path from 'node:path';
import {higherWorlds} from '../content/higher-worlds.mjs';
import {freedomConnections} from '../content/philosophy-of-freedom-connections.mjs';
import {additions} from '../content/philosophy-of-freedom-additions.mjs';
const freedomLessons=[...JSON.parse(fs.readFileSync('content/philosophy-of-freedom-lessons.json','utf8')),...additions];
const root = path.resolve('docs');
const files = fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
const errors = [];
for (const relative of files) {
 const file = path.join(root,relative), html = fs.readFileSync(file,'utf8');
 const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length) errors.push(`${relative}: duplicate id`);
 if((html.match(/<h1\b/g)||[]).length!==1) errors.push(`${relative}: expected one h1`);
 if(/Awaiting source|Aguardando material|Future subject lessons/.test(html)) errors.push(`${relative}: stale placeholder`);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const href=match[1];
  if(/^(https?:|data:|mailto:)/.test(href)) continue;
  const [name,anchor]=href.split('#');
  let target=name?path.resolve(path.dirname(file),name):file;
  if(!target.startsWith(root+path.sep)&&target!==root) {errors.push(`${relative}: link escapes docs ${href}`);continue;}
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
  if(!fs.existsSync(target)) {errors.push(`${relative}: missing ${href}`);continue;}
  if(anchor&&!fs.readFileSync(target,'utf8').includes(`id="${anchor}"`)) errors.push(`${relative}: missing anchor ${href}`);
 }
 if(relative.includes('lessons')) {
  if(!html.includes('class="worked-example"')||!html.includes('class="takeaway"')) errors.push(`${relative}: missing worked example or takeaway`);
  if(relative.includes('philosophy-of-freedom')) {
   const lang=relative.startsWith('pt')?'pt':'en';
   const lesson=freedomLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||(html.match(/<details\b/g)||[]).length!==lesson[lang].checks.length+1) errors.push(`${relative}: missing lesson or answers`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong language`);
   if(/For both drafts|Assess both drafts|student draft|Visual plan and/.test(html))errors.push(`${relative}: editorial notes leaked`);
   continue;
  }
  const intro=!relative.includes('higher-worlds') && path.basename(relative)==='00.html';
  const thinkingLesson=!relative.includes('higher-worlds') && path.basename(relative)==='18.html';
  const expectedDetails=relative.includes('higher-worlds')?4:intro?6:thinkingLesson?3:2;
  if(thinkingLesson && (!html.includes('class="inquiry-diagrams thinking-review"') || !html.includes('((3 × 3) + 1) ÷ 2') || !html.includes('10 ÷ 2 = 5'))) errors.push(`${relative}: missing thinking exercise or explicit arithmetic grouping`);
  if((html.match(/<details\b/g)||[]).length!==expectedDetails) errors.push(`${relative}: incorrect number of answer, rubric or inquiry controls`);
  if(!html.includes('How to assess your response')&&!html.includes('Como avaliar sua resposta')) errors.push(`${relative}: missing rubric`);
  if(intro && (!html.includes('class="question-pair"')||!html.includes('class="inquiry-steps"')||(html.match(/<details open>/g)||[]).length!==1)) errors.push(`${relative}: incomplete introductory diagrams`);
  const expected=relative.startsWith('pt')?'pt-BR':'en';
  if(!html.includes(`<html lang="${expected}">`)) errors.push(`${relative}: language mismatch`);
 }
}
for(const [course,entries] of Object.entries(freedomConnections)) for(const [id,entry] of Object.entries(entries)) {
 for(const [lang,index] of [['en',2],['pt',3]]) {
  const relative=`${lang==='pt'?'pt/':''}${course==='higherWorlds'?'higher-worlds/':''}lessons/${String(id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  if(!entry[index]||!html.includes(entry[index])||!html.includes('freedom-source')) errors.push(`${relative}: missing bilingual GA 4 explanation or source`);
 }
}
for(let i=0;i<=22;i++) for(const prefix of ['lessons','pt/lessons']) {
 if(!fs.existsSync(path.join(root,prefix,String(i).padStart(2,'0')+'.html'))) errors.push(`Missing lesson ${prefix}/${i}`);
}
for(let i=0;i<=18;i++) for(const prefix of ['higher-worlds/lessons','pt/higher-worlds/lessons']) {
 if(!fs.existsSync(path.join(root,prefix,String(i).padStart(2,'0')+'.html'))) errors.push(`Missing Course 2 lesson ${prefix}/${i}`);
}
for(const lang of ['en','pt']) for(const l of higherWorlds) {
 const v=l[lang];
 if(!v || v.length!==9 || v[2].length<3 || v[6].length!==3 || v[8].length<2) errors.push(`Incomplete Course 2 content: ${lang}/${l.id}`);
 if(!Number.isInteger(l.bridge)||l.bridge<0||l.bridge>22) errors.push(`Invalid Course 1 reference: ${l.id}`);
}
if(higherWorlds.length!==19 || new Set(higherWorlds.map(l=>l.id)).size!==19) errors.push('Expected 19 distinct Course 2 lessons');
for(let id=0;id<=17;id++)for(const prefix of ['philosophy-of-freedom','pt/philosophy-of-freedom'])if(!fs.existsSync(path.join(root,prefix,'lessons',String(id).padStart(2,'0')+'.html')))errors.push(`Missing GA 4 ${prefix}/${id}`);
if(freedomLessons.length!==18||new Set(freedomLessons.map(l=>l.id)).size!==18)errors.push('Expected 18 distinct GA 4 lessons');
if(files.length!==126) errors.push(`Expected 126 HTML pages, got ${files.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Passed: ${files.length} pages, local links and anchors, three bilingual courses, headings, examples, answers, and rubrics.`);
