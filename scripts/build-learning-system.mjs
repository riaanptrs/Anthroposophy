import fs from 'node:fs';
import path from 'node:path';
import {esc,n,relative,wholeElement,quiz,shell,write} from './learning-html.mjs';
import {isPracticalThinkingOwned} from './practical-thinking-owned.mjs';

const readJSON=name=>JSON.parse(fs.readFileSync('content/'+name,'utf8'));
const catalogue=readJSON('learning-system-catalogue.json');
const sources=readJSON('learning-system-sources.json');
const lessons=['01-12','13-24','25-36'].flatMap(range=>readJSON('learning-lessons-'+range+'.json'));
const passages=readJSON('passage-study.json');
const passageCollections={
 'passage-study':passages,
 'what-is-biodynamics':readJSON('what-is-biodynamics-passages.json'),
 'agriculture':readJSON('agriculture-passages.json'),
 'toward-threefold-society':readJSON('toward-threefold-society-passages.json')
};
const bookChecks=[...readJSON('learning-book-checks.json'),...readJSON('what-is-biodynamics-checks.json'),...readJSON('agriculture-checks.json'),...readJSON('toward-threefold-society-checks.json')];
const parts={en:['Entering Anthroposophy','The human being','Human destiny','The spiritual cosmos','Knowledge and freedom','Christ and human evolution','Anthroposophy in practice','Final synthesis'],pt:['Entrar na antroposofia','O ser humano','Destino humano','O cosmos espiritual','Conhecimento e liberdade','Cristo e evolução humana','Antroposofia na prática','Síntese final']};
const mainCourses=['theosophy','philosophy-of-freedom','higher-worlds','practical-thinking','understanding-temperaments','according-to-luke','colour','encountering-the-self','ancient-myths','meditation','what-is-biodynamics','agriculture','toward-threefold-society'];
const cardMarkers={'according-to-luke':'luke','colour':'colour','encountering-the-self':'self','meditation':'meditation'};
const title=(item,lang)=>item[lang==='pt'?'titlePt':'titleEn'];
const lessonPath=(item,lang)=>item[lang==='pt'?'pathPt':'pathEn'];
const courseIndex=(course,lang)=>`docs/${lang==='pt'?'pt/':''}${course.route}/index.html`;
const beginnerPath=(id,lang)=>`docs/${lang==='pt'?'pt/':''}learn/lessons/${n(id)}.html`;
const sectionPath=(course,part,group,lang)=>`docs/${lang==='pt'?'pt/':''}${course.route}/chapters/${part.id}-${group.id}.html`;
const absoluteLocal=(url,lang)=>`docs/${lang==='pt'?'pt/':''}${url}`;

function centralQuestion(course,item,lang) {
 const field=lang==='pt'?'questionPt':'questionEn',value=item[field];
 if(value?.endsWith('?'))return value;
 // Group aims remain outcomes. The source-specific question for its first reading introduces the chapter.
 const first=course.lessons.find(l=>l.id===item.lessonIds?.[0]);
 return first?bookChecks.find(c=>c.studyId===first.studyId)?.[lang]?.question:value;
}
function rebase(html,from,to) {
 return html.replace(/\b(href|src)="([^"]+)"/g,(all,attr,url)=>{
  if(/^(https?:|data:|mailto:|#)/.test(url))return all;
  const [resource,fragment]=url.split('#'),[name,query]=resource.split('?');
  return `${attr}="${relative(to,path.resolve(path.dirname(from),name))}${query?'?'+query:''}${fragment?'#'+fragment:''}"`;
 });
}
function readingList(course,group,file,lang) {
 const pt=lang==='pt';
 return `<ol class="chapter-readings">${group.lessonIds.map((id,i)=>{const l=course.lessons.find(v=>v.id===id);return `<li><a href="${relative(file,lessonPath(l,lang))}">${l.optional?(pt?'Prática opcional':'Optional practice'):(pt?'Leitura':'Reading')+' '+(i+1)}: ${esc(title(l,lang))}</a><p>${esc(l[pt?'goalPt':'goalEn'])}</p></li>`;}).join('')}</ol>`;
}
function hierarchy(course,file,lang) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a;
 return `<section class="learning-index" id="structured-readings"><h2>${t('Parts, chapters and readings','Partes, capítulos e leituras')}</h2>${course.parts.map((part,i)=>`<section class="learning-part" id="part-${part.id}"><div class="eyebrow">${t('Course part','Parte do curso')} ${i+1}</div><h2>${esc(title(part,lang))}</h2><p class="learning-question">${esc(part[pt?'questionPt':'questionEn'])}</p>${part.groups.map(group=>`<section class="learning-chapter" id="chapter-${part.id}-${group.id}"><div class="eyebrow">${group.sourceChapterNumber?`${t('Book chapter','Capítulo do livro')} ${group.sourceChapterNumber}`:group.sourceLectureNumber?`${t('Source lecture','Palestra da fonte')} ${group.sourceLectureNumber}`:group.chapterIsOriginal?t('Source section','Seção da fonte'):t('Course grouping','Agrupamento do curso')}</div><h3>${(group.lessonIds.length>1||group.sourceChapterNumber)?`<a href="${relative(file,sectionPath(course,part,group,lang))}">${esc(title(group,lang))}</a>`:esc(title(group,lang))}</h3><p><strong>${t('Question','Pergunta')}:</strong> ${esc(centralQuestion(course,group,lang))}</p>${readingList(course,group,file,lang)}</section>`).join('')}</section>`).join('')}</section>`;
}
function beginnerSource(plan,lang,file,teaching) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a;
 if(Number.isInteger(plan.existingSource?.recordIndex)) {
  const collection=passageCollections[plan.existingSource.recordCollection||'passage-study'];
  if(!collection)throw Error('Unknown source collection for beginner '+plan.id);
  const p=collection[plan.existingSource.recordIndex];
  if(!p||p.course!==plan.existingSource.course||!p.ids.includes(plan.existingSource.id))throw Error('Source mismatch for beginner '+plan.id);
  return `<section class="learning-source" id="read"><div class="eyebrow">${t('Read · Source passage','Leia · Trecho da fonte')}</div><h2>${esc(p.author)} · <cite>${esc(pt?p.titlePt||p.title:p.title)}</cite></h2><p class="source-locator">${esc(pt?p.locatorPt||p.locator:p.locator)}</p><blockquote>${esc(p[lang].quote).split('\n\n').map(p=>`<p>${p.replaceAll('\n','<br>')}</p>`).join('')}</blockquote><p class="source-credit">${pt?(p.editionPt?esc(p.editionPt):'<span lang="en">'+esc(p.edition)+'</span> · Tradução de estudo em português preparada para este curso.'):esc(p.edition)}</p><p><a href="${relative(file,absoluteLocal(plan.bookLinks.find(l=>l.course===p.course&&l.id===plan.existingSource.id)?.url||plan.bookLinks[0].url,lang))}#book-passage">${t('Read the passage in its book course','Leia o trecho no curso do livro')} →</a></p></section>`;
 }
 const missing=plan.sourceStatus.startsWith('missing-local-source');
 return `<section class="learning-source" id="read"><div class="eyebrow">${missing?t('Read · Named follow-up source','Leia · Fonte indicada para aprofundamento'):t('Read · Identified source section','Leia · Seção identificada da fonte')}</div><h2>${t('Locate the section','Localize a seção')}</h2><p>${esc(teaching.sourceSection||plan.sourceSectionIfNoQuote)}</p><p>${missing?t('This is an introductory course overview. The named primary text has not been reviewed from a supplied local edition; no quotation or page number is supplied.','Esta é uma visão introdutória do curso. O texto primário indicado não foi conferido numa edição local fornecida; não apresentamos citação nem número de página.'):t('The explanation below paraphrases the identified section. It is course prose, rather than a quotation. Follow the book links for the wider reading and edition notes.','A explicação abaixo apresenta a seção indicada com outras palavras. É texto do curso. Consulte os links do livro para a leitura mais ampla e as notas da edição.')}</p></section>`;
}

for(const lang of ['en','pt']) {
 const pt=lang==='pt',t=(a,b)=>pt?b:a,base=pt?'docs/pt':'docs',other=pt?'docs':'docs/pt';
 const home=base+'/index.html',learn=base+'/learn/index.html',books=base+'/books/index.html';
 const lead=t('A progressive introduction to Rudolf Steiner’s account of the human being, consciousness, karma, reincarnation, spiritual worlds, freedom and human development.','Uma introdução progressiva à concepção de Rudolf Steiner sobre o ser humano, a consciência, o carma, a reencarnação, os mundos espirituais, a liberdade e o desenvolvimento humano.');
 write(home,shell(home,t('Learn Anthroposophy','Aprenda antroposofia'),`<section class="learning-hero"><div class="eyebrow">${t('36 lessons · English and Portuguese','36 lições · Português e inglês')}</div><h1>${t('Learn Anthroposophy','Aprenda antroposofia')}</h1><p class="lead">${lead}</p><a class="button" href="learn/lessons/01.html">${t('Begin the course','Comece o curso')} →</a><a class="learning-secondary" href="learn/index.html">${t('See the learning path','Veja o percurso de aprendizagem')}</a><p><a data-learning-resume hidden href="learn/lessons/01.html">${t('Continue where you left off','Continue de onde parou')} →</a></p></section><section id="study-guide" class="learning-method"><h2>${t('One question at a time','Uma pergunta por vez')}</h2><p>${t('Read a short source passage or identified section. Understand the author’s claim, examine a distinction, and check what you understood. Each lesson explains why the next idea follows.','Leia um trecho curto ou uma seção identificada da fonte. Compreenda a afirmação do autor, examine uma distinção e confira o que entendeu. Cada lição explica por que a próxima ideia decorre dela.')}</p><p>${t('The course distinguishes source texts, its own explanations and everyday examples. Understanding a claim and agreeing with it are separate steps.','O curso distingue os textos das fontes, suas próprias explicações e exemplos cotidianos. Compreender uma afirmação e concordar com ela são passos distintos.')}</p></section><section id="courses"><h2>${t('Go deeper when you are ready','Aprofunde quando estiver pronto')}</h2><div class="learning-grid"><a class="learning-card" href="books/index.html"><h3>${t('Study the Books','Estude os livros')}</h3><p>${t(`Follow ${catalogue.courses.length} book and practice collections, with visible chapters, source passages and existing notebooks.`,`Acompanhe ${catalogue.courses.length} coletâneas de livros e práticas, com capítulos visíveis, trechos das fontes e os cadernos existentes.`)}</p></a><a class="learning-card" href="themes/index.html"><h3>${t('Themes and Applications','Temas e aplicações')}</h3><p>${t('Find education, art, colour, biography, temperaments and meditation by subject.','Encontre educação, arte, cor, biografia, temperamentos e meditação por assunto.')}</p></a><a class="learning-card" href="research/index.html"><h3>${t('Research / Source Library','Pesquisa / Biblioteca de fontes')}</h3><p>${t('Explore detailed source maps, page notes, references and specialist material.','Explore mapas detalhados das fontes, notas por página, referências e material especializado.')}</p></a></div></section><section id="lessons"><p><a href="theosophy/index.html">${t('Looking for the original Theosophy course?','Procurando o curso original de Teosofia?')} →</a></p><p class="constitution-entry"><a href="reference/human-constitution.html">${t('Compare the human-being terminology','Compare a terminologia do ser humano')} →</a></p></section>`,lang,{partner:other+'/index.html',description:lead}));

 const partList=parts[lang].map((name,i)=>{const rows=sources.filter(s=>s.part===i+1);return `<section class="learning-part" id="part-${i+1}"><div class="eyebrow">${i===7?t('Final synthesis','Síntese final'):`${t('Part','Parte')} ${i+1}`}</div><h2>${esc(name)}</h2><ol start="${rows[0].id}">${rows.map(s=>`<li data-learning-progress="${n(s.id)}"><a href="lessons/${n(s.id)}.html">${esc(title(s,lang))}</a><p>${esc(s[pt?'centralQuestionPt':'centralQuestionEn'])}</p></li>`).join('')}</ol></section>`;}).join('');
 write(learn,shell(learn,t('Your beginner learning path','Seu percurso inicial'),`<div class="eyebrow">${t('Learn Anthroposophy · 36 lessons','Aprenda antroposofia · 36 lições')}</div><h1>${t('A connected learning path','Um percurso de aprendizagem conectado')}</h1><p class="lead">${lead}</p><a class="button" href="lessons/01.html">${t('Begin with Rudolf Steiner','Comece por Rudolf Steiner')} →</a><p data-learning-progress-summary></p><p><a data-learning-resume hidden href="lessons/01.html">${t('Resume your reading','Retome sua leitura')} →</a></p><section class="learning-method"><h2>${t('How the path works','Como funciona o percurso')}</h2><p>${t('Follow the sequence or return to a question. Brief checks help you retrieve ideas; they carry no score. Saving notes and completion is optional and stays in this browser.','Siga a sequência ou retome uma pergunta. Perguntas breves ajudam a recordar ideias, sem pontuação. Salvar notas e conclusão é opcional e fica neste navegador.')}</p><p>${t('Most lessons start from reviewed local source material. Biodynamics draws on What Is Biodynamics? and a complete eight-lecture GA 327 Agriculture course reviewed in two supplied Markdown editions. Social threefolding draws on the reviewed translator’s introduction and complete 1920 preface in Toward a Threefold Society; its main chapters remain outside this collection. Broader cosmology also identifies limits in the local collection.','A maioria das lições parte de fontes locais conferidas. A biodinâmica parte de O que é biodinâmica? e do Curso de Agricultura completo de oito palestras de GA 327, revisto em duas edições Markdown fornecidas. A trimembração social parte da introdução do tradutor e do prefácio completo de 1920 estudados em Rumo a uma sociedade trimembrada; seus capítulos principais permanecem fora desta coleção. A cosmologia mais ampla também identifica limites da coleção local.')}</p></section>${partList}`,lang,{partner:other+'/learn/index.html'}));

 for(const plan of sources) {
  const lesson=lessons.find(l=>l.id===plan.id),v=lesson?.[lang];if(!v)throw Error('Missing beginner teaching '+plan.id+'/'+lang);
  const file=beginnerPath(plan.id,lang),previous=plan.id>1?beginnerPath(plan.id-1,lang):learn,next=plan.id<36?beginnerPath(plan.id+1,lang):books;
  const links=plan.bookLinks.map(link=>`<li><a href="${relative(file,absoluteLocal(link.url,lang))}">${esc(link.title)}</a></li>`).join('');
  const body=`<nav class="learning-breadcrumb" aria-label="${t('Learning location','Localização no percurso')}"><a href="../index.html">${t('Learn Anthroposophy','Aprenda antroposofia')}</a> → <a href="../index.html#part-${plan.part}">${esc(parts[lang][plan.part-1])}</a></nav><div class="learning-position">${t('Lesson','Lição')} ${plan.id} / 36 · ${36-plan.id} ${t('lessons follow','lições a seguir')}</div><article><h1>${esc(title(plan,lang))}</h1><p class="learning-question"><strong>${esc(plan[pt?'centralQuestionPt':'centralQuestionEn'])}</strong></p><p class="lead">${esc(v.intro)}</p>${beginnerSource(plan,lang,file,v)}<section class="learning-meaning"><div class="eyebrow">${t('Course explanation','Explicação do curso')}</div><h2>${t('What the author means','O que o autor quer dizer')}</h2>${v.meaning.map(p=>`<p>${esc(p)}</p>`).join('')}</section><aside class="learning-key"><h2>${t('Key concept','Conceito principal')}</h2><p>${esc(v.keyConcept)}</p></aside><section class="learning-example"><h2>${t('Everyday example','Exemplo cotidiano')}</h2><p>${esc(v.example)}</p></section><section class="learning-distinction"><h2>${t('Keep this distinction','Conserve esta distinção')}</h2><p>${esc(v.distinction)}</p></section><section class="learning-checks"><h2>${t('Check your understanding','Confira sua compreensão')}</h2>${v.checks.map((check,i)=>quiz(check,lang,`learn-${n(plan.id)}-${i}`)).join('')}<noscript><p>${t('Choose an answer, then reveal the explanation to compare. Automatic feedback requires JavaScript.','Escolha uma resposta e revele a explicação para comparar. A resposta automática requer JavaScript.')}</p></noscript></section><details class="guided-deep-study" data-deep-study><summary>${t('Continue in the books and sources','Continue nos livros e fontes')}</summary><ul>${links}</ul><p>${esc(v.coverageNote||plan.coverageLimit)}</p></details><section class="learning-notebook"><h2>${t('Your learning note','Sua nota de aprendizagem')}</h2><label><input type="checkbox" data-learning-save> ${t('Save notes and completion in this browser','Salvar notas e conclusão neste navegador')}</label><label for="learning-note">${t('One idea I can explain, or a question to return to','Uma ideia que consigo explicar ou uma pergunta para retomar')}</label><textarea id="learning-note" data-learning-note rows="3"></textarea><div class="quiz-actions"><button type="button" data-learning-complete>${t('Mark as read','Marcar como lida')}</button><button type="button" data-learning-export>${t('Download my note','Baixar minha nota')}</button><button type="button" data-learning-delete>${t('Delete saved note and completion','Apagar nota e conclusão salvas')}</button></div><p data-learning-status role="status" aria-live="polite"></p><noscript><p>${t('Copy your note before leaving. Browser saving, completion and download controls require JavaScript.','Copie sua nota antes de sair. Os controles de salvamento, conclusão e download requerem JavaScript.')}</p></noscript></section><section class="learning-continue"><h2>${plan.id<36?t('Why the next idea follows','Por que vem a próxima ideia'):t('Choose your next reading','Escolha sua próxima leitura')}</h2><p>${esc(v.connection)}</p><a class="button" href="${relative(file,next)}">${plan.id<36?esc(title(sources[plan.id],lang)):t('Study the books','Estude os livros')} →</a></section></article><nav class="lesson-navigation" aria-label="${t('Lesson navigation','Navegação das lições')}"><a href="${relative(file,previous)}">← ${t('Previous','Anterior')}</a><a href="../index.html#part-${plan.part}">${t('Learning path','Percurso')}</a></nav>`;
  write(file,shell(file,title(plan,lang),body,lang,{partner:beginnerPath(plan.id,pt?'en':'pt'),description:v.intro}).replace('class="learning-course"','class="learning-course" data-learning-id="'+n(plan.id)+'"'));
 }

 const primaryCards=mainCourses.map(route=>{const c=catalogue.courses.find(c=>c.route===route),marker=cardMarkers[route];return `${marker?`<!-- ${marker}-card:start -->`:''}<a class="course-card" href="../${route}/index.html"><h2>${esc(title(c,lang))}</h2><p>${esc(pt?c.authorPt||c.author:c.author)} · ${route==='practical-thinking'?t('12 lessons + optional forecasting','12 lições + previsão opcional'):`${c.lessons.length} ${t('readings','leituras')}`}</p></a>${marker?`<!-- ${marker}-card:end -->`:''}`;}).join('');
 const companionCards=catalogue.courses.filter(c=>!mainCourses.includes(c.route)).map(c=>`<li><a href="../${c.route}/index.html">${esc(title(c,lang))}</a> · ${esc(pt?c.authorPt||c.author:c.author)}</li>`).join('');
 write(books,shell(books,t('Study the Books','Estude os livros'),`<div class="eyebrow">${t(`Deeper study · ${catalogue.courses.length} collections`,`Estudo aprofundado · ${catalogue.courses.length} coletâneas`)}</div><h1>${t('Study the Books','Estude os livros')}</h1><p class="lead">${t('Keep the author’s sequence in view. Each course now shows its parts, source chapters or lectures, and individual readings.','Mantenha a sequência do autor em vista. Cada curso agora apresenta suas partes, capítulos ou palestras da fonte e leituras individuais.')}</p><p>${t('New to this material?','Está começando?')} <a href="../learn/index.html">${t('Follow the beginner learning path first','Siga primeiro o percurso inicial')} →</a></p><div class="study-resume" data-study-resume hidden></div><section class="learning-grid">${primaryCards}</section><section><h2>${t('Temperament source companions','Fontes complementares dos temperamentos')}</h2><p>${t('The combined temperament course links these distinct sources. Their complete book courses remain available.','O curso integrado dos temperamentos relaciona estas fontes distintas. Seus cursos completos continuam disponíveis.')}</p><ul>${companionCards}</ul></section>`,lang,{partner:other+'/books/index.html'}));

 for(const course of catalogue.courses) {
  // Theosophy has its own PDF-led reading structure and calm study controls.
  // Its builder runs below before the shared site-navigation pass.
  if(course.route==='theosophy'||course.route==='practical-thinking')continue;
  const file=courseIndex(course,lang),oldFile=course.route==='theosophy'?home:course[pt?'indexPathPt':'indexPathEn'];
  // The original indexes contain edition evidence, journals and specialist links. Retain them as a deeper layer.
  const oldHTML=course.route==='theosophy'?fs.readFileSync(`content/legacy-home-${lang}.html`,'utf8'):fs.readFileSync(oldFile,'utf8');
  let oldMain=wholeElement(oldHTML,'<main');oldMain=oldMain.replace(/^<main[^>]*>/,'').replace(/<\/main>$/,'').replace(/<h1\b/g,'<h2').replaceAll('</h1>','</h2>');
  if(course.route==='theosophy') {
   const pathSection=wholeElement(oldHTML,'<section class="path"'),orientation=wholeElement(oldHTML,'<article class="guide"');
   oldMain=[pathSection,orientation].filter(Boolean).join('');
  }
  oldMain=rebase(oldMain,oldFile,file);
  const first=course.lessons[0];
  const indexBody=`<div class="study-resume" data-study-resume hidden></div><nav class="learning-breadcrumb"><a href="${relative(file,books)}">${t('Study the Books','Estude os livros')}</a></nav><div class="eyebrow">${esc(pt?course.authorPt||course.author:course.author)} · ${course.lessons.length} ${t('readings','leituras')}</div><h1>${esc(title(course,lang))}</h1><p class="lead">${t('Follow the author’s argument through clear reading boundaries.','Acompanhe o argumento do autor por leituras com limites claros.')}</p><p>${esc(pt?course.sourceScopePt:course.sourceScope)}</p><a class="button" href="${relative(file,lessonPath(first,lang))}">${t('Begin this book course','Comece este curso')} →</a>${hierarchy(course,file,lang)}<details class="guided-deep-study" data-deep-study><summary>${t('Edition notes, original course guides and journals','Notas da edição, guias originais do curso e cadernos')}</summary>${oldMain}</details>`;
  let newIndex=shell(file,title(course,lang),indexBody,lang,{partner:courseIndex(course,pt?'en':'pt')});
  // Preserve index-specific style and script assets (e.g. practice journals).
  for(const asset of oldHTML.matchAll(/<(?:link\b[^>]*rel="stylesheet"|script\b[^>]*src=)[^>]*>(?:<\/script>)?/g)) {
   const rebased=rebase(asset[0],oldFile,file);if(!newIndex.includes(rebased))newIndex=newIndex.replace('</head>',rebased+'</head>');
  }
  if(course.route==='theosophy'&&!newIndex.includes('passage-study.css'))newIndex=newIndex.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/passage-study.css')}"></head>`);
  write(file,newIndex);
  for(const part of course.parts)for(const group of part.groups) {
   if((group.lessonIds.length>1||group.sourceChapterNumber)) {
    const chapter=sectionPath(course,part,group,lang),outcomes=group.lessonIds.map(id=>course.lessons.find(l=>l.id===id)[pt?'goalPt':'goalEn']);
    write(chapter,shell(chapter,title(group,lang),`<nav class="learning-breadcrumb"><a href="${relative(chapter,books)}">${t('Study the Books','Estude os livros')}</a> → <a href="${relative(chapter,file)}">${esc(title(course,lang))}</a> → <a href="${relative(chapter,file)}#part-${part.id}">${esc(title(part,lang))}</a></nav><div class="eyebrow">${group.chapterIsOriginal?t('Source chapter or section','Capítulo ou seção da fonte'):t('Course grouping','Agrupamento do curso')}</div><h1>${esc(title(group,lang))}</h1><p class="learning-question">${esc(centralQuestion(course,group,lang))}</p><section><h2>${t('What you will learn','O que você vai aprender')}</h2><ul>${outcomes.map(o=>`<li>${esc(o)}</li>`).join('')}</ul></section><section><h2>${t('Readings in this chapter','Leituras neste capítulo')}</h2>${readingList(course,group,chapter,lang)}</section><p>${group.sourceSection?esc(group.sourceSection):t('This division organizes the course; it is not an additional numbered book chapter.','Esta divisão organiza o curso; não é um capítulo numerado adicional do livro.')}</p>`,lang,{partner:sectionPath(course,part,group,pt?'en':'pt')}));
   }
   for(const id of group.lessonIds) {
    const l=course.lessons.find(l=>l.id===id),reading=lessonPath(l,lang),check=bookChecks.find(c=>c.studyId===l.studyId)?.[lang];if(!check)throw Error('Missing book check '+l.studyId);
    let html=fs.readFileSync(reading,'utf8');
    const q=check.question,chapter=(group.lessonIds.length>1||group.sourceChapterNumber)?sectionPath(course,part,group,lang):file+'#chapter-'+part.id+'-'+group.id;
    const chapterHref=chapter.includes('#')?relative(reading,file)+chapter.slice(chapter.indexOf('#')):relative(reading,chapter);
    const context=`<section class="learning-context"><nav class="learning-breadcrumb" aria-label="${t('Reading location','Localização da leitura')}"><a href="${relative(reading,books)}">${t('Study the Books','Estude os livros')}</a> → <a href="${relative(reading,file)}">${esc(title(course,lang))}</a> → <a href="${relative(reading,file)}#part-${part.id}">${esc(title(part,lang))}</a> → <a href="${chapterHref}">${esc(title(group,lang))}</a></nav><p class="learning-position">${t('Reading','Leitura')} ${group.lessonIds.indexOf(id)+1} / ${group.lessonIds.length} · ${course.lessonIds.indexOf(id)+1} / ${course.lessons.length} ${t('in the course','no curso')}</p></section>`;
    html=html.replace(/(<main\b[^>]*>)/,'$1'+context);
    html=html.replace(/(<p class="lead">[\s\S]*?<\/p>)/,`$1<p class="learning-question"><strong>${esc(q)}</strong></p>`);
    html=html.replace(/<h2 class="study-question">[\s\S]*?<\/h2>/,`<h2 class="study-question">${t('Explain the relationship in your own words','Explique a relação com suas palavras')}</h2>`);
    // Convert the first source check to an accessible choice. Retain its original response under the explanation.
    const heading=/(<h2>(?:Check your understanding|Confira sua compreensão|Check the connection|Confira a relação|Confira o que entendeu|Check what you understood)<\/h2>)/;
    if(!heading.test(html))throw Error('Missing check section '+reading);
    html=html.replace(heading,(all)=>all+quiz({...check,type:'choice'},lang,'book-'+course.route+'-'+n(id)));
    // A source question plus its annotated answer stays as further reading, rather than a duplicate test item.
    const after=html.indexOf('class="learning-quiz"'),start=html.indexOf('</fieldset>',after)+11;
    const tail=html.slice(start),original=tail.startsWith('<div class="knowledge-check">')?wholeElement(tail,'<div class="knowledge-check">'):tail.match(/^<p>[\s\S]*?<\/p><details>[^]*?<\/details>/)?.[0];
    if(!original)throw Error('Missing original source check '+reading);
    html=html.slice(0,start)+`<details class="guided-deep-study" data-deep-study><summary>${t('Original open question and answer','Pergunta aberta original e resposta')}</summary>${original}</details>`+tail.slice(original.length);
    if(check.additionalReflection)html=html.replace('</fieldset>','</fieldset>'+quiz({...check.additionalReflection,type:'reflection'},lang,'book-reflection-'+n(id)));
    // Supplementary sources remain complete and are opened on demand; the source chapter explanation stays open.
    for(const marker of ['<section class="companion-reading"','<aside class="freedom-source"','<section class="lecture-guide"']) {
     let search=0;
     while(true) { const index=html.indexOf(marker,search);if(index<0)break;const element=wholeElement(html.slice(index),marker);const heading=element.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/)?.[1]||t('Supplementary study','Estudo complementar');const wrap=`<details class="guided-deep-study" data-deep-study><summary>${heading}</summary>${element}</details>`;html=html.slice(0,index)+wrap+html.slice(index+element.length);search=index+wrap.length; }
    }
    const nextLink=course.route==='philosophy-of-freedom'?html.match(/<a data-core-next href="(\d{2})\.html"/)?.[1]:null;
    const next=course.lessons.find(x=>x.id===(course.route==='philosophy-of-freedom'?(nextLink?Number(nextLink):-1):id+1));
    if(next)html=html.replace(/(<nav class="lesson-navigation")/,`<aside class="learning-continue"><p>${t('Next, develop this reading through','A seguir, desenvolva esta leitura em')} <a href="${relative(reading,lessonPath(next,lang))}">${esc(title(next,lang))}</a>: ${esc(next[pt?'goalPt':'goalEn'])}</p></aside>$1`);
    write(reading,html);
   }
  }
 }
}

const {buildResearch}=await import('./learning-research.mjs');
await buildResearch({docsDir:'docs'});

const {buildTheosophy}=await import('./build-theosophy-guided.mjs');
buildTheosophy();
const {buildIntroductionAnthroposophy}=await import('./build-introduction-anthroposophy.mjs');
buildIntroductionAnthroposophy();
const {buildPracticalThinking}=await import('./build-practical-thinking.mjs');
buildPracticalThinking();

// Apply the four destinations to every retained and newly generated page.
for(const name of fs.readdirSync('docs',{recursive:true}).filter(f=>f.endsWith('.html'))) {
 const file='docs/'+name,pt=name.startsWith('pt/'),base=pt?'docs/pt':'docs',t=(a,b)=>pt?b:a;
 let html=fs.readFileSync(file,'utf8');
 const localName=name.replace(/^pt\//,''),courseRoutes=catalogue.courses.map(c=>c.route);
 const active=localName.startsWith('learn/')||localName.startsWith('introduction-to-anthroposophy/')?'learn':localName.startsWith('themes/')?'themes':/^(research|reference)\//.test(localName)?'research':localName.startsWith('books/')||localName.startsWith('lessons/')||courseRoutes.some(route=>localName.startsWith(route+'/'))?'books':null;
 const destinations=[['learn',t('Learn Anthroposophy','Aprenda antroposofia')],['books',t('Study the Books','Estude os livros')],['themes',t('Themes and Applications','Temas e aplicações')],['research',t('Research Library','Biblioteca de pesquisa')]];
 const nav=`<nav class="system-nav" aria-label="${t('Main navigation','Navegação principal')}">${destinations.map(([route,label])=>`<a${active===route?' aria-current="true"':''} href="${relative(file,base+'/'+route+'/index.html')}">${label}</a>`).join('')}</nav>`;
 if(localName.startsWith('introduction-to-anthroposophy/')&&html.includes('data-introduction-owned="true"'))html=html.replace(/<nav class="system-nav"[\s\S]*?<\/nav>/,nav);
 else html=html.replace('</header>',nav+'</header>');
 // Retained reading controls now return to the visible hierarchy. Original anchors remain for old bookmarks.
 const indexes=new Set(catalogue.courses.map(c=>path.resolve(courseIndex(c,pt?'pt':'en'))));
 html=html.replace(/href="([^"#]*)#(lessons|sessions)"/g,(all,url)=>{
  const target=path.resolve(path.dirname(file),url||path.basename(file));
  if(indexes.has(target))return `href="${url}#structured-readings"`;
  if(target===path.resolve(base+'/index.html'))return `href="${relative(file,base+'/theosophy/index.html')}#structured-readings"`;
  return all;
 });
 for(const [tag,asset] of [['css','learning-system.css'],['js','learning-system.js']])if(!html.includes(asset))html=html.replace('</head>',tag==='css'?`<link rel="stylesheet" href="${relative(file,'docs/'+asset)}"></head>`:`<script defer src="${relative(file,'docs/'+asset)}"></script></head>`);
 if((localName==='books/index.html'||indexes.has(path.resolve(file)))&&!isPracticalThinkingOwned(name,html)) {
  if(!html.includes('guided-study.v1.css'))html=html.replace('</head>',`<link rel="stylesheet" href="${relative(file,'docs/guided-study.v1.css')}"></head>`);
  if(!html.includes('guided-study.v1.js'))html=html.replace('</head>',`<script defer src="${relative(file,'docs/guided-study.v1.js')}"></script></head>`);
 }
 // Existing self-assessment criteria stay useful without numerical grades.
 html=html.replace(/<p>[^<]*(?:0–2 points|0 a 2 pontos)[\s\S]*?<\/p>/g,`<p>${t('Check whether your explanation states the meaning clearly, keeps the distinctions, points to support in the source, and identifies the kind of claim: observation, argument, analogy or supersensible report. Return to any part you cannot yet explain. A well-supported disagreement can show understanding.','Confira se sua explicação apresenta claramente o significado, conserva as distinções, aponta apoio na fonte e identifica o tipo de afirmação: observação, argumento, analogia ou relato suprassensível. Retome o que ainda não consegue explicar. Uma discordância fundamentada também pode demonstrar compreensão.')}</p>`);
 write(file,html);
}
console.log(`Learning system: 36 bilingual beginner lessons, ${catalogue.courses.length} structured book courses, source library and shared navigation.`);
