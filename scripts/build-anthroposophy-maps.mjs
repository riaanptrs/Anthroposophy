import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {anthroposophyMaps} from '../content/anthroposophy-maps.mjs';
import {esc, relative, write} from './learning-html.mjs';
import {renderPlatformPage} from './platform-components.mjs';

export {renderAnthroposophyMap} from './render-anthroposophy-maps.mjs';
import {renderAnthroposophyMap} from './render-anthroposophy-maps.mjs';

export function buildAnthroposophyMaps(){
 fs.copyFileSync(new URL('./assets/anthroposophy-maps.css',import.meta.url),'docs/anthroposophy-maps.css');
 for(const lang of ['en','pt']){
  const pt=lang==='pt',base=`docs/${pt?'pt/':''}`,file=base+'reference/anthroposophy-map.html',partner=`docs/${pt?'':'pt/'}reference/anthroposophy-map.html`;
  const title=pt?'Mapas para compreender a antroposofia':'Maps for understanding Anthroposophy';
  const body=`<nav class="cp-breadcrumb" aria-label="${pt?'Localização':'Location'}"><a href="${relative(file,base+'learn/index.html')}">${pt?'Aprenda':'Learn'}</a><a href="${relative(file,base+'learn/foundations/index.html')}">${pt?'Fundamentos da antroposofia':'Foundations of Anthroposophy'}</a></nav><div class="am-reference-intro"><p class="cp-label">${pt?'Referência visual · 6 mapas':'Visual reference · 6 maps'}</p><h1>${title}</h1><p class="lead">${pt?'Veja as relações, conserve as distinções e volte à lição. Cada mapa organiza uma pergunta diferente.':'See the relationships, keep the distinctions, and return to the lesson. Each map organizes a different question.'}</p><p>${pt?'Estes são apoios didáticos originais para estudar a concepção de Steiner. Seus relatos de mundos e membros suprassensíveis são apresentados como afirmações dele, não como fatos comprovados. Compreender o mapa não exige aceitar a afirmação.':'These are original teaching aids for studying Steiner’s account. His descriptions of supersensible worlds and members are presented as his claims, not established facts. Understanding a map does not require accepting the claim.'}</p></div><nav class="am-reference-nav" aria-label="${pt?'Escolha um mapa':'Choose a map'}">${anthroposophyMaps.map(m=>`<a href="#${m.id}">${esc(m[lang].title)}</a>`).join('')}</nav>${anthroposophyMaps.map(m=>`<section class="am-map-section" id="${m.id}">${renderAnthroposophyMap(m.id,lang)}</section>`).join('')}<p><a class="cp-button" href="${relative(file,base+'learn/foundations/index.html')}">${pt?'Voltar ao curso de Fundamentos':'Return to Foundations'} →</a></p>`;
  let html=renderPlatformPage(file,title,body,lang,{partner,role:'reference'});
  html=html.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/visual-identity.css')}"><link rel="stylesheet" href="${relative(file,'docs/anthroposophy-maps.css')}"></head>`).replace('<body class="concept-platform-page"','<body data-visual-identity="2026-10" data-identity-theme="violet" class="concept-platform-page"');
  write(file,html);
 }
 console.log('Built six original concept maps in English and Portuguese.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildAnthroposophyMaps();
