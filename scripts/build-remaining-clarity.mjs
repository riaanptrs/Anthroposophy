import fs from 'node:fs';
import {linkTerms} from './link-constitution.mjs';
import {esc,n,relative,wholeElement} from './learning-html.mjs';
export const clarityRows=JSON.parse(fs.readFileSync(new URL('../content/remaining-course-clear-lessons.json',import.meta.url),'utf8'));
export const clarityRoute=(row,lang)=>`docs/${lang==='pt'?'pt/':''}${row.course==='theosophy-reading'?'lessons':row.course==='foundations'?'learn/lessons':row.course==='meditation'?'meditation':row.course+'/lessons'}/${n(row.id)}.html`;
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
  let first=`<section class="batch-first-reading" data-batch-clarity-first="${row.course}/${n(row.id)}">${v.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<h2>${pt?'Duas perguntas — opcionais':'Two questions — optional'}</h2>${v.checks.map(([q,a])=>`<div class="batch-clarity-check"><p>${esc(q)}</p><details class="batch-clarity-answer"><summary>${pt?'Ver uma explicação':'See an explanation'}</summary><p>${esc(a)}</p></details></div>`).join('')}${row.references?.length?`<aside class="clarity-practical-references"><p>${pt?'Orientação prática complementar:':'Further practical guidance:'} ${row.references.map(ref=>`<a href="${esc(ref.url)}">${esc(ref[lang])}</a>`).join('; ')}</p></aside>`:''}</section>`;
  if(['higher-worlds','temperaments','understanding-temperaments','foundations','meditation','agriculture','what-is-biodynamics','according-to-luke','ancient-myths','encountering-the-self','learn/esoteric-christianity','colour','toward-threefold-society'].includes(row.course))first=linkTerms('<body>'+first+'</body>',relative(file,`docs/${pt?'pt/':''}reference/human-constitution.html`)).html.slice(6,-7);
  html=html.replace(main,`${mainTag}<p class="breadcrumb"><a href="${relative(file,index)}">← ${pt?'Curso completo':'Full course'}</a></p>${heading}${first}<details class="batch-retained-depth"><summary>${pt?'Leitura completa, fontes e outras práticas — opcional':'Full reading, sources and further practice — optional'}</summary>${retained}</details>${nav}</main>`);
  fs.writeFileSync(file,html);
 }
 console.log(`Built ${rows.length} bilingual first readings; full teaching retained as optional depth.`);
}
