import fs from 'node:fs';
import path from 'node:path';
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const n = value => String(value).padStart(2,'0');
export function relative(from,to) { return path.relative(path.dirname(from),to).replaceAll('\\','/') || path.basename(to); }
export function wholeElement(html,marker) {
 const start=html.indexOf(marker); if(start<0) return null;
 const tag=marker.match(/^<(\w+)/)[1], tokens=new RegExp(`</?${tag}\\b[^>]*>`,'g');
 tokens.lastIndex=start;let depth=0;
 for(let m;(m=tokens.exec(html));) { depth+=m[0].startsWith('</')?-1:1;if(!depth)return html.slice(start,tokens.lastIndex); }
 throw Error('Unclosed element '+marker);
}
export function quiz(check,lang,name) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a;
 if(check.type==='reflection') return `<section class="learning-reflection"><h3>${esc(check.question)}</h3><p>${t('Pause and answer in one sentence, aloud or in your notes.','Pare e responda em uma frase, em voz alta ou nas suas notas.')}</p><details class="guided-quiz answer-explanation"><summary>${t('See a way to approach it','Veja uma maneira de abordar a pergunta')}</summary><p>${esc(check.explanation)}</p></details></section>`;
 return `<fieldset class="learning-quiz" data-answer="${check.answer}"><legend>${esc(check.question)}</legend>${check.options.map((option,i)=>`<label><input type="radio" name="${esc(name)}" value="${i}"><span>${esc(option)}</span></label>`).join('')}<div class="quiz-actions"><button type="button" data-check-answer>${t('Check answer','Conferir resposta')}</button><button type="button" data-retry>${t('Try again','Tentar novamente')}</button></div><p data-quiz-feedback role="status" aria-live="polite"></p><details class="guided-quiz answer-explanation"><summary>${t('Reveal the explanation','Revelar a explicação')}</summary><p>${esc(check.explanation)}</p></details></fieldset>`;
}
export function shell(file,title,body,lang,{partner,description='',className='learning-course'}={}) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a;
 const assets=name=>relative(file,'docs/'+name);
 return `<!doctype html>\n<html lang="${pt?'pt-BR':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — ${t('Anthroposophy','Antroposofia')}</title><meta name="description" content="${esc(description||title)}"><link rel="stylesheet" href="${assets('site-watercolour.css')}"><link rel="stylesheet" href="${assets('learning-system.css')}"><script defer src="${assets('learning-system.js')}"></script>${partner?`<link rel="alternate" hreflang="${pt?'en':'pt-BR'}" href="${relative(file,partner)}">`:''}</head><body data-learning-owned="true"><a class="skip" href="#main">${t('Skip to content','Pular para o conteúdo')}</a><header><a class="brand" href="${relative(file,pt?'docs/pt/index.html':'docs/index.html')}"><span class="mark" aria-hidden="true">✳</span> ${t('Anthroposophy','Antroposofia')}</a>${partner?`<nav aria-label="${t('Language','Idioma')}"><a lang="${pt?'en':'pt-BR'}" href="${relative(file,partner)}">${t('Português','English')}</a></nav>`:''}</header><main id="main" class="${className}">${body}</main><footer>${t('Understand the idea. Explain the relationship. Apply what you learned.','Compreenda a ideia. Explique a relação. Aplique o que aprendeu.')}</footer></body></html>`;
}
export function write(file,html) { fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html); }
