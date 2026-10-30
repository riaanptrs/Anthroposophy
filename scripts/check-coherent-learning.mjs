import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {wholeElement} from './learning-html.mjs';

// This checks the visible teaching contract rather than the historical nested
// lesson layouts. It also works with Windows filesystem separators.
const root=path.resolve(process.argv.includes('--docs-dir')?process.argv[process.argv.indexOf('--docs-dir')+1]:'docs');
const globalOnly=process.argv.includes('--global-only');
const skipLinks=process.argv.includes('--content-only');
const baselineOption=process.argv.indexOf('--baseline');
const baseline=baselineOption>=0?process.argv[baselineOption+1]:'HEAD';
const baselineCommit=execFileSync('git',['rev-parse',baseline],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const files=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html')).map(f=>f.replaceAll('\\','/')).sort();
const pages=new Map(files.map(route=>[route,fs.readFileSync(path.join(root,route),'utf8')]));
const errors=[];
const counters={htmlPages:files.length,localLinks:0,canonicalLessons:0,foundations:0,theosophy:0,pathwayPages:0,mapPages:0};
const clarity=JSON.parse(fs.readFileSync(new URL('../content/foundations-introduction-clear-lessons.json',import.meta.url),'utf8'));
const theosophyClarity=JSON.parse(fs.readFileSync(new URL('../content/theosophy-clear-lessons.json',import.meta.url),'utf8'));
const decoded=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ');
const plain=s=>decoded(s.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const fail=(route,message)=>errors.push(`${route}: ${message}`);
const idCache=new Map();
const allIds=html=>{
 if(!idCache.has(html))idCache.set(html,[...html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)].map(m=>decoded(m[2])));
 return idCache.get(html);
};
const hasId=(html,id)=>allIds(html).includes(id);
const targetCache=new Map();
const resolveTarget=target=>{
 const requested=target;
 if(!targetCache.has(target)){
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  targetCache.set(requested,{target,exists:fs.existsSync(target)});
 }
 return targetCache.get(requested);
};
const block=(html,token)=>{
 const tag=html.match(new RegExp(`<\\w+\\b[^>]*\\bclass=["'][^"']*\\b${token}\\b[^"']*["'][^>]*>`))?.[0];
 return tag?wholeElement(html,tag):null;
};
const originalSource=(html,route)=>{
 if(/^(?:pt\/)?learn\/lessons\//.test(route))return block(html,'learning-source');
 if(/^(?:pt\/)?introduction-to-anthroposophy\/lessons\//.test(route)){
  const tag=html.match(/<section\b[^>]*\sid=["']source["'][^>]*>/)?.[0];
  return tag?wholeElement(html,tag):null;
 }
 if(/^(?:pt\/)?theosophy\/lessons\//.test(route))return block(html,'cp-sources');
 return null;
};
// One Git process reads all baselines; spawning one process per lesson makes
// this unnecessarily slow on Windows and adds no verification value.
const headSources=new Map();
if(!globalOnly){
 const wanted=[...pages].filter(([route,html])=>/\bdata-lesson-flow=["']canonical["']/.test(html)&&/^(?:pt\/)?(?:learn|introduction-to-anthroposophy|theosophy)\/lessons\/[^/]+\.html$/.test(route)).map(([route])=>route);
 if(wanted.length)try{
  const result=execFileSync('git',['cat-file','--batch'],{input:wanted.map(route=>baselineCommit+':docs/'+route).join('\n')+'\n',maxBuffer:50e6,stdio:['pipe','pipe','pipe']});
  let offset=0;
  for(const route of wanted){
   const end=result.indexOf(10,offset),header=result.subarray(offset,end).toString('utf8');offset=end+1;
   const size=header.match(/ blob (\d+)$/)?.[1];
   if(size===undefined){headSources.set(route,null);continue;}
   const bytes=Number(size);headSources.set(route,result.subarray(offset,offset+bytes).toString('utf8'));offset+=bytes+1;
  }
 }catch(error){errors.push('Unable to load Git source baselines: '+error.message.split('\n')[0]);}
}

for(const [route,html] of pages){
 const ids=allIds(html);
 if(new Set(ids).size!==ids.length)fail(route,'duplicate id');
 if((html.match(/<h1\b/gi)||[]).length!==1)fail(route,'expected one h1');
 if(!/<meta\b[^>]*name=["']viewport["']/i.test(html))fail(route,'missing responsive viewport');
 const language=html.match(/<html\b[^>]*\blang=["']([^"']+)/i)?.[1];
 if(!['en','pt-BR'].includes(language))fail(route,'missing supported document language');
 if(route.startsWith('pt/')&&language!=='pt-BR')fail(route,'Portuguese route has incorrect language');
 for(const m of skipLinks?[]:html.matchAll(/\s(?:href|src)\s*=\s*(["'])(.*?)\1/gi)){
  const href=decoded(m[2]);
  if(!href||/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href))continue;
  let url;
  try{url=new URL(href,`https://local.test/${route}`);}catch{fail(route,`invalid local URL ${href}`);continue;}
  if(url.hostname!=='local.test')continue;
  let relative;
  try{relative=decodeURIComponent(url.pathname).replace(/^\//,'');}catch{fail(route,`invalid encoded URL ${href}`);continue;}
  let target=path.resolve(root,relative);
  if(target!==root&&!target.startsWith(root+path.sep)){fail(route,`link leaves publishing directory ${href}`);continue;}
  const resolution=resolveTarget(target);target=resolution.target;
  counters.localLinks++;
  if(!resolution.exists){fail(route,`missing local target ${href}`);continue;}
  if(url.hash&&target.endsWith('.html')){
   const targetRoute=path.relative(root,target).replaceAll('\\','/');
   // The documentary uses its existing hash router for reader and lesson views.
   if(/(?:^|\/)learn\/steiner-documentary\/index\.html$/.test(targetRoute)&&/^#\//.test(url.hash))continue;
   let id;
   try{id=decodeURIComponent(url.hash.slice(1));}catch{fail(route,`invalid encoded anchor ${href}`);continue;}
   if(id&&!hasId(pages.get(targetRoute)||fs.readFileSync(target,'utf8'),id))fail(route,`missing anchor ${href}`);
  }
 }
 if(globalOnly)continue;
 if(/\bdata-lesson-flow=["']canonical["']/.test(html)){
  counters.canonicalLessons++;
  const expected=['question','experience','idea','relationship','distinction','apply','check','depth','next'];
  const actual=[...html.matchAll(/\bdata-flow-step=["']([^"']+)["']/g)].map(m=>m[1]);
  if(JSON.stringify(actual)!==JSON.stringify(expected))fail(route,`teaching steps must appear once in order; found ${actual.join(', ')}`);
  const main=wholeElement(html,html.match(/<main\b[^>]*>/)?.[0]||'<main');
  for(const step of expected){
   const tag=html.match(new RegExp(`<\\w+\\b[^>]*\\bdata-flow-step=["']${step}["'][^>]*>`))?.[0];
   const section=tag&&wholeElement(html,tag);
   if(!section||plain(section).length<15)fail(route,`empty ${step} teaching step`);
   if(step==='depth'&&section&&(!/^<details\b/.test(section)||/^<details\b[^>]*\bopen(?:\s|>|=)/.test(section)))fail(route,'Go Deeper must be closed by default');
  }
  for(const legacy of ['learning-meaning','learning-development','learning-checks','foundation-next'])if(block(main,legacy))fail(route,`duplicated legacy teaching section ${legacy}`);
  const pt=route.startsWith('pt/'),partner=pt?route.slice(3):'pt/'+route;
  if(!pages.has(partner))fail(route,'canonical lesson missing language counterpart');
  else if(!/\bdata-lesson-flow=["']canonical["']/.test(pages.get(partner)))fail(route,'language counterpart does not use the same teaching flow');
  const numericLesson=/^(?:pt\/)?(?:learn|introduction-to-anthroposophy)\/lessons\/\d{2}\.html$/.test(route);
  const theosophyLesson=/^(?:pt\/)?theosophy\/lessons\/[^/]+\.html$/.test(route);
  if(numericLesson){
   const course=route.includes('introduction-to-anthroposophy/')?'introduction-to-anthroposophy':'foundations';
   const row=clarity.find(r=>r.course===course&&r.id===Number(path.basename(route,'.html'))),copy=row?.[pt?'pt':'en'];
   if(!copy)fail(route,'no reviewed clarity lesson data');
   else for(const value of [copy.goal,...copy.paragraphs,...copy.checks.flat()])if(!plain(main).includes(value.replace(/\s+/g,' ').trim()))fail(route,'reviewed teaching paragraph, question or answer missing');
  }
  if(theosophyLesson){
   counters.theosophy++;
   const copy=theosophyClarity.find(r=>r.id===path.basename(route,'.html'))?.[pt?'pt':'en'];
   if(!copy)fail(route,'no reviewed Theosophy clarity lesson data');
   else for(const value of [...copy.paragraphs,...copy.checks.flat()])if(!plain(main).includes(value.replace(/\s+/g,' ').trim()))fail(route,'reviewed Theosophy paragraph, question or answer missing');
   for(const hook of ['data-concept-save','data-concept-state','data-concept-bookmark','data-concept-reflection','data-concept-export','data-concept-delete','data-concept-status'])if(!html.includes(hook))fail(route,`missing preserved study control ${hook}`);
  }
  if(numericLesson||theosophyLesson){
   try{
    const before=headSources.get(route);
    if(!before)throw Error('Git baseline is unavailable');
    const source=originalSource(before,route);
    if(source&&!html.includes(source))fail(route,'original source evidence changed or missing');
    const beforeMain=wholeElement(before,before.match(/<main\b[^>]*>/)?.[0]||'<main');
    for(const id of allIds(beforeMain))if(!hasId(html,id))fail(route,`historical deep-link anchor removed: ${id}`);
    const commentary=route.replace('/lessons/','/commentary/');
    const retained=pages.get(commentary)||'';
    const quotes=[...before.matchAll(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi)].map(m=>plain(m[1]));
    for(const quote of new Set(quotes))if(quote&&!plain(html+retained).includes(quote))fail(route,'source quotation changed or missing');
   }catch(error){fail(route,`unable to check source preservation against HEAD: ${error.message.split('\n')[0]}`);}
  }
  if(/^(?:pt\/)?learn\/lessons\/\d{2}\.html$/.test(route)){
   counters.foundations++;
   const id=Number(path.basename(route,'.html'));
   for(const hook of ['data-learning-id','data-learning-save','data-learning-note','data-learning-complete','data-learning-export','data-learning-delete'])if(!html.includes(hook))fail(route,`missing preserved study control ${hook}`);
   const next=html.match(/<\w+\b[^>]*\bdata-flow-step=["']next["'][^>]*>/)?.[0];
   const nextBlock=next&&wholeElement(html,next);
   if(id<36&&!nextBlock?.includes(`href="${String(id+1).padStart(2,'0')}.html"`))fail(route,'next step does not link to following Foundations lesson');
   if(id>1&&!html.includes(`href="${String(id-1).padStart(2,'0')}.html"`))fail(route,'missing previous Foundations lesson');
  }
 }
 if(/\bdata-learning-pathways=["']true["']/.test(html)){
  counters.pathwayPages++;
  const pathways=[...html.matchAll(/\bdata-pathway=["']([^"']+)["']/g)].map(m=>m[1]);
  if(pathways.length!==7||new Set(pathways).size!==7)fail(route,'expected seven distinct learning pathways');
  if(!html.includes('foundations/index.html'))fail(route,'missing canonical beginner course');
 }
 if(/^(?:pt\/)?reference\/anthroposophy-map\.html$/.test(route)){
  counters.mapPages++;
  const maps=[...html.matchAll(/\bdata-concept-map=["']([^"']+)["']/g)].map(m=>m[1]);
  if(new Set(maps).size<6)fail(route,'expected six distinct concept maps');
  if(!/Steiner/.test(plain(html)))fail(route,'maps need attributed framework language');
  for(const marker of [...html.matchAll(/<figure\b[^>]*\bdata-concept-map=["']([^"']+)["'][^>]*>/g)]){
   const figure=wholeElement(html.slice(marker.index),marker[0]);
   if(!/<figcaption\b/.test(figure))fail(route,`map ${marker[1]} missing visible caption`);
   const label=marker[0].match(/\baria-labelledby=["']([^"']+)/)?.[1];
   if(!label||!hasId(figure,label))fail(route,`map ${marker[1]} missing accessible caption relationship`);
   if(plain(figure).length<100)fail(route,`map ${marker[1]} needs visible explanatory text`);
  }
 }
 if(/^(?:pt\/)?introduction-to-anthroposophy\/overview\.html$/.test(route)){
  const parts=[...html.matchAll(/\bid=["']overview-part-([1-7])["']/g)].map(m=>m[1]);
  if(parts.length!==7||new Set(parts).size!==7)fail(route,'short overview must contain seven distinct parts');
  if(!html.includes('foundations/index.html'))fail(route,'short overview must identify Foundations as the full beginner course');
 }
 if(/^(?:pt\/)?learn\/foundations\/index\.html$/.test(route)){
  const notes=[...html.matchAll(/<\w+\b[^>]*\sclass=["'][^"']*\bpathway-canonical-note\b[^"']*["'][^>]*>/g)];
  if(notes.length!==1)fail(route,`expected one canonical beginner note, found ${notes.length}`);
 }
 if(/^(?:pt\/)?introduction-to-anthroposophy\/index\.html$/.test(route)){
  const notes=[...html.matchAll(/<\w+\b[^>]*\sclass=["'][^"']*\bpathway-introduction-position\b[^"']*["'][^>]*>/g)];
  if(notes.length!==1)fail(route,`expected one Introduction positioning note, found ${notes.length}`);
 }
}
if(!globalOnly){
 if(counters.foundations!==72)errors.push(`Expected 72 bilingual Foundations lessons; found ${counters.foundations}.`);
 if(counters.theosophy!==46)errors.push(`Expected 46 bilingual Theosophy concept lessons; found ${counters.theosophy}.`);
 if(counters.pathwayPages<2)errors.push(`Expected English and Portuguese pathway catalogues; found ${counters.pathwayPages}.`);
 if(counters.mapPages!==2)errors.push(`Expected two concept-map references; found ${counters.mapPages}.`);
}
const report={status:errors.length?'failed':'passed',verificationMode:skipLinks?'content-only':globalOnly?'global-only':'complete',sourceBaseline:baselineCommit,...counters,errors};
const reportArg=process.argv.indexOf('--report');
if(reportArg>=0){const destination=path.resolve(process.argv[reportArg+1]||'reviews/pedagogy/coherent-learning-validation.json');fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n');}
if(errors.length){console.error(errors.slice(0,50).join('\n'));if(errors.length>50)console.error(`… ${errors.length-50} more issues. Use --report <path> for the full list.`);process.exitCode=1;}
else console.log(`Passed: ${counters.htmlPages} HTML pages, ${counters.localLinks} local links, ${counters.canonicalLessons} coherent lessons (${counters.foundations} Foundations), ${counters.pathwayPages} catalogues and ${counters.mapPages} concept-map references.`);
