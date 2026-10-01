import fs from 'node:fs';
import {esc,n,relative,quiz,shell,write} from './learning-html.mjs';

const route='toward-threefold-society';
const course=JSON.parse(fs.readFileSync('content/toward-threefold-society.json','utf8'));
const lessons=course.lessons;
if(!Array.isArray(lessons)||!lessons.length)throw Error('Missing threefold society introduction and preface readings');
if(new Set(lessons.map(l=>l.id)).size!==lessons.length)throw Error('Repeated threefold society reading identity');
const fileFor=(id,lang)=>`docs/${lang==='pt'?'pt/':''}${route}/lessons/${n(id)}.html`;
const indexFor=lang=>`docs/${lang==='pt'?'pt/':''}${route}/index.html`;
const text=(item,key,lang)=>item[key+(lang==='pt'?'Pt':'En')];
const paragraphs=value=>(Array.isArray(value)?value:[value]).map(p=>`<p>${esc(p)}</p>`).join('');
const quoteParagraphs=value=>esc(value).split('\n\n').map(p=>`<p>${p.replaceAll('\n','<br>')}</p>`).join('');

function sourcePassage(lesson,lang) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a,p=lesson.passage;
 if(!p||!text(p,'quote',lang)?.trim())throw Error('Missing Markdown source passage '+route+'/'+lesson.id+'/'+lang);
 if(!Number.isInteger(p.pageMarker)||p.pageMarker<1||p.pageMarker>14)throw Error('Missing or out-of-scope Markdown page marker '+route+'/'+lesson.id);
 const locator=text(p,'locator',lang)||p.locator;
 const credit=text(p,'credit',lang)||p.credit;
 if(!locator||!credit||!lesson.author)throw Error('Missing source attribution '+route+'/'+lesson.id+'/'+lang);
 return `<section class="learning-source book-passage" id="book-passage"><div class="eyebrow">${t('Read · Source passage','Leia · Trecho da fonte')}</div><h2>${esc(lesson.author)} · <cite>${esc(text(course,'title',lang))}</cite></h2><p class="source-locator">${t('Markdown page marker','Marcador de página do Markdown')} ${p.pageMarker} · ${esc(locator)}</p><blockquote class="source-excerpt">${quoteParagraphs(text(p,'quote',lang))}</blockquote><p class="passage-credit">${esc(credit)}</p><p class="source-credit">${esc(text(course,'edition',lang))}</p><p>${t('The quotation is checked against the supplied OCR Markdown. Its page markers and displayed Kindle locations identify that text; they are not printed page numbers. No PDF was supplied for visual comparison.','A citação foi conferida no Markdown de OCR fornecido. Seus marcadores de página e as localizações exibidas do Kindle identificam esse texto; não são números de páginas impressas. Não foi fornecido PDF para comparação visual.')}</p></section>`;
}

function openCheck(check,lang) {
 if(!check.question||!check.explanation)throw Error('Incomplete threefold society source check');
 return `<p>${esc(check.question)}</p><details><summary>${lang==='pt'?'Ver uma resposta comentada':'Show a suggested answer'}</summary><p>${esc(check.explanation)}</p></details>`;
}

function deeperStudy(value) {
 if(!value)return '';
 return (Array.isArray(value)?value:[value]).map(section=>{
  if(!section.title||!Array.isArray(section.paragraphs)||!section.paragraphs.length)throw Error('Incomplete threefold society deeper study');
  return `<details class="guided-deep-study" data-deep-study><summary>${esc(section.title)}</summary>${paragraphs(section.paragraphs)}</details>`;
 }).join('');
}

for(const lang of ['en','pt']) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a,index=indexFor(lang),opposite=pt?'en':'pt';
 const scope=text(course,'scope',lang)||t('This course studies the supplied front matter, Frank Thomas Smith’s October 2019 translator’s introduction and Rudolf Steiner’s complete preface to the fourth German edition (1920). The book’s main chapters are not included in the supplied Markdown and have not been reviewed here.','Este curso estuda os elementos iniciais fornecidos, a introdução do tradutor Frank Thomas Smith de outubro de 2019 e o prefácio completo de Rudolf Steiner à quarta edição alemã (1920). Os capítulos principais do livro não estão incluídos no Markdown fornecido e não foram estudados aqui.');
 const indexBody=`<div class="eyebrow">${t('Introduction and preface · English and Portuguese','Introdução e prefácio · Português e inglês')}</div><h1>${esc(text(course,'title',lang))}</h1><p class="lead">${esc(scope)}</p><section class="learning-distinction"><h2>${t('The source and its limits','A fonte e seus limites')}</h2><p>${esc(text(course,'edition',lang))}</p><p>${t('Smith’s translator’s introduction, Steiner’s 1920 preface and the course’s original teaching examples are separately attributed. Source references use the fourteen page markers of the uploaded OCR Markdown. No PDF was supplied for visual comparison; the complete GA 23 book remains outside this reviewed source.','A introdução do tradutor Smith, o prefácio de Steiner de 1920 e os exemplos didáticos originais do curso são atribuídos separadamente. As referências à fonte usam os quatorze marcadores de página do Markdown de OCR enviado. Não foi fornecido PDF para comparação visual; o livro completo de GA 23 permanece fora desta fonte estudada.')}</p></section><section id="lessons"><h2>${t('Readings in the introduction and preface','Leituras da introdução e do prefácio')}</h2><ol>${lessons.map(l=>`<li><a href="${relative(index,fileFor(l.id,lang))}">${esc(text(l,'title',lang))}</a><p>${esc(text(l,'goal',lang))}</p></li>`).join('')}</ol></section>`;
 write(index,shell(index,text(course,'title',lang),indexBody,lang,{partner:indexFor(opposite),description:scope}));

 for(const [position,lesson] of lessons.entries()) {
  const v=lesson[lang],file=fileFor(lesson.id,lang),previous=lessons[position-1],next=lessons[position+1];
  if(!v?.intro||!v.meaning||!v.keyConcept||!v.example||!v.distinction||!v.connection)throw Error('Missing threefold society teaching '+lesson.id+'/'+lang);
  if(!Array.isArray(v.checks)||v.checks.length!==3||v.checks[0].type==='reflection'||v.checks[1].type==='reflection'||v.checks[2].type!=='reflection')throw Error('Expected two retrieval checks and one reflection '+lesson.id+'/'+lang);
  // The shared learning layer inserts one interactive choice from the separate bank.
  const checks=`<section class="learning-checks"><h2>${t('Check your understanding','Confira sua compreensão')}</h2>${openCheck(v.checks[0],lang)}${openCheck(v.checks[1],lang)}${quiz(v.checks[2],lang,route+'-'+n(lesson.id)+'-reflection')}<noscript><p>${t('Read each question, answer in your own words, then reveal the explanation to compare.','Leia cada pergunta, responda com suas palavras e revele a explicação para comparar.')}</p></noscript></section>`;
  const body=`<article><div class="eyebrow">${esc(lesson.author)} · ${t('Introduction and 1920 preface','Introdução e prefácio de 1920')}</div><h1>${esc(text(lesson,'title',lang))}</h1><p class="lead">${esc(v.intro)}</p><p><strong>${t('Reading aim','Objetivo da leitura')}:</strong> ${esc(text(lesson,'goal',lang))}</p>${sourcePassage(lesson,lang)}<section class="learning-meaning" id="study-explanation"><div class="eyebrow">${t('Course explanation','Explicação do curso')}</div><h2>${t('What the author means','O que o autor quer dizer')}</h2>${paragraphs(v.meaning)}</section><aside class="learning-key"><h2>${t('Key concept','Conceito principal')}</h2><p>${esc(v.keyConcept)}</p></aside><section class="learning-example"><h2>${t('Course example','Exemplo do curso')}</h2><p>${esc(v.example)}</p></section><section class="learning-distinction"><h2>${t('Keep this distinction','Conserve esta distinção')}</h2><p>${esc(v.distinction)}</p></section>${deeperStudy(v.deepStudy)}${checks}<section class="learning-continue"><h2>${next?t('Why the next reading follows','Por que vem a próxima leitura'):t('Bring the readings together','Relacione as leituras')}</h2><p>${esc(v.connection)}</p></section></article><nav class="lesson-navigation" aria-label="${t('Reading navigation','Navegação das leituras')}"><a href="${relative(file,previous?fileFor(previous.id,lang):index)}">← ${t('Previous','Anterior')}</a><a href="../index.html#structured-readings">${t('Course structure','Estrutura do curso')}</a>${next?`<a href="${relative(file,fileFor(next.id,lang))}">${t('Next','Próxima')}: ${esc(text(next,'title',lang))} →</a>`:''}</nav>`;
  // This source course has no notebook identity and cannot collide with existing saved notes.
  write(file,shell(file,text(lesson,'title',lang),body,lang,{partner:fileFor(lesson.id,opposite),description:v.intro}));
 }
}
console.log(`Built ${lessons.length} bilingual Toward a Threefold Society introduction and preface readings with Markdown source locators.`);
