import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {biodynamicCourseData, readBiodynamicJSON, assertBiodynamicPublicationReady, assertBiodynamicCourseLayout} from './biodynamic-course-data.mjs';
import {esc} from './learning-html.mjs';

const {course,parts,lessons}=biodynamicCourseData();
for (const invalidRoute of ['../../../docs/biodynamics','/biodynamics','other-course']) {
  assert.throws(()=>assertBiodynamicCourseLayout({...course,route:invalidRoute}),/Fixed biodynamic course route/,'Reject a route before any output write');
}
const invalidParts=structuredClone(course);
invalidParts.parts[0].slug='../../../docs/index';
assert.throws(()=>assertBiodynamicCourseLayout(invalidParts),/Fixed ordered biodynamic part routes/,'Reject traversal in a part route before any output write');
const root=path.resolve(process.argv.includes('--draft')||course.status==='draft'?'.sites-runtime/biodynamic-course-preview/docs':'docs');
if(process.argv.includes('--draft')||course.status==='draft'){
  const preview=spawnSync(process.execPath,['scripts/build-biodynamic-agriculture.mjs','--draft'],{encoding:'utf8'});
  assert.equal(preview.status,0,'Fresh private course build: '+preview.stderr);
}
const modern=readBiodynamicJSON('biodynamic-modern-evidence.json');
const library=readBiodynamicJSON('biodynamic-practice-library.json');
const oldMap=readBiodynamicJSON('agriculture-source-map.json');
const expected=[[1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15,16],[17,18,19,20],[21,22,23,24]];
assert.deepEqual(parts.map(part=>part.lessonIds),expected);
assert.deepEqual(lessons.map(lesson=>lesson.id),Array.from({length:24},(_,i)=>i+1));
assert.equal(course.canonical.id,'creeger');
assert.equal(course.comparison.id,'adams');
assert.notEqual(course.canonical.sha256,course.comparison.sha256);
assert.equal(parts.length,6);

if(course.status==='draft'){
  assert.throws(()=>assertBiodynamicPublicationReady(course),/publication is blocked/);
  const refused=spawnSync(process.execPath,['scripts/build-biodynamic-agriculture.mjs'],{encoding:'utf8'});
  assert.notEqual(refused.status,0,'Unverified draft must not write public course pages');
  assert.match(refused.stderr,/publication is blocked/);
}else assertBiodynamicPublicationReady(course);

if(course.sourceAuthority==='supplied-markdown') {
  assert.equal(course.canonical.paginationKind,'markdown-capture');
  assert.equal(course.canonical.pdfVerified,false,'Markdown authority does not certify PDF inspection');
  assert.equal(course.comparison.pdfVerified,false);
  assert.equal(course.canonical.printedPaginationVerified,false);
  assertBiodynamicPublicationReady({...course,status:'ready'});
  for(const key of ['sourcePassagesAndLocatorsVerified','diagramProvenanceVerified','modernSourcesVerified','legacyMigrationVerified','browserChecksPassed']) {
    const incomplete=structuredClone(course);incomplete.status='ready';incomplete.publicationChecks[key]=false;
    assert.throws(()=>assertBiodynamicPublicationReady(incomplete),/publication is blocked/,'Required Markdown release check: '+key);
  }
  for(const key of ['canonical','comparison']) {
    const incomplete=structuredClone(course);incomplete.status='ready';incomplete[key].markdownVerified=false;
    assert.throws(()=>assertBiodynamicPublicationReady(incomplete),/publication is blocked/,'Verified Markdown witness: '+key);
  }
  assert.throws(()=>assertBiodynamicPublicationReady({...course,sourceAuthority:'unknown'}),/publication is blocked/);
  assert.throws(()=>assertBiodynamicPublicationReady({...course,sourceAuthority:'supplied-pdf'}),/publication is blocked/,'PDF authority still requires actual PDF verification');
}

const sourceArg=process.argv.indexOf('--canonical-md');
let captureText;
if(sourceArg>=0){
  const source=fs.readFileSync(process.argv[sourceArg+1],'utf8');
  assert.equal(createHash('sha256').update(source).digest('hex'),course.canonical.sha256,'Actual canonical Markdown fingerprint');
  const blocks=source.split(/<!-- page: (\d+) -->/);
  captureText=new Map();
  for(let i=1;i<blocks.length;i+=2)captureText.set(Number(blocks[i]),blocks[i+1]);
  assert.equal(captureText.size,course.canonical.captureCount);
}
const comparisonArg=process.argv.indexOf('--comparison-md');
if(comparisonArg>=0){
  const source=fs.readFileSync(process.argv[comparisonArg+1],'utf8');
  assert.equal(createHash('sha256').update(source).digest('hex'),course.comparison.sha256,'Actual comparison Markdown fingerprint');
  assert.equal([...source.matchAll(/<!-- page: (\d+) -->/g)].length,course.comparison.captureCount);
}
const normalized=value=>value.normalize('NFKC').replace(/\s+/g,' ').trim();
const answers=new Set();
for(const part of parts)for(const lang of ['en','pt']){
  const v=part[lang];
  assert.ok(v.question&&v.sources&&v.outcomes.length>=3);
  assert.ok(v.synthesis.summary.length&&v.synthesis.steps.length>=3&&v.synthesis.question&&v.synthesis.answer.length);
}
for(const lesson of lessons){
  const source=lesson.source;
  assert.ok(source.quoteEn&&source.quotePt&&source.date);
  assert.ok(source.quoteEn.trim().split(/\s+/).length<=50,'Concise source passage '+lesson.id);
  assert.ok(source.captures.includes(source.quoteCapture),'Quotation belongs to reading assignment '+lesson.id);
  assert.ok(source.captures.every(number=>Number.isInteger(number)&&number>=1&&number<=192));
  if(source.lecture){
    const lecture=oldMap.lectures.find(row=>row.number===source.lecture);
    assert.ok(lecture,'Real GA327 lecture '+lesson.id);
    assert.equal(source.date,lecture.date,'Actual lecture date '+lesson.id);
    assert.ok(source.quoteCapture>=lecture.creeger.first&&source.quoteCapture<=lecture.creeger.last,'Quote capture in dated lecture '+lesson.id);
  }else assert.ok(source.sectionEn&&source.sectionPt,'Separate source context labelled '+lesson.id);
  if(captureText)assert.ok(normalized(captureText.get(source.quoteCapture)).includes(normalized(source.quoteEn)),`Exact canonical OCR passage at lesson ${lesson.id}, capture ${source.quoteCapture}`);
  for(const lang of ['en','pt']){
    const v=lesson[lang];
    for(const field of ['question','intro','proposal','example','anthroposophy','modernContext','limits','connection'])assert.ok(v[field]&&(typeof v[field]==='string'||v[field].length),`${lesson.id}/${lang}/${field}`);
    assert.ok(v.proposal.length>=2&&v.model.length>=3,'Developed mechanism '+lesson.id+'/'+lang);
    assert.equal(v.checks.length,3,'Two comprehension checks and one transfer '+lesson.id+'/'+lang);
    assert.equal(v.checks[2].type,'reflection');
    for(const check of v.checks.slice(0,2)){
      assert.ok(check.question&&check.explanation&&check.options.length>=2&&check.options.length<=4);
      assert.ok(Number.isInteger(check.answer)&&check.answer>=0&&check.answer<check.options.length);
      assert.ok(!/do you believe|você acredita/i.test(check.question),'Test understanding rather than belief');
      answers.add(check.answer);
    }
    assert.ok(v.observe.task.length&&v.observe.record.length>=2&&v.observe.interpretation);
    for(const id of v.modernReferences||[])assert.ok(modern.sources.some(source=>source.id===id),'Known reference '+id);
    for(const table of v.tables||[]){assert.ok(table.caption&&table.headers.length>=2&&table.rows.length);for(const row of table.rows)assert.equal(row.length,table.headers.length);}
    const filename=path.join(root,lang==='pt'?'pt':'','biodynamics','lessons',String(lesson.id).padStart(2,'0')+'.html');
    const html=fs.readFileSync(filename,'utf8');
    for(const field of ['question','intro','proposal','example','anthroposophy','modernContext','limits','connection'])for(const paragraph of Array.isArray(v[field])?v[field]:[v[field]])assert.ok(html.includes(esc(paragraph)),`Current authored ${field} is rendered at ${lesson.id}/${lang}`);
    assert.ok(html.includes(esc(source[lang==='pt'?'quotePt':'quoteEn'])),'Source is rendered '+filename);
    assert.ok(html.includes(`data-study-id="biodynamics/${String(lesson.id).padStart(2,'0')}"`),'Distinct notebook identity '+filename);
    assert.equal((html.match(/data-note-field=/g)||[]).length,6,'All six notebook fields '+filename);
    assert.equal((html.match(/data-biodynamic-source/g)||[]).length,1);
    assert.ok(html.includes('data-reading-view'),'Shared notebook reading control '+filename);
    const question=html.indexOf('class="bio-question"'),read=html.indexOf('data-biodynamic-source'),proposal=html.indexOf('class="bio-proposal"'),model=html.indexOf('class="bio-process"'),example=html.indexOf('class="bio-example"');
    assert.ok(question<read&&read<proposal&&proposal<model&&model<example,'Agricultural source sequence '+filename);
    assert.ok(html.includes('Part contents')||html.includes('Conteúdo da parte'));
    if(process.argv.includes('--draft')||course.status==='draft')assert.ok(html.includes('class="bio-draft"'));
    else assert.ok(!html.includes('class="bio-draft"'),'Public course contains no private-preview banner');
    if(course.sourceAuthority==='supplied-markdown') {
      assert.equal(source.markdownVerified,true);
      assert.ok(html.includes(lang==='pt'?'Capturas ':'Canonical Markdown captures '),'Accurate Markdown source label');
      assert.ok(!html.includes('Canonical PDF pages')&&!html.includes('Canonical printed edition pages'),'Do not relabel Markdown captures as book/PDF pages');
    }
  }
  assert.deepEqual(lesson.en.checks.slice(0,2).map(row=>row.answer),lesson.pt.checks.slice(0,2).map(row=>row.answer));
}
for(const lang of ['en','pt']){
  for(const data of [lessons.find(lesson=>lesson.id===11)[lang].cycle,parts.find(part=>part.id===3)[lang].synthesis.cycle]){
    assert.ok(data?.caption&&data.start.length>=2&&data.paths.length>=2&&data.note&&data.credit,'Branched farm cycle '+lang);
    assert.ok(data.paths.some(route=>route.returns.length>=2),'Manure has alternative return routes '+lang);
  }
  const cycleFiles=['lessons/11.html','parts/farm-organism.html'];
  for(const file of cycleFiles)assert.ok(fs.readFileSync(path.join(root,lang==='pt'?'pt':'','biodynamics',file),'utf8').includes('data-farm-cycle'),'Actual branched figure '+lang+'/'+file);
}
assert.ok(answers.size>=3,'Vary correct-option positions');
for(const lang of ['en','pt']){
  const last=lessons.at(-1)[lang].project;
  assert.ok(last?.title&&last.tasks.length>=4&&last.model.length>=3,'Longitudinal final project '+lang);
}
assert.equal(library.categories.length,5);
assert.ok(library.categories.flatMap(category=>category.entries).length>=12);
const libraryIds=new Set();
for(const category of library.categories){
  assert.ok(category.id&&category.titleEn&&category.titlePt&&category.entries.length,'Named bilingual practice category');
  assert.ok(!libraryIds.has(category.id),'Unique practice category anchor');libraryIds.add(category.id);
  for(const entry of category.entries){
    assert.ok(entry.id&&entry.titleEn&&entry.titlePt&&!libraryIds.has(entry.id),'Unique bilingual practice entry');libraryIds.add(entry.id);
    assert.ok(lessons.some(lesson=>lesson.id===entry.lessonId),'Practice connects to a real source-led lesson');
    for(const lang of ['en','pt']){
      assert.ok(entry[lang]?.observation?.length&&entry[lang].steiner&&entry[lang].later&&entry[lang].evidence,'Complete practice provenance '+entry.id+'/'+lang);
      const html=fs.readFileSync(path.join(root,lang==='pt'?'pt':'','biodynamics/practice/index.html'),'utf8');
      for(const field of ['steiner','later','evidence'])assert.ok(html.includes(esc(entry[lang][field])),'Current library provenance is rendered '+entry.id+'/'+field);
    }
  }
}

let pages=0;
for(const lang of ['en','pt']){
  const prefix=lang==='pt'?'pt/':'';
  const dir=path.join(root,prefix,'biodynamics');
  const files=fs.readdirSync(dir,{recursive:true}).filter(name=>name.endsWith('.html'));
  assert.equal(files.length,34,'Index, six parts, 24 lessons, library, sources and background '+lang);
  for(const name of files){
    const file=path.join(dir,name),html=fs.readFileSync(file,'utf8');pages++;
    assert.ok(html.includes(`<html lang="${lang==='pt'?'pt-BR':'en'}">`));
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert.equal((html.match(/<script\b/g)||[]).length,(html.match(/<\/script>/g)||[]).length,'Closed script elements '+file);
    const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
    assert.equal(new Set(ids).size,ids.length,'Unique IDs '+file);
    assert.ok(!/sediment:\/\/|\/workspace\/attachments\/|file_0000|pages XX|páginas XX/i.test(html),'No private paths or fake pagination '+file);
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      const href=match[1];if(/^(https?:|data:|mailto:)/.test(href))continue;
      const [resource,anchor]=href.split('#'),targetName=resource.split('?')[0];
      let target=targetName?path.resolve(path.dirname(file),targetName):file;
      assert.ok(target.startsWith(root+path.sep),'Local link inside docs '+href);
      if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
      assert.ok(fs.existsSync(target),file+' missing '+href);
      if(anchor)assert.ok(fs.readFileSync(target,'utf8').includes(`id="${anchor}"`),file+' missing anchor '+href);
    }
    const alternate=html.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
    assert.ok(alternate);
    assert.equal(path.resolve(path.dirname(file),alternate[1]),path.join(root,lang==='pt'?'':'pt','biodynamics',name),'Correct EN/PT partner');
  }
  const index=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  assert.equal((index.match(/class="bio-card"/g)||[]).length,6,'Six part cards');
  assert.equal((index.match(/href="lessons\//g)||[]).length,2,'No duplicated 24-lesson listing');
  assert.ok(index.includes('data-biodynamic-resume')&&index.includes('practice/index.html'));
}
console.log(`Biodynamic Agriculture checks passed: ${pages} paired-course pages, 24 source-led lessons, six syntheses, isolated study identities, library, links and publication gate${captureText?', exact canonical Markdown excerpts':''}.`);
