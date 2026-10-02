import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {esc, n, quiz, relative, shell, write} from './learning-html.mjs';

const route = 'introduction-to-anthroposophy';
const read = name => JSON.parse(fs.readFileSync(`content/introduction-anthroposophy-${name}.json`, 'utf8'));
const base = lang => `docs/${lang === 'pt' ? 'pt/' : ''}${route}`;
const lessonFile = (id, lang) => `${base(lang)}/lessons/${n(id)}.html`;
const indexFile = lang => `${base(lang)}/index.html`;
const partFile = (part, lang) => `${base(lang)}/parts/${part.slug}.html`;
const text = (lang, en, pt) => lang === 'pt' ? pt : en;
const span = pair => pair[0] === pair[1] ? String(pair[0]) : pair.join('–');
const heading = (row, lang) => row[lang === 'pt' ? 'titlePt' : 'titleEn'];

function edition(source) {
  const e = source.editionEvidence || {};
  switch (source.id) {
    case 'ga26': return 'George and Mary Adams · Rudolf Steiner Press · 1973 / 1985';
    case 'ga28': return 'Authorized English translation, edited by H. Collison · 1928 · John Roland Penner eText';
    case 'ga13': return 'Catherine E. Creeger · Anthroposophic Press · © 1997';
    case 'ga10-modern': return 'Christopher Bamford · Anthroposophic Press · 1994';
    case 'ga9': return 'Elizabeth Douglas Shields · 1910 · Delhi Open Books reissue';
    case 'ga4': return 'Michael Wilson · Rudolf Steiner Press · eighth English edition, 2012';
    case 'ga327': return 'Catherine Creeger and Malcolm Gardner · Bio-Dynamic Farming and Gardening Association · 1993 · Markdown witness';
    case 'biodynamics-anthology': return 'Marcia Merryman Means, editor · SteinerBooks · introduction © 2005; GA 327 selections translated by Creeger and Gardner';
    case 'colour': return 'John Salter / Pauline Wehrle · Rudolf Steiner Press · translation © 1992';
    case 'four-temperaments': return 'B. Kelly, revised by Matthew Barton · Sophia Books / Rudolf Steiner Press · 2012';
    case 'ga23-opening': return 'Frank Thomas Smith · Rudolf Steiner Publications · 2019 · supplied 1920 preface in Markdown';
    default: return e.translation || source.edition || '';
  }
}

function locator(assignment, lang) {
  const l = assignment.locator;
  if (l.kind === 'EPUB-section') return text(lang, 'Leading Thoughts ', 'Pensamentos-guia ') + span(l.leadingThoughts);
  if (l.pageLabelEvidence) return text(lang, 'PDF page ', 'Página do PDF ') + span(l.pdfPages) + text(lang, ' · edition page label ', ' · rótulo de página da edição ') + span(l.printedPages);
  if (l.printedPages) return text(lang, 'Printed pp. ', 'Páginas impressas ') + span(l.printedPages) + ` · PDF ${span(l.pdfPages)}`;
  if (l.kind === 'PDF-capture') return text(lang, 'PDF captures ', 'Capturas do PDF ') + span(l.pdfPages);
  if (l.kind === 'PDF-page') return text(lang, 'Digital PDF pages ', 'Páginas do PDF digital ') + span(l.pdfPages);
  if (l.kind === 'Markdown-marker') return text(lang, 'Markdown markers ', 'Marcadores do Markdown ') + span(l.markdownMarkers);
  throw new Error(`Unavailable source assignment ${assignment.sourceId}`);
}

function courseShell(file, title, body, lang, partner, description) {
  const root = lang === 'pt' ? 'docs/pt' : 'docs';
  const nav = `<nav class="system-nav" aria-label="${text(lang, 'Main navigation', 'Navegação principal')}">${[['learn','Learn Anthroposophy','Aprenda antroposofia'],['books','Study the Books','Estude os livros'],['themes','Themes and Applications','Temas e aplicações'],['research','Research Library','Biblioteca de pesquisa']].map(([p,en,pt]) => `<a${p === 'learn' ? ' aria-current="true"' : ''} href="${relative(file, `${root}/${p}/index.html`)}">${text(lang,en,pt)}</a>`).join('')}</nav>`;
  return shell(file, title, body, lang, {partner, description, className:'learning-course intro-course'})
    .replace('<main id="main"', `<main data-introduction-owned="true" data-intro-available="${read('course').availableLessonIds.map(n).join(',')}" data-intro-language="${lang}" id="main"`)
    .replace('</head>', `<link rel="stylesheet" href="${relative(file, 'docs/introduction-anthroposophy.css')}"><script defer src="${relative(file, 'docs/introduction-anthroposophy.js')}"></script></head>`)
    .replace('</header>', `${nav}</header>`);
}

function sourceBlock(a, source, lang) {
  const label = a.role === 'secondary' ? text(lang,'Supporting source','Fonte de apoio') : text(lang,'Primary source','Fonte principal');
  const excerpt = lang === 'pt' ? a.excerptPt : a.excerptEn;
  const section = a.section;
  return `<section class="intro-source" data-intro-source-role="${esc(a.role)}" data-intro-source-id="${esc(a.sourceId)}"><div class="eyebrow">${label}</div><h3>${esc(a.bookTitle || source.title)}</h3><p class="intro-source-meta">${esc(a.voice || 'Rudolf Steiner')}${a.ga || source.ga ? ` · GA ${esc(a.ga || source.ga)}` : ''}<br>${esc(edition(source))}</p><p><strong>${text(lang,'Section','Seção')}:</strong> ${esc(section)}<br><strong>${text(lang,'Reading','Leitura')}:</strong> ${esc(locator(a,lang))}</p>${a.readingEn || a.readingPt ? `<p>${esc(lang === 'pt' ? a.readingPt : a.readingEn)}</p>` : ''}${excerpt ? `<blockquote><p>${esc(excerpt)}</p></blockquote>${lang === 'pt' ? `<p class="intro-source-meta">Tradução de estudo do curso a partir da edição inglesa identificada.</p>` : ''}` : `<p>${text(lang,'Read this identified section in the source alongside the explanation below.','Leia esta seção identificada na fonte junto com a explicação abaixo.')}</p>`}</section>`;
}

function specialConcepts(row,v,lang) {
  let html='';
  if(v.memberCards) html+=`<section id="member-cards"><h2>${text(lang,'Four members, four distinctions','Quatro membros, quatro distinções')}</h2><div class="intro-member-cards">${v.memberCards.map(card=>`<section class="intro-concept"><h3>${esc(card.term)}</h3>${[['meaning','Meaning','Significado'],['problem','Question it addresses','Questão que aborda'],['difference','Distinction','Distinção'],['example','Course example','Exemplo do curso'],['misconception','Common misunderstanding','Equívoco comum']].map(([key,en,pt])=>`<p><strong>${text(lang,en,pt)}:</strong> ${esc(card[key])}</p>`).join('')}</section>`).join('')}</div></section>`;
  if(v.worldRelationships) {
    const title=text(lang,'Three worlds in Steiner’s account','Três mundos na exposição de Steiner');
    html+=`<section id="world-relationships"><h2>${title}</h2><figure class="intro-diagram"><svg viewBox="0 0 450 180" role="img" aria-labelledby="world-diagram-title"><title id="world-diagram-title">${title}</title><desc>${text(lang,"One human being participates in three parallel, interpenetrating worlds. The table explains each relationship.","Um ser humano participa de três mundos paralelos que se interpenetram. A tabela explica cada relação.")}</desc>${v.worldRelationships.map((r,i)=>{const words=r.domain.split(' ');return `<rect x="${i*150+5}" y="10" width="140" height="80" rx="12" fill="none" stroke="currentColor"/><text x="${i*150+75}" y="44" text-anchor="middle" fill="currentColor" font-size="25"><tspan x="${i*150+75}">${esc(words[0])}</tspan><tspan x="${i*150+75}" dy="29">${esc(words.slice(1).join(' '))}</tspan></text><path d="M ${i*150+75} 90 L 225 120" fill="none" stroke="currentColor"/>`;}).join('')}<text x="225" y="158" text-anchor="middle" fill="currentColor" font-size="24">${text(lang,'One human being','Um ser humano')}</text></svg><figcaption>${text(lang,'Parallel relationships in Steiner’s account; these boxes do not mark locations in physical space.','Relações paralelas na exposição de Steiner; estes quadros não indicam lugares no espaço físico.')}</figcaption></figure><div class="intro-table"><table><thead><tr><th>${text(lang,'Domain','Âmbito')}</th><th>${text(lang,'Relationship to the human being','Relação com o ser humano')}</th></tr></thead><tbody>${v.worldRelationships.map(r=>`<tr><th scope="row">${esc(r.domain)}</th><td>${esc(r.relationship)}</td></tr>`).join('')}</tbody></table></div></section>`;
    html+=`<section id="death-transition" class="intro-example"><h2>${text(lang,'A changing relationship after death','Uma relação que se modifica após a morte')}</h2><p>${esc(v.deathTransition.text)}</p></section>`;
  }
  if(v.conceptConnections) {
    const title=text(lang,'How the concepts depend on one another','Como os conceitos se apoiam uns nos outros');
    const nodes=v.architectureNodes;
    const positions=[[15,15],[15,100],[15,185],[15,270],[240,15],[240,100],[240,185],[240,270],[127.5,365]];
    const diagram=nodes ? `<figure class="intro-diagram intro-architecture"><svg viewBox="0 0 450 435" role="img" aria-labelledby="architecture-title architecture-description"><title id="architecture-title">${title}</title><desc id="architecture-description">${esc(v.conceptConnections.map(c=>`${c.from}: ${c.to}. ${c.reason}`).join(' '))}</desc><defs><marker id="architecture-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="currentColor"/></marker></defs>${['M112,75V100','M112,160V185','M112,245V270','M337,75V100','M337,160V185','M337,245V270','M210,300H225V130H240','M15,45H5V5H445V300H435','M337,330V347H225V365'].map(d=>`<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#architecture-arrow)"/>`).join('')}${nodes.map((node,i)=>{const [x,y]=positions[i];return `<rect x="${x}" y="${y}" width="195" height="60" rx="9" fill="#fbf7ed" stroke="currentColor"/><text text-anchor="middle" fill="currentColor" font-size="22">${node.lines.map((line,j)=>`<tspan x="${x+97.5}" y="${y+25+j*24}">${esc(line)}</tspan>`).join('')}</text>`;}).join('')}</svg><figcaption>${text(lang,'Original course map. Arrows show which questions prepare other questions; the reasons are explained below.','Mapa original do curso. As setas mostram quais questões preparam outras questões; as razões são explicadas abaixo.')}</figcaption></figure>` : '';
    html+=`<section id="concept-architecture"><h2>${title}</h2>${diagram}<ol class="intro-connections">${v.conceptConnections.map(c=>`<li><h3>${esc(c.from)} → ${esc(c.to)}</h3><p>${esc(c.reason)}</p></li>`).join('')}</ol></section>`;
  }
  return html;
}

function pathways(v,lang,file) {
  if(!v.pathways) return '';
  return `<section id="pathways"><h2>${text(lang,'Choose your next study','Escolha seu próximo estudo')}</h2><ul>${v.pathways.map(p=>`<li>${p.route?`<a href="${relative(file,`docs/${lang==='pt'?'pt/':''}${p.route}/index.html`)}">${esc(p.title)}</a>`:`<strong>${esc(p.title)}</strong>`}${p.note?` — ${esc(p.note)}`:''}</li>`).join('')}</ul></section>`;
}

function position(row, course, lang) {
  const part = course.parts.find(p => p.number === row.part);
  return `<p class="intro-lesson-position">${esc(heading(course,lang))}<br>${text(lang,'Part','Parte')} ${part.roman} ${text(lang,'of VII','de VII')} · ${text(lang,'Lesson','Lição')} ${row.id} ${text(lang,'of 28','de 28')} · ${esc(heading(part,lang))}</p>`;
}

function lessonList(part, available, plan, file, lang) {
  return `<ol class="intro-lesson-list" start="${part.lessonIds[0]}">${part.lessonIds.map(id => {
    const row = plan.lessons.find(l => l.id === id);
    return available.has(id) ? `<li><a href="${relative(file,lessonFile(id,lang))}">${esc(heading(row,lang))}</a></li>` : `<li><span>${esc(heading(row,lang))}</span> <small>${text(lang,'Planned','Planejada')}</small></li>`;
  }).join('')}</ol>`;
}

function resume(file, course, lang) {
  const first = course.availableLessonIds[0];
  const status=course.availableLessonIds.length===28?text(lang,'All 28 lessons are available.','Todas as 28 lições estão disponíveis.'):text(lang,`Lessons 1–${course.availableLessonIds.length} are available. Later lessons are planned.`,`As lições 1–${course.availableLessonIds.length} estão disponíveis. As demais estão planejadas.`);
  return `<div class="intro-actions"><a class="button" href="${relative(file,lessonFile(first,lang))}">${text(lang,'Begin course','Começar o curso')}</a><a class="learning-secondary" data-intro-continue data-intro-available="${course.availableLessonIds.map(n).join(',')}" data-intro-language="${lang}" data-intro-lesson-base="${relative(file,`${base(lang)}/lessons/index.html`).replace(/index\.html$/,'')}" href="${relative(file,lessonFile(first,lang))}">${text(lang,'Continue studying','Continuar o estudo')}</a></div><p class="intro-status" data-intro-progress>${status}</p>`;
}

function buildLesson(row, course, plan, sources, lang) {
  const file = lessonFile(row.id,lang), v = row[lang], mapped = plan.lessons.find(l => l.id === row.id);
  const available = new Set(course.availableLessonIds);
  const previous = row.id === 1 ? indexFile(lang) : lessonFile(row.id - 1,lang);
  const nextRow = plan.lessons.find(l => l.id === row.id + 1);
  const nextAvailable = nextRow && available.has(nextRow.id);
  const nextPart = nextRow && course.parts.find(p => p.number === nextRow.part);
  const next = nextRow ? nextAvailable ? lessonFile(nextRow.id,lang) : partFile(nextPart,lang) : indexFile(lang);
  const nextLabel = nextRow ? `${text(lang,nextAvailable ? 'Next' : 'Next planned','Próxima' + (nextAvailable ? '' : ' planejada'))}: ${text(lang,'Lesson','Lição')} ${nextRow.id} — ${heading(nextRow,lang)}` : text(lang,'Choose your next book','Escolha seu próximo livro');
  const context = (mapped.teacherContext || []).filter(a => a.locator.kind !== 'missing');
  const contextualRefs = context.length ? `<details class="intro-context"><summary>${text(lang,'Related source sections','Outras seções relacionadas da fonte')}</summary><ul>${context.map(a => `<li>${esc(sources.get(a.sourceId).title)} · GA ${esc(a.ga || sources.get(a.sourceId).ga)} · ${esc(a.section)} · ${esc(locator(a,lang))}</li>`).join('')}</ul></details>` : '';
  const deeper = (v.deeperStudy || []).length ? `<details id="deeper-study" class="intro-deeper"><summary>${text(lang,'Optional deeper study','Estudo mais aprofundado, opcional')}</summary><ul>${v.deeperStudy.map(link => {
    const targetRoute=link.route.replace(/^\/?(?:pt\/)?/,'').replace(/\/index\.html$/,'').replace(/\/$/,'');
    return `<li><a href="${relative(file,`docs/${lang==='pt'?'pt/':''}${targetRoute}/index.html`)}">${esc(link.title)}</a></li>`;
  }).join('')}</ul></details>` : '';
  const body = `<article class="intro-reading" data-intro-study-id="${n(row.id)}" data-intro-language="${lang}" data-intro-title="${esc(heading(row,lang))}" data-intro-available="${course.availableLessonIds.map(n).join(',')}">${position(row,course,lang)}<h1>${esc(heading(row,lang))}</h1><section id="question"><h2>${text(lang,'Central question','Pergunta central')}</h2><p class="lead">${esc(v.question)}</p></section><section id="matters"><h2>${text(lang,'Why this matters','Por que isso importa')}</h2><p>${esc(v.matters)}</p></section><section id="source"><h2>${text(lang,'Read Steiner','Leia Steiner')}</h2>${row.sourceAssignments.map(a => sourceBlock(a,sources.get(a.sourceId),lang)).join('')}${contextualRefs}</section><section id="explanation"><div class="eyebrow">${text(lang,'Course explanation','Explicação do curso')}</div><h2>${text(lang,'What Steiner is saying','O que Steiner está dizendo')}</h2>${v.explanation.map(p => `<p>${esc(p)}</p>`).join('')}</section><aside id="key-concept" class="intro-concept"><h2>${text(lang,'Key concept','Conceito principal')}: ${esc(v.keyConcept.term)}</h2><p>${esc(v.keyConcept.definition)}</p></aside>${specialConcepts(row,v,lang)}${v.sourceNeeded?.length ? `<aside id="source-needed" class="intro-context"><h2>${text(lang,"Sources needed for fuller study","Fontes necessárias para aprofundar o estudo")}</h2><ul>${v.sourceNeeded.map(note=>`<li>${esc(note)}</li>`).join('')}</ul></aside>` : ''}${v.example ? `<section id="example" class="intro-example"><h2>${text(lang,'Course example','Exemplo do curso')}</h2><p>${esc(v.example.text)}</p></section>` : ''}<section id="distinction" class="intro-distinction"><h2>${text(lang,'Important distinction','Distinção importante')}</h2><p>${esc(v.distinction)}</p></section><section id="checks" class="intro-checks"><h2>${text(lang,'Check your understanding','Confira sua compreensão')}</h2>${v.checks.map((check,i) => `<div data-intro-check="${i+1}">${quiz({...check,explanation:check.reason},lang,`intro-${lang}-${n(row.id)}-${i}`)}</div>`).join('')}<noscript><p>${text(lang,'Choose an answer, then reveal the explanation to compare.','Escolha uma resposta e revele a explicação para comparar.')}</p></noscript></section><section class="intro-progress-controls"><h2>${text(lang,'Optional progress','Progresso opcional')}</h2><p>${text(lang,'Marking a lesson studied saves your progress in this browser. Reading and checks do not require saving.','Marcar uma lição como estudada salva seu progresso neste navegador. A leitura e as perguntas não exigem salvamento.')}</p><button type="button" data-intro-complete aria-pressed="false" disabled>${text(lang,'Mark lesson studied','Marcar lição como estudada')}</button><p data-intro-status class="intro-status" role="status" aria-live="polite"></p><noscript><p>${text(lang,'Saved progress requires JavaScript; all reading and answer explanations remain available.','O progresso salvo exige JavaScript; toda a leitura e as explicações das respostas continuam disponíveis.')}</p></noscript></section><section id="connection"><h2>${text(lang,'Connection','Conexão')}</h2><p>${esc(v.connection)}</p><a href="${relative(file,next)}">${esc(nextLabel)} →</a>${nextRow && !nextAvailable ? `<p>${text(lang,'See the next part’s outline. Its lessons are being prepared.','Veja o roteiro da próxima parte. Suas lições estão sendo preparadas.')}</p>` : ''}</section>${pathways(v,lang,file)}${deeper}</article><nav class="intro-nav lesson-navigation" aria-label="${text(lang,'Lesson navigation','Navegação das lições')}"><a href="${relative(file,previous)}">← ${text(lang,'Previous','Anterior')}</a><a href="${relative(file,indexFile(lang))}">${text(lang,'Course contents','Conteúdo do curso')}</a><a href="${relative(file,next)}">${esc(nextLabel)} →</a></nav>`;
  write(file,courseShell(file,heading(row,lang),body,lang,lessonFile(row.id,lang==='pt'?'en':'pt'),v.matters));
}

function buildIndex(course, plan, lang) {
  const file=indexFile(lang), available=new Set(course.availableLessonIds), v=course[lang];
  const body=`<section class="intro-hero"><div class="eyebrow">${text(lang,'28 lessons · seven parts','28 lições · sete partes')}</div><h1>${esc(heading(course,lang))}</h1><p class="lead">${esc(v.description)}</p><p>${esc(v.introduction)}</p>${resume(file,course,lang)}</section><section><h2>${text(lang,'How the course develops','Como o curso se desenvolve')}</h2><ol class="intro-flow">${course.parts.map(p=>`<li>${esc(heading(p,lang))}</li>`).join('')}</ol><p>${text(lang,'Follow one question at a time: read an identified Steiner section, understand its argument, distinguish the terms and check what you understood.','Acompanhe uma pergunta por vez: leia uma seção identificada de Steiner, compreenda o argumento, distinga os termos e confira o que entendeu.')}</p></section><section class="intro-parts" aria-label="${text(lang,'Course parts','Partes do curso')}">${course.parts.map(p=>`<section id="part-${p.number}" class="intro-part-card"><div class="eyebrow">${text(lang,'Part','Parte')} ${p.roman} ${text(lang,'of VII','de VII')}</div><h2><a href="${relative(file,partFile(p,lang))}">${esc(heading(p,lang))}</a></h2><p>${esc(p[lang].question)}</p>${lessonList(p,available,plan,file,lang)}</section>`).join('')}</section><p><a href="source-notes.html">${text(lang,'Sources, editions and reading references','Fontes, edições e referências de leitura')}</a></p>`;
  write(file,courseShell(file,heading(course,lang),body,lang,indexFile(lang==='pt'?'en':'pt'),v.description));
}

function buildPart(part, course, plan, lang) {
  const file=partFile(part,lang), v=part[lang], available=new Set(course.availableLessonIds);
  const ready=part.lessonIds.every(id=>available.has(id));
  const synthesis=ready && v.synthesis ? `<section class="intro-part-synthesis"><h2>${text(lang,'How the ideas connect','Como as ideias se conectam')}</h2><p>${esc(v.synthesis)}</p><h3>${text(lang,'Explain it yourself','Explique com suas palavras')}</h3><p>${esc(v.synthesisQuestion)}</p><details><summary>${text(lang,'See an optional model answer','Veja uma resposta-modelo opcional')}</summary><p>${esc(v.synthesisAnswer)}</p></details></section>` : '';
  const body=`<p class="intro-lesson-position">${esc(heading(course,lang))} · ${text(lang,'Part','Parte')} ${part.roman} ${text(lang,'of VII','de VII')}</p><h1>${esc(heading(part,lang))}</h1><p class="lead">${esc(v.question)}</p><p>${esc(v.introduction)}</p>${!ready?`<p class="intro-status">${text(lang,'This part is planned. The opening orientation lessons are available now.','Esta parte está planejada. As lições iniciais de orientação já estão disponíveis.')}</p>`:''}<section><h2>${text(lang,'What you will learn','O que você vai aprender')}</h2><ul>${v.outcomes.map(o=>`<li>${esc(o)}</li>`).join('')}</ul></section><section><h2>${text(lang,'Lessons','Lições')}</h2>${lessonList(part,available,plan,file,lang)}</section>${synthesis}<nav class="intro-nav" aria-label="${text(lang,'Course navigation','Navegação do curso')}"><a href="${relative(file,indexFile(lang))}">← ${text(lang,'Course contents','Conteúdo do curso')}</a>${ready?`<a href="${relative(file,lessonFile(part.lessonIds[0],lang))}">${text(lang,'Begin this part','Começar esta parte')} →</a>`:`<a href="${relative(file,lessonFile(1,lang))}">${text(lang,'Begin with orientation','Começar pela orientação')} →</a>`}</nav>`;
  write(file,courseShell(file,heading(part,lang),body,lang,partFile(part,lang==='pt'?'en':'pt'),v.question));
}

function buildSourceNotes(course, sources, lang) {
  const file=`${base(lang)}/source-notes.html`, v=course[lang];
  const used=course.availableLessonIds.flatMap(id=>read(`lesson-${n(id)}`).sourceAssignments.map(a=>a.sourceId));
  const cards=[...new Set(['ga26','ga28','ga13','ga10-modern','ga9','ga4',...used])].map(id=>{
    const source=sources.get(id),note=v.sourceNotes[id];
    if(!note)throw new Error(`Missing ${lang} source note for ${id}`);
    return `<section class="intro-source"><h2>${esc(source.title)}${source.ga ? ` · GA ${source.ga}` : ''}</h2><p class="intro-source-meta">${esc(edition(source))}</p><p>${esc(note)}</p></section>`;
  }).join('');
  const body=`<p><a href="index.html">← ${esc(heading(course,lang))}</a></p><h1>${text(lang,'Sources and reading references','Fontes e referências de leitura')}</h1><p class="lead">${text(lang,'The course identifies the edition and section behind each explanation. Numbered thoughts, printed pages and digital PDF positions remain distinct.','O curso identifica a edição e a seção por trás de cada explicação. Pensamentos numerados, páginas impressas e posições no PDF digital permanecem distintos.')}</p><p>${text(lang,'Source passages are separate from course explanations and examples. A Brazilian Portuguese quotation is labelled as a course study translation of the supplied English edition. Editorial introductions and Steiner’s retrospective autobiography retain their own source context.','Os trechos das fontes são separados das explicações e dos exemplos do curso. Uma citação em português brasileiro é identificada como tradução de estudo da edição inglesa fornecida. Introduções editoriais e a autobiografia retrospectiva de Steiner conservam seu próprio contexto de fonte.')}</p>${cards}<p>${text(lang,'The practical parts will use only supported introductory material and will identify additional specialist sources needed for expansion.','As partes práticas usarão apenas material introdutório sustentado pelas fontes e identificarão as fontes especializadas adicionais necessárias para ampliação.')}</p>`;
  write(file,courseShell(file,text(lang,'Sources and reading references','Fontes e referências de leitura'),body,lang,`${base(lang==='pt'?'en':'pt')}/source-notes.html`,text(lang,'Verified editions and source references for the introductory course.','Edições conferidas e referências de fontes do curso introdutório.')));
}

function addHomeEntry(course,lang) {
  const file=`docs/${lang==='pt'?'pt/':''}index.html`;
  if(!fs.existsSync(file))return;
  let html=fs.readFileSync(file,'utf8');
  const marker='<!-- introduction-course-entry -->';
  const entry=`${marker}<section class="learning-method" id="introduction-course"><h2>${esc(heading(course,lang))}</h2><p>${text(lang,'A concise course in seven parts, connecting the human being, destiny, knowledge and freedom to Anthroposophy’s wider worldview and practical questions.','Um curso conciso em sete partes, que relaciona o ser humano, o destino, o conhecimento e a liberdade à visão de mundo mais ampla da antroposofia e às questões práticas.')}</p><a class="button" href="${route}/index.html">${text(lang,'Explore the introduction','Conhecer a introdução')} →</a></section><!-- /introduction-course-entry -->`;
  if(html.includes(marker))html=html.replace(/<!-- introduction-course-entry -->[\s\S]*?<!-- \/introduction-course-entry -->/,entry);
  else html=html.replace('</main>',`${entry}</main>`);
  write(file,html);
}

export function buildIntroductionAnthroposophy() {
  const course=read('course'),plan=read('source-map'),sources=new Map(plan.sourceRegistry.map(s=>[s.id,s]));
  const lessons=course.availableLessonIds.map(id=>read(`lesson-${n(id)}`));
  for(const lang of ['en','pt']){
    buildIndex(course,plan,lang);
    for(const part of course.parts)buildPart(part,course,plan,lang);
    for(const lesson of lessons)buildLesson(lesson,course,plan,sources,lang);
    buildSourceNotes(course,sources,lang);
    addHomeEntry(course,lang);
  }
  console.log(`Introduction to Anthroposophy: ${lessons.length} bilingual lessons available; ${course.lessonCount}-lesson plan and seven part outlines.`);
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildIntroductionAnthroposophy();
