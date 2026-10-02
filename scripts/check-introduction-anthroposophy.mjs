import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {esc,wholeElement} from './learning-html.mjs';
import {isIntroductionOwned} from './link-constitution.mjs';

const route='introduction-to-anthroposophy';
const json=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const padded=id=>String(id).padStart(2,'0');
const nonempty=value=>typeof value==='string'&&Boolean(value.trim());
const plain=html=>html.replace(/<[^>]*>/g,' ').replace(/&(amp|lt|gt|quot|#39|nbsp);/g,(_,entity)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'",nbsp:' '}[entity])).replace(/\s+/g,' ').trim();
const elementAt=(html,attribute)=>{
 const at=html.indexOf(attribute);assert.ok(at>=0,'Missing '+attribute);
 const start=html.lastIndexOf('<',at),opening=html.slice(start,html.indexOf('>',at)+1);
 return wholeElement(html.slice(start),opening);
};
const section=(html,id)=>elementAt(html,`id="${id}"`);
const equalVisible=(html,text,message)=>assert.ok(plain(html).includes(plain(esc(text))),message);
const range=value=>Array.isArray(value)&&value.length===2&&value.every(Number.isInteger)&&value[0]>=1&&value[1]>=value[0];
const closedModel=html=>/<details\b(?![^>]*\bopen\b)[^>]*>/.test(html);
const accessibleDiagrams=(html,message,required=false)=>{
 const diagrams=[...html.matchAll(/<svg\b[^>]*>/g)];
 if(required)assert.ok(diagrams.length>0,message+' missing teaching diagram');
 for(const match of diagrams){
  const svg=wholeElement(html.slice(match.index),match[0]);
  assert.ok(/\brole="img"/.test(match[0]),message+' diagram role');
  const names=match[0].match(/\baria-labelledby="([^"]+)"/)?.[1].split(/\s+/);
  assert.ok(names?.length,message+' named diagram');
  for(const id of names)assert.ok(svg.includes(`id="${id}"`),message+' unresolved diagram label '+id);
  assert.ok(/<title\b[^>]*>\s*[^<]+<\/title>/.test(svg)&&/<desc\b[^>]*>\s*[^<]+<\/desc>/.test(svg),message+' diagram title and text description');
 }
};

const course=json('introduction-anthroposophy-course.json');
const map=json('introduction-anthroposophy-source-map.json');
assert.equal(course.lessonCount,28,'The new course plans 28 lessons');
assert.equal(course.partCount,7,'The new course has seven parts');
assert.equal(map.lessonCount,28);assert.equal(map.partCount,7);
assert.equal(map.route,route);assert.equal(map.replacesExistingCourse,false,'Introduction must remain a separate course');
assert.deepEqual(map.lessons.map(lesson=>lesson.id),Array.from({length:28},(_,index)=>index+1),'Complete sequential source architecture');
assert.equal(map.parts.length,7);assert.equal(course.parts.length,7);
assert.deepEqual(course.parts.map(part=>part.slug),map.parts.map(part=>part.slug),'Published part order matches the reviewed source plan');
assert.deepEqual(map.parts.flatMap(part=>part.lessonIds),Array.from({length:28},(_,index)=>index+1),'Each lesson belongs to one teaching part');
assert.ok(Array.isArray(course.availableLessonIds)&&course.availableLessonIds.length>0,'No available lessons');
assert.deepEqual([...new Set(course.availableLessonIds)].sort((a,b)=>a-b),course.availableLessonIds,'Available IDs are distinct and ordered');
assert.ok(course.availableLessonIds.every(id=>Number.isInteger(id)&&id>=1&&id<=28),'Available lesson range');
const phaseLast={B:3,C:7,D:14,E:18,F:22,G:27,H:28};
assert.ok(Object.hasOwn(phaseLast,course.phase),'Recognized implementation phase B–H');
assert.deepEqual(course.availableLessonIds,Array.from({length:phaseLast[course.phase]},(_,index)=>index+1),'Available lessons match the cumulative phase '+course.phase);
const registry=new Map(map.sourceRegistry.map(source=>[source.id,source]));
assert.equal(registry.size,map.sourceRegistry.length,'Unique source identities');
for(const lesson of map.lessons){
 assert.ok(nonempty(lesson.coreIdea)&&Array.isArray(lesson.terms)&&lesson.terms.length,'Missing conceptual source plan '+lesson.id);
 const part=map.parts.find(part=>part.number===lesson.part);
 assert.ok(part?.lessonIds.includes(lesson.id),'Incorrect planned part '+lesson.id);
 assert.ok(lesson.sourceAssignments.some(assignment=>assignment.role==='primary'&&assignment.sourceId===lesson.primarySource),'Missing primary source '+lesson.id);
 for(const assignment of lesson.sourceAssignments){
  assert.ok(registry.has(assignment.sourceId),'Unknown source '+assignment.sourceId);
  assert.ok(['primary','secondary'].includes(assignment.role),'Invalid source role');
  assert.ok(nonempty(assignment.locator?.kind),'Missing locator type');
  if(assignment.locator.kind==='missing')assert.ok(lesson.sourceGaps?.length,'Unrecorded source gap '+lesson.id);
 }
}

// Available IDs select only this course's authored lessons, never another bank.
const lessonFiles=course.lessonFiles||course.availableLessonIds.map(id=>`introduction-anthroposophy-lesson-${padded(id)}.json`);
const lessons=lessonFiles.flatMap(file=>{
 const data=json(file.replace(/^content\//,''));
 return Array.isArray(data)?data:Array.isArray(data.lessons)?data.lessons:[data];
}).sort((a,b)=>a.id-b.id);
assert.deepEqual(lessons.map(lesson=>lesson.id),course.availableLessonIds,'Exactly the available lesson data is authored');

const expected=new Set();
for(const language of ['en','pt']){
 const prefix=language==='pt'?'pt/':'';
 for(const suffix of ['index.html','source-notes.html',...course.parts.map(part=>'parts/'+part.slug+'.html'),...course.availableLessonIds.map(id=>'lessons/'+padded(id)+'.html')])expected.add(prefix+route+'/'+suffix);
}
const actual=fs.readdirSync('docs',{recursive:true}).map(file=>file.replaceAll('\\','/')).filter(file=>new RegExp(`^(?:pt/)?${route}/`).test(file)&&fs.statSync(path.join('docs',file)).isFile());
assert.deepEqual(actual.sort(),[...expected].sort(),'Only available paired lessons and the seven paired part landings are published');
let pageCount=0,checkCount=0;
for(const relative of expected){
 const file=path.join('docs',relative),html=fs.readFileSync(file,'utf8');
 const pt=relative.startsWith('pt/'),lang=pt?'pt':'en',visible=plain(html);
 assert.ok(isIntroductionOwned(relative,html),file+' scoped ownership');
 assert.ok(html.includes(`<html lang="${pt?'pt-BR':'en'}">`),file+' language');
 assert.ok(html.includes('introduction-anthroposophy.css')&&html.includes('introduction-anthroposophy.js'),file+' scoped assets');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+' single page title');
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(ids).size,ids.length,file+' unique IDs');
 assert.ok(!/data-(?:study-id|learning-id|note-field)=/.test(html),file+' legacy notebook controller');
 assert.ok(!/\b\d+\s*(?:points?|pontos?)\b|receive full marks|pontuação máxima|data-score=/.test(html),file+' numerical grading in an unscored course');
 assert.ok(!html.includes('constitution-ref')&&!html.includes('constitution-entry'),file+' automatic terminology panel');
 assert.ok(!/sediment:\/\/|\/workspace\/attachments\/|C:\\Users\\|file_[a-f0-9]{16,}|capture-software|Starting in\s+\d/.test(html),file+' private source content');
 assert.ok(visible.split(/\s+/).length<5000,file+' unexpectedly contains a full source text');
 const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
 const partner=path.resolve('docs',pt?relative.slice(3):'pt/'+relative);
 assert.ok(alternate,file+' language partner');
 assert.equal(path.resolve(path.dirname(file),alternate[1]),partner,file+' paired route');
 for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|data:|mailto:)/.test(href))continue;
  const [resource,anchor]=href.split('#'),target=resource?path.resolve(path.dirname(file),resource.split('?')[0]):path.resolve(file);
  assert.ok(target.startsWith(path.resolve('docs')+path.sep),file+' link escapes public site');
  const resolved=fs.existsSync(target)&&fs.statSync(target).isDirectory()?path.join(target,'index.html'):target;
  assert.ok(fs.existsSync(resolved),file+' missing '+href);
  if(anchor)assert.ok(fs.readFileSync(resolved,'utf8').includes(`id="${anchor}"`),file+' missing anchor '+href);
  const introLesson=resolved.match(/[\\/]introduction-to-anthroposophy[\\/]lessons[\\/](\d{2})\.html$/);
  if(introLesson)assert.ok(course.availableLessonIds.includes(Number(introLesson[1])),file+' links to an unwritten lesson');
 }
 if(relative.endsWith('/index.html')){
  assert.ok(html.includes('data-intro-continue'),file+' Begin/Continue entry');
  for(const part of map.parts)equalVisible(html,part[pt?'titlePt':'titleEn'],file+' part title '+part.number);
 }
 const slug=relative.match(/\/parts\/([a-z-]+)\.html$/)?.[1];
 if(slug){
  const part=map.parts.find(part=>part.slug===slug);
  const authored=course.parts.find(part=>part.slug===slug)[lang];
  equalVisible(html,part[pt?'titlePt':'titleEn'],file+' part title');
  assert.ok(nonempty(authored.question)&&nonempty(authored.introduction)&&Array.isArray(authored.outcomes)&&authored.outcomes.length>0&&authored.outcomes.every(nonempty),file+' part orientation');
  for(const text of [authored.question,authored.introduction,...authored.outcomes])equalVisible(html,text,file+' part orientation text');
  if(part.lessonIds.every(id=>course.availableLessonIds.includes(id))){
   for(const key of ['synthesis','synthesisQuestion','synthesisAnswer'])assert.ok(nonempty(authored[key]),file+' completed part missing '+key);
   const synthesis=elementAt(html,'class="intro-part-synthesis"');
   for(const text of [authored.synthesis,authored.synthesisQuestion,authored.synthesisAnswer])equalVisible(synthesis,text,file+' completed part synthesis text');
   assert.ok(closedModel(synthesis),file+' optional closed synthesis model');
  }
 }
 pageCount++;
}

for(const lesson of lessons){
 const planned=map.lessons.find(entry=>entry.id===lesson.id),part=map.parts.find(entry=>entry.number===lesson.part);
 assert.equal(lesson.part,planned.part,'Authored part differs from its plan');
 assert.equal(lesson.titleEn,planned.titleEn);assert.equal(lesson.titlePt,planned.titlePt);
 assert.ok(Array.isArray(lesson.sourceAssignments)&&lesson.sourceAssignments.length,'Source assignments '+lesson.id);
 assert.equal(new Set(lesson.sourceAssignments.filter(assignment=>assignment.role==='primary').map(assignment=>assignment.sourceId)).size,1,'One primary work per lesson');
 assert.ok(new Set(lesson.sourceAssignments.filter(assignment=>assignment.role==='secondary').map(assignment=>assignment.sourceId)).size<=1,'At most one supporting work per normal lesson');
 for(const assignment of lesson.sourceAssignments){
  const source=registry.get(assignment.sourceId),locator=assignment.locator;
  assert.ok(source,'Unregistered authored source '+assignment.sourceId);
  assert.notEqual(source.availability,'missing','Missing source used by an available lesson');
  assert.notEqual(locator?.kind,'missing','Unverified reading used by an available lesson');
  assert.ok(nonempty(assignment.section)&&nonempty(assignment.voice),'Actual section and source voice');
  if(assignment.selectedExcerpt){
   assert.equal(assignment.excerptEn,assignment.selectedExcerpt,'Excerpt differs from the reviewed wording');
   assert.ok(nonempty(assignment.excerptPt)&&assignment.courseTranslation===true,'Identified Portuguese study translation');
   assert.ok(assignment.excerptVerification&&typeof assignment.excerptVerification==='object','Excerpt review record');
  }
  if(locator.kind==='printed-page'){
   assert.ok(range(locator.printedPages)&&range(locator.pdfPages),'Verified printed/PDF ranges');
   const offset=assignment.sourceId==='ga13'?13:assignment.sourceId==='ga10-modern'?9:null;
   if(offset!==null)assert.deepEqual(locator.pdfPages,locator.printedPages.map(page=>page+offset),'Incorrect printed-to-PDF conversion');
  }else if(['PDF-page','PDF-capture'].includes(locator.kind)){
   assert.ok(range(locator.pdfPages),'Actual PDF locator');assert.equal(locator.printedPages,null,'No inferred printed folios');
  }else if(/^EPUB/i.test(locator.kind)){
   assert.equal(locator.printedPages??null,null,'EPUB has no established printed folios');
   assert.equal(locator.pdfPages??null,null,'EPUB is not a PDF locator');
   assert.ok(nonempty(locator.anchor)||nonempty(locator.href)||nonempty(locator.epubHref)||nonempty(locator.spineHref),'Stable EPUB section/fragment anchor');
  }else if(locator.kind==='Markdown-marker'){
   assert.ok(range(locator.markdownMarkers),'Actual Markdown marker range');
   assert.equal(locator.printedPages??null,null,'Markdown markers are not established print folios');
   assert.equal(locator.pdfPages??null,null,'Markdown markers are not PDF page numbers');
   assert.match(source.availability,/markdown/i,'Markdown witness identified explicitly');
  }else assert.fail('Unsupported authored locator '+locator.kind);
 }
 assert.deepEqual(lesson.en.checks.map(check=>check.answer),lesson.pt.checks.map(check=>check.answer),'Paired correct answers '+lesson.id);
 if(lesson.id===5)assert.equal(lesson.en.memberCards?.length,lesson.pt.memberCards?.length,'Paired member cards');
 if(lesson.id===14){
  const domainKind=(label,lang)=>lang==='pt'?/físic/i.test(label)?'physical':/anímic|alma/i.test(label)?'soul':/espiritual/i.test(label)?'spiritual':null:/physical/i.test(label)?'physical':/soul/i.test(label)?'soul':/spiritual/i.test(label)?'spiritual':null;
  assert.deepEqual(lesson.en.worldRelationships?.map(world=>domainKind(world.domain,'en')),lesson.pt.worldRelationships?.map(world=>domainKind(world.domain,'pt')),'Paired world-domain relationships');
 }
 if(lesson.id>=23&&lesson.id<=27)assert.equal(lesson.en.sourceNeeded?.length??0,lesson.pt.sourceNeeded?.length??0,'Paired application source-needed notes '+lesson.id);
 if(lesson.id===28){
  assert.equal(lesson.en.conceptConnections?.length,lesson.pt.conceptConnections?.length,'Paired conceptual architecture');
  assert.deepEqual(lesson.en.pathways?.map(pathway=>pathway.route||'book-note'),lesson.pt.pathways?.map(pathway=>pathway.route||'book-note'),'Paired deeper-study destinations');
  if(lesson.en.architectureNodes!==undefined||lesson.pt.architectureNodes!==undefined){
   assert.equal(lesson.en.architectureNodes?.length,9,'Nine English architecture nodes');
   assert.equal(lesson.pt.architectureNodes?.length,9,'Nine Portuguese architecture nodes');
   const indexedEdges=lang=>lesson[lang].conceptConnections.map(connection=>[lesson[lang].architectureNodes.findIndex(node=>node.label===connection.from),lesson[lang].architectureNodes.findIndex(node=>node.label===connection.to)]);
   assert.deepEqual(indexedEdges('en'),indexedEdges('pt'),'Translated graph preserves the same ordered relationships');
  }
 }
 for(const lang of ['en','pt']){
  const v=lesson[lang],pt=lang==='pt',file=path.join(pt?'docs/pt':'docs',route,'lessons',padded(lesson.id)+'.html');
  const html=fs.readFileSync(file,'utf8'),visible=plain(html),sourceBlock=section(html,'source');
  for(const key of ['question','matters','distinction','connection'])assert.ok(nonempty(v[key]),file+' missing '+key);
  const sentences=[...new Intl.Segmenter(pt?'pt-BR':'en',{granularity:'sentence'}).segment(v.matters)].filter(segment=>segment.segment.trim());
  assert.ok(sentences.length>=2&&sentences.length<=4,file+' Why this matters should contain two to four sentences');
  assert.ok(Array.isArray(v.explanation)&&v.explanation.length>=2&&v.explanation.length<=5&&v.explanation.every(nonempty),file+' focused reasoning');
  assert.ok(nonempty(v.keyConcept?.term)&&nonempty(v.keyConcept?.definition),file+' key concept');
  assert.ok(Array.isArray(v.checks)&&v.checks.length>=2&&v.checks.length<=4,file+' meaningful comprehension count');
  assert.ok(html.includes(`data-intro-study-id="${padded(lesson.id)}"`)&&html.includes(`data-intro-language="${lang}"`),file+' scoped study identity');
  assert.ok(new RegExp(`${pt?'Parte':'Part'}\\s+${part.roman}\\s+${pt?'de':'of'}\\s+(?:7|VII)\\b`).test(visible),file+' visible part position');
  assert.ok(new RegExp(`${pt?'(?:Lição|Aula)':'Lesson'}\\s+0?${lesson.id}\\s+${pt?'de':'of'}\\s+28\\b`).test(visible),file+' visible lesson position');
  const order=['question','matters','source','explanation','key-concept',...(v.example?['example']:[]),'distinction','checks','connection',...(v.deeperStudy?.length?['deeper-study']:[])];
  let previous=-1;
  for(const id of order){const at=html.indexOf(`id="${id}"`);assert.ok(at>previous,file+' missing or misordered '+id);previous=at;}
  for(const text of [v.question,v.matters,...v.explanation,v.keyConcept.term,v.keyConcept.definition,v.distinction,v.connection])equalVisible(html,text,file+' missing authored text');
  if(v.example){assert.ok(nonempty(v.example.text),file+' example text');equalVisible(section(html,'example'),v.example.text,file+' example');}
  if(lesson.id===5){
   assert.ok(Array.isArray(v.memberCards)&&v.memberCards.length===4,file+' four human-member cards');
   assert.equal(new Set(v.memberCards.map(card=>card.term)).size,4,file+' distinct member terms');
   const block=section(html,'member-cards');
   for(const card of v.memberCards)for(const key of ['term','meaning','problem','difference','example','misconception']){
    assert.ok(nonempty(card[key]),file+' member card missing '+key);
    equalVisible(block,card[key],file+' visible member card '+key);
   }
   const labels=v.memberCards.map(card=>card.term.toLocaleLowerCase(pt?'pt-BR':'en'));
   assert.match(labels[0],pt?/físic/:/physical/,file+' physical member first');
   assert.match(labels[1],pt?/etéric|vital/:/etheric|life/,file+' life member second');
   assert.match(labels[2],/astral/,file+' astral member third');
   assert.match(labels[3],pt?/\beu\b/:/\bi\b/,file+' I as fourth member');
   assert.ok(html.indexOf('id="source"')<html.indexOf('id="member-cards"'),file+' cards follow the identified source');
  }
  if(lesson.id===14){
   assert.ok(Array.isArray(v.worldRelationships)&&v.worldRelationships.length===3,file+' three world relationships');
   assert.equal(new Set(v.worldRelationships.map(world=>world.domain)).size,3,file+' distinct world domains');
   const block=section(html,'world-relationships'),death=section(html,'death-transition');
   for(const world of v.worldRelationships)for(const key of ['domain','relationship']){
    assert.ok(nonempty(world[key]),file+' world relationship missing '+key);
    equalVisible(block,world[key],file+' accessible world relationship '+key);
   }
   const domains=v.worldRelationships.map(world=>world.domain.toLocaleLowerCase(pt?'pt-BR':'en'));
   for(const test of pt?[/físic/,/anímic|alma/,/espiritual/]:[/physical/,/soul/,/spiritual/])assert.ok(domains.some(domain=>test.test(domain)),file+' physical, soul and spiritual domains');
   assert.ok(nonempty(v.deathTransition?.text),file+' separate death transition');
   equalVisible(death,v.deathTransition.text,file+' death transition text');
   assert.ok(!block.includes('id="death-transition"'),file+' death transition separated from parallel-world relationships');
   accessibleDiagrams(block,file+' world relationships',true);
  }
  if(lesson.id>=23&&lesson.id<=27){
   const gaps=[...(lesson.sourceGaps||[]),...(planned.sourceGaps||[])];
   if(gaps.length)assert.ok(Array.isArray(v.sourceNeeded)&&v.sourceNeeded.length>0,file+' existing application source gaps must remain visible');
   if(v.sourceNeeded!==undefined){
    assert.ok(Array.isArray(v.sourceNeeded)&&v.sourceNeeded.every(nonempty),file+' source-needed notes');
    if(v.sourceNeeded.length){const block=section(html,'source-needed');for(const note of v.sourceNeeded)equalVisible(block,note,file+' source-needed note');}
   }
   if(lesson.sourceAssignments.some(assignment=>assignment.locator.kind==='Markdown-marker'))assert.ok(v.sourceNeeded?.some(note=>/PDF|pagination|pagin[aã]|layout|diagrama/i.test(note)),file+' unverified Markdown/PDF layout limitation');
  }
  if(lesson.id===28){
   assert.ok(Array.isArray(v.conceptConnections)&&v.conceptConnections.length>=4,file+' conceptual architecture connections');
   const block=section(html,'concept-architecture'),edges=new Set(),nodes=new Set();
   for(const connection of v.conceptConnections){
    for(const key of ['from','to','reason']){
     assert.ok(nonempty(connection[key]),file+' conceptual connection missing '+key);
     equalVisible(block,connection[key],file+' accessible conceptual connection '+key);
    }
    assert.notEqual(connection.from,connection.to,file+' meaningful connection endpoints');
    const edge=JSON.stringify([connection.from,connection.to]);assert.ok(!edges.has(edge),file+' repeated conceptual connection');edges.add(edge);
    nodes.add(connection.from);nodes.add(connection.to);
   }
   assert.ok(nodes.size>=5,file+' architecture covers distinct concepts');
   accessibleDiagrams(block,file+' conceptual architecture');
   if(v.architectureNodes!==undefined){
    assert.ok(Array.isArray(v.architectureNodes)&&v.architectureNodes.length===9,file+' nine diagram nodes');
    const labels=[];
    for(const node of v.architectureNodes){
     assert.ok(nonempty(node.label),file+' diagram node label');
     assert.ok(Array.isArray(node.lines)&&node.lines.length>=1&&node.lines.length<=2&&node.lines.every(nonempty),file+' one or two diagram label lines');
     assert.equal(node.lines.join(' ').replace(/\s+/g,' ').trim(),node.label.replace(/\s+/g,' ').trim(),file+' line wrapping preserves the node label');
     labels.push(node.label);
    }
    assert.equal(new Set(labels).size,9,file+' distinct diagram nodes');
    assert.deepEqual([...nodes].sort(),[...labels].sort(),file+' all graph endpoints name the authored nodes');
    const opening=block.match(/<svg\b[^>]*>/);
    assert.ok(opening,file+' node data requires a diagram');
    const svg=wholeElement(block.slice(opening.index),opening[0]);
    const visibleLabels=[...svg.matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(match=>plain(match[0]));
    for(const label of labels)assert.ok(visibleLabels.includes(label),file+' visible diagram node '+label);
    assert.match(plain(block),pt?/Mapa original do curso/:/Original course map/,file+' graph identified as course synthesis');
   }
   assert.ok(Array.isArray(v.pathways)&&v.pathways.length>=4,file+' deeper-study pathways');
   const pathways=section(html,'pathways'),local=new Set();let ga13Book=false;
   for(const pathway of v.pathways){
    assert.ok(nonempty(pathway.title),file+' pathway title');equalVisible(pathways,pathway.title,file+' pathway title visible');
    assert.notEqual(nonempty(pathway.route),nonempty(pathway.note),file+' choose a real course route or book note');
    if(pathway.route){
     assert.ok(!/^(?:https?:|\/)|(?:^|\/)\.\.(?:\/|$)/.test(pathway.route),file+' local study route');
     const normalized=pathway.route.replace(/\/index\.html$/,'').replace(/\/$/,'');
     assert.ok(!/esoteric|occult|ga-?13/i.test(normalized),file+' GA13 has no existing course route');
     const target=path.resolve(pt?'docs/pt':'docs',normalized,'index.html');
     assert.ok(fs.existsSync(target),file+' real study course '+normalized);
     const linked=[...pathways.matchAll(/href="([^"]+)"/g)].some(([,href])=>path.resolve(path.dirname(file),href)===target);
     assert.ok(linked,file+' pathway link '+normalized);local.add(normalized);
    }else{
     equalVisible(pathways,pathway.note,file+' book recommendation note');
     if(/GA\s*13|esoteric|esotéric/i.test(pathway.title+' '+pathway.note))ga13Book=true;
    }
   }
   for(const existing of ['theosophy','philosophy-of-freedom','higher-worlds'])assert.ok(local.has(existing),file+' existing deeper course '+existing);
   assert.ok(ga13Book,file+' GA13 book recommendation without a dead course link');
  }
  assert.equal((sourceBlock.match(/data-intro-source-role=/g)||[]).length,lesson.sourceAssignments.length,file+' all source assignments visible');
  for(const assignment of lesson.sourceAssignments){
   assert.ok(sourceBlock.includes(`data-intro-source-id="${assignment.sourceId}"`),file+' source identity');
   const item=elementAt(sourceBlock,`data-intro-source-id="${assignment.sourceId}"`);
   const source=registry.get(assignment.sourceId),ga=assignment.ga??source.ga;
   assert.ok(item.includes(`data-intro-source-role="${assignment.role}"`),file+' source role');
   assert.ok(ga&&new RegExp(`\\bGA\\s*${ga}\\b`).test(plain(item)),file+' visible source GA');
   equalVisible(sourceBlock,assignment.section,file+' visible source section');
   equalVisible(item,assignment.voice,file+' visible source voice');
   assert.ok(plain(item).includes(source.title)||plain(item).includes(assignment.bookTitle||'\u0000'),file+' visible source book');
  }
  assert.equal((html.match(/data-intro-check=/g)||[]).length,v.checks.length,file+' authored checks rendered once');
  for(const [index,check] of v.checks.entries()){
   assert.ok(nonempty(check.question)&&nonempty(check.reason),file+' question and explanatory feedback');
   assert.ok(Array.isArray(check.options)&&check.options.length>=2&&check.options.length<=4&&check.options.every(nonempty),file+' meaningful options');
   assert.ok(Number.isInteger(check.answer)&&check.answer>=0&&check.answer<check.options.length,file+' valid answer');
   const block=elementAt(html,`data-intro-check="${index+1}"`);
   assert.ok(block.includes(`data-answer="${check.answer}"`),file+' rendered answer index');
   assert.equal((block.match(/type="radio"/g)||[]).length,check.options.length,file+' radio options');
   assert.ok(closedModel(block),file+' answers work without JavaScript');
   for(const text of [check.question,...check.options,check.reason])equalVisible(block,text,file+' missing question/answer explanation');
   checkCount++;
  }
  const before=course.availableLessonIds[course.availableLessonIds.indexOf(lesson.id)-1],after=course.availableLessonIds[course.availableLessonIds.indexOf(lesson.id)+1];
  for(const target of [before,after].filter(Boolean)){
   const targetLesson=map.lessons.find(entry=>entry.id===target);
   assert.ok(html.includes(`href="${padded(target)}.html"`),file+' missing adjacent lesson '+target);
   if(target===after)equalVisible(html,targetLesson[pt?'titlePt':'titleEn'],file+' next lesson title');
  }
 }
}

const js=fs.readFileSync('docs/introduction-anthroposophy.js','utf8');
assert.ok(js.includes('anthro-introduction-v1:'),'Independent optional progress namespace');
assert.ok(!/anthro-learning-v1:|anthro-study-v1:|data-learning-id|data-study-id/.test(js),'No access to legacy progress/controllers');
assert.ok(js.includes('try')&&js.includes('catch'),'Storage failure must not stop the course');
// The exclusion is both route- and ownership-specific; markers on an unrelated
// legacy course, extra route or unknown part never bypass its original checks.
const owned='<body data-introduction-owned="true">';
assert.equal(isIntroductionOwned(route+'/lessons/01.html',owned),true);
for(const unrelated of ['learn/lessons/01.html','lessons/01.html','higher-worlds/lessons/01.html',route+'/parts/unknown.html',route+'/private.html'])assert.equal(isIntroductionOwned(unrelated,owned),false,unrelated+' must retain its original validation');
assert.equal(isIntroductionOwned(route+'/lessons/01.html','<body>'),false,'Ownership required for the course-specific branch');
console.log(`Passed: Introduction architecture (28 lessons, seven parts), ${pageCount} available bilingual pages and ${checkCount} comprehension questions; provenance, navigation, source locators and isolated progress.`);
