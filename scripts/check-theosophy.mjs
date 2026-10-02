import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {wholeElement} from './learning-html.mjs';
import {introduction} from '../content/introduction.mjs';
import {lessons as chapter1} from '../content/lessons.mjs';
import {lessons as chapter2} from '../content/lessons-chapter-2.mjs';
import {lessons as chapter3} from '../content/lessons-chapter-3.mjs';
import {lessons as chapter4} from '../content/lessons-chapter-4.mjs';
import {applyFreedomConnections} from '../content/philosophy-of-freedom-connections.mjs';
import {loadTheosophyCourse} from '../content/theosophy-guided.mjs';

const lessons=[introduction,...chapter1,...chapter2,...chapter3,...chapter4];
assert.deepEqual(lessons.map(l=>l.id),Array.from({length:23},(_,id)=>id),'The complete book route must retain all 23 lesson IDs');
for(const [entries,chapter,first,last] of [[chapter1,1,1,6],[chapter2,2,7,9],[chapter3,3,10,17],[chapter4.slice(0,4),4,18,21]]){
  assert.equal(entries.length,last-first+1);
  assert.ok(entries.every(l=>l.chapter===chapter),'Chapter sequence changed');
}
for(const lang of ['en','pt']){
  for(const lesson of lessons){
    assert.equal(lesson[lang].length,6,`Lesson ${lesson.id}/${lang} is incomplete`);
    assert.ok(lesson[lang][2].every(p=>typeof p==='string'&&p.trim()));
  }
  for(const id of [18,21]){
    const original=lessons.find(l=>l.id===id);
    const supplemented=applyFreedomConnections([original],'theosophy')[0];
    assert.equal(supplemented[lang][3],original[lang][3],`A supplement replaced the main book exercise in ${id}/${lang}`);
  }
}

const assignedAddenda=new Set();
for(const lesson of lessons)for(const token of (lesson.notes||'').split(/[,;]/)){
  const match=token.trim().match(/^(\d+)(?:[–-](\d+))?$/);
  if(match)for(let n=Number(match[1]);n<=Number(match[2]||match[1]);n++)assignedAddenda.add(n);
}
assert.deepEqual([...assignedAddenda].sort((a,b)=>a-b),Array.from({length:13},(_,n)=>n+1),'All thirteen addenda must remain assigned');
assert.ok(lessons.find(l=>l.id===18).notes.split(/[,;–-]/).includes('8'),'Addendum 8 belongs with the path of knowledge');

const ledgers=[
  ['front-and-addenda',[...Array.from({length:28},(_,i)=>i+1),...Array.from({length:22},(_,i)=>i+207)]],
  ['chapter-1',Array.from({length:39},(_,i)=>i+29)],
  ['chapter-2',Array.from({length:30},(_,i)=>i+68)],
  ['chapter-3',Array.from({length:84},(_,i)=>i+98)],
  ['chapter-4',Array.from({length:25},(_,i)=>i+182)]
];
const reviewed=[];
for(const [suffix,expected] of ledgers){
  const text=fs.readFileSync(`content/theosophy-page-notes-${suffix}.md`,'utf8');
  let pageTable=false;const pages=[];
  for(const line of text.split('\n')){
    if(/^\| PDF page \|/.test(line)){pageTable=true;continue;}
    if(!line.startsWith('|')){pageTable=false;continue;}
    if(pageTable){
      const row=line.match(/^\|\s*(\d+)\s*\|/);
      if(row)pages.push(Number(row[1]));
    }
  }
  assert.deepEqual(pages,expected,`Incomplete or duplicated page notes in ${suffix}`);
  reviewed.push(...pages);
}
assert.deepEqual(reviewed.sort((a,b)=>a-b),Array.from({length:228},(_,i)=>i+1),'Every PDF page must have a reading record');

const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8')).filter(p=>p.course==='theosophy');
assert.equal(passages.length,23,'Each Theosophy lesson needs its own contextualized passage');
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),Array.from({length:23},(_,id)=>id));
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({'amp':'&','lt':'<','gt':'>','quot':'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
for(const p of passages){
  assert.equal(p.originalLanguage,'en');
  assert.equal(p.original,p.en.quote,'The source wording must be distinct from its Portuguese translation');
  assert.ok(p.edition.includes('1971')&&p.edition.includes('Monges')&&p.edition.includes('Church'),'Missing verified edition credit');
  assert.ok(Number.isInteger(p.pdfPage)&&p.pdfPage>=1&&p.pdfPage<=228,'Missing PDF locator');
  if(/^\d+$/.test(p.printedPage))assert.equal(p.pdfPage,Number(p.printedPage)+28,'Printed/PDF locator mismatch');
  assert.equal(p.sourceFile,'Theosophy -- Rudolf Steiner -- 1971 -- Anthroposophic Press -- 35a0e3779e08323bf09813009f1f2dca -- Anna’s Archive.pdf');
}
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
assert.ok(registry.some(s=>s.sha256==='ca555e2d7a13477b94b3012a53e929350756f9d9e3570381e639225f8e7876bc'&&s.contents_in_repository===false),'Supplied PDF provenance missing');

// The earlier edition stays intact for historical research and beginner lessons.
// The guided book course follows the newly supplied, PDF-verified edition.
assert.equal(JSON.parse(fs.readFileSync('content/passage-study.json','utf8')).length,177,'Historical passage bank changed');
assert.equal(JSON.parse(fs.readFileSync('content/learning-book-checks.json','utf8')).length,185,'Historical comprehension bank changed');
for(const [name,hash] of [['passage-study.json','f63c5c1d21c2a81f20ed4b93054aa0ddb9390890699fc2e035fd14c24364570f'],['learning-book-checks.json','37c3c7d96d754717713ba4ce67d1cdb5a6a4cca37f39bd6143820023d167df22']]){
 assert.equal(createHash('sha256').update(fs.readFileSync('content/'+name)).digest('hex'),hash,'Historical bank must remain byte-identical: '+name);
}
const course=loadTheosophyCourse(),source=course.source;
assert.equal(source.schemaVersion,1);
assert.equal(source.author,'Rudolf Steiner');
assert.equal(source.translator,'Elizabeth Douglas Shields');
assert.equal(source.translationYear,1910);
assert.equal(source.reissuePublisher,'Delhi Open Books');
assert.equal(source.pdfFile,'Teosophy new.pdf');
assert.equal(source.pdfCaptureCount,94);
assert.equal(source.locatorKind,'one-based-pdf-capture');
assert.equal(source.printedPaginationEstablished,false,'Do not invent printed page numbers');
assert.equal(source.bookMapCompleteBeforeLessonEditing,true);
assert.equal(source.contentsInRepository,false,'The supplied book is a private source');
for(const key of ['sha256','markdownSha256'])assert.match(source[key],/^[a-f0-9]{64}$/,'Source fingerprint '+key);
assert.equal(source.sha256,'809fa64f1d20a4311c8c12060a0157cb0d55399afb19d33d529def1efacd9911','Uploaded primary PDF fingerprint');
assert.equal(source.markdownSha256,'fdf9ed1e350cb1080d59de2b99f913b4a0cc5351c487fc954eb18e2615f8ec6a','Uploaded primary Markdown fingerprint');
assert.deepEqual(source.reviewedCaptureLedger.map(row=>row.capture),Array.from({length:94},(_,i)=>i+1),'Complete PDF capture coverage');
for(const row of source.reviewedCaptureLedger){
 assert.equal(row.pdfImageInspected,true,'Uninspected source image '+row.capture);
 assert.equal(row.markdownRead,true,'Unread source transcription '+row.capture);
 assert.equal(row.reliablePrintedPage,null,'Unestablished printed pagination');
 assert.ok(row.note?.trim()&&row.reviewGroup?.trim(),'Missing source review note');
}
assert.deepEqual(source.chapters.map(chapter=>chapter.number),[1,2,3,4]);
assert.deepEqual(source.chapters.map(chapter=>chapter.captures),[[13,31],[32,41],[42,81],[82,92]]);
assert.deepEqual(source.chapters.map(chapter=>chapter.plannedIds.length),[8,4,10,4]);
assert.equal(source.notes.count,9,'Primary edition notes differ from the later thirteen addenda');
assert.deepEqual(source.notes.captures,[93,94]);
assert.equal(source.parallelEdition.year,1971);
assert.equal(source.parallelEdition.translator,'Henry B. Monges, revised by Gilbert Church');
assert.deepEqual([...course.order].sort((a,b)=>a-b),Array.from({length:28},(_,i)=>i),'Preserved and added stable reading routes');
assert.deepEqual(course.lessons.map(lesson=>lesson.id),course.order,'Pedagogical order follows the source');
assert.equal(course.order[0],0);assert.equal(course.order.at(-1),22);

const verifiedPassages=source.verifiedLessonPassages;
assert.ok(Array.isArray(verifiedPassages),'Missing independently reviewed source passage ledger');
assert.equal(new Set(verifiedPassages.map(record=>record.id)).size,verifiedPassages.length,'Repeated verified passage identity');
let pagesChecked=0,questionsChecked=0;
for(const lesson of course.lessons){
 const final=lesson.id===22,chapter=course.chapters.find(c=>c.number===lesson.chapter);
 if(chapter){
  assert.ok(chapter.plannedIds.includes(lesson.id),'Reading assigned to the wrong source chapter');
  assert.match(lesson.number,new RegExp('^'+lesson.chapter+'\\.\\d+$'),'Chapter-based reading number');
  assert.equal(lesson.number,`${lesson.chapter}.${chapter.plannedIds.indexOf(lesson.id)+1}`,'Chapter reading progression');
 }
 if(!final){
  assert.equal(lesson.captures.length,2,'A source reading needs start/end captures');
  const [first,last]=lesson.captures;
  assert.ok(Number.isInteger(first)&&Number.isInteger(last)&&first<=last&&first>=1&&last<=94,'Source reading range');
  if(chapter)assert.ok(first>=chapter.captures[0]&&last<=chapter.captures[1],'Reading escaped its primary chapter');
  const allowed=chapter?[...chapter.sourceSections.map(s=>s.heading),chapter.sourceHeading,chapter.titleEn,chapter.subtitle].filter(Boolean):source.frontMatter.map(s=>s.heading);
  for(const heading of lesson.sourceSections||[])assert.ok(heading===null||allowed.includes(heading),'Invented source subsection '+heading);
 }
 if(lesson.passage?.en){
  assert.ok(Number.isInteger(lesson.passage.capture)&&lesson.passage.capture>=1&&lesson.passage.capture<=94,'Passage source capture');
  assert.ok(lesson.passage.pt?.trim(),'Passage needs an identified Portuguese study translation');
  assert.ok(lesson.passage.verification?.trim(),'Passage verification missing');
  const verified=verifiedPassages.find(record=>record.id===lesson.id);
  assert.ok(verified,'Unreviewed source selection '+lesson.id);
  assert.equal(verified.capture,lesson.passage.capture,'Selected source capture changed');
  assert.equal(verified.quoteEn,lesson.passage.en,'Selection differs from the PDF-reviewed source ledger');
  assert.ok(verified.verification?.trim(),'Independent source verification missing');
 }
 for(const lang of ['en','pt']){
  const v=lesson[lang],file=path.join(lang==='en'?'docs':'docs/pt','lessons',String(lesson.id).padStart(2,'0')+'.html');
  const html=fs.readFileSync(file,'utf8'),visible=plain(html);
  assert.ok(html.includes('data-theosophy-owned="true"'),file+' missing scoped ownership');
  assert.ok(html.includes('theosophy-study.css')&&html.includes('theosophy-study.js'),file+' missing scoped assets');
  assert.ok(visible.includes(v.title),file+' title missing');
  assert.ok(!html.includes('data-study-id=')&&!html.includes('data-learning-id=')&&!html.includes('data-note-field='),file+' mandatory legacy notebook returned');
  assert.ok(!html.includes('constitution-ref')&&!html.includes('constitution-entry'),file+' automatic cross-links returned');
  assert.ok(!/0–2 points|0 a 2 pontos|receive full marks|receber a pontuação máxima/.test(visible),file+' numerical grading returned');
  assert.equal((html.match(/class="learning-quiz"/g)||[]).length,final?0:2,file+' comprehension question count');
  const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
  const partner=path.join(lang==='en'?'docs/pt':'docs','lessons',path.basename(file));
  assert.ok(alternate,file+' language partner missing');
  assert.equal(path.resolve(path.dirname(file),alternate[1]),path.resolve(partner),file+' wrong language partner');
  if(!final){
   for(const key of ['title','question','before','example','distinction','matters','connection'])assert.ok(v[key]?.trim(),'Incomplete '+key+' '+lesson.id+'/'+lang);
   assert.ok(v.explanation.length>=2&&v.explanation.length<=5,'Focused source explanation '+lesson.id+'/'+lang);
   assert.ok(v.explanation.every(paragraph=>typeof paragraph==='string'&&paragraph.trim()),'Empty source explanation');
   assert.ok(v.term?.label?.trim()&&v.term?.definition?.trim(),'Missing attributed key term');
   assert.ok(html.indexOf('id="book-passage"')>=0&&html.indexOf('id="book-passage"')<html.indexOf('id="study-explanation"'),file+' source must precede explanation');
   assert.ok(visible.includes(source.translator)&&visible.includes('1910'),file+' primary translation credit missing');
   const sourceStart=html.lastIndexOf('<section',html.indexOf('id="book-passage"'));
   const sourceBlock=wholeElement(html.slice(sourceStart),'<section');
   assert.ok(!/(?:pp?\.|pages? impressas?)\s*\d/.test(plain(sourceBlock)),file+' guessed primary printed pagination');
   assert.equal(v.checks.length,2);
   for(const check of v.checks){
    assert.ok(check.question?.trim()&&check.explanation?.trim(),'Missing comprehension feedback');
    assert.ok(check.options.length>=2&&check.options.length<=4&&check.options.every(option=>typeof option==='string'&&option.trim()),'Choice alternatives');
    assert.ok(Number.isInteger(check.answer)&&check.answer>=0&&check.answer<check.options.length,'Choice answer range');
    assert.ok(visible.includes(check.question)&&visible.includes(check.explanation),file+' missing comprehension text');
    questionsChecked++;
   }
   assert.deepEqual(v.checks.map(c=>c.answer),lesson[lang==='en'?'pt':'en'].checks.map(c=>c.answer),'Translated answers changed');
  }else{
   const synthesis=lesson.synthesis?.[lang];
   assert.ok(synthesis,'Missing final book synthesis '+lang);
   for(const key of ['map','concepts','distinctions','argument','unresolved']){
    assert.ok(Array.isArray(synthesis[key])&&synthesis[key].length>0,'Missing final synthesis '+key+' '+lang);
    for(const text of synthesis[key]){
     assert.ok(typeof text==='string'&&text.trim(),'Empty final synthesis '+key);
     assert.ok(visible.includes(text.replace(/\s+/g,' ').trim()),file+' missing final synthesis '+key);
    }
   }
   assert.ok(synthesis.map.length>=4&&synthesis.argument.length>=2,'Final synthesis needs connected book architecture');
   for(const key of ['task','model']){
    assert.ok(synthesis[key]?.trim().length>50,'Missing whole-book reconstruction '+key);
    assert.ok(visible.includes(synthesis[key].replace(/\s+/g,' ').trim()),file+' missing final '+key);
   }
   assert.ok(html.indexOf('id="book-passage"')>=0&&html.indexOf('id="book-passage"')<html.indexOf('id="study-explanation"'),file+' whole-book source assignment must precede reconstruction');
   const deeper=wholeElement(html,'<section class="theosophy-deeper-task"');
   assert.ok(deeper,file+' final deeper task missing');
   const model=wholeElement(deeper,'<details');
   assert.ok(model&&!/^<details\b[^>]*\bopen(?:\s|>)/.test(model),file+' optional model must begin closed');
   assert.ok(plain(model).includes(synthesis.model.replace(/\s+/g,' ').trim()),file+' model reconstruction missing');
   assert.ok(Array.isArray(synthesis.further)&&synthesis.further.length>=1&&synthesis.further.length<=2,'Keep final further study selective');
   for(const link of synthesis.further){
    assert.ok(link.title?.trim()&&link.description?.trim(),'Incomplete further-study reference');
    assert.match(link.route,/^[a-z0-9-]+\/index\.html$/,'Further study must identify a book course');
    const target=path.join(lang==='en'?'docs':'docs/pt',link.route);
    assert.ok(fs.existsSync(target),'Further-study book route missing');
    const href=path.relative(path.dirname(file),target).replaceAll('\\','/');
    assert.ok(html.includes(`href="${href}"`)&&visible.includes(link.title)&&visible.includes(link.description),file+' further-study reference missing');
   }
  }
  if(lesson.passage?.[lang]){
   const excerpt=html.match(/<blockquote class="source-excerpt">([\s\S]*?)<\/blockquote>/);
   assert.ok(excerpt,file+' source excerpt missing');
   assert.equal(plain(excerpt[1]),lesson.passage[lang].replace(/\s+/g,' ').trim(),file+' rendered excerpt changed');
  }else assert.ok(!html.includes('class="source-excerpt"'),file+' invented excerpt for a source assignment');
  const nav=html.match(/<nav class="lesson-navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,file+' reading navigation missing');
  const position=course.order.indexOf(lesson.id),next=course.byId.get(course.order[position+1]);
  if(next){assert.ok(nav.includes(String(next.id).padStart(2,'0')+'.html'),file+' wrong next route');assert.ok(plain(nav).includes(next[lang].title),file+' next title missing');}
  pagesChecked++;
 }
}
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt',index=fs.readFileSync(base+'/theosophy/index.html','utf8');
 assert.ok(index.includes('data-theosophy-owned="true"')&&index.includes('id="structured-readings"'),'Canonical Theosophy index');
 assert.equal((index.match(/data-theosophy-progress="theosophy\/\d{2}"/g)||[]).length,28,'One canonical reading map');
 assert.ok(index.includes('data-theosophy-resume'),'Course-scoped continue control');
 for(const chapter of course.chapters){
  const file=base+'/theosophy/chapters/book-'+chapter.slug+'.html',html=fs.readFileSync(file,'utf8');
  assert.ok(html.includes('data-theosophy-owned="true"'),'Scoped chapter landing');
  assert.ok(plain(html).includes(chapter.sourceTitle),'Original chapter heading missing');
  for(const key of ['map','concepts','distinctions','argument'])assert.ok(chapter.synthesis[lang][key].length,'Incomplete chapter synthesis '+key);
  assert.ok(chapter.synthesis[lang].concepts.length>=5&&chapter.synthesis[lang].concepts.length<=8,'Chapter synthesis concept count');
  assert.ok(chapter.synthesis[lang].task?.trim()&&chapter.synthesis[lang].model?.trim(),'Chapter-end deeper reconstruction');
  assert.ok(plain(html).includes(chapter.synthesis[lang].task)&&plain(html).includes(chapter.synthesis[lang].model),'Chapter synthesis task/model missing');
  const covered=new Set(chapter.lessons.flatMap(lesson=>Array.from({length:lesson.captures[1]-lesson.captures[0]+1},(_,i)=>lesson.captures[0]+i)));
  for(let capture=chapter.captures[0];capture<=chapter.captures[1];capture++)assert.ok(covered.has(capture),'Primary chapter capture missing from guided assignments: '+capture);
 }
}
console.log(`Passed: 94 PDF-reviewed primary captures, 28 guided reading routes, ${pagesChecked} bilingual readings and ${questionsChecked} comprehension questions; four chapter syntheses and intact 1971 research/177-passage/185-question banks.`);
