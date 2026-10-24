import fs from 'node:fs';
import {esc,relative} from './learning-html.mjs';
export const biodynamicsIllustrations=JSON.parse(fs.readFileSync(new URL('../content/what-is-biodynamics-illustrations.json',import.meta.url),'utf8'));
export function biodynamicsFigure(id,lang,file){
 const f=biodynamicsIllustrations.figures.find(f=>f.id===id);if(!f)throw Error('Unknown biodynamics figure '+id);
 const v=f[lang],pt=lang==='pt',src=relative(file,'docs/'+f.file);
 return `<figure class="biodynamics-book-figure" data-biodynamics-figure="${esc(id)}"><h3>${esc(v.title)}</h3><a href="${src}" aria-label="${pt?'Abrir a figura em tamanho completo':'Open the full-size figure'}"><img src="${src}" width="${f.width}" height="${f.height}" loading="lazy" alt="${esc(v.alt)}"></a><figcaption>${esc(f[pt?'creditPt':'creditEn'])}</figcaption><div class="biodynamics-figure-guide"><h4>${pt?'Como ler a figura':'How to read the figure'}</h4><ol>${v.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div></figure>`;
}
export function biodynamicsFiguresAfter(row,i,lang,file){
 const figs=(row.biodynamicsFigures||[]).filter(f=>f.afterParagraph===i);
 return figs.length?`<div class="biodynamics-figure-grid">${figs.map(f=>biodynamicsFigure(f.id,lang,file)).join('')}</div>`:'';
}
export function biodynamicsFurtherFigures(row,lang,file){
 return (row.biodynamicsFurtherFigures||[]).map(id=>`<details class="guided-biodynamics-figure"><summary>${esc(biodynamicsIllustrations.figures.find(f=>f.id===id)[lang].title)}</summary>${biodynamicsFigure(id,lang,file)}</details>`).join('');
}
export function biodynamicsWorkedExample(v,lang){
 if(!v.workedExample)return '';
 return `<section class="biodynamics-worked-example" data-biodynamics-worked-example><h2>${esc(v.workedExample.title)}</h2><ol>${v.workedExample.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="biodynamics-example-credit">${lang==='pt'?'Exemplo didático original do curso; não é uma citação do livro.':'Original course teaching example; not a quotation from the book.'}</p></section>`;
}
fs.copyFileSync(new URL('./assets/biodynamics-illustrations.css',import.meta.url),new URL('../docs/biodynamics-illustrations.css',import.meta.url));
export function biodynamicsIllustrationStyles(file){return `<link rel="stylesheet" href="${relative(file,'docs/biodynamics-illustrations.css')}">`;}
