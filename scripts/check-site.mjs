import fs from 'node:fs';
import path from 'node:path';
import {higherWorlds} from '../content/higher-worlds.mjs';
import {freedomConnections} from '../content/philosophy-of-freedom-connections.mjs';
import {additions} from '../content/philosophy-of-freedom-additions.mjs';
import {lukeLessons,lukeSources} from '../content/according-to-luke.mjs';
import {lukeConnections} from '../content/according-to-luke-connections.mjs';
import {colourLessons,colourSources} from '../content/colour.mjs';
import {colourConnections} from '../content/colour-connections.mjs';
import {temperamentsLessons,temperamentsSource,temperamentsConnections} from '../content/temperaments.mjs';
import {understandLessons,understandSource,understandConnections} from '../content/understand-temperament.mjs';
import {selfLessons,selfSource,selfConnections} from '../content/encountering-the-self.mjs';
import {mysteryLessons,mysterySource} from '../content/mystery-temperaments.mjs';
import {freedomConsolidated as freedomLessons} from '../content/philosophy-of-freedom-consolidated.mjs';
const root = path.resolve('docs');
const files = fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
const errors = [];
for (const relative of files) {
 const file = path.join(root,relative), html = fs.readFileSync(file,'utf8');
 const answerDetails=(html.match(/<details(?! class="guided-)\b/g)||[]).length;
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
  if(relative.includes('mystery-temperaments')) {
   const lang=relative.startsWith('pt')?'pt':'en',lesson=mysteryLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==4)errors.push(`${relative}: incomplete Mystery lesson`);
   if(!html.includes(mysterySource)||!html.includes(lesson?.span))errors.push(`${relative}: missing Mystery source assignment`);
   const partner=path.join(root,lang==='pt'?'':'pt','mystery-temperaments','lessons',path.basename(relative));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
   if(!alternate||path.resolve(path.dirname(file),alternate[1])!==partner)errors.push(`${relative}: incorrect Mystery language partner`);
   continue;
  }
  if(relative.includes('encountering-the-self')) {
   const lang=relative.startsWith('pt')?'pt':'en',lesson=selfLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==4)errors.push(`${relative}: incomplete Koepke lesson`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong Koepke language`);
   if(!html.includes('How to assess your response')&&!html.includes('Como avaliar sua resposta'))errors.push(`${relative}: missing Koepke rubric`);
   if(!html.includes(selfSource))errors.push(`${relative}: missing dated primary source`);
   const partner=path.join(root,lang==='pt'?'':'pt','encountering-the-self','lessons',path.basename(relative));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
   if(!alternate||path.resolve(path.dirname(file),alternate[1])!==partner)errors.push(`${relative}: incorrect language partner`);
   if(/Starting in|capture-software|C:\\Users\\|Encountering the self\.md/.test(html))errors.push(`${relative}: source capture noise leaked`);
   continue;
  }
  if(relative.includes('understand-temperament')) {
   const lang=relative.startsWith('pt')?'pt':'en',lesson=understandLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==4)errors.push(`${relative}: incomplete Childs lesson`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong Childs language`);
   if(!html.includes('How to assess your response')&&!html.includes('Como avaliar sua resposta'))errors.push(`${relative}: missing Childs rubric`);
   if(!html.includes(understandSource))errors.push(`${relative}: missing dated primary source`);
   const partner=path.join(root,lang==='pt'?'':'pt','understand-temperament','lessons',path.basename(relative));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
   if(!alternate||path.resolve(path.dirname(file),alternate[1])!==partner)errors.push(`${relative}: incorrect language partner`);
   if(/Starting in|capture-software|C:\\Users\\|Understand your temperament\.md/.test(html))errors.push(`${relative}: source capture noise leaked`);
   continue;
  }
  if(relative.includes('temperaments')) {
   const lang=relative.startsWith('pt')?'pt':'en',lesson=temperamentsLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==4)errors.push(`${relative}: incomplete GA 57 lesson`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong GA 57 language`);
   if(!html.includes('How to assess your response')&&!html.includes('Como avaliar sua resposta'))errors.push(`${relative}: missing GA 57 rubric`);
   if(!html.includes(temperamentsSource))errors.push(`${relative}: missing dated primary source`);
   const partner=path.join(root,lang==='pt'?'':'pt','temperaments','lessons',path.basename(relative));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
   if(!alternate||path.resolve(path.dirname(file),alternate[1])!==partner)errors.push(`${relative}: incorrect language partner`);
   if(/Starting in|capture-software|C:\\Users\\|The Four Temperaments\.md/.test(html))errors.push(`${relative}: source capture noise leaked`);
   continue;
  }
  if(relative.includes('colour')) {
   const lang=relative.startsWith('pt')?'pt':'en',lesson=colourLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==4)errors.push(`${relative}: incomplete GA 291 lesson`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong GA 291 language`);
   if(!html.includes('How to assess your response')&&!html.includes('Como avaliar sua resposta'))errors.push(`${relative}: missing GA 291 rubric`);
   if(lesson?.lecture&&!html.includes(colourSources[lesson.lecture-1].url))errors.push(`${relative}: missing dated primary source`);
   const partner=path.join(root,lang==='pt'?'':'pt','colour','lessons',path.basename(relative));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
   if(!alternate||path.resolve(path.dirname(file),alternate[1])!==partner)errors.push(`${relative}: incorrect language partner`);
   if(/Starting in|capture-software|C:\\Users\\|Colour \(2\)\.md/.test(html))errors.push(`${relative}: source capture noise leaked`);
   continue;
  }
  if(relative.includes('according-to-luke')) {
   const lang=relative.startsWith('pt')?'pt':'en',lesson=lukeLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==4)errors.push(`${relative}: incomplete GA 114 lesson`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong GA 114 language`);
   if(!html.includes('How to assess your response')&&!html.includes('Como avaliar sua resposta'))errors.push(`${relative}: missing GA 114 rubric`);
   if(lesson?.lecture&&!html.includes(lukeSources[lesson.lecture-1].url))errors.push(`${relative}: missing dated primary source`);
   const partner=path.join(root,lang==='pt'?'':'pt','according-to-luke','lessons',path.basename(relative));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
   if(!alternate||path.resolve(path.dirname(file),alternate[1])!==partner)errors.push(`${relative}: incorrect language partner`);
   if(/Starting in|capture-software|C:\\Users\\|According to Luke \(1\)\.md/.test(html))errors.push(`${relative}: source capture noise leaked`);
   continue;
  }
  if(relative.includes('philosophy-of-freedom')) {
   const lang=relative.startsWith('pt')?'pt':'en';
   const lesson=freedomLessons.find(l=>l.id===Number(path.basename(relative,'.html')));
   if(!lesson||!html.includes(lesson[lang].title)||answerDetails!==lesson[lang].checks.length+1) errors.push(`${relative}: missing lesson or answers`);
   if(!html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`))errors.push(`${relative}: wrong language`);
   if(/For both drafts|Assess both drafts|student draft|Visual plan and/.test(html))errors.push(`${relative}: editorial notes leaked`);
   continue;
  }
  const intro=!relative.includes('higher-worlds') && path.basename(relative)==='00.html';
  const thinkingLesson=!relative.includes('higher-worlds') && path.basename(relative)==='18.html';
  const expectedDetails=relative.includes('higher-worlds')?4:intro?6:thinkingLesson?3:2;
  if(thinkingLesson && (!html.includes('class="inquiry-diagrams thinking-review"') || !html.includes('((3 × 3) + 1) ÷ 2') || !html.includes('10 ÷ 2 = 5'))) errors.push(`${relative}: missing thinking exercise or explicit arithmetic grouping`);
  if(answerDetails!==expectedDetails) errors.push(`${relative}: incorrect number of answer, rubric or inquiry controls`);
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
for(let id=0;id<=20;id++)for(const prefix of ['philosophy-of-freedom','pt/philosophy-of-freedom'])if(!fs.existsSync(path.join(root,prefix,'lessons',String(id).padStart(2,'0')+'.html')))errors.push(`Missing GA 4 ${prefix}/${id}`);
if(freedomLessons.length!==22||new Set(freedomLessons.map(l=>l.id)).size!==22)errors.push('Expected 22 GA 4 pages: 16 core lessons and 6 optional practices');
if(lukeLessons.length!==12||new Set(lukeLessons.map(l=>l.id)).size!==12)errors.push('Expected 12 distinct GA 114 lessons');
if(lukeLessons.filter(l=>l.lecture).map(l=>l.lecture).join(',')!=='1,2,3,4,5,6,7,8,9,10')errors.push('GA 114 must cover ten lectures in order');
for(const prefix of ['','pt/']){
 const home=fs.readFileSync(path.join(root,prefix,'index.html'),'utf8');
 if((home.match(/<!-- luke-card:start -->/g)||[]).length!==1)errors.push(`${prefix}index.html: expected one GA 114 course card`);
 for(let id=0;id<=11;id++)if(!fs.existsSync(path.join(root,prefix,'according-to-luke','lessons',String(id).padStart(2,'0')+'.html')))errors.push(`Missing GA 114 ${prefix}${id}`);
 for(const c of lukeConnections){
  const html=fs.readFileSync(path.join(root,prefix,c.target),'utf8'),v=c[prefix?'pt':'en'];
  if((html.match(/<!-- luke-connection:start -->/g)||[]).length!==1||!html.includes(v[1]))errors.push(`${prefix}${c.target}: missing or repeated GA 114 supplement`);
 }
}

if(colourLessons.length!==14||colourLessons.map(l=>l.id).join(',')!=='0,1,2,3,4,5,6,7,8,9,10,11,12,13')errors.push('Expected fourteen Colour lessons in order');
if(colourLessons.filter(l=>l.lecture).map(l=>l.lecture).join(',')!=='1,2,3,4,5,6,7,8,9,10,11,12')errors.push('Colour must cover twelve lectures');
for(const prefix of ['', 'pt/']){
 const home=fs.readFileSync(path.join(root,prefix,'index.html'),'utf8');
 if((home.match(/<!-- colour-card:start -->/g)||[]).length!==1)errors.push(prefix+'index.html: missing or repeated Colour card');
 for(const l of colourLessons){
  const p=path.join(root,prefix,'colour','lessons',String(l.id).padStart(2,'0')+'.html');
  if(!fs.existsSync(p)){errors.push('Missing '+p);continue;}
  const h=fs.readFileSync(p,'utf8'),v=l[prefix?'pt':'en'];
  if(!h.includes(v.reading))errors.push(p+': missing reading assignment');
  if([2,4,9,11].includes(l.id)&&!h.includes('class="colour-swatch'))errors.push(p+': missing labelled colour studies');
  if(l.id===8&&(!h.includes('spaceplace.nasa.gov')||!h.includes('nei.nih.gov')))errors.push(p+': missing scientific context sources');
 }
 for(const c of colourConnections){const h=fs.readFileSync(path.join(root,prefix,c.target),'utf8');if((h.match(/<!-- colour-connection:start -->/g)||[]).length!==1||!h.includes(c[prefix?'pt':'en'][1]))errors.push(prefix+c.target+': missing Colour supplement');}
}

if(temperamentsLessons.map(l=>l.id).join(',')!=='0,1,2,3,4,5,6,7,8,9,10')errors.push('Expected eleven Temperaments lessons');
for(const prefix of ['', 'pt/']){
 const home=fs.readFileSync(path.join(root,prefix,'index.html'),'utf8');
 if((home.match(/<!-- temperaments-card:start -->/g)||[]).length!==1)errors.push(prefix+'index.html: missing or repeated Temperaments card');
 for(const l of temperamentsLessons){
  const p=path.join(root,prefix,'temperaments','lessons',String(l.id).padStart(2,'0')+'.html');
  if(!fs.existsSync(p)){errors.push('Missing '+p);continue;}
  const h=fs.readFileSync(p,'utf8'),v=l[prefix?'pt':'en'];
  if(!h.includes(v.reading))errors.push(p+': missing source assignment');
  if([2,8].includes(l.id)&&!h.includes('class="temperaments-map"'))errors.push(p+': missing comparison table');
 }
 for(const c of temperamentsConnections){const h=fs.readFileSync(path.join(root,prefix,c.target),'utf8');if((h.match(/<!-- temperaments-connection:start -->/g)||[]).length!==1||!h.includes(c[prefix?'pt':'en'][1]))errors.push(prefix+c.target+': missing Temperaments supplement');}
}

if(understandLessons.map(l=>l.id).join(',')!=='0,1,2,3,4,5,6,7,8,9,10,11,12')errors.push('Expected thirteen Understand lessons');
if(understandLessons.map(l=>l.section).join(',')!=='orientation,chapter-1,chapter-2,chapter-3,chapter-4,chapter-5,chapter-6,chapter-7,chapter-8,chapter-9,appendix-1,appendix-2,synthesis')errors.push('Incorrect Childs chapter/appendix coverage');
for(const prefix of ['', 'pt/']){
 const home=fs.readFileSync(path.join(root,prefix,'index.html'),'utf8');
 if((home.match(/<!-- understand-card:start -->/g)||[]).length!==1)errors.push(prefix+'index.html: missing or repeated Understand card');
 for(const l of understandLessons){
  const p=path.join(root,prefix,'understand-temperament','lessons',String(l.id).padStart(2,'0')+'.html');
  if(!fs.existsSync(p)){errors.push('Missing '+p);continue;}
  const h=fs.readFileSync(p,'utf8'),v=l[prefix?'pt':'en'];
  if(!h.includes(v.reading)||!h.includes('Gilbert Childs'))errors.push(p+': missing source assignment or correct author');
  if(l.id===8&&(h.match(/<th scope="row">/g)||[]).length!==10)errors.push(p+': expected ten pairing prompts');
  if(l.id===9&&!h.includes('medlineplus.gov'))errors.push(p+': missing genetics context');
  if(/GA 57|1909-03-04|Read the parallel 1987/.test(h))errors.push(p+': incorrect inherited source metadata');
 }
 for(const c of understandConnections){const h=fs.readFileSync(path.join(root,prefix,c.target),'utf8');if((h.match(/<!-- understand-connection:start -->/g)||[]).length!==1||!h.includes(c[prefix?'pt':'en'][1]))errors.push(prefix+c.target+': missing Childs supplement');}
}

if(selfLessons.map(l=>l.id).join(',')!=='0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')errors.push('Expected seventeen Koepke lessons');
if(selfLessons.map(l=>l.section).join(',')!=='orientation,peter,monica,dear-parents,biography,second-seven-years,seven-and-twelve,move-within-house,curriculum,disturbances,incarnation,school-doctor,sapling,moon-nodes,teeth,form-drawing,synthesis')errors.push('Incorrect Koepke section coverage');
for(const prefix of ['', 'pt/']){
 const home=fs.readFileSync(path.join(root,prefix,'index.html'),'utf8');
 if((home.match(/<!-- self-card:start -->/g)||[]).length!==1)errors.push(prefix+'index.html: missing or repeated Koepke card');
 for(const l of selfLessons){
  const p=path.join(root,prefix,'encountering-the-self','lessons',String(l.id).padStart(2,'0')+'.html');
  if(!fs.existsSync(p)){errors.push('Missing '+p);continue;}
  const h=fs.readFileSync(p,'utf8'),v=l[prefix?'pt':'en'];
  if(!h.includes(v.reading)||!h.includes('Hermann Koepke')||!h.includes('Walter Holtzapfel'))errors.push(p+': missing reading or authors');
  if(l.id===2&&!h.includes('nimh.nih.gov'))errors.push(p+': missing current care context');
  if(l.id===11&&!h.includes('ods.od.nih.gov'))errors.push(p+': missing iron context');
  if(l.id===13&&!h.includes('eclipse.gsfc.nasa.gov'))errors.push(p+': missing astronomy context');
  if(l.id===15&&!h.includes('reflection-desc'))errors.push(p+': missing accessible reflection diagram');
  if(/GA 57|1909-03-04|Gilbert Childs ·|1995/.test(h))errors.push(p+': inherited incorrect source metadata');
 }
 for(const c of selfConnections){const h=fs.readFileSync(path.join(root,prefix,c.target),'utf8');if((h.match(/<!-- self-connection:start -->/g)||[]).length!==1||!h.includes(c[prefix?'pt':'en'][1]))errors.push(prefix+c.target+': missing Koepke supplement');}
}
if(files.length!==310) errors.push(`Expected 310 HTML pages, got ${files.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Passed: ${files.length} pages, local links and anchors, nine bilingual courses, headings, examples, answers, and rubrics.`);
