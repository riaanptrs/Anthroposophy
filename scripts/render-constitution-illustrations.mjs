import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {esc,relative} from './learning-html.mjs';

const guide=JSON.parse(fs.readFileSync(new URL('../content/human-constitution-illustrations.json',import.meta.url),'utf8'));
const css=fs.readFileSync(new URL('./assets/constitution-illustrations.css',import.meta.url));
fs.writeFileSync('docs/constitution-illustrations.css',css);
const version=createHash('sha256').update(css).digest('hex').slice(0,12);
export const illustrationStyles=file=>`<link rel="stylesheet" href="${relative(file,'docs/constitution-illustrations.css')}?v=${version}">`;

export function constitutionIllustration(id,lang,file){
 const item=guide.illustrations.find(item=>item.id===id);
 if(!item)throw Error('Unknown constitution illustration: '+id);
 const v=item[lang],pt=lang==='pt',src=relative(file,'docs/'+item.file);
 return `<figure class="constitution-illustration" data-constitution-illustration="${esc(id)}"><a class="constitution-illustration-image" href="${src}" aria-label="${esc((pt?'Abrir imagem completa: ':'Open full-size image: ')+v.title)}"><img src="${src}" alt="${esc(v.alt)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"${pt?' lang="en"':''}></a><figcaption><p><strong>${esc(v.title)}</strong> · ${pt?'Ilustração original do curso sobre a concepção de Steiner. Legendas da imagem em inglês.':'Original course illustration of Steiner’s account.'} <a href="${src}">${pt?'Abrir imagem completa':'Open full-size image'}</a></p><details class="constitution-illustration-description"><summary>${pt?'Ler o diagrama em português':'Read the diagram in words'}</summary>${v.description.map(p=>`<p>${esc(p)}</p>`).join('')}</details></figcaption></figure>`;
}

export function constitutionGallery(lang,file){
 const pt=lang==='pt';
 return `<details class="constitution-illustration-gallery"><summary>${pt?'Comparar as descrições de três, nove e sete membros':'Compare the threefold, ninefold and sevenfold descriptions'}</summary><p>${pt?'Comece pela relação entre corpo, alma e espírito; depois acompanhe as distinções, os dois pares e a descrição separada do desenvolvimento. Cores e posições são recursos didáticos, não localizações no corpo.':'Start with body, soul and spirit, then follow the finer distinctions, the two pairings, and the separate developmental account. Colours and positions are teaching aids, not bodily locations.'}</p>${guide.illustrations.map(item=>constitutionIllustration(item.id,lang,file)).join('')}<p><a href="${relative(file,`docs/${pt?'pt/':''}learn/lessons/05.html`)}">${pt?'Lição 5: corpo, alma e espírito':'Lesson 5: body, soul and spirit'}</a> · <a href="${relative(file,`docs/${pt?'pt/':''}learn/lessons/11.html`)}">${pt?'Lição 11: distinções e agrupamentos':'Lesson 11: distinctions and groupings'}</a></p></details>`;
}
