import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {esc,relative} from './learning-html.mjs';

// A final presentation pass: retain course-owned teaching, URLs and source credits.
const pathways = [
 ['human-being','Human Being','Ser humano','Understand constitution, individuality, temperament and biography.','Compreenda constituição, individualidade, temperamento e biografia.',['theosophy','understanding-temperaments','temperaments','mystery-temperaments','understand-temperament','phases']],
 ['knowledge-freedom','Knowledge & Freedom','Conhecimento e liberdade','Explore thinking, judgment and the reasons for free action.','Explore o pensar, o juízo e as razões de uma ação livre.',['philosophy-of-freedom','practical-thinking']],
 ['inner-development','Inner Development','Desenvolvimento interior','Study the proposed path of spiritual knowledge and its practice contexts.','Estude o caminho proposto de conhecimento espiritual e os contextos de suas práticas.',['higher-worlds','start-now','meditation']],
 ['christianity','Christianity','Cristianismo','Follow Steiner’s esoteric interpretations with their Gospel and lecture contexts.','Acompanhe as interpretações esotéricas de Steiner em seus contextos evangélicos e de palestras.',['according-to-luke','esoteric-christianity-1']],
 ['education','Education','Educação','Connect the account of development with Waldorf learning and family questions.','Relacione a concepção de desenvolvimento com a educação Waldorf e as questões das famílias.',['waldorf','encountering-the-self']],
 ['biodynamics','Biodynamics','Biodinâmica','Explore agriculture, bees, food and the differences between observation and spiritual interpretation.','Explore agricultura, abelhas, alimentação e as diferenças entre observação e interpretação espiritual.',['biodynamics','agriculture','what-is-biodynamics','bees','foodwise','nutrition']],
 ['society-culture','Society & Culture','Sociedade e cultura','Explore social life, myth, art and Steiner’s cultural work.','Explore vida social, mitos, arte e o trabalho cultural de Steiner.',['toward-threefold-society','esoteric-social','ancient-myths','colour','steiner-documentary']]
];
const takeElement=(html,start)=>{
 const tag=html.slice(start).match(/^<(\w+)\b/)?.[1];if(!tag)throw Error('Expected element');
 const tokens=new RegExp(`</?${tag}\\b[^>]*>`,'g');tokens.lastIndex=start;let depth=0;
 for(let m;(m=tokens.exec(html));){depth+=m[0].startsWith('</')?-1:1;if(!depth)return html.slice(start,tokens.lastIndex);}
 throw Error('Unclosed '+tag);
};
const main = html => html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0];
const addAsset=(html,file)=>html.includes('learning-pathways.css')?html:html.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/learning-pathways.css')}"></head>`);
const replaceMain=(html,body,attrs='')=>html.replace(/<main\b([^>]*)>[\s\S]*?<\/main>/,(_,a)=>`<main${a.replace(/ data-learning-pathways="[^"]*"/g,'')}${attrs}>${body}</main>`);
const read=file=>fs.readFileSync(file,'utf8');
const put=(file,html)=>fs.writeFileSync(file,addAsset(html,file));

function cardsFrom(html){
 const cards=new Map();
 for(const m of html.matchAll(/<(?:article|li)\b[^>]*class="[^"]*identity-(?:course-card|directory-course)[^"]*"[^>]*>/g)){
  const htmlCard=takeElement(html,m.index),key=htmlCard.match(/data-identity-art="([^"]+)"/)?.[1];
  if(key)cards.set(key,htmlCard.replace(/^<li\b([^>]*)>/,(_,attrs)=>`<article${attrs.replace(/class="[^"]*"/,'class="identity-course-card"')}>`).replace(/<\/li>$/,'</article>').replace('identity-directory-copy','identity-course-copy'));
 }
 return cards;
}
function startBlock(lang,file,{catalogue=false}={}){
 const pt=lang==='pt',t=(en,br)=>pt?br:en,base=pt?'docs/pt':'docs';
 return `<section class="pathway-foundations-start"${catalogue?' id="beginner-courses"':''} aria-labelledby="foundations-start-title"><div><p class="eyebrow">${t('New to Anthroposophy? Start here','Começando na antroposofia? Comece aqui')}</p><h2 id="foundations-start-title">${t('Foundations of Anthroposophy','Fundamentos da Antroposofia')}</h2><p class="lead">${t('The complete beginner starting point: 36 connected lessons, no previous knowledge and no book required.','O ponto de partida completo para iniciantes: 36 lições conectadas, sem conhecimento prévio nem livro obrigatório.')}</p><p>${t('Understand the human being, karma and reincarnation, spiritual worlds, knowledge, freedom and Anthroposophy in practice. Everyday examples introduce the ideas; Steiner’s spiritual claims remain clearly attributed.','Compreenda o ser humano, carma e reencarnação, mundos espirituais, conhecimento, liberdade e antroposofia na prática. Exemplos cotidianos introduzem as ideias; as afirmações espirituais de Steiner permanecem claramente atribuídas.')}</p><div class="pathway-actions"><a class="identity-primary-action button" href="${relative(file,base+'/learn/lessons/01.html')}">${t('Start Lesson 1','Começar a Lição 1')} →</a><a href="${relative(file,base+'/learn/foundations/index.html')}">${t('See all 36 lessons','Veja as 36 lições')} →</a></div></div><div class="pathway-start-sequence" aria-label="${t('Learning sequence','Sequência de aprendizagem')}"><span>${t('1 · Foundations','1 · Fundamentos')}</span><span aria-hidden="true">↓</span><span>${t('2 · Choose a pathway','2 · Escolha um percurso')}</span><span aria-hidden="true">↓</span><span>${t('3 · Books and practice','3 · Livros e prática')}</span></div></section>`;
}

function buildCatalogue(lang){
 const pt=lang==='pt',t=(en,br)=>pt?br:en,base=pt?'docs/pt':'docs',file=base+'/learn/index.html';
 let html=read(file),oldMain=main(html),cards=cardsFrom(oldMain);
 const expected=pathways.flatMap(p=>p[5]);
 for(const key of expected)if(!cards.has(key))throw Error(`${lang} pathway course missing: ${key}`);
 // Legacy subject bookmarks lead to their course inside the relevant pathway.
 if(!cards.get('nutrition').includes('id="nutrition-course"'))cards.set('nutrition',cards.get('nutrition').replace('<article','<article id="nutrition-course"'));
 const oldIds=[...oldMain.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]).filter(id=>id!=='main');
 const overview=`<section class="pathway-overview" aria-labelledby="overview-heading"><div><p class="eyebrow">${t('A shorter orientation','Uma orientação mais breve')}</p><h2 id="overview-heading">${t('Anthroposophy in Seven Parts','Antroposofia em sete partes')}</h2><p>${t('Want a quick map before committing to a course? Read the short overview. Foundations remains the recommended course for learning step by step.','Quer um mapa breve antes de iniciar um curso? Leia a visão geral. Fundamentos continua sendo o curso recomendado para aprender passo a passo.')}</p><a href="${relative(file,base+'/introduction-to-anthroposophy/overview.html')}">${t('Read the short overview','Leia a visão geral breve')} →</a><p class="pathway-small"><a href="${relative(file,base+'/introduction-to-anthroposophy/index.html')}">${t('Introduction: all 28 source-led lessons','Introdução: todas as 28 lições com fontes')}</a> · ${t('Optional thematic companion; you do not need to complete it alongside Foundations.','Estudo temático opcional; não é necessário concluí-lo junto com Fundamentos.')}</p></div></section>`;
 const groups=pathways.map(([id,en,br,descEn,descBr,keys])=>`<details class="learning-pathway" id="pathway-${id}" data-pathway="${id}"><summary><span class="pathway-title">${esc(t(en,br))}</span><span class="pathway-description">${esc(t(descEn,descBr))}</span><span class="pathway-count">${keys.length} ${t('courses','cursos')}</span></summary><div class="pathway-course-grid">${keys.map(key=>cards.get(key)).join('')}</div></details>`).join('');
 const syllabus=`<details class="pathway-parts"><summary>${t('Return to a Foundations part','Retome uma parte de Fundamentos')}</summary><ol>${Array.from({length:8},(_,i)=>`<li id="part-${i+1}"><a href="foundations/index.html#part-${i+1}">${t('Part','Parte')} ${i+1}</a></li>`).join('')}</ol></details>`;
 let body=`<h1>${t('Learn Anthroposophy','Aprenda antroposofia')}</h1><p class="lead">${t('One beginner course. Then choose the questions you want to explore.','Um curso inicial. Depois, escolha as questões que deseja explorar.')}</p>${startBlock(lang,file,{catalogue:true})}${overview}<section id="other-courses" aria-labelledby="pathways-heading"><p class="eyebrow">${t('After Foundations','Depois de Fundamentos')}</p><h2 id="pathways-heading">${t('Choose your learning pathway','Escolha seu percurso de aprendizagem')}</h2><p>${t('Open a pathway to see its courses. Begin with the first course listed or return to a subject you already know; you do not need to study every pathway.','Abra um percurso para ver seus cursos. Comece pelo primeiro curso da lista ou retome um tema que já conhece; não é necessário estudar todos os percursos.')}</p><nav class="pathway-jumps" aria-label="${t('Learning pathways','Percursos de aprendizagem')}">${pathways.map(([id,en,br])=>`<a href="#pathway-${id}">${esc(t(en,br))}</a>`).join('')}</nav>${groups}</section>${syllabus}`;
 // Existing bookmarks and external deep links continue to resolve.
 const present=new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 const missing=oldIds.filter(id=>!present.has(id));
 if(missing.length)body=`<div class="pathway-legacy-anchors" aria-hidden="true">${missing.map(id=>`<span id="${esc(id)}"></span>`).join('')}</div>`+body;
 html=replaceMain(html,body,' data-learning-pathways="true"');
 put(file,html);
}

function buildOverview(lang){
 const pt=lang==='pt',t=(en,br)=>pt?br:en,base=pt?'docs/pt':'docs',indexFile=base+'/introduction-to-anthroposophy/index.html',file=base+'/introduction-to-anthroposophy/overview.html';
 const course=JSON.parse(read('content/introduction-anthroposophy-course.json'));
 let original=read(indexFile);
 const title=t('Anthroposophy in Seven Parts — A Short Overview','Antroposofia em sete partes — uma visão geral breve');
 const body=`<p class="eyebrow">${t('Short overview · seven parts','Visão geral breve · sete partes')}</p><h1>${title}</h1><p class="lead">${t('See how the main questions fit together before choosing a longer study.','Veja como as questões centrais se relacionam antes de escolher um estudo mais longo.')}</p><div class="pathway-position-note"><p>${t('This is a short orientation drawn from the Introduction’s seven part summaries. For a complete beginner course with experience, explanation, diagrams and understanding checks, start with Foundations of Anthroposophy.','Esta é uma orientação breve baseada nas sínteses das sete partes da Introdução. Para um curso inicial completo, com experiência, explicação, diagramas e perguntas de compreensão, comece por Fundamentos da Antroposofia.')}</p><a href="${relative(file,base+'/learn/foundations/index.html')}">${t('Start Foundations','Comece por Fundamentos')} →</a></div><p>${t('These sections describe Steiner’s account. Understanding its relationships does not establish its spiritual claims. The source-led Introduction remains available in 28 lessons for thematic reading after this overview.','Estas seções descrevem a concepção de Steiner. Compreender suas relações não comprova suas afirmações espirituais. A Introdução com fontes permanece disponível em 28 lições para leitura temática após esta visão geral.')}</p><nav class="pathway-jumps" aria-label="${t('Seven parts','Sete partes')}">${course.parts.map(p=>`<a href="#overview-part-${p.number}">${p.roman} · ${esc(t(p.titleEn,p.titlePt))}</a>`).join('')}</nav>${course.parts.map(p=>`<section class="pathway-overview-part" id="overview-part-${p.number}"><p class="eyebrow">${t('Part','Parte')} ${p.roman}</p><h2>${esc(t(p.titleEn,p.titlePt))}</h2><p class="lead">${esc(p[lang].question)}</p><p>${esc(p[lang].synthesis)}</p><details><summary>${t('Pause and check the distinction','Pare e confira a distinção')}</summary><p><strong>${esc(p[lang].synthesisQuestion)}</strong></p><p>${esc(p[lang].synthesisAnswer)}</p></details><a href="parts/${p.slug}.html">${t('Optional: study this part with its sources','Opcional: estude esta parte com suas fontes')} →</a></section>`).join('')}<section class="pathway-position-note"><h2>${t('Choose what comes next','Escolha o próximo passo')}</h2><p><a href="${relative(file,base+'/learn/foundations/index.html')}">${t('Learn step by step: Foundations of Anthroposophy','Aprenda passo a passo: Fundamentos da Antroposofia')} →</a></p><p><a href="index.html">${t('Explore the Introduction’s full 28-lesson source companion','Explore o estudo completo da Introdução em 28 lições com fontes')} →</a></p><p><a href="${relative(file,base+'/learn/index.html')}">${t('Choose a learning pathway','Escolha um percurso de aprendizagem')} →</a></p><p><a href="source-notes.html">${t('Sources, editions and reading references','Fontes, edições e referências de leitura')}</a></p></section>`;
 let html=replaceMain(original,body);
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(t('A short seven-part orientation to Steiner’s worldview, with clearly attributed claims and links to full studies.','Uma orientação breve em sete partes à concepção de Steiner, com afirmações atribuídas e links para estudos completos.'))}">`);
 html=html.replace(/<script type="application\/json" id="cw-data">[\s\S]*?<\/script>/,'');
 html=html.replace(/("page":)"((?:pt\/)?introduction-to-anthroposophy)\/index.html"/g,'$1"$2/overview.html"').replace(/("(?:en|pt-BR)":)"((?:pt\/)?introduction-to-anthroposophy)\/index.html"/g,'$1"$2/overview.html"');
 html=html.replace(/(<link rel="alternate"[^>]*href=")([^"]*)index.html("[^>]*>)/,'$1$2overview.html$3').replace(/(<a\b[^>]*href=")([^"]*)index.html("[^>]*data-site-language-choice=[^>]*>)/g,'$1$2overview.html$3');
 put(file,html);
 // Make the different job of the existing 28-lesson route explicit, preserving all its lessons.
 original=original.replace(/<aside class="pathway-introduction-position\b[^"]*"[\s\S]*?<\/aside>/g,'');
 const note=`<aside class="pathway-introduction-position pathway-position-note"><h2>${t('A thematic source companion','Um estudo temático com fontes')}</h2><p>${t('Foundations of Anthroposophy is the canonical beginner course. This Introduction is an optional seven-part thematic companion with 28 source-led lessons; it is useful for an overview or revisiting a question after Foundations. You do not need to complete both courses.','Fundamentos da Antroposofia é o curso inicial de referência. Esta Introdução é um estudo temático opcional em sete partes e 28 lições com fontes; serve para uma visão de conjunto ou para retomar uma questão depois de Fundamentos. Não é necessário concluir os dois cursos.')}</p><div class="pathway-actions"><a href="overview.html">${t('Read the short seven-part overview','Leia a visão geral breve em sete partes')} →</a><a href="${relative(indexFile,base+'/learn/foundations/index.html')}">${t('Start Foundations','Comece por Fundamentos')} →</a></div></aside>`;
 original=original.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/,'$1'+note).replace(t('Begin course','Começar o curso'),t('Begin the optional 28-lesson companion','Começar o estudo opcional de 28 lições'));
 put(indexFile,original);
}

function strengthenStart(lang){
 const pt=lang==='pt',t=(en,br)=>pt?br:en,base=pt?'docs/pt':'docs';
 const file=base+'/learn/foundations/index.html';let html=read(file);
 html=html.replace(/<aside class="pathway-foundations-start\b[^"]*"[\s\S]*?<\/aside>/g,'');
 const note=`<aside class="pathway-foundations-start pathway-canonical-note"><p><strong>${t('The beginner starting point','O ponto de partida para iniciantes')}</strong> · ${t('36 lessons · No previous knowledge · No book required','36 lições · Sem conhecimento prévio · Sem livro obrigatório')}</p><p>${t('Follow these lessons in order. Then choose a learning pathway; the shorter Introduction overview is optional.','Acompanhe estas lições em ordem. Depois escolha um percurso de aprendizagem; a visão geral breve da Introdução é opcional.')}</p></aside>`;
 html=html.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/,'$1'+note);put(file,html);
 for(const home of pt?['docs/pt/index.html','docs/index.html']:['docs/en/index.html']){html=read(home);
 html=html.replace(/(<a class="identity-primary-action" href="[^"]*learn\/foundations\/index.html">)[\s\S]*?(<\/a>)/,`$1${t('Start Foundations','Comece por Fundamentos')}$2`)
  .replace(t('Follow a guided introduction to the central questions.','Siga uma introdução guiada às questões centrais.'),t('Start Foundations of Anthroposophy: 36 lessons, no previous knowledge and no book required.','Comece por Fundamentos da Antroposofia: 36 lições, sem conhecimento prévio nem livro obrigatório.'))
  .replace(t('Explore the Introduction to Anthroposophy','Conheça a Introdução à Antroposofia'),t('Read the short seven-part overview','Leia a visão geral breve em sete partes'))
  .replace(/(href="[^"]*introduction-to-anthroposophy\/)index.html("[^>]*>)(Read the short seven-part overview|Leia a visão geral breve em sete partes)/,'$1overview.html$2$3');
 put(home,html);
 }
}

export function buildLearningPathways(){
 fs.copyFileSync(new URL('./assets/learning-pathways.css',import.meta.url),'docs/learning-pathways.css');
 for(const lang of ['en','pt']){buildCatalogue(lang);buildOverview(lang);strengthenStart(lang);}
 console.log('Built seven bilingual learning pathways, canonical Foundations entry and a short seven-part overview; all existing courses retained.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildLearningPathways();
