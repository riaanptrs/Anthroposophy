import fs from 'node:fs';
import {esc,n,relative,quiz,shell,write} from './learning-html.mjs';

const route='agriculture';
const course=JSON.parse(fs.readFileSync('content/agriculture.json','utf8'));
const lessons=course.lessons;
if(!Array.isArray(lessons)||!lessons.length)throw Error('Missing agriculture readings');
if(new Set(lessons.map(l=>l.id)).size!==lessons.length)throw Error('Repeated agriculture reading identity');
const fileFor=(id,lang)=>`docs/${lang==='pt'?'pt/':''}${route}/lessons/${n(id)}.html`;
const indexFor=lang=>`docs/${lang==='pt'?'pt/':''}${route}/index.html`;
const text=(item,key,lang)=>item[key+(lang==='pt'?'Pt':'En')];
const paragraphs=value=>(Array.isArray(value)?value:[value]).map(p=>`<p>${esc(p)}</p>`).join('');
const quoteParagraphs=value=>esc(value).split('\n\n').map(p=>`<p>${p.replaceAll('\n','<br>')}</p>`).join('');

function sourcePassage(lesson,lang) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a,p=lesson.passage;
 if(!p||!text(p,'quote',lang)?.trim()||!Number.isInteger(p.capture)||!p.sourceFile||!p.verification)throw Error('Missing reviewed agriculture passage '+lesson.id);
 return `<section class="learning-source book-passage" id="book-passage"><div class="eyebrow">${t('Read · Source passage','Leia · Trecho da fonte')}</div><h2>${esc(lesson.author)} · <cite>${esc(p.title||text(course,'title',lang))}</cite></h2><p class="source-locator">${t('Markdown capture','Captura do Markdown')} ${p.capture} · ${esc(text(p,'locator',lang))}</p><blockquote class="source-excerpt">${quoteParagraphs(text(p,'quote',lang))}</blockquote><p class="passage-credit">${esc(text(p,'credit',lang))}</p><details><summary>${t('Source edition and verification','Edição da fonte e verificação')}</summary><p>${esc(text(course,'edition',lang))}</p><p>${t('Capture numbers identify the supplied Markdown page blocks. The PDF images could not be transferred, so wording was checked in the supplied OCR Markdown and parallel passages were compared between editions where available. Drawings and page layout remain unverified.','Os números das capturas identificam os blocos de páginas do Markdown fornecido. As imagens dos PDFs não puderam ser transferidas; o texto foi conferido no Markdown em OCR e as passagens paralelas foram comparadas entre as edições quando disponíveis. Os desenhos e o layout das páginas continuam sem verificação.')}</p></details></section>`;
}

function openCheck(check,lang) {
 const pt=lang==='pt';
 if(!check.question||!check.explanation)throw Error('Incomplete biodynamics source check');
 return `<p>${esc(check.question)}</p><details><summary>${pt?'Ver uma resposta comentada':'Show a suggested answer'}</summary><p>${esc(check.explanation)}</p></details>`;
}

function deeperStudy(value) {
 if(!value)return '';
 return (Array.isArray(value)?value:[value]).map(section=>{
  if(!section.title||!Array.isArray(section.paragraphs)||!section.paragraphs.length)throw Error('Incomplete agriculture deeper study');
  return `<details class="guided-deep-study" data-deep-study><summary>${esc(section.title)}</summary>${paragraphs(section.paragraphs)}</details>`;
 }).join('');
}

for(const lang of ['en','pt']) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a,index=indexFor(lang),opposite=pt?'en':'pt';
 const scope=text(course,'scope',lang);
 const indexBody=`<div class="eyebrow">${t('Agriculture Course · English and Portuguese','Curso de Agricultura · Português e inglês')}</div><h1>${esc(text(course,'title',lang))}</h1><p class="lead">${esc(scope)}</p><section class="learning-distinction"><h2>${t('The source and its digital locators','A fonte e seus localizadores digitais')}</h2><p>${esc(text(course,'edition',lang))}</p><p>${t('The course follows the eight dated lectures and includes their discussions. It distinguishes Steiner’s speech, later reports and editorial commentary. Teaching examples and Portuguese study translations were prepared for this course.','O curso acompanha as oito palestras datadas e inclui suas discussões. Distingue a fala de Steiner, os relatos posteriores e os comentários editoriais. Os exemplos didáticos e as traduções de estudo em português foram preparados para este curso.')}</p></section><section id="lessons"><h2>${t('The eight lectures and their discussions','As oito palestras e suas discussões')}</h2><ol>${lessons.map(l=>`<li><a href="${relative(index,fileFor(l.id,lang))}">${esc(text(l,'title',lang))}</a><p>${esc(text(l,'goal',lang))}</p></li>`).join('')}</ol></section><section class="learning-continue"><h2>${t('Read the introductory anthology alongside this course','Leia a antologia introdutória junto a este curso')}</h2><p><a href="${relative(index,`docs/${pt?'pt/':''}what-is-biodynamics/index.html`)}">${t('What Is Biodynamics?','O que é biodinâmica?')} →</a></p></section>`;
 write(index,shell(index,text(course,'title',lang),indexBody,lang,{partner:indexFor(opposite),description:scope}));

 for(const [position,lesson] of lessons.entries()) {
  const v=lesson[lang],file=fileFor(lesson.id,lang),previous=lessons[position-1],next=lessons[position+1];
  if(!v?.intro||!v.meaning||!v.keyConcept||!v.example||!v.distinction||!v.connection)throw Error('Missing biodynamics teaching '+lesson.id+'/'+lang);
  if(!Array.isArray(v.checks)||v.checks.length!==3||v.checks[0].type==='reflection'||v.checks[1].type==='reflection'||v.checks[2].type!=='reflection')throw Error('Expected two retrieval checks and one reflection '+lesson.id+'/'+lang);
  // The shared learning builder adds the first interactive choice from the separate bank.
  // Keep its original open answer compatible with that builder and the second retrieval open.
  const checks=`<section class="learning-checks"><h2>${t('Check your understanding','Confira sua compreensão')}</h2>${openCheck(v.checks[0],lang)}${openCheck(v.checks[1],lang)}${quiz(v.checks[2],lang,route+'-'+n(lesson.id)+'-reflection')}<noscript><p>${t('Read each question, answer in your own words, then reveal the explanation to compare.','Leia cada pergunta, responda com suas palavras e revele a explicação para comparar.')}</p></noscript></section>`;
  const body=`<article><div class="eyebrow">${esc(lesson.author)} · ${t('Agriculture reading','Leitura de agricultura')}</div><h1>${esc(text(lesson,'title',lang))}</h1><p class="lead">${esc(v.intro)}</p><p><strong>${t('Reading aim','Objetivo da leitura')}:</strong> ${esc(text(lesson,'goal',lang))}</p>${sourcePassage(lesson,lang)}<section class="learning-meaning" id="study-explanation"><div class="eyebrow">${t('Course explanation','Explicação do curso')}</div><h2>${t('What the author means','O que o autor quer dizer')}</h2>${paragraphs(v.meaning)}</section><aside class="learning-key"><h2>${t('Key concept','Conceito principal')}</h2><p>${esc(v.keyConcept)}</p></aside><section class="learning-example"><h2>${t('Course example','Exemplo do curso')}</h2><p>${esc(v.example)}</p></section><section class="learning-distinction"><h2>${t('Keep this distinction','Conserve esta distinção')}</h2><p>${esc(v.distinction)}</p></section>${deeperStudy(v.deepStudy)}${checks}<section class="learning-continue"><h2>${next?t('Why the next reading follows','Por que vem a próxima leitura'):t('Bring the readings together','Relacione as leituras')}</h2><p>${esc(v.connection)}</p></section></article><nav class="lesson-navigation" aria-label="${t('Reading navigation','Navegação das leituras')}"><a href="${relative(file,previous?fileFor(previous.id,lang):index)}">← ${t('Previous','Anterior')}</a><a href="../index.html#structured-readings">${t('Course structure','Estrutura do curso')}</a>${next?`<a href="${relative(file,fileFor(next.id,lang))}">${t('Next','Próxima')}: ${esc(text(next,'title',lang))} →</a>`:''}</nav>`;
  // No notebook identity is assigned: existing beginner and legacy book storage stay separate.
  write(file,shell(file,text(lesson,'title',lang),body,lang,{partner:fileFor(lesson.id,opposite),description:v.intro}));
 }
}
console.log(`Built ${lessons.length} bilingual Agriculture readings with attributed source passages.`);
