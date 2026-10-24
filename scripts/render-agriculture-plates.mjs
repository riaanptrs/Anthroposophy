import fs from 'node:fs';
import {esc,relative} from './learning-html.mjs';
export const agriculturePlates=JSON.parse(fs.readFileSync(new URL('../content/agriculture-source-plates.json',import.meta.url),'utf8'));
export function agriculturePlate(id,lang,file){
 const p=agriculturePlates.plates.find(p=>p.id===id);if(!p)throw Error('Unknown agriculture source plate '+id);
 const pt=lang==='pt',v=p[lang],src=relative(file,'docs/'+p.file);
 return `<figure class="agriculture-source-plate" data-source-plate="${esc(id)}"><h3>${esc(v.title)}</h3><a href="${src}" aria-label="${pt?'Abrir a prancha em tamanho completo':'Open the full-size plate'}"><img src="${src}" width="${p.width}" height="${p.height}" loading="lazy" alt="${esc(v.alt)}"></a><figcaption>${pt?'Prancha reproduzida na edição inglesa de George Adams, Rudolf Steiner Press, 2012; página':'Plate reproduced in George Adams’s English edition, Rudolf Steiner Press, 2012; page'} ${p.pdfPage} ${pt?'do PDF fornecido. Margens recortadas; linhas, cores e rótulos preservados. A numeração dos desenhos segue esta edição. Clique na imagem para ampliar.':'of the supplied PDF. Margins cropped; lines, colours and labels preserved. Drawing numbers follow this edition. Select the image to enlarge.'}</figcaption><details class="agriculture-plate-guide" open><summary>${pt?'Como ler a prancha':'How to read the plate'}</summary><ol>${v.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></details></figure>`;
}
fs.copyFileSync(new URL('./assets/agriculture-plates.css',import.meta.url),new URL('../docs/agriculture-plates.css',import.meta.url));
export function agriculturePlateStyles(file){return `<link rel="stylesheet" href="${relative(file,'docs/agriculture-plates.css')}">`;}
