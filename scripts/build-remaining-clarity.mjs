import fs from 'node:fs';
import {linkTerms} from './link-constitution.mjs';
import {esc,n,relative,wholeElement} from './learning-html.mjs';
export const clarityRows=JSON.parse(fs.readFileSync(new URL('../content/remaining-course-clear-lessons.json',import.meta.url),'utf8'));
export const clarityRoute=(row,lang)=>`docs/${lang==='pt'?'pt/':''}${row.course==='theosophy-reading'?'lessons':row.course==='foundations'?'learn/lessons':row.course==='meditation'?'meditation':row.course==='nutrition'?'nutrition':row.course+'/lessons'}/${n(row.id)}.html`;
function relationshipTable(table){
 if(!table)return '';
 return `<table class="foundation-relationships"><caption>${esc(table.caption)}</caption><thead><tr>${table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(([label,...cells])=>`<tr><th scope="row">${esc(label)}</th>${cells.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
export function buildRemainingClarity(rows=clarityRows){
 for(const row of rows)for(const lang of ['en','pt']){
  const file=clarityRoute(row,lang),v=row[lang],pt=lang==='pt';let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-batch-clarity-first'))throw Error('Clarity pass requires freshly rendered input: '+file);
  const mainTag=html.match(/<main\b[^>]*>/)?.[0],main=mainTag&&wholeElement(html,mainTag);
  const heading=main?.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0];
  const navTag=main?.match(/<nav\b[^>]*class="[^"]*\b(?:lesson-navigation|ec-prev-next)\b[^"]*"[^>]*>/)?.[0];
  const nav=navTag&&wholeElement(main,navTag);
  if(!main||!heading||!nav)throw Error('Missing lesson structure: '+file);
  const retained=main.slice(mainTag.length,-7).replace(heading,'').replace(nav,'');
  const index=`docs/${pt?'pt/':''}${row.course==='theosophy-reading'?'read/theosophy':row.course==='foundations'?'learn/foundations':row.course}/index.html`;
  let first=`<section class="batch-first-reading" data-batch-clarity-first="${row.course}/${n(row.id)}">${v.paragraphs.map((p,i)=>`${v.paragraphHeadings?`<h2>${esc(v.paragraphHeadings[i])}</h2>`:''}<p>${esc(p)}</p>${i===0&&row.definitionLink?`<p class="clarity-introduction-link"><a href="${esc(row.definitionLink.href)}">${esc(row.definitionLink[lang])}</a></p>`:''}`).join('')}<h2>${pt?'Duas perguntas — opcionais':'Two questions — optional'}</h2>${v.checks.map(([q,a])=>`<div class="batch-clarity-check"><p>${esc(q)}</p><details class="batch-clarity-answer"><summary>${pt?'Ver uma explicação':'See an explanation'}</summary><p>${esc(a)}</p></details></div>`).join('')}${row.references?.length?`<aside class="clarity-practical-references"><p>${pt?'Orientação prática complementar:':'Further practical guidance:'} ${row.references.map(ref=>`<a href="${esc(ref.url)}">${esc(ref[lang])}</a>`).join('; ')}</p></aside>`:''}${row.sourceReview?`<aside class="clarity-source-review"><p>${esc(row.sourceReview[lang])}</p></aside>`:''}</section>`;
  if(v.relationshipTable){
   const after=v.relationshipTableAfterParagraph;
   const marker=Number.isInteger(after)?`<p>${esc(v.paragraphs[after])}</p>`:`<h2>${pt?'Duas perguntas — opcionais':'Two questions — optional'}</h2>`;
   first=first.replace(marker,Number.isInteger(after)?marker+relationshipTable(v.relationshipTable):relationshipTable(v.relationshipTable)+marker);
  }
  if(v.activity)first=first.replace(/<\/section>$/,`<details class="clarity-activity"><summary>${esc(v.activity.title)}</summary><p>${esc(v.activity.prompt)}</p><details><summary>${pt?'Veja um exemplo de resposta':'See an example response'}</summary><p>${esc(v.activity.example)}</p></details></details></section>`);
  if(['nutrition','understand-temperament','mystery-temperaments','higher-worlds','temperaments','understanding-temperaments','foundations','meditation','agriculture','what-is-biodynamics','according-to-luke','ancient-myths','encountering-the-self','learn/esoteric-christianity','colour','toward-threefold-society'].includes(row.course))first=linkTerms('<body>'+first+'</body>',relative(file,`docs/${pt?'pt/':''}reference/human-constitution.html`)).html.slice(6,-7);
  const foundation=row.course==='foundations';
  let context=foundation?`<section class="foundation-orientation"><p>${pt?'Lição':'Lesson'} ${row.id} / 36 · ${row.id===1?(pt?'Comece aqui; nenhum conhecimento anterior é necessário.':'Start here; no previous study is needed.'):`${pt?'Retome primeiro:':'Builds on:'} <a href="${n(row.id-1)}.html">${esc(rows.find(r=>r.course==='foundations'&&r.id===row.id-1)[lang].title)}</a>`}</p><p><strong>${esc(v.goal)}</strong></p></section>`:'';
  if(foundation)context=linkTerms('<body>'+context+'</body>',relative(file,`docs/${pt?'pt/':''}reference/human-constitution.html`)).html.slice(6,-7);
  if(row.course==='introduction-to-anthroposophy')context=`<section class="foundation-orientation"><p>${pt?'Lição':'Lesson'} ${row.id} / 28</p><p><strong>${esc(v.goal)}</strong></p></section>`;
  const following=foundation&&row.id<36?rows.find(r=>r.course==='foundations'&&r.id===row.id+1):null;
  const continuation=foundation?`<section class="foundation-next"><h2>${pt?'Continue passo a passo':'Continue step by step'}</h2><a class="button" href="${following?n(following.id)+'.html':relative(file,index)}">${following?`${pt?'Próxima lição':'Next lesson'}: ${esc(following[lang].title)}`:(pt?'Retome o mapa do curso':'Return to the course map')} →</a></section>`:'';
  const depthLabel=foundation?(pt?'Fontes, comentários anteriores e notas salvas — opcional':'Sources, earlier commentary and saved notes — optional'):(pt?'Leitura completa, fontes e outras práticas — opcional':'Full reading, sources and further practice — optional');
  html=html.replace(main,`${mainTag}<p class="breadcrumb"><a href="${relative(file,index)}">← ${pt?'Curso completo':'Full course'}</a></p>${heading}${context}${first}${continuation}<details class="batch-retained-depth"><summary>${depthLabel}</summary>${retained}</details>${nav}</main>`);
  fs.writeFileSync(file,html);
 }
 console.log(`Built ${rows.length} bilingual first readings; full teaching retained as optional depth.`);
}
