import {withPortugueseSourceLabels} from './portuguese-source-labels.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {cloudGuide} from '../content/thinking-cloud-guide.mjs';

const passages=withPortugueseSourceLabels(JSON.parse(fs.readFileSync(new URL('../content/passage-study.json',import.meta.url),'utf8')));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=i=>String(i).padStart(2,'0');
const courses=[...new Set(passages.map(p=>p.course))];
// Locate a whole element even when it contains nested elements of the same kind.
function element(html,marker){
 const start=html.indexOf(marker);if(start<0)throw Error('Missing element: '+marker);
 const tag=marker.match(/^<(\w+)/)[1],tokens=new RegExp(`<\/?${tag}\\b[^>]*>`,'g');
 tokens.lastIndex=start;let depth=0;
 for(let m;(m=tokens.exec(html));){depth+=m[0].startsWith('</')?-1:1;if(depth===0)return html.slice(start,tokens.lastIndex);}
 throw Error('Unclosed element: '+marker);
}
function paragraphBlock(text){return text.split('\n\n').map(p=>`<p>${esc(p).replaceAll('\n','<br>')}</p>`).join('');}
function ensureStylesheet(html,href){
 const link=`<link rel="stylesheet" href="${href}">`;
 return html.replaceAll(link,'').replace('</head>',link+'</head>');
}
function renderCloudGuide(lang){
 const v=cloudGuide[lang],pt=lang==='pt';
 const urls=['https://rsarchive.org/Lectures/GA108/English/Singles/19090118p02.html','https://rsarchive.org/Books/GA004/English/RSP1964/GA004_c06.html'];
 return `<section class="cloud-guide" id="cloud-guide" aria-labelledby="cloud-guide-title"><h2 id="cloud-guide-title">${esc(v.title)}</h2><p>${esc(v.intro)}</p>${v.steps.map(([title,body,question,hint,answer],i)=>`<section id="cloud-step-${i+1}"><h3>${i+1}. ${esc(title)}</h3><p>${esc(body)}</p><p><strong>${pt?'Confira sua compreensão':'Check your understanding'}:</strong> ${esc(question)}</p><details class="guided-hint"><summary>${pt?'Uma dica':'A hint'}</summary><p>${esc(hint)}</p></details><details class="guided-answer"><summary>${pt?'Ver uma resposta comentada':'Show an explained answer'}</summary><p>${esc(answer)}</p></details></section>`).join('')}<aside class="source-note"><h3>${esc(v.sourceTitle)}</h3><ul>${urls.map((url,i)=>`<li><a href="${url}">${esc(v.sources[i])}</a></li>`).join('')}</ul><p><a href="01.html">${pt?'Retome a lição anterior: pensamento espiritual e compreensão humana':'Revisit the previous lesson: spiritual thought and human understanding'} →</a></p></aside></section>`;
}
function renderPassage(p,lang,goal){
 const pt=lang==='pt',t=(en,br)=>pt?br:en,v=p[lang];
 const credit=t(p.edition,p.editionPt||(p.originalLanguage==='de'?'Original alemão; novas traduções de estudo em inglês e português brasileiro.':p.title.includes('Foundation Stone')?'Tradução de estudo preparada para este curso a partir do original alemão impresso.':'Trecho selecionado da edição inglesa indicada; nova tradução de estudo em português. Quebras de linha normalizadas.'));
 const title=pt?(p.titlePt||p.title):p.title,locator=pt?(p.locatorPt||p.locator):p.locator;
 const reference=p.referenceEdition;
 const original=p.originalLanguage==='de'?`<details class="guided-original"><summary>${t('Compare with the German passage','Compare com o trecho alemão')}</summary><blockquote lang="de">${paragraphBlock(p.original)}</blockquote></details>`:reference?.originalLanguage==='de'?`<details class="guided-original"><summary>${t('Compare with the separately credited German parallel','Compare com a edição paralela alemã, creditada separadamente')}</summary><p>${esc(reference.title)} · ${esc(reference.locator)}</p><p>${t('Earlier German reference selection; the passage above quotes the supplied 2012 English edition. The selections can cover different sentences.','Seleção alemã de referência anterior; o trecho acima cita a edição inglesa de 2012 fornecida. As seleções podem abranger frases diferentes.')}</p><blockquote lang="de">${paragraphBlock(reference.original)}</blockquote>${reference.url?`<p><a href="${esc(reference.url)}">${t('Read the German lecture','Leia a palestra alemã')} →</a></p>`:''}</details>`:'';
 return `<section class="book-passage" id="book-passage" aria-labelledby="passage-title"><div class="eyebrow">${t('1 · Read the passage','1 · Leia o trecho')}</div><h2 id="passage-title">${t('Begin with the book','Comece pelo livro')}</h2><p class="passage-context">${esc(p.author)} · <cite>${esc(title)}</cite> · ${esc(locator)}</p><blockquote class="source-excerpt">${paragraphBlock(v.quote)}</blockquote><p class="passage-credit">${esc(credit)}</p>${p.url?`<p><a href="${esc(p.url)}">${t(p.originalLanguage==='de'?'Read the original chapter or lecture (German)':'Open the source or edition index',p.originalLanguage==='de'?'Leia o capítulo ou a palestra original (alemão)':'Abra a fonte ou o índice de edições')} →</a></p>`:''}${original}<div class="passage-explanation"><h3>${t('What this passage means','O que este trecho significa')}</h3>${paragraphBlock(v.note)}<h3>${t('The focus of this lesson','O foco desta lição')}</h3><p>${goal}</p></div></section>`;
}
const seen=new Set();let count=0;
for(const p of passages)for(const id of p.ids)for(const lang of ['en','pt']){
 const pt=lang==='pt',base=pt?'docs/pt':'docs',t=(en,br)=>pt?br:en;
 const file=p.course==='theosophy'?`${base}/lessons/${n(id)}.html`:p.course==='meditation'?`${base}/meditation/${n(id)}.html`:`${base}/${p.course}/lessons/${n(id)}.html`;
 if(seen.has(file))throw Error('Duplicate passage assignment: '+file);seen.add(file);
 let h=fs.readFileSync(file,'utf8');
 if(h.includes('data-passage-study='))throw Error('Run the complete build before applying passage study again: '+file);
 const lead=h.match(/<p class="lead">([\s\S]*?)<\/p>/);if(!lead)throw Error('No lesson goal: '+file);
 const passage=renderPassage(p,lang,lead[1])+(p.course==='practical-thinking'&&id===2?renderCloudGuide(lang):'');
 h=h.replace('class="lesson-main"','class="lesson-main" data-passage-study="true"');
 const css=path.relative(path.dirname(file),'docs/passage-study.css').replaceAll('\\','/');
 h=ensureStylesheet(h,css);
 if(p.course==='meditation'){
  h=h.replace(lead[0],lead[0]+passage);
 }else{
  const first=element(h,'<section class="study-attempt">');
  h=h.replace(first,'');
  const scene=element(h,'<section class="worked-example">');h=h.replace(scene,'');
  const example=element(h,'<div class="study-example-rest">');h=h.replace(example,'');
  let explanation=element(h,'<details class="guided-reveal"');h=h.replace(explanation,'');
  explanation=explanation.replace('<details class="guided-reveal"','<details class="guided-reveal" open').replace(/<summary>[\s\S]*?<\/summary>/,`<summary>${t('Explore the chapter’s core ideas','Explore as ideias centrais do capítulo')}</summary>`);
  // Put the source and the full explanation ahead of the scenario and all exercises.
  h=h.replace(lead[0],lead[0]+passage+explanation);
  const worked=`<section class="worked-example">${example.replace(/^<div[^>]*>/,'').replace(/<\/div>$/,'').replace(/<h3>[\s\S]*?<\/h3>/,`<h2>${t('See the idea in an example','Veja a ideia num exemplo')}</h2>`)}</section>`;
  let attempt=first.replace(/<span class="study-step">[\s\S]*?<\/span>/,`<span class="study-step">${t('2 · Explain what you read','2 · Explique o que leu')}</span>`)
   .replace(/<h2 class="study-question">[\s\S]*?<\/h2>/,`<h2 class="study-question">${t('Explain and apply the central idea','Explique e aplique a ideia central')}</h2><p>${t('Explain the central idea in your own words. Show how it works in the example, then describe a different situation where the same distinction matters. Use this lesson’s explanation to address its learning goal:','Explique a ideia central com suas palavras. Mostre como ela funciona no exemplo e descreva outra situação em que a mesma distinção seja relevante. Use a explicação da lição para desenvolver seu objetivo de aprendizagem:')} ${lead[1]}</p>`)
   .replace(/<details class="guided-hint">[\s\S]*?<\/details>/,`<details class="guided-hint"><summary>${t('A hint if you need one','Uma pista, se precisar')}</summary><p>${t('Read the passage and its explanation again. Identify what the author connects or distinguishes. Explain that relationship before applying it to your own example.','Releia o trecho e sua explicação. Identifique o que o autor relaciona ou distingue. Explique essa relação antes de aplicá-la a um exemplo próprio.')}</p></details>`);
  const source=element(h,'<section class="study-return">');
  const revisedSource=source.replace(/<p>[\s\S]*?<\/p>/,`<p>${t('Return to the passage at the top. Identify the words that support your explanation and give the source reference. If you have the book, read the surrounding section and add one point that the short excerpt leaves out.','Volte ao trecho inicial. Identifique as palavras que sustentam sua explicação e indique a referência. Se tiver o livro, leia a seção ao redor e acrescente um ponto que o trecho curto não inclui.')}</p>`);
  h=h.replace(source,worked+attempt+revisedSource);
  h=h.replace(t('Try → explore → read → revise. You can open the explanation whenever you need it.','Tente → explore → leia → revise. Abra a explicação quando precisar.'),t('Read → understand → explain → apply. The chapter explanation is open from the start.','Leia → compreenda → explique → aplique. A explicação do capítulo está aberta desde o início.'));
 }
 fs.writeFileSync(file,h);count++;
}
for(const course of courses)for(const lang of ['en','pt']){
 const pt=lang==='pt',t=(en,br)=>pt?br:en,base=pt?'docs/pt':'docs';
 const file=course==='theosophy'?`${base}/index.html`:`${base}/${course}/index.html`;
 let h=fs.readFileSync(file,'utf8');
 const guide=`<section class="passage-course-guide" id="reading-method"><h2>${t('Read the book with guidance','Leia o livro com orientação')}</h2><p>${t('Each lesson teaches its central ideas, shows an example and offers questions with explanatory feedback. A selected source passage is included for optional closer reading.','Cada lição ensina suas ideias centrais, apresenta um exemplo e oferece perguntas com respostas comentadas. Um trecho selecionado da fonte está incluído para leitura atenta opcional.')}</p><p>${t('Short excerpts are starting points for close reading. The source credit identifies the edition; the lesson’s reading assignment gives the wider section.','Os trechos curtos iniciam a leitura atenta. O crédito identifica a edição; a leitura indicada na lição apresenta a seção mais ampla.')}</p></section>`;
 h=h.replace(/(<p class="lead">[\s\S]*?<\/p>)/,'$1'+guide);
 const css=path.relative(path.dirname(file),'docs/passage-study.css').replaceAll('\\','/');
 h=ensureStylesheet(h,css);
 fs.writeFileSync(file,h);
}
console.log(`Passage study: ${passages.length} verified selections across ${courses.length} courses; ${count} English and Portuguese lesson pages.`);
