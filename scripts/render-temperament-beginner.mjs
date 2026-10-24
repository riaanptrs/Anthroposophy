import fs from 'node:fs';
import {esc,relative} from './learning-html.mjs';
export const temperamentBeginner=JSON.parse(fs.readFileSync(new URL('../content/temperament-beginner-teaching.json',import.meta.url),'utf8'));
fs.copyFileSync(new URL('./assets/temperament-beginner.css',import.meta.url),new URL('../docs/temperament-beginner.css',import.meta.url));
export function temperamentWorkedExample(key,lang){
 const unit=temperamentBeginner.modules[key]?.[lang];if(!unit)throw Error('Unknown temperament teaching module '+key);
 const v=unit.workedExample,pt=lang==='pt';
 return `<section class="temperament-taught-example" data-temperament-example="${esc(key)}"><h2>${pt?'Exemplo explicado passo a passo':'A worked example, step by step'}</h2><h3>${pt?'1. A situação':'1. The situation'}</h3><p>${esc(v.situation)}</p><h3>${pt?'2. O que ajuda a compreender':'2. What helps explain it'}</h3><p>${esc(v.reasoning)}</p><h3>${pt?'3. Uma resposta possível':'3. A possible response'}</h3><p>${esc(v.response)}</p><p class="temperament-example-credit">${pt?'Exemplo original do curso para compreender a ideia; não é uma citação do livro nem um teste de classificação.':'Original course example for understanding the idea; not a book quotation or a classification test.'}</p></section>`;
}
export const temperamentBeginnerStyles=file=>`<link rel="stylesheet" href="${relative(file,'docs/temperament-beginner.css')}">`;
