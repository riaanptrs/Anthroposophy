import {anthroposophyMaps} from '../content/anthroposophy-maps.mjs';
import {esc} from './learning-html.mjs';

export function renderAnthroposophyMap(id,lang,{prefix='map',sources=true}={}){
 const map=anthroposophyMaps.find(x=>x.id===id);if(!map)throw Error('Unknown Anthroposophy map '+id);
 const v=map[lang],pt=lang==='pt',caption=`${prefix}-${id}-caption`;
 let diagram='';
 if(map.kind==='comparison')diagram=`<div class="am-panels">${v.groups.map(g=>`<div class="am-panel"><h3>${esc(g.title)}</h3><p>${esc(g.subtitle)}</p><dl>${g.nodes.map(([term,meaning])=>`<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl></div>`).join('')}</div>`;
 if(['sequence','cycle'].includes(map.kind))diagram=`${v.center?`<p class="am-center">${esc(v.center)}</p>`:''}<ol class="am-sequence${map.kind==='cycle'?' am-cycle':''}">${v.nodes.map(([term,meaning])=>`<li><strong>${esc(term)}</strong><span>${esc(meaning)}</span></li>`).join('')}</ol>${v.returnLabel?`<p class="am-return"><span aria-hidden="true">↶ </span>${esc(v.returnLabel)}</p>`:''}`;
 if(map.kind==='transformation')diagram=`<p class="am-center">${esc(v.center)}</p><ul class="am-transform">${v.nodes.map(([from,to])=>`<li><strong>${esc(from)}</strong><span class="am-arrow" aria-hidden="true">→</span><span class="sr-only">${pt?'transformação proposta em direção a':'proposed transformation toward'}</span><strong>${esc(to)}</strong></li>`).join('')}</ul>`;
 if(map.kind==='overview')diagram=`<p class="am-center">${esc(v.center)}</p><ul class="am-branches">${v.nodes.map(([term,meaning,question])=>`<li><strong>${esc(term)}</strong><span>${esc(meaning)}</span><em>${esc(question)}</em></li>`).join('')}</ul>`;
 return `<figure class="anthroposophy-map" data-concept-map="${id}" role="group" aria-labelledby="${caption}"><figcaption id="${caption}">${esc(v.title)}</figcaption><p class="am-question">${esc(v.question)}</p>${diagram}<p class="am-note">${esc(v.note)}</p><details><summary>${pt?'Leia o mapa em palavras e confira as fontes':'Read the map in words and check the sources'}</summary><p>${esc(v.description)}</p><p class="am-source-label">${pt?'Mapa e paráfrases originais do curso, não citações. As cores distinguem relações; não representam auras ou localizações físicas.':'Original course map and paraphrases, not quotations. Colours distinguish relationships; they do not represent auras or physical locations.'}</p>${sources?`<ul class="am-source-list">${map.sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s[lang])}</a></li>`).join('')}</ul>`:''}</details></figure>`;
}
