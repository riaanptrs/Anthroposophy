import fs from 'node:fs';
import path from 'node:path';
import {Marked} from './vendor/marked/marked.mjs';
import {esc,relative,shell,write} from './learning-html.mjs';
import {platformNav,platformSupportNav} from './platform-architecture.mjs';
import {renderIdentityMark,renderCourseArtwork} from './visual-identity.mjs';
import {loadWaldorfContent,rootRoute,packageRoot,groups,states,gradeViews,gradeSelections,waldorfRoutes,waldorfPresentation} from './waldorf-content.mjs';
import {provenanceNote,readableProvenance} from './waldorf-provenance.mjs';

const items = loadWaldorfContent(), sourceMap = new Map(items.map(i=>[i.source,i.route]));
for (const [source,route] of [['SOURCES.md','sources/index.html'],['README.md','orientation.html'],['COURSE_MASTER.md','index.html'],['CONTENT_STATUS.md','status.html']]) sourceMap.set(source,rootRoute+route);
const master = fs.readFileSync(new URL('COURSE_MASTER.md',packageRoot),'utf8');
const description = "A Parent's Guide to Child Development, Curriculum, and Why It Is Taught When It Is";
const title = 'Understanding Waldorf Education';
const links = (file,route,label,attrs='') => `<a href="${esc(relative(file,'docs/'+route))}"${attrs?' '+attrs:''}>${esc(label)}</a>`;
const courseLink = (file,route,label,attrs='')=>links(file,rootRoute+route,label,attrs);
const badge = i=>`<span class="wf-badge" data-content-state="${i.state}">${states[i.state]}</span>`;
const pending = i=>`<aside class="wf-status wf-status-compact">${badge(i)} ${i.state==='draft-copy'?'':'<strong>Awaiting final course copy.</strong>'} <span>Source verification is pending.</span> <a href="#wf-source-notes">Sources &amp; Origins</a></aside>`;
const sections = body=>{
 const lines=body.split('\n'),result=[];let part=[];
 for (const line of lines) {
  if (/^#{2,4} \d+\. /.test(line) || /^## (?:Later |Additional |Established |Unfinished |Sources |Continue |Completion |Unresolved )/.test(line)) {
   if(part.length) result.push(part.join('\n'));part=[];
  }
  part.push(line);
 }
 if(part.length) result.push(part.join('\n'));
 return result;
};

// Render with a per-page Markdown instance. Supplied text is preserved; source
// tokens remain visibly unresolved. No raw HTML or guessed citation targets.
export function renderMarkdown(body,item,file,idPrefix='copy') {
 const headings=[],counts=new Map();let level=1;
 const parser=new Marked({gfm:true});
 parser.use({renderer:{
  html({text}) {return esc(text);},
  heading({tokens,depth,text}) {
   const wanted=Math.max(2,depth);level=Math.min(wanted,level+1);
   const base=text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';
   const count=counts.get(base)||0;counts.set(base,count+1);const id=idPrefix+'-'+base+(count?'-'+count:'');
   headings.push({id,text:text.replace(/[*_`]/g,'')});
   return `<h${level} id="${id}">${this.parser.parseInline(tokens)}</h${level}>\n`;
  },
  link({href,tokens,title:tooltip}) {
   let url=href;
   if (/\.md(?:#|$)/.test(url)) {
    const [name,anchor]=url.split('#'),source=path.posix.normalize(path.posix.join(path.posix.dirname(item.source),name));
    const route=sourceMap.get(source);if(!route)throw Error('Unmapped Markdown link '+source);
    url=relative(file,'docs/'+route)+(anchor?'#copy-'+anchor:'');
   }
   if (/^(?:javascript|data|vbscript):/i.test(url)) return this.parser.parseInline(tokens);
   return `<a href="${esc(url)}"${tooltip?` title="${esc(tooltip)}"`:''}>${this.parser.parseInline(tokens)}</a>`;
  },
  image({text}) {return esc(text);},
  table({header,rows}) {
   return `<div class="wf-table" role="region" tabindex="0" aria-label="Course reference table"><table><thead><tr>${header.map(c=>`<th scope="col">${this.parser.parseInline(c.tokens)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((c,n)=>`<td data-label="${esc(header[n].text.replace(/[*_`]/g,''))}">${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
 }});
 let html=parser.parse(body.replace(/:chatgpt-content-reference\{index="(\d+)"\}/g,'[Unresolved conversation citation $1 — primary-source check pending]'));
 // Human-readable labels retain their exact inherited category for auditing.
 html=readableProvenance(html,idPrefix==='copy'&&item.source!=='SOURCES.md');
 for(const heading of headings) heading.text=heading.text.replace(/\[BOOK\]/g,'Book attribution — unverified');
 return {html,headings};
}
function sources(item,file,editorial=waldorfPresentation(item).editorial) {
 const labels=[...new Set(item.body.match(/\[(?:BOOK|STEINER|EARLY WALDORF|LATER WALDORF|WALDORF|INTERPRETATION|EXPANSION|MODERN|CONTEMPORARY WALDORF|CONVERSATION|TEXT UNCERTAIN)[A-Z /+—-]*\]/g)||[])];
 const messages=[...new Set(item.raw.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/g)||[])];
 const citations=[...new Set(item.body.match(/(?:content-reference\{index="\d+"\}|unresolved conversation citation \d+|Original content-reference index \d+)/gi)||[])];
 return `<details class="wf-sources" id="wf-source-notes"><summary>Sources &amp; Origins</summary><p><strong>Source verification pending.</strong> This page reproduces supplied conversation material. Labels record inherited attributions, not independent verification. Later Waldorf curriculum and interpretation remain distinct from Steiner indications. Quotations and shortened source-preview names require checking against the actual edition.</p><p>Supplied file: <code>${esc(item.source)}</code></p>${labels.length?`<p>Inherited provenance categories: ${labels.map(l=>provenanceNote(l)).join(' ')}</p>`:''}${messages.length?`<details><summary>Conversation trace</summary><ul>${messages.map(m=>`<li><code>${m}</code></li>`).join('')}</ul></details>`:''}${citations.length?`<p>Unresolved citation clues (indices belong to their originating messages):</p><ul>${citations.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`:''}${editorial?`<h2>Original package notes</h2><div class="wf-source-copy" data-wf-editorial="${item.source}">${renderMarkdown(editorial,item,file,'note').html}</div>`:''}<p>${courseLink(file,'sources/index.html','Read the source register and verification limits')} · ${courseLink(file,'status.html','See content status')}</p></details>`;
}
function emit(route,pageTitle,body,item=null) {
 const file='docs/'+route;
 const group=item?.group;
 const crumbs=`<nav class="wf-breadcrumb" aria-label="Breadcrumb">${links(file,'learn/index.html','Learn')} <span aria-hidden="true">/</span> ${courseLink(file,'index.html','Waldorf')}${group?` <span aria-hidden="true">/</span> ${courseLink(file,group+'/index.html',groups[group])}`:''}</nav>`;
 const nav=`<nav class="wf-nav" aria-label="Waldorf course">${[['index.html','Course home'],['foundations/index.html','Start here'],['development/index.html','Development'],['grades/index.html','Grades'],['subjects/index.html','Subjects'],['parents/index.html','Parent questions'],['sources/index.html','Sources']].map(([r,l])=>courseLink(file,r,l,route===rootRoute+r?'aria-current="page"':'')).join('')}</nav>`;
 let html=shell(file,pageTitle,crumbs+nav+body,'en',{description:pageTitle===title?description:pageTitle+' — '+title,className:'wf-main'});
 html=html.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/concept-platform.css')}"><link rel="stylesheet" href="${relative(file,'docs/visual-identity.css')}"><link rel="stylesheet" href="${relative(file,'docs/waldorf.css')}"><script defer src="${relative(file,'docs/waldorf.js')}"></script></head>`)
 .replace('<body data-learning-owned="true">','<body data-learning-owned="true" data-waldorf-owned="true" data-visual-identity="true" data-identity-theme="green">')
 .replace('<span class="mark" aria-hidden="true">✳</span>',renderIdentityMark())
 .replace('</header>',platformNav(file,'en','learn')+'</header>')
 .replace('</footer>',platformSupportNav(file,'en')+'</footer>');
 write(file,html);
}
function card(item,file) {
 return `<article class="wf-card" data-wf-item data-wf-group="${item.group}"><p class="wf-eyebrow">${groups[item.group]}</p><h3>${links(file,item.route,item.title)}</h3>${badge(item)}${item.state!=='draft-copy'?'<p class="wf-awaiting">Awaiting final course copy</p>':'<p class="wf-awaiting">Editorial and source review pending</p>'}<span class="wf-read-state" data-wf-progress="${item.id}"></span></article>`;
}
function cards(rows,file) {return `<div class="wf-grid">${rows.map(i=>card(i,file)).join('')}</div>`;}
const spine=master.match(/\| Approximate period[\s\S]*?(?=\n## Foundations)/)[0].split('\n').slice(2).filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
const matrix=master.match(/\| Grade \| Approximate age[\s\S]*?(?=\nThe earlier dossier)/)[0].split('\n').slice(2).filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
function timeline(file) {
 return `<section class="wf-development"><h2>From imitation to independent judgment</h2><p>This is the course’s Anthroposophical/Waldorf framework. Ages are approximate; they are not fixed diagnoses or universally accepted scientific stages.</p><ol class="wf-timeline">${spine.map(([age,gesture,target])=>{
  const source=target.match(/\]\((.*?)\)/)[1];return `<li><p class="wf-eyebrow">${esc(age)}</p>${links(file,sourceMap.get(source),gesture)}</li>`;
 }).join('')}</ol></section>`;
}
function gradeMatrix(file) {
 return `<div class="wf-grade-matrix">${matrix.map((r,index)=>`<article class="wf-card"><h3>${links(file,items.find(i=>i.grade===index+1).route,'Grade '+(index+1))}</h3><p class="wf-eyebrow">Approximately ${esc(r[1])}</p><p><strong>${esc(r[2])}</strong></p><p>${esc(r[3])}</p>${badge(items.find(i=>i.grade===index+1))}</article>`).join('')}</div>`;
}
function related(item,file) {
 const stages=['school-readiness','ages-7-9','nine-year-change','ages-9-12','ages-9-12','age-12-causality','puberty-authority','puberty-authority','adolescence-judgment'];
 let targets=[];
 if(item.grade) {
  targets=[items.find(i=>i.route===rootRoute+'development/'+stages[item.grade-1]+'.html'),...items.filter(i=>i.group==='subjects')];
 } else if(item.group==='subjects') targets=items.filter(i=>i.grade);
 else {
  const gradeNums=item.group==='development'?{20:[1],21:[1,2],22:[3],23:[4,5,6],24:[6],25:[7,8],26:[9]}[Number(item.source.match(/\d+/)?.[0])]:null;
  targets=gradeNums?gradeNums.map(g=>items.find(i=>i.grade===g)):[items.find(i=>i.group==='development'),items.find(i=>i.group==='subjects'),items.find(i=>i.group==='parents')];
 }
 return `<section class="wf-related"><h2>Related topics</h2><ul>${targets.filter(Boolean).map(i=>`<li>${links(file,i.route,i.title)} ${badge(i)}</li>`).join('')}</ul>${item.grade===3?`<p>${links(file,'biodynamics/index.html','Related course: Biodynamic Agriculture')}</p>`:''}${item.route.includes('nine-year-change')?`<p>${links(file,'encountering-the-self/index.html','Related source companion: Encountering the Self')}</p>`:''}</section>`;
}
function sequence(item,file) {
 const ordered=items.filter(i=>i.group===item.group),n=ordered.indexOf(item);
 return `<nav class="wf-prev-next" aria-label="${item.grade?'Grade':'Topic'} navigation">${n?links(file,ordered[n-1].route,'← '+ordered[n-1].title):courseLink(file,item.group+'/index.html','← '+groups[item.group])}${n<ordered.length-1?links(file,ordered[n+1].route,ordered[n+1].title+' →'):courseLink(file,'index.html','Return to course home →')}</nav>`;
}
function study(item) {
 return `<section class="wf-study" data-wf-study="${item.id}"><h2>Your reading</h2><p>Mark that you have read this draft. This does not mark the educational content as complete or verified. Saving is optional and stays in this browser.</p><label><input type="checkbox" data-wf-save disabled> Save reading marks on this device</label><button type="button" data-wf-mark aria-pressed="false" disabled>Mark draft as read</button><button type="button" data-wf-delete disabled>Delete this reading mark</button><p data-wf-study-status role="status" aria-live="polite"></p><noscript>Reading marks require JavaScript. All course content and navigation remain available.</noscript></section>`;
}
function contents(headings) {return headings.length>3?`<details class="wf-contents"><summary>On this page</summary><ul>${headings.map(h=>`<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ul></details>`:'';}
function journey(item,file) {
 const steps=[...item.body.matchAll(/^Grades? (\d(?:[–-]\d)?)\n([\s\S]*?)(?=\n↓|\n---|\n#{1,6} |$(?![\s\S]))/gm)];
 // Table-only pathways retain their actual grade rows; no invented early years.
 if(!steps.length) for (const row of item.body.matchAll(/^\| (\d) \| (.*?) \|$/gm)) steps.push([row[0],row[1],row[2]]);
 const unique=new Map();for(const s of steps)if(!unique.has(s[1]))unique.set(s[1],s[2].trim());
 if(!unique.size)return `<aside class="wf-status"><strong>Grade-by-grade pathway awaiting final course copy.</strong><p>The supplied file contains planning points and excerpts. Explore the grade dossiers below for the material currently available.</p></aside>`;
 return `<section><h2>Curriculum journey — supplied outline</h2><p>Later curriculum planning, with source verification pending. Schools and facilities vary; this is not a universal prescription.</p><ol class="wf-journey">${[...unique].map(([g,text])=>{
  const grade=Number(g[0]),target=items.find(i=>i.grade===grade);return `<li><h3>${links(file,target.route,'Grade'+(g.length>1?'s ':' ')+g)}</h3><p>${esc(text).replace(/\n/g,'<br>')}</p></li>`;
 }).join('')}</ol></section>`;
}

// The landing page and section directories precede the longer draft reading.
const landing='docs/'+rootRoute+'index.html';
emit(rootRoute+'index.html',title,`<section class="wf-hero"><div><p class="wf-eyebrow">Education · A parent course</p><h1>${title}</h1><p class="lead">${description}</p><blockquote>Why is my child learning this, in this way, at this age?</blockquote><p>Waldorf education is easiest to understand when curriculum and child development are considered together.</p><div class="wf-actions">${links(landing,items[0].route,'Start with Waldorf education','class="identity-primary-action"')}${courseLink(landing,'grades/index.html','Explore Grades 1–9')}</div></div>${renderCourseArtwork(landing,'waldorf')}</section><aside class="wf-status"><strong>A working course: drafts, dossiers, outlines, and a placeholder.</strong><p>Detailed supplied material is available to read. Unfinished sections remain visibly marked. All source verification is pending.</p>${courseLink(landing,'status.html','See exactly what is awaiting final copy')}</aside><section><h2>Choose your way into the course</h2><div class="wf-grid">${Object.entries(groups).map(([g,l])=>`<article class="wf-card"><h3>${courseLink(landing,g+'/index.html',l)}</h3><p>${{foundations:'The origins, developmental picture, and teaching methods.',development:'From school readiness to adolescent judgment.',grades:'The child, curriculum, and “why now?” for Grades 1–9.',subjects:'Follow a subject across the supplied grade outlines.',parents:'Reading, stories, technology, assessment, religion, and learning differences.'}[g]}</p></article>`).join('')}</div></section>${timeline(landing)}<section><h2>Explore by grade</h2><p>These approximate ranges come from the supplied planning matrix. Individual dossiers retain their own qualifications.</p>${gradeMatrix(landing)}</section><section id="course-topics"><h2>Find a topic</h2><div class="wf-filters" data-wf-filters hidden><label for="wf-search">Search course topics<input id="wf-search" type="search" data-wf-search placeholder="Try reading, physics, or Grade 3"></label><label for="wf-group">Section<select id="wf-group" data-wf-filter><option value="">All sections</option>${Object.entries(groups).map(([g,l])=>`<option value="${g}">${l}</option>`).join('')}</select></label></div><p data-wf-results role="status" aria-live="polite"></p>${cards(items,landing)}</section>`);
for(const [group,label] of Object.entries(groups)) {
 const file='docs/'+rootRoute+group+'/index.html',rows=items.filter(i=>i.group===group);
 const listing=group==='parents'?rows.map(i=>`<details class="wf-question"><summary>${esc(i.title)} — ${states[i.state]}</summary><p>${i.state==='placeholder'?'No substantive answer supplied.':'Planning material and excerpts are available.'} Awaiting final course copy.</p>${links(file,i.route,'Read '+i.title)} ${badge(i)}</details>`).join(''):group==='grades'?gradeMatrix(file):cards(rows,file);
 emit(rootRoute+group+'/index.html',label,`<h1>${label}</h1><p>${group==='foundations'?'Lessons 1–6 contain substantive draft prose; Lessons 7–19 are outlines.':group==='grades'?'Each grade includes a complete supplied research dossier and three focused reading views. Finished parent-facing lessons and source checks are pending.':'Established outlines and planning material are available; final educational copy and source checks are pending.'}</p>${group==='development'?timeline(file):''}${listing}`);
}
for(const item of items) {
 const file='docs/'+item.route,presentation=waldorfPresentation(item),rendered=renderMarkdown(presentation.reading,item,file);
 let gradeExtras='';
 if(item.grade) {
  const row=matrix[item.grade-1];
  gradeExtras=`<div class="wf-grid wf-grade-views">${[['child','The Child','What is changing developmentally?'],['curriculum','What They Learn','Explore the supplied curriculum material.'],['why-now','Why Now?','Read the developmental reasoning.']].map(([v,l,d])=>`<article class="wf-card"><h2>${links(file,item.route.replace('index.html',v+'.html'),l)}</h2><p>${d}</p></article>`).join('')}</div><section><h2>Development and curriculum at a glance</h2><p class="wf-eyebrow">Approximately ${esc(row[1])}</p><p><strong>${esc(row[2])}</strong></p><p>${esc(row[3])}</p><p>This summary follows the supplied master matrix; the dossier below retains its fuller explanations and differing age approximations.</p></section>`;
 }
 const full=`${contents(rendered.headings)}<div class="wf-copy" data-wf-copy="${item.source}">${rendered.html}</div>`;
 emit(item.route,item.title,`<h1>${esc(item.title)}</h1>${pending(item)}${gradeExtras}${item.group==='subjects'?journey(item,file):''}${item.grade?`<details class="wf-dossier"><summary>Read the complete supplied Grade ${item.grade} research dossier</summary>${full}</details>`:full}${sources(item,file)}${related(item,file)}${study(item)}${sequence(item,file)}`,item);
 if(item.grade) {
  const parts=sections(item.body);
  for(const view of gradeViews) {
   const selected=parts.filter(s=>gradeSelections[item.grade][view].includes(Number(s.match(/^#{2,4} (\d+)\. /)?.[1])));
   if(!selected.length)throw Error(`Empty grade view ${item.grade}/${view}`);
   const route=item.route.replace('index.html',view+'.html'),subfile='docs/'+route;
   const pageTitle=`Grade ${item.grade} — ${{child:'The Child',curriculum:'What They Learn','why-now':'Why Now?'}[view]}`;
   const subset=renderMarkdown(selected.join('\n\n'),item,subfile);
   emit(route,pageTitle,`<h1>${pageTitle}</h1>${pending(item)}<p>This focused view contains intact sections of the supplied research dossier. ${links(subfile,item.route,'Read the complete dossier, planning excerpts, and unfinished work')}.</p><nav class="wf-nav" aria-label="Grade reading views">${links(subfile,item.route,'Grade overview')}${gradeViews.map(v=>links(subfile,item.route.replace('index.html',v+'.html'),{child:'The Child',curriculum:'What They Learn','why-now':'Why Now?'}[v],v===view?'aria-current="page"':'')).join('')}</nav>${contents(subset.headings)}<div class="wf-copy">${subset.html}</div><aside class="wf-status"><strong>Awaiting final course copy</strong><p>Final parent-facing lessons, classroom case studies, exercises, parent observations, assessment guidance, and any subject material absent from the dossier remain unfinished.</p></aside>${sources(item,subfile)}${related(item,subfile)}${sequence(item,subfile)}`,item);
  }
 }
}
for(const [source,route,pageTitle] of [['README.md','orientation.html','About this working course'],['CONTENT_STATUS.md','status.html','Content status and unfinished pages'],['SOURCES.md','sources/index.html','Sources and provenance']]) {
 const raw=fs.readFileSync(new URL(source,packageRoot),'utf8'),body=raw.replace(/^# .*\n/,'');
 // Implementation/reference documents stay in the repository, not the course.
 const cleaned=body.replace(/^.*\]\((?:CODEX_IMPLEMENTATION\.md|reference\/README\.md)\).*$/gm,'Implementation specifications and recovered conversation records remain in the repository as trace material.');
 const file='docs/'+rootRoute+route,rendered=renderMarkdown(cleaned,{source},file);
 emit(rootRoute+route,pageTitle,`<h1>${pageTitle}</h1><div class="wf-copy">${rendered.html}</div>`);
}
const manifest={title,sourceVerification:'pending',pages:waldorfRoutes(items),content:items.map(({raw,body,...rest})=>rest)};
fs.mkdirSync('content/waldorf',{recursive:true});fs.writeFileSync('content/waldorf/manifest.json',JSON.stringify(manifest,null,2)+'\n');
for(const ext of ['css','js'])fs.copyFileSync(new URL('./assets/waldorf.'+ext,import.meta.url),'docs/waldorf.'+ext);
console.log(`Waldorf: ${manifest.pages.length} pages; ${items.length} supplied content files. All source verification pending.`);
