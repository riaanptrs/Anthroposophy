import {renderNutritionBookMarkdown,renderNutritionBookLesson,renderNutritionBookOrientation,renderNutritionAttachedSource,copyNutritionSourceFigures} from './render-nutrition-book.mjs';
import fs from 'node:fs';
import {buildRemainingClarity} from './build-remaining-clarity.mjs';
import {linkTerms} from './link-constitution.mjs';
import {esc,n,wholeElement} from './learning-html.mjs';
export const nutritionClarity=JSON.parse(fs.readFileSync(new URL('../content/nutrition-clear-lessons.json',import.meta.url),'utf8'));
export function buildNutritionClarity(){
 buildRemainingClarity(nutritionClarity);
 copyNutritionSourceFigures();
 for(const row of nutritionClarity)for(const lang of ['en','pt']){
  const file=`docs/${lang==='pt'?'pt/':''}nutrition/${n(row.id)}.html`;let html=fs.readFileSync(file,'utf8');
  const first=wholeElement(html,'<section class="batch-first-reading"');
  const heading=lang==='pt'?'<h2>Duas perguntas — opcionais</h2>':'<h2>Two questions — optional</h2>';
  const teaching=linkTerms('<body>'+renderNutritionBookLesson(row.id,lang)+'</body>','../reference/human-constitution.html').html.slice(6,-7);
  if(!first.includes(heading))throw Error('Missing Nutrition teaching insertion: '+file);
  html=html.replace(first,first.replace(heading,teaching+heading));fs.writeFileSync(file,html);
 }

 for(const lang of ['en','pt']){
  const pt=lang==='pt',root=`docs/${pt?'pt/':''}nutrition/`;
  let html=fs.readFileSync(root+'print.html','utf8');
  const tag=html.match(/<main\b[^>]*>/)[0],old=wholeElement(html,tag);
  const title=pt?'Nutrição: ensino dos capítulos e casos de estudo':'Nutrition: chapter teaching and study cases';
  const body=`${tag}<h1>${title}</h1><p>${pt?'Lições ampliadas dos doze capítulos, exemplos e perguntas explicadas. Use a impressão do navegador.':'Expanded teaching through all twelve chapters, examples and explained questions. Use your browser’s print function.'}</p><p><a href="index.html">${pt?'Mapa do curso':'Course map'}</a> · <a href="print.html">${pt?'Edição completa com fontes e outras práticas':'Complete edition with sources and further practice'}</a></p>${nutritionClarity.map(row=>{const v=row[lang];return `<article class="nutrition-print-lesson"><h2>${esc(v.title)}</h2>${v.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${renderNutritionBookLesson(row.id,lang,true)}${v.checks.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}<p><a href="${n(row.id)}.html">${pt?'Lição e aprofundamento opcional':'Lesson and optional deeper reading'}</a></p></article>`;}).join('')}</main>`;
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title}</title>`).replace(old,body);
  // The inherited reciprocal link must point to the same new resource.
  html=html.replace(/(href="[^"]*)print\.html("[^>]*hreflang=)/g,'$1first-readings.html$2').replace(/(hreflang="[^"]+"[^>]*href="[^"]*)print\.html/g,'$1first-readings.html');
  html=html.replace(/(href="[^"]+\/nutrition\/)print\.html/g,'$1first-readings.html');
  html=linkTerms(html,'../reference/human-constitution.html').html;
  fs.writeFileSync(root+'first-readings.html',html);
  const download=root+'nutrition-study-guide.md',earlier=pt?'':fs.readFileSync(download,'utf8');
  fs.writeFileSync(download,renderNutritionBookMarkdown(lang,nutritionClarity)+(pt?'':'\n\n---\n\n# Earlier study guide: original 118-capture source\n\nThe following material retains its earlier locators. Use the current page guide for the new attachment.\n\n'+earlier));
  const index=root+'index.html';let home=fs.readFileSync(index,'utf8');
  home=home.replace('</h1>',`</h1><p><a href="first-readings.html">${pt?'Leia ou imprima as lições ampliadas':'Read or print the expanded lessons'}</a></p>`);
  home=home.replace('</h1>','</h1>'+renderNutritionBookOrientation(lang));
  home=home.replace('Não houve nova conferência dos originais nem revisão médica das referências.','As novas explicações detalhadas usam o anexo atual de 122 páginas; os excertos anteriores conservam seus localizadores e há um guia de correspondência. Não se trata de revisão médica.');
  if(!pt)home=home.replace('Eighteen short readings connect','Eighteen expanded readings connect');
  fs.writeFileSync(index,home);
  const source=root+'sources.html';let sourceHtml=fs.readFileSync(source,'utf8');
  sourceHtml=sourceHtml.replace('</h1>','</h1>'+renderNutritionAttachedSource(lang)+`<h2>${pt?'Referências anteriores: arquivo de 118 capturas':'Earlier references: the 118-capture file'}</h2><p>${pt?'Os localizadores abaixo pertencem ao arquivo anterior. Use o guia acima para o PDF atual.':'Locators below belong to the earlier file. Use the guide above for the current PDF.'}</p>`);
  fs.writeFileSync(source,sourceHtml);
 }
}
