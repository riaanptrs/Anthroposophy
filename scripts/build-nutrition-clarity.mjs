import fs from 'node:fs';
import {buildRemainingClarity} from './build-remaining-clarity.mjs';
import {linkTerms} from './link-constitution.mjs';
import {esc,n,wholeElement} from './learning-html.mjs';
export const nutritionClarity=JSON.parse(fs.readFileSync(new URL('../content/nutrition-clear-lessons.json',import.meta.url),'utf8'));
export function buildNutritionClarity(){
 buildRemainingClarity(nutritionClarity);
 for(const lang of ['en','pt']){
  const pt=lang==='pt',root=`docs/${pt?'pt/':''}nutrition/`;
  let html=fs.readFileSync(root+'print.html','utf8');
  const tag=html.match(/<main\b[^>]*>/)[0],old=wholeElement(html,tag);
  const title=pt?'Nutrição: as dezoito leituras breves':'Nutrition: eighteen short readings';
  const body=`${tag}<h1>${title}</h1><p>${pt?'Explicações, exemplos e perguntas opcionais. Use a função de impressão do navegador.':'Explanations, examples and optional questions. Use your browser’s print function.'}</p><p><a href="index.html">${pt?'Mapa do curso':'Course map'}</a> · <a href="print.html">${pt?'Edição completa com fontes e outras práticas':'Complete edition with sources and further practice'}</a></p>${nutritionClarity.map(row=>{const v=row[lang];return `<article class="nutrition-print-lesson"><h2>${esc(v.title)}</h2>${v.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${v.checks.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}<p><a href="${n(row.id)}.html">${pt?'Lição e aprofundamento opcional':'Lesson and optional deeper reading'}</a></p></article>`;}).join('')}</main>`;
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title}</title>`).replace(old,body);
  // The inherited reciprocal link must point to the same new resource.
  html=html.replace(/(href="[^"]*)print\.html("[^>]*hreflang=)/g,'$1first-readings.html$2').replace(/(hreflang="[^"]+"[^>]*href="[^"]*)print\.html/g,'$1first-readings.html');
  html=html.replace(/(href="[^"]+\/nutrition\/)print\.html/g,'$1first-readings.html');
  html=linkTerms(html,'../reference/human-constitution.html').html;
  fs.writeFileSync(root+'first-readings.html',html);
  const index=root+'index.html';let home=fs.readFileSync(index,'utf8');
  home=home.replace('</h1>',`</h1><p><a href="first-readings.html">${pt?'Leia ou imprima as dezoito leituras breves':'Read or print all eighteen short readings'}</a></p>`);
  fs.writeFileSync(index,home);
 }
}
