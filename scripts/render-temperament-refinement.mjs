import {temperamentTeaching} from '../content/temperament-teaching.mjs';
import {openingTemperamentTeaching,temperamentPortraitOverview,temperamentSourceOverview} from '../content/temperament-refinement.mjs';
import {temperamentComparativeChecks,temperamentFinalComparison} from '../content/temperament-comparison-practice.mjs';
import {quiz} from './learning-html.mjs';

const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sections=rows=>rows.map(([title,...paragraphs])=>`<section class="temperament-concept"><h2>${esc(title)}</h2>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('');

function overview(value,id,lang){
 const pt=lang==='pt';
 return `<section class="temperament-overview" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${esc(value.title)}</h2><p>${esc(value.intro)}</p><p class="temperament-scroll-hint">${pt?'Em telas pequenas, deslize a tabela para comparar as colunas. Pelo teclado, selecione a tabela e use as setas.':'On small screens, scroll the table to compare columns. With a keyboard, focus the table and use the arrow keys.'}</p><div class="temperament-table-scroll" role="region" tabindex="0" aria-labelledby="${id}-title"><table><caption>${esc(value.title)}</caption><thead><tr>${value.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${value.rows.map(([label,...cells])=>`<tr><th scope="row">${esc(label)}</th>${cells.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="temperament-chart-source">${esc(value.source)}</p></section>`;
}

export function renderTemperamentTeaching(id,lang,originalKey=''){
 const opening=openingTemperamentTeaching[id]?.[lang];
 const main=sections(opening||temperamentTeaching[id][lang]);
 const chart=id===0?overview(temperamentSourceOverview[lang],'temperament-source-comparison',lang):id===1?overview(temperamentPortraitOverview[lang],'temperament-portrait-comparison',lang):'';
 const archive=opening?`<details class="guided-deep-study temperament-details" data-deep-study data-temperament-source-detail><summary>${lang==='pt'?'Aprofunde as fontes, os termos e as edições':'Go deeper into the sources, terms and editions'}</summary>${originalKey?`<p>${esc(originalKey)}</p>`:''}${sections(temperamentTeaching[id][lang])}</details>`:'';
 const final=id===11?renderFinalComparison(lang):'';
 return `<section class="temperament-teaching" data-temperament-core aria-label="${lang==='pt'?'O temperamento explicado':'Temperament explained'}">${main}${chart}${final}</section>${archive}`;
}

export function renderTemperamentComparisonCheck(id,lang){
 const check=temperamentComparativeChecks[id]?.[lang];
 if(!check)return '';
 return `<section class="temperament-comparison-check" data-temperament-comparison-check="${id}"><h3>${lang==='pt'?'Compare as explicações dos autores':'Compare the authors’ explanations'}</h3>${quiz(check,lang,`temperament-comparison-${id}`)}<p class="temperament-chart-source">${esc(check.source)}</p></section>`;
}

function renderFinalComparison(lang){
 const value=temperamentFinalComparison[lang];
 return `<section class="temperament-final-model" id="temperament-final-comparison" aria-labelledby="temperament-final-comparison-title"><div class="eyebrow">${lang==='pt'?'Exemplo de síntese do curso':'Course synthesis example'}</div><h2 id="temperament-final-comparison-title">${esc(value.title)}</h2>${value.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<ul>${value.sources.map(s=>`<li><a href="${esc(s.href)}">${esc(s.label)}</a></li>`).join('')}</ul></section>`;
}
