import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {esc,n,wholeElement} from './learning-html.mjs';
import {isPracticalThinkingOwned,coreRouteIds,optionalRouteIds,partSlugs} from './practical-thinking-owned.mjs';

const sourceUrl='https://rsarchive.org/Lectures/GA108/English/Singles/19090118p02.html';
const json=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const occurrences=(html,name)=>(html.match(new RegExp('\\b'+name+'(?:="[^"]*")?(?=[\\s>])','g'))||[]).length;
const section=(html,attribute)=>{
 const opening=html.match(new RegExp('<section\\b[^>]*\\b'+attribute+'(?:="[^"]*")?[^>]*>'))?.[0];
 assert.ok(opening,'Missing source-first section '+attribute);
 return wholeElement(html,opening);
};
const hasTarget=(file,html,target)=>[...html.matchAll(/href="([^"]+)"/g)].some(([,href])=>{
 if(/^[a-z][a-z\d+.-]*:/i.test(href))return false;
 return path.resolve(path.dirname(file),href.split('#')[0])===path.resolve(target);
});
const nonempty=(value,label)=>assert.ok(typeof value==='string'&&value.trim(),label);
const rejectNoise=(html,file)=>assert.ok(!/sediment:\/\/|\/workspace\/attachments\/|C:\\Users\\|capture-software|\uFFFD/.test(html),file+' contains source capture noise');

export function validatePracticalThinking(){
 const map=json('practical-thinking-source-map.json');
 const parts=[1,2,3,4].map(id=>json('practical-thinking-part-'+id+'.json'));
 const lessons=parts.flatMap(p=>p.lessons),forecast=json('practical-thinking-forecast.json');
 const inventory=[...lessons,forecast];
 assert.deepEqual(coreRouteIds,[0,1,10,2,3,5,6,7,8,11,12,9],'Stable route identity is distinct from learner order');
 assert.deepEqual(optionalRouteIds,[4]);
 assert.deepEqual(map.stableCoreRouteIds,coreRouteIds);assert.deepEqual(map.optionalRouteIds,optionalRouteIds);
 assert.deepEqual(lessons.map(l=>l.sequence),Array.from({length:12},(_,i)=>i+1));
 assert.deepEqual(lessons.map(l=>l.routeId),coreRouteIds);assert.equal(forecast.routeId,4);
 assert.ok(!Number.isInteger(forecast.sequence),'Optional forecast must not count as a thirteenth core lesson');
 assert.deepEqual([...inventory.map(l=>l.routeId)].sort((a,b)=>a-b),Array.from({length:13},(_,i)=>i));
 assert.deepEqual(parts.map(p=>p.slug),partSlugs);
 for(const [index,part] of parts.entries()){
  assert.equal(part.part,index+1);assert.equal(part.lessons.length,3);
  assert.ok(part.lessons.every(l=>l.part===part.part));
  for(const lang of ['en','pt']){
   const p=part[lang];for(const field of ['title','summary','connection','deeperExercise','model'])nonempty(p?.[field],part.slug+' '+lang+' '+field);
   assert.ok(p.keyIdeas.length>=2&&p.keyIdeas.length<=4,'Part synthesis must remain short');
   assert.ok(p.keyIdeas.every(s=>typeof s==='string'&&s.trim()));
  }
 }
 assert.equal(map.source.url,sourceUrl);assert.equal(map.source.ga,'GA 108');
 assert.equal(map.source.date,'1909-01-18');assert.equal(map.source.translator,'George (Kaufmann) Adams');
 assert.equal(map.source.pagination,null,'Web paragraphs must not be presented as print pages');
 assert.equal(map.source.paragraphs.translated,48);assert.deepEqual(map.source.paragraphs.untranslated,[49]);
 assert.deepEqual(map.source.originalInternalHeadings,[],'Teaching parts are editorial divisions of one lecture');
 assert.match(map.source.htmlSha256,/^[a-f\d]{64}$/);assert.match(map.source.plaintextSha256,/^[a-f\d]{64}$/);
 const covered=new Set();
 for(const s of map.sections){
  for(const key of ['labelPt','mainIdeaPt','whyIntroducedPt','facultyTrainedPt','relationToNextPt'])nonempty(s[key],'Portuguese source map '+s.id+' '+key);
  if(s.id==='omission'){
   assert.deepEqual(s.paragraphs,[49,49]);assert.equal(s.exercise,null);
   assert.ok(s.mainIdea.includes('Not translated')&&s.fidelityLimits.some(limit=>limit.includes('No invented')),'Omitted paragraph has no inferred content');
   continue;
  }
  assert.ok(s.paragraphs.length===2&&s.paragraphs[0]>=1&&s.paragraphs[1]<=48&&s.paragraphs[0]<=s.paragraphs[1]);
  for(let p=s.paragraphs[0];p<=s.paragraphs[1];p++)covered.add(p);
  for(const key of ['mainIdea','whyIntroduced','facultyTrained','relationToNext','labelProvenance'])nonempty(s[key],'Source map '+s.id+' '+key);
 }
 assert.deepEqual([...covered].sort((a,b)=>a-b),Array.from({length:48},(_,i)=>i+1),'Complete translated lecture must remain mapped');
 assert.equal(map.proposedLessonMapping.length,12);
 // These banks still serve the unchanged beginner and source-library courses.
 for(const [file,hash] of [['passage-study.json','f63c5c1d21c2a81f20ed4b93054aa0ddb9390890699fc2e035fd14c24364570f'],['learning-book-checks.json','37c3c7d96d754717713ba4ce67d1cdb5a6a4cca37f39bd6143820023d167df22']])assert.equal(crypto.createHash('sha256').update(fs.readFileSync('content/'+file)).digest('hex'),hash,file+' changed during scoped Practical revision');

 const marker='<main id="main" data-practical-thinking-owned="true">';
 for(const prefix of ['', 'pt/']){
  for(const route of ['index.html','tools.html','source-notes.html',...partSlugs.map(s=>'parts/'+s+'.html'),...Array.from({length:13},(_,i)=>'lessons/'+n(i)+'.html')])assert.ok(isPracticalThinkingOwned(prefix+'practical-thinking/'+route,marker),'Owned route '+prefix+route);
 }
 for(const route of ['other-course/index.html','practical-thinking/lessons/99.html','practical-thinking/lessons/13.html','practical-thinking/parts/unknown.html','practical-thinking/../practical-thinking/index.html','../practical-thinking/index.html','research/notes/practical-thinking/index.html','practical-thinking/index.html?x=1','/practical-thinking/index.html'])assert.ok(!isPracticalThinkingOwned(route,marker),'Ownership exemption escaped exact route: '+route);
 assert.ok(!isPracticalThinkingOwned('practical-thinking/index.html','<aside data-practical-thinking-owned="true">'),'Only authored main can opt out');
 assert.ok(!isPracticalThinkingOwned('practical-thinking/index.html','<main id="main">'),'Marker is required');

 const candidates=[...map.exactShortQuoteCandidates,...(map.optionalQuoteCandidates||[])];
 for(const l of inventory){
  const label='Practical '+n(l.routeId);
  assert.ok(l.paragraphs.length===2&&l.paragraphs[0]>=1&&l.paragraphs[1]<=48&&l.paragraphs[0]<=l.paragraphs[1],label+' invalid reading bounds');
  assert.ok(l.quote.paragraph>=l.paragraphs[0]&&l.quote.paragraph<=l.paragraphs[1],label+' excerpt outside required reading');
  const verified=candidates.find(c=>c.paragraph===l.quote.paragraph&&c.text===l.quote.en);
  assert.ok(verified,label+' English excerpt differs from independently verified source map');
  assert.match(verified.paragraphSha256,/^[a-f\d]{64}$/);assert.ok(verified.verification.includes('Exact contiguous substring'));
  assert.ok(l.quote.en.split(/\s+/).length<=60,label+' passage should be a short bounded excerpt');
  if(Number.isInteger(l.sequence)){
   const assigned=map.proposedLessonMapping.find(m=>m.lesson===l.sequence);
   assert.equal(assigned.part,l.part);assert.deepEqual(l.paragraphs,assigned.sourceParagraphs,label+' source-map assignment drift');
  }
  nonempty(l.quote.pt,label+' Portuguese course translation');
  for(const lang of ['en','pt']){
   const v=l[lang];for(const field of ['title','goal','question','key','application','tryIt','connection'])nonempty(v?.[field],label+' '+lang+' '+field);
   assert.ok(Array.isArray(v.meaning)&&v.meaning.length>=2&&v.meaning.length<=5,label+' explanation size');
   assert.ok(v.meaning.every(s=>typeof s==='string'&&s.trim()));
   assert.ok(v.exercise===null||typeof v.exercise==='string'&&v.exercise.trim(),label+' exercise must be explicit or absent');
   assert.ok(v.checks.length>=2&&v.checks.length<=3,label+' short comprehension count');
   for(const [i,c] of v.checks.entries()){
    nonempty(c.question,label+' check');nonempty(c.explanation,label+' reason');
    assert.ok(c.options.length>=2&&c.options.length<=4&&c.options.every(s=>typeof s==='string'&&s.trim()));
    assert.ok(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<c.options.length);
    assert.equal(c.answer,l[lang==='en'?'pt':'en'].checks[i].answer,label+' bilingual answer mismatch');
   }
  }
  assert.equal(l.en.checks.length,l.pt.checks.length,label+' bilingual check count');
  assert.equal(l.en.exercise===null,l.pt.exercise===null,label+' bilingual source exercise mismatch');
  if(l.part===1)assert.equal(l.en.exercise,null,label+' invented Part I exercise attributed to Steiner');
 }

 let pages=0;
 for(const lang of ['en','pt']){
  const base=lang==='pt'?'docs/pt':'docs',other=lang==='pt'?'docs':'docs/pt',course=base+'/practical-thinking';
  const indexFile=course+'/index.html',index=fs.readFileSync(indexFile,'utf8');
  assert.ok(isPracticalThinkingOwned(indexFile.slice(5),index));
  assert.equal((index.match(/<h1\b/g)||[]).length,1);assert.ok(!index.includes('Edition notes, original course guides and journals')&&!index.includes('Notas de edição, guias originais do curso e diários'),'Layered original index returned');
  for(const slug of partSlugs)assert.equal((index.match(new RegExp('id="part-'+slug+'"','g'))||[]).length,1,'One visible group per part');
  for(const scope of ['all','1','2','3','4'])assert.equal((index.match(new RegExp('data-thought-progress="'+scope+'"','g'))||[]).length,1,'Simple source-part progress '+scope);
  assert.deepEqual([...index.matchAll(/data-practice-lesson="(\d+)"/g)].map(m=>Number(m[1])),coreRouteIds,'Index path displays every core lesson once in source order');
  assert.ok(hasTarget(indexFile,index,course+'/tools.html'),'Optional tools separate from main path');
  assert.ok(!index.includes('guided-study.v1.js')&&!index.includes('guided-course-journal'),'Legacy journal returned to index');

  for(const l of inventory){
   const file=course+'/lessons/'+n(l.routeId)+'.html',html=fs.readFileSync(file,'utf8'),v=l[lang];
   assert.ok(isPracticalThinkingOwned(file.slice(5),html),file+' ownership');
   assert.ok(html.includes('data-thought-route="'+n(l.routeId)+'"'),file+' stable route');
   if(Number.isInteger(l.sequence))assert.ok(html.includes('data-thought-sequence="'+l.sequence+'"'),file+' learner sequence');
   else assert.ok(!html.includes('data-thought-sequence='),file+' optional route counts as core');
   assert.ok(html.includes('<html lang="'+(lang==='pt'?'pt-BR':'en')+'">'));
   const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/)?.[1];
   assert.ok(alternate&&path.resolve(path.dirname(file),alternate)===path.resolve(other,'practical-thinking/lessons/'+n(l.routeId)+'.html'),file+' language partner');
   for(const field of ['title','goal','question','key','application','tryIt','connection'])assert.ok(html.includes(esc(v[field])),file+' lost '+field);
   for(const paragraph of v.meaning)assert.ok(html.includes(esc(paragraph)),file+' lost teaching paragraph');
   const source=section(html,'data-thought-source');
   assert.ok(source.includes('data-thought-paragraphs="'+l.paragraphs.join('–')+'"'),file+' incorrect web reading bounds');
   assert.ok(source.includes('data-thought-quote-paragraph="'+l.quote.paragraph+'"'),file+' wrong excerpt locator');
   assert.ok(source.includes('<blockquote')&&source.includes(esc(l.quote[lang])),file+' excerpt changed');
   if(l.sourcePortion)assert.ok(source.includes(esc(l.sourcePortion[lang])),file+' overlapping paragraph28 source portion must remain clear');
   assert.ok(source.includes(sourceUrl)&&source.includes('Adams')&&source.includes('1909'),file+' source credit');
   assert.ok(!source.includes(sourceUrl+'#'),'Paragraph anchors are absent on this witness');
   assert.equal(occurrences(html,'data-thought-source'),1);assert.equal(occurrences(html,'data-thought-application'),1);assert.equal(occurrences(html,'data-thought-practice'),1);
   assert.equal(occurrences(html,'data-thought-exercise'),v.exercise?1:0,file+' attributed exercise count');
   if(v.exercise)assert.ok(section(html,'data-thought-exercise').includes(esc(v.exercise)),file+' source exercise altered');
   const sourceAt=html.indexOf('data-thought-source'),keyAt=html.indexOf('class="learning-key"'),applicationAt=html.indexOf('data-thought-application'),practiceAt=html.indexOf('data-thought-practice'),quizAt=html.indexOf('class="learning-quiz"');
   assert.ok(sourceAt>=0&&keyAt>sourceAt&&applicationAt>keyAt&&practiceAt>applicationAt&&quizAt>practiceAt,file+' Read → understand → practice → observe sequence');
   assert.equal((html.match(/class="learning-quiz"/g)||[]).length,v.checks.length,file+' check count');
   assert.equal((html.match(/<details class="guided-quiz answer-explanation"/g)||[]).length,v.checks.length,file+' no-JS reasons');
   assert.ok(/Course application|Aplicação do curso/i.test(html),file+' modern exercise provenance');
   assert.ok(!html.includes('guided-study.v1.js')&&!html.includes('data-learning-id=')&&!html.includes('class="learning-context"'),file+' legacy wrapper collision');
   const notes=wholeElement(html,'<details class="thought-notes"');
   assert.ok(notes&&!/^<details[^>]*\bopen(?:\s|>)/.test(notes),'Practice notes must remain optional and closed');
   assert.deepEqual([...notes.matchAll(/data-thought-note="([^"]+)"/g)].map(m=>m[1]),['date','exercise','noticed','changed'],file+' compact four-field notes');
   for(const attr of ['data-thought-save','data-thought-legacy-details','data-thought-export','data-thought-delete'])assert.ok(notes.includes(attr),file+' optional note preservation control '+attr);
   assert.ok(notes.includes('<noscript>'),file+' optional notes fallback');
   if(Number.isInteger(l.sequence)){
    const part=parts[l.part-1],next=l.sequence%3===0?course+'/parts/'+part.slug+'.html':course+'/lessons/'+n(coreRouteIds[l.sequence])+'.html';
    assert.ok(hasTarget(file,html,course+'/parts/'+part.slug+'.html')||html.includes('href="../index.html#part-'+part.slug+'"'),file+' part link');
    assert.ok(hasTarget(file,html,next),file+' explicit next reading');
    if(l.sequence%3!==0)assert.ok(html.includes(esc(lessons[l.sequence][lang].title)),file+' visible next title');
    if(l.sequence>1)assert.ok(hasTarget(file,html,course+'/lessons/'+n(coreRouteIds[l.sequence-2])+'.html')||hasTarget(file,html,course+'/parts/'+parts[Math.floor((l.sequence-2)/3)].slug+'.html'),file+' previous reading');
   }
   rejectNoise(html,file);pages++;
  }
  for(const [index,part] of parts.entries()){
   const file=course+'/parts/'+part.slug+'.html',html=fs.readFileSync(file,'utf8'),v=part[lang];
   assert.ok(isPracticalThinkingOwned(file.slice(5),html));
   for(const field of ['title','connection','deeperExercise','model'])assert.ok(html.includes(esc(v[field])),file+' lost '+field);
   assert.ok(html.includes('<details'),'Synthesis model must remain optional');
   const next=index<3?course+'/lessons/'+n(coreRouteIds[(index+1)*3])+'.html':course+'/tools.html';
   assert.ok(hasTarget(file,html,next)||index===3&&hasTarget(file,html,course+'/index.html'),file+' synthesis continuation');
   assert.ok(hasTarget(file,html,course+'/lessons/'+n(part.lessons[2].routeId)+'.html'),'Synthesis returns to its last lesson');
   rejectNoise(html,file);pages++;
  }
  const toolsFile=course+'/tools.html',tools=fs.readFileSync(toolsFile,'utf8'),sourcesFile=course+'/source-notes.html',sources=fs.readFileSync(sourcesFile,'utf8');
  for(const [file,html] of [[toolsFile,tools],[sourcesFile,sources]]){assert.ok(isPracticalThinkingOwned(file.slice(5),html));rejectNoise(html,file);}
  for(const id of ['exercise-map','journal'])assert.ok(tools.includes('id="'+id+'"'),'Optional tools retain '+id);
  for(const route of [2,4,5,6,7,8])assert.ok(hasTarget(toolsFile,tools,course+'/lessons/'+n(route)+'.html'),'Exercise-selection tool missing route '+route);
  assert.ok(sources.includes(sourceUrl)&&sources.includes('49')&&sources.includes('48')&&sources.includes('Adams'),'Source scope and omission must remain visible');
  assert.ok(hasTarget(course+'/lessons/09.html',fs.readFileSync(course+'/lessons/09.html','utf8'),base+'/meditation/index.html'),'Final meditation study link');
  pages+=3;
 }
 return {coreLessons:lessons.length,optionalLessons:1,bilingualPages:pages,sourceSections:map.sections.length};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=validatePracticalThinking();
 console.log(`Passed: ${result.coreLessons} source-first Practical Thinking lessons, retained optional forecasting, four bilingual syntheses, exact Adams excerpts, full ${result.sourceSections}-section source map, stable old route identities and narrow builder ownership (${result.bilingualPages} pages).`);
}
