import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {esc, n, relative, wholeElement} from './learning-html.mjs';
import {foundationFlow} from '../content/foundations-lesson-flow.mjs';
import {loadConceptCourse} from '../content/theosophy-concept-course.mjs';
import {renderConceptLesson} from './platform-components.mjs';
import {createHash} from 'node:crypto';
import {renderAnthroposophyMap} from './build-anthroposophy-maps.mjs';

const rows=JSON.parse(fs.readFileSync(new URL('../content/foundations-introduction-clear-lessons.json',import.meta.url),'utf8'));
const introductionTopics=[2,1,3,5,6,10,11,14,15,12,6,17,18,18,26,26,22,25,20,19,21,27,30,31,32,34,35,36];
const labels={en:['The Question','Begin with Experience','Steiner’s Idea','See the Relationship','Important Distinction','Apply It','Check Your Understanding','Go Deeper — optional','Next Lesson'],pt:['A pergunta','Comece com a experiência','A ideia de Steiner','Veja a relação','Distinção importante','Aplique','Confira sua compreensão','Aprofunde — opcional','Próxima lição']};
const steps=['question','experience','idea','relationship','distinction','apply','check','depth','next'];
const p=text=>`<p>${esc(text)}</p>`;
function pick(html,pattern){const tag=html.match(pattern)?.[0];return tag?wholeElement(html,tag):'';}
function inner(element){return element.replace(/^<[^>]+>/,'').replace(/<\/\w+>$/,'');}
function content(element){return inner(element).replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/,'');}
function uniqueIds(html){const counts=new Map();return html.replace(/\sid="([^"]+)"/g,(all,id)=>{const count=(counts.get(id)||0)+1;counts.set(id,count);return count===1?all:` id="${id}-context-${count}"`;});}
function step(index,body,{id='',className=''}={}){return `<section class="lesson-flow-step ${className}" data-flow-step="${steps[index]}"${id?` id="${id}"`:''}><h2>${labels[step.lang][index]}</h2>${body}</section>`;}
function table(v){const t=v.relationshipTable;if(!t)return '';return `<div class="flow-table"><table><caption>${esc(t.caption)}</caption><thead><tr>${t.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(row=>`<tr>${row.map((c,i)=>i?`<td>${esc(c)}</td>`:`<th scope="row">${esc(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function rebase(markup,from,to){return markup.replace(/\b(href|src)="([^"]+)"/g,(all,attr,url)=>{if(/^(https?:|data:|mailto:|#)/.test(url))return all;const [resource,fragment]=url.split('#'),[name,query]=resource.split('?');return `${attr}="${relative(to,path.resolve(path.dirname(from),name))}${query?'?'+query:''}${fragment?'#'+fragment:''}"`;});}
function commentaryLanguageLinks(page,notes,file,lang){
 const header=pick(page,/<header\b[^>]*>/);if(!header)return page;
 const partnerLesson=file.replace(/^docs\/(pt\/)?/,lang==='pt'?'docs/':'docs/pt/'),partnerNotes=notes.replace(/^docs\/(pt\/)?/,lang==='pt'?'docs/':'docs/pt/');
 return page.replace(header,header.replaceAll(`href="${relative(notes,file)}"`,`href="${path.basename(notes)}"`).replaceAll(`href="${relative(notes,partnerLesson)}"`,`href="${relative(notes,partnerNotes)}"`));
}
function companion(html,file,retained,title,lang){
 const notes=file.replace(/\/lessons\//,'/commentary/');
 // Keep the original source explanations in a separate reading, rather than
 // placing a second lesson after the checks. The active study controls stay
 // on the lesson at their existing storage identity.
 let body=inner(retained).replace(/^<summary>[\s\S]*?<\/summary>/,'');
 for(const marker of [/<section\b[^>]*class="learning-notebook"[^>]*>/,/<section\b[^>]*class="intro-progress-controls"[^>]*>/]){const tool=pick(body,marker);if(tool)body=body.replace(tool,'');}
 const mainTag=html.match(/<main\b[^>]*>/)[0],main=wholeElement(html,mainTag);
 const t=(en,pt)=>lang==='pt'?pt:en;
 let page=html.replace(main,`${mainTag}<p class="breadcrumb"><a href="${relative(notes,file)}">← ${t('Return to the lesson','Voltar à lição')}</a></p><h1>${esc(title)} · ${t('extended commentary','comentário ampliado')}</h1><p class="lead">${t('Optional earlier commentary, source context and further questions. The main lesson is a separate, shorter teaching sequence.','Comentários anteriores opcionais, contexto das fontes e outras perguntas. A lição principal segue uma sequência de ensino mais curta e separada.')}</p>${rebase(body,file,notes)}</main>`);
 // Rebase the original shell too, but not the already rebased main.
 const newMain=wholeElement(page,page.match(/<main\b[^>]*>/)[0]);
 page=rebase(page.replace(newMain,'<!--FLOW-MAIN-->'),file,notes).replace('<!--FLOW-MAIN-->',newMain);
 page=page.replace(/<script type="application\/json" id="cw-data">[\s\S]*?<\/script>/,'').replace(/<script type="application\/json" id="site-language-config">[\s\S]*?<\/script>/,'').replace(/<script\b[^>]*data-site-language-script[^>]*><\/script>/,'');
 const other=notes.replace(/^docs\/(pt\/)?/,lang==='pt'?'docs/':'docs/pt/');
  const oldPartner=file.replace(/^docs\/(pt\/)?/,lang==='pt'?'docs/':'docs/pt/');
  page=page.replaceAll(`href="${relative(notes,oldPartner)}"`,`href="${relative(notes,other)}"`);
 page=page.replace(/(<link rel="alternate"[^>]*href=")[^"]+/,`$1${relative(notes,other)}`);
 page=page.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)} · ${t('Extended commentary','Comentário ampliado')} — ${t('Anthroposophy','Antroposofia')}</title>`);
 page=commentaryLanguageLinks(page,notes,file,lang);
 fs.mkdirSync(path.dirname(notes),{recursive:true});fs.writeFileSync(notes,uniqueIds(page));
 return notes;
}
export function buildCoherentLessons(){
 fs.copyFileSync(new URL('./assets/coherent-lessons.css',import.meta.url),'docs/coherent-lessons.css');
 const report=[];
 const model=loadConceptCourse(),conceptLessons=[...model.lessons,{...model.course.synthesis,moduleId:'synthesis',conceptIds:[]}];
 fs.copyFileSync(new URL('./assets/theosophy-workspace.js',import.meta.url),'docs/theosophy-workspace.js');
 const workspaceHash=createHash('sha256').update(fs.readFileSync('docs/theosophy-workspace.js')).digest('hex').slice(0,12);
 for(const lesson of model.lessons)for(const lang of ['en','pt']){
  const file=`docs/${lang==='pt'?'pt/':''}theosophy/lessons/${lesson.id}.html`;
  let html=fs.readFileSync(file,'utf8');const mainTag=html.match(/<main\b[^>]*>/)[0],old=wholeElement(html,mainTag);
  let body=renderConceptLesson(lesson,{...model,lessons:conceptLessons,lang,file});
  const oldIds=[...old.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);const ids=new Set([...body.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
  const anchors=[...new Set(oldIds)].filter(id=>id!=='main'&&!ids.has(id)).map(id=>`<span id="${esc(id)}" class="flow-legacy-anchor" aria-hidden="true"></span>`).join('');
  body=body.replace(/(<details\b[^>]*data-flow-step="depth"[^>]*><summary>[^<]*<\/summary>)/,'$1'+anchors);
  html=html.replace(old,mainTag+body+'</main>').replace(/(theosophy-workspace\.js)(?:\?v=[^"']*)?/g,`$1?v=${workspaceHash}`);
  for(const asset of ['coherent-lessons.css','anthroposophy-maps.css'])if(!html.includes(asset))html=html.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/'+asset)}"></head>`);
  fs.writeFileSync(file,html);report.push({file,course:'theosophy',sourcePreserved:true});
 }
 for(const row of rows.filter(r=>['foundations','introduction-to-anthroposophy'].includes(r.course)))for(const lang of ['en','pt']){
  step.lang=lang;
  const foundation=row.course==='foundations',file=`docs/${lang==='pt'?'pt/':''}${foundation?'learn':row.course}/lessons/${n(row.id)}.html`;
  let html=fs.readFileSync(file,'utf8');if(html.includes('data-lesson-flow="canonical"')){
   const commentary=file.replace(/\/lessons\//,'/commentary/'),otherCommentary=commentary.replace(/^docs\/(pt\/)?/,lang==='pt'?'docs/':'docs/pt/'),partnerLesson=file.replace(/^docs\/(pt\/)?/,lang==='pt'?'docs/':'docs/pt/');
   if(fs.existsSync(commentary)){const notes=fs.readFileSync(commentary,'utf8');const updated=commentaryLanguageLinks(notes.replaceAll(`href="${relative(commentary,partnerLesson)}"`,`href="${relative(commentary,otherCommentary)}"`),commentary,file,lang);if(updated!==notes)fs.writeFileSync(commentary,updated);}
   report.push({file,commentary,sourcePreserved:true,course:row.course});continue;
  }
  const v=row[lang],t=(en,br)=>lang==='pt'?br:en;
  const mainTag=html.match(/<main\b[^>]*>/)[0],main=wholeElement(html,mainTag),heading=pick(main,/<h1\b[^>]*>/);
  const retained=pick(main,/<details\b[^>]*class="batch-retained-depth"[^>]*>/);
  if(!retained||!heading)throw Error('Missing reviewed lesson input '+file);
  const flow=foundationFlow.find(x=>x.id===(foundation?row.id:introductionTopics[row.id-1]));
  if(!flow)throw Error('Missing flow specification '+file);
  const notebook=pick(retained,foundation?/<section\b[^>]*class="learning-notebook"[^>]*>/:/<section\b[^>]*class="intro-progress-controls"[^>]*>/);
  const source=pick(retained,foundation?/<section\b[^>]*class="learning-source"[^>]*>/:/<section\b[^>]*id="source"[^>]*>/);
  const further=foundation?pick(retained,/<details\b[^>]*class="guided-deep-study"[^>]*>/):'';
  const distinction=pick(retained,foundation?/<section\b[^>]*class="learning-distinction"[^>]*>/:/<section\b[^>]*id="distinction"[^>]*>/);
  if(!source||!distinction||!notebook)throw Error('Missing source, distinction or study controls '+file);
  const commentary=companion(html,file,retained,v.title,lang);
  // The clarity text is retained once, with its familiar example placed first.
  const experienceIndex=foundation?flow.experienceIndex:0;
  const experience=foundation?flow.experience?.[lang]:null;
  const optional=new Set((v.optionalSteps||[]).map(x=>x.paragraph));
  let idea=v.paragraphs.map((text,i)=>(!experience&&i===experienceIndex)||optional.has(i)?'':`${v.paragraphHeadings?.[i]?`<h3>${esc(v.paragraphHeadings[i])}</h3>`:''}${p(text)}`).join('');
  const optionalText=[...optional].map(i=>`<h3>${esc(v.paragraphHeadings[i])}</h3>${p(v.paragraphs[i])}`).join('');
  // Diagrams are organizing aids, not demonstrations of the claimed realities.
  const mapId=foundation?flow.map:({4:'constitution',5:'constitution',7:'soul-development',8:'death-rebirth',9:'death-rebirth',10:'death-rebirth',18:'spiritual-knowing',28:'overview'}[row.id]||null);
  const relationship=mapId?renderAnthroposophyMap(mapId,lang):`<figure class="flow-relationship"><figcaption>${t('An original guide to the relationships in this lesson','Um guia original das relações nesta lição')}</figcaption><ul>${flow[lang].nodes.map(node=>`<li>${esc(node)}</li>`).join('')}</ul><p>${t('Read these as related distinctions in the account, rather than separate objects or a proof.','Leia como distinções relacionadas na concepção estudada, sem tratá-las como objetos separados ou como prova.')}</p></figure>`;
  const mapLink=`<p><a href="${relative(file,`docs/${lang==='pt'?'pt/':''}reference/anthroposophy-map.html`)}">${t('Explore the full map of Anthroposophy','Explore o mapa completo da antroposofia')} →</a></p>`;
  const checks=v.checks.map(([q,a])=>`<div class="flow-check"><h3>${esc(q)}</h3><details class="batch-clarity-answer"><summary>${t('Compare with an explained answer','Compare com uma resposta comentada')}</summary>${p(a)}</details></div>`).join('');
  const previous=row.id>1?`${n(row.id-1)}.html`:relative(file,`docs/${lang==='pt'?'pt/':''}${foundation?'learn/foundations':row.course}/index.html`);
  const nextRow=rows.find(r=>r.course===row.course&&r.id===row.id+1);
  const index=relative(file,`docs/${lang==='pt'?'pt/':''}${foundation?'learn/foundations':row.course}/index.html`);
  const next=nextRow?`${n(nextRow.id)}.html`:relative(file,`docs/${lang==='pt'?'pt/':''}learn/index.html`);
  const movedIds=[...main.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  const introTag=!foundation?retained.match(/<article\b[^>]*>/)?.[0]:'<article>';
  const introWrapper=introTag||'<article>';
  let body=`<p class="breadcrumb"><a href="${index}">← ${t('Course overview','Visão geral do curso')}</a></p>${introWrapper}${heading}<p class="flow-position">${foundation?t('Foundations · Lesson','Fundamentos · Lição'):t('Overview reference · Topic','Referência da visão geral · Tema')} ${row.id} / ${foundation?36:28}</p><div class="canonical-lesson" data-lesson-flow="canonical">`+
   step(0,p(v.goal),{id:'question'})+step(1,p(experience||v.paragraphs[experienceIndex]),{id:'experience'})+step(2,idea,{id:'explanation'})+
   step(3,relationship+table(v)+mapLink,{id:'relationship'})+step(4,content(distinction)+p(t('An ordinary example can clarify a distinction without establishing Steiner’s further spiritual claims. Understanding the account does not require accepting it as established fact.','Um exemplo comum pode esclarecer uma distinção sem comprovar as afirmações espirituais adicionais de Steiner. Compreender a concepção não exige aceitá-la como fato comprovado.')),{id:'distinction',className:'flow-distinction'})+
   step(5,p(flow[lang].apply),{id:'apply'})+step(6,checks,{id:'checks'})+
   `<details class="lesson-flow-step flow-depth" data-flow-step="depth" id="go-deeper"><summary>${labels[lang][7]}</summary>${source}${optionalText}${further}${mapId==='soul-development'?renderAnthroposophyMap('transformation',lang):''}<p><a href="${relative(file,commentary)}">${t('Extended commentary and source context','Comentário ampliado e contexto das fontes')} →</a></p>${notebook}</details>`+
   step(8,p(nextRow?t(`Next, take up a new question: ${nextRow.en.goal}`,`A seguir, uma nova pergunta: ${nextRow.pt.goal}`):t('You have reached the end of this sequence. Choose a subject pathway to continue, or return to any question that remains open.','Você chegou ao fim desta sequência. Escolha um percurso por tema ou retome alguma pergunta que permaneceu aberta.'))+`<a class="button" href="${next}">${nextRow?esc(nextRow[lang].title):t('Choose a learning pathway','Escolha um percurso de aprendizagem')} →</a>`,{id:'connection'})+'</div></article>'+`<nav class="lesson-navigation" aria-label="${t('Lesson navigation','Navegação das lições')}"><a href="${previous}">← ${t('Previous','Anterior')}</a><a href="${index}">${t('Course overview','Visão geral do curso')}</a></nav>`;
  // Retain existing deep links. Source and semantic section IDs already have
  // their normal target; other historical anchors point to the optional context.
  const existing=new Set([...body.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
  const anchors=[...new Set(movedIds)].filter(id=>id!=='main'&&!existing.has(id)).map(id=>`<span id="${esc(id)}" class="flow-legacy-anchor" aria-hidden="true"></span>`).join('');
  body=body.replace('<summary>'+labels[lang][7]+'</summary>','<summary>'+labels[lang][7]+'</summary>'+anchors);
  html=html.replace(main,mainTag+body+'</main>');
  for(const asset of ['coherent-lessons.css','anthroposophy-maps.css'])if(!html.includes('href="'+relative(file,'docs/'+asset)+'"'))html=html.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/'+asset)}"></head>`);
  fs.writeFileSync(file,uniqueIds(html));report.push({file,commentary,sourcePreserved:true,course:row.course});
 }
 fs.mkdirSync('reviews/pedagogy',{recursive:true});fs.writeFileSync('reviews/pedagogy/coherent-lesson-flow.json',JSON.stringify(report,null,2)+'\n');
 console.log(`Coherent lesson flow: ${report.length} bilingual lesson pages; source context and study identities preserved.`);
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildCoherentLessons();
