import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {esc, relative} from './learning-html.mjs';
import {platformNav, platformSupportNav, platformArea} from './platform-architecture.mjs';
import {renderCourseArtwork} from './visual-identity.mjs';

const slug = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const t = (lang, en, pt) => lang === 'pt' ? pt : en;
const value = (item, lang, key) => item?.[lang]?.[key] ?? item?.[`${key}${lang === 'pt' ? 'Pt' : 'En'}`];
const paragraphs = values => (Array.isArray(values) ? values : [values]).filter(Boolean).map(text => `<p>${esc(text)}</p>`).join('');
const list = values => `<ul>${values.map(text => `<li>${esc(text)}</li>`).join('')}</ul>`;
const base = lang => `docs/${lang === 'pt' ? 'pt/' : ''}`;
const link = (file, route, label, lang, attributes = '') => `<a${attributes ? ' ' + attributes : ''} href="${esc(relative(file, base(lang) + route))}">${esc(label)}</a>`;
function semantic(id) {
  if (typeof id !== 'string' || !slug.test(id)) throw new Error(`Invalid semantic identifier: ${id}`);
  return id;
}
function find(items, id, kind) {
  const item = items.find(entry => entry.id === id);
  if (!item) throw new Error(`Unknown ${kind}: ${id}`);
  return item;
}
const courseId = course => semantic(course.id ?? course.route);
const courseRoute = course => semantic(course.route ?? course.id);
const lessonRoute = (course, lesson) => `${courseRoute(course)}/lessons/${semantic(lesson.slug ?? lesson.id)}.html`;
const conceptRoute = concept => `concepts/${semantic(concept.slug ?? concept.id)}.html`;
const practiceRoute = practice => `practice/${semantic(practice.slug ?? practice.id)}.html`;
function orderFor(course, lessons) {
  const order = course.lessonIds ?? lessons.map(lesson => lesson.id);
  if (!Array.isArray(order) || !order.length || new Set(order).size !== order.length) throw new Error('Invalid conceptual lesson order');
  for (const id of order) { semantic(id); find(lessons, id, 'lesson'); }
  return order;
}
function progressAttributes(course, lessons, lesson = null) {
  const order = orderFor(course, lessons);
  const routes = Object.fromEntries(order.map(id => [id, lessonRoute(course, find(lessons, id, 'lesson'))]));
  return `data-concept-course="${esc(courseId(course))}" data-concept-order="${esc(JSON.stringify(order))}" data-concept-routes="${esc(JSON.stringify(routes))}"${lesson ? ` data-concept-lesson="${esc(semantic(lesson.id))}"` : ''}`;
}
function sourceLedger(course) {
  const ledger = course.sourceLedger ?? course.source;
  if (!ledger?.title || !ledger.translator || !Array.isArray(ledger.chapters)) throw new Error('A verified source ledger is required for primary references');
  return ledger;
}
function sourceReferences(sources, {course, lang, file}) {
  if (!sources?.length) throw new Error('Primary source references are required');
  const ledger = sourceLedger(course);
  const refs = sources.map(source => {
    const chapter = ledger.chapters.find(item => item.number === source.chapter);
    if (!chapter && source.chapter !== 0) throw new Error(`Unknown primary source chapter: ${source.chapter}`);
    const captures = source.captures;
    if (!Array.isArray(captures) || !captures.length || captures.some(n => !Number.isInteger(n) || n < 1 || n > ledger.pdfCaptureCount)) throw new Error('Invalid primary source capture');
    const heading = chapter ? (value(chapter, lang, 'title') || chapter.sourceHeading) : t(lang, 'Prefaces and Introduction', 'Prefácios e Introdução');
    const locator = captures.length === 2 ? captures.join('–') : captures.join(', ');
    const context = (source.readingIds ?? []).map(id => {
      if (!Number.isInteger(id) || id < 0 || id > 27) throw new Error('Invalid retained commentary identity');
      return link(file, `lessons/${String(id).padStart(2, '0')}.html#book-passage`, t(lang, 'Read in context', 'Leia no contexto'), lang);
    }).join(' · ');
    let notes = '';
    if (source.noteIds?.length) {
      if (!ledger.notes?.heading || !Array.isArray(ledger.notes.captures) || source.noteIds.some(id => !Number.isInteger(id) || id < 1 || id > ledger.notes.count)) throw new Error('Invalid primary source note reference');
      notes = `<span class="cp-source-notes"><span lang="en">${esc(ledger.notes.heading)}</span> · ${t(lang, 'notes', 'notas')} ${esc(source.noteIds.join(', '))} · ${t(lang, 'PDF captures', 'capturas do PDF')} ${esc(ledger.notes.captures.join('–'))}</span>`;
    }
    return `<li><strong>${esc(heading)}</strong><span>${t(lang, 'PDF captures', 'Capturas do PDF')} ${esc(locator)}</span>${notes}${context ? `<p class="cp-context-links">${context}</p>` : ''}</li>`;
  }).join('');
  const chapters = [...new Set(sources.map(source => source.chapter).filter(number => number >= 1 && number <= 4))];
  const parallel = ledger.parallelEdition;
  const archive = parallel?.year === 1971 && chapters.length ? `<details class="cp-deeper cp-parallel-source"><summary>${t(lang, 'Optional parallel translation', 'Tradução paralela opcional')}</summary><p>${t(lang, 'The Rudolf Steiner Archive presents the 1971 Henry B. Monges translation, revised by Gilbert Church. Its wording and later addenda differ from the supplied 1910 Shields edition.', 'O Rudolf Steiner Archive apresenta a tradução de Henry B. Monges de 1971, revista por Gilbert Church. Sua redação e seus adendos posteriores diferem da edição Shields de 1910 fornecida.')}</p><ul>${chapters.map(number => `<li><a href="https://rsarchive.org/Books/GA009/English/AP1971/GA009_c0${number}.html">${t(lang, '1971 parallel edition — Chapter', 'Edição paralela de 1971 — Capítulo')} ${number}</a></li>`).join('')}</ul></details>` : '';
  return `<section class="cp-sources" id="primary-sources" data-concept-sources data-concept-section="sources" aria-labelledby="primary-sources-heading"><div class="cp-label">${t(lang, 'Optional source reading', 'Leitura opcional da fonte')}</div><h2 id="primary-sources-heading">${t(lang, 'Primary source and context', 'Fonte primária e contexto')}</h2><p>Rudolf Steiner · <cite>${esc(ledger.title)}</cite> · GA 9</p><p class="cp-source-credit">${t(lang, 'English translation', 'Tradução inglesa')}: ${esc(ledger.translator)}, ${esc(ledger.translationYear)}. ${t(lang, 'Digital reissue', 'Reedição digital')}: ${esc(ledger.reissuePublisher)}${ledger.reissuePublicationYear ? ', ' + esc(ledger.reissuePublicationYear) : t(lang, '; publication year unstated', '; ano de publicação não indicado')}. ${t(lang, 'Locators refer to the supplied PDF captures, not inferred printed pages.', 'Os localizadores correspondem às capturas do PDF fornecido, sem inferência de páginas impressas.')}</p><ul class="cp-source-list">${refs}</ul><p>${link(file, 'read/theosophy/index.html', t(lang, 'Explore the complete reading commentary', 'Explore o comentário de leitura completo'), lang)} · ${link(file, 'theosophy/source-notes.html', t(lang, 'Edition and source notes', 'Notas da edição e das fontes'), lang)}</p>${archive}</section>`;
}
function lessonCards(ids, {course, lessons, lang, file}) {
  return `<ol class="cp-lesson-list">${ids.map(id => {
    const lesson = find(lessons, id, 'lesson');
    return `<li data-concept-progress="${esc(id)}"><div><h3>${link(file, lessonRoute(course, lesson), value(lesson, lang, 'title'), lang)}</h3><p>${esc(value(lesson, lang, 'question'))}</p></div><span class="cp-state-label" data-concept-progress-label>${t(lang, 'Not started', 'Não iniciada')}</span><span class="cp-bookmark-label" data-concept-bookmark-label hidden>${t(lang, 'Bookmarked', 'Favorita')}</span></li>`;
  }).join('')}</ol>`;
}
function moduleNavigation(current, {course, lessons, lang, file}) {
  return `<details class="cp-module-navigation"><summary>${t(lang,'Explore the course map','Explore o mapa do curso')}</summary><nav aria-label="${t(lang,'Course modules and lessons','Módulos e lições do curso')}">${course.modules.map(module => `<section><h2>${esc(value(module,lang,'title'))}</h2><ol>${module.lessonIds.map(id => {const lesson=find(lessons,id,'module lesson');return `<li>${link(file,lessonRoute(course,lesson),value(lesson,lang,'title'),lang,id===current?'aria-current="page"':'')}</li>`;}).join('')}</ol></section>`).join('')}<p>${link(file,lessonRoute(course,course.synthesis),value(course.synthesis,lang,'title'),lang,course.synthesis.id===current?'aria-current="page"':'')}</p></nav></details>`;
}
function practiceBody(practice, {lang, file}, embedded = false) {
  const v = practice[lang];
  if (!v?.title || !v.purpose || !Array.isArray(v.steps)) throw new Error(`Incomplete practice: ${practice.id}/${lang}`);
  const adaptation = practice.sourceType === 'course-adaptation';
  return `<section class="cp-practice"${embedded ? ' id="try-in-life"' : ''} data-concept-practice data-concept-section="practice"><div class="cp-label">${t(lang, 'Try it in life', 'Experimente na vida')}</div><h2>${esc(v.title)}</h2><p class="cp-attribution">${adaptation ? t(lang, 'Course exercise', 'Exercício do curso') : t(lang, 'Exercise given by Steiner', 'Exercício proposto por Steiner')}</p><p>${esc(v.purpose)}</p>${v.duration ? `<p class="cp-duration">${esc(v.duration)}</p>` : ''}<ol class="cp-practice-steps">${v.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><p class="cp-reflection-question">${esc(v.reflection)}</p><details class="cp-course-notes"><summary>${t(lang, 'Reveal course notes', 'Revelar notas do curso')}</summary>${paragraphs(v.notes)}</details>${v.sourceBasis ? `<p class="cp-source-basis">${esc(v.sourceBasis)}</p>` : ''}${embedded ? `<p>${link(file, practiceRoute(practice), t(lang, 'Open this practice on its own', 'Abra esta prática separadamente'), lang)}</p>` : ''}</section>`;
}
function studyControls(lang) {
  return `<section class="cp-study-controls" aria-labelledby="study-controls-heading"><h2 id="study-controls-heading">${t(lang, 'Your study', 'Seu estudo')}</h2><p>${t(lang, 'Use the study marks and reflection for yourself. Saving is optional and stays in this browser.', 'Use as marcas de estudo e a reflexão para você. Salvar é opcional e fica neste navegador.')}</p><label class="cp-save"><input type="checkbox" data-concept-save disabled> ${t(lang, 'Save my study in this browser', 'Salvar meu estudo neste navegador')}</label><div class="cp-control-row"><label for="concept-study-state">${t(lang, 'Study state', 'Estado do estudo')}<select id="concept-study-state" data-concept-state disabled>${[['not-started','Not started','Não iniciada'],['exploring','Exploring','Explorando'],['studied','Studied','Estudada'],['reviewed','Reviewed','Revisada']].map(([id,en,pt]) => `<option value="${id}">${t(lang,en,pt)}</option>`).join('')}</select></label><button type="button" data-concept-bookmark aria-pressed="false" disabled>${t(lang, 'Bookmark this lesson', 'Favoritar esta lição')}</button></div><label for="concept-reflection">${t(lang, 'Optional personal reflection', 'Reflexão pessoal opcional')}</label><textarea id="concept-reflection" data-concept-reflection rows="4"></textarea><div class="cp-control-row"><button type="button" data-concept-export disabled>${t(lang, 'Export my reflection', 'Exportar minha reflexão')}</button><button type="button" class="cp-delete" data-concept-delete disabled>${t(lang, 'Delete this lesson’s saved study', 'Apagar o estudo salvo desta lição')}</button></div><p data-concept-status role="status" aria-live="polite"></p><noscript><p>${t(lang, 'Reading and course notes remain available. Copy any personal reflection before leaving; study marks and export require JavaScript.', 'A leitura e as notas do curso continuam disponíveis. Copie sua reflexão pessoal antes de sair; as marcas de estudo e a exportação requerem JavaScript.')}</p></noscript></section>`;
}

export function renderPlatformPage(file, title, body, lang, {partner, description = '', role = 'page'} = {}) {
  if (!['en', 'pt'].includes(lang)) throw new Error('Unsupported platform language');
  const area = platformArea(file), areaName = area ?? (file.replace(/^docs\/(?:pt\/)?/, '') === 'index.html' ? 'home' : 'support');
  const attributes = ['course','order','routes','lesson'].map(name => body.match(new RegExp(`\\bdata-concept-${name}="([^"]*)"`))?.[0]).filter(Boolean).join(' ');
  const assets = ['concept-platform.css','concept-platform.js'].map(name => {
    const hash = createHash('sha256').update(fs.readFileSync(new URL('./assets/' + name, import.meta.url))).digest('hex').slice(0,12);
    const href = esc(relative(file, 'docs/' + name)) + '?v=' + hash;
    return name.endsWith('.css') ? `<link rel="stylesheet" href="${href}">` : `<script defer src="${href}"></script>`;
  }).join('');
  return `<!doctype html>\n<html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — ${t(lang,'Anthroposophy','Antroposofia')}</title><meta name="description" content="${esc(description || title)}"><link rel="stylesheet" href="${esc(relative(file,'docs/site-watercolour.css'))}"><link rel="stylesheet" href="${esc(relative(file,'docs/learning-system.css'))}"><script defer src="${esc(relative(file,'docs/learning-system.js'))}"></script>${partner ? `<link rel="alternate" hreflang="${lang === 'pt' ? 'en' : 'pt-BR'}" href="${esc(relative(file,partner))}">` : ''}${assets}</head><body class="concept-platform-page" data-learning-owned="true"><a class="skip" href="#main">${t(lang,'Skip to content','Pular para o conteúdo')}</a><header class="cp-header"><a class="brand" href="${esc(relative(file,base(lang)+'index.html'))}"><span class="mark" aria-hidden="true">✳</span> ${t(lang,'Anthroposophy','Antroposofia')}</a>${partner ? `<nav class="cp-language" aria-label="${t(lang,'Language','Idioma')}"><a lang="${lang === 'pt' ? 'en' : 'pt-BR'}" href="${esc(relative(file,partner))}">${t(lang,'Português','English')}</a></nav>` : ''}${platformNav(file,lang,area)}</header><main id="main" class="cp-main" data-concept-platform-owned="true" data-platform-area="${esc(areaName)}" data-platform-role="${esc(role)}" data-concept-page="${esc(file.replace(/^docs\//, ''))}" ${attributes}>${body}</main><footer class="cp-footer"><p>${t(lang,'Begin with a question. Follow the relationships. Return to life.','Comece com uma pergunta. Acompanhe as relações. Retorne à vida.')}</p>${platformSupportNav(file,lang)}</footer></body></html>\n`;
}

export function renderConceptLesson(lesson, {course, lessons, concepts, practices, lang, file}) {
  const v = lesson[lang], order = orderFor(course,lessons), position = order.indexOf(lesson.id);
  if (position < 0 || !v?.title || !v.question) throw new Error('Lesson is absent from its course or language');
  const module = find(course.modules,lesson.moduleId,'module');
  const terms = lesson.termIds.map(id => find(concepts,id,'term'));
  const central = find(concepts,lesson.primaryConceptId,'primary concept');
  const relationships = lesson.connections.map(edge => {
    const concept = find(concepts,edge.id,'connected concept');
    return `<li><h3>${link(file,conceptRoute(concept),value(concept,lang,'term'),lang)}</h3><p>${esc(edge[lang])}</p></li>`;
  }).join('');
  const practice = lesson.practiceId ? find(practices,lesson.practiceId,'practice') : null;
  const previous = position ? find(lessons,order[position-1],'previous lesson') : null;
  const next = position + 1 < order.length ? find(lessons,order[position+1],'next lesson') : null;
  const comparisons = (v.comparisons ?? []).map(table => {
    if (!table.title || !Array.isArray(table.headers) || !table.headers.length || !Array.isArray(table.rows) || table.rows.some(row=>!Array.isArray(row)||row.length!==table.headers.length)) throw new Error('Invalid concept comparison table');
    return `<table class="cp-comparison"><caption>${esc(table.title)}</caption><thead><tr>${table.headers.map(header=>`<th scope="col">${esc(header)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map((cell,index)=>index?`<td>${esc(cell)}</td>`:`<th scope="row">${esc(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table>`;
  }).join('');
  return [
    `<article class="cp-lesson" ${progressAttributes(course,lessons,lesson)}>`,
    `<nav class="cp-breadcrumb" aria-label="${t(lang,'Course location','Localização no curso')}">${link(file,`${courseRoute(course)}/index.html`,value(course,lang,'title'),lang)}<span>${t(lang,'Lesson','Lição')} ${position+1} ${t(lang,'of','de')} ${order.length}</span></nav>`,
    `<header class="cp-lesson-heading"><p class="cp-label">${esc(value(module,lang,'title'))}</p><h1>${esc(v.title)}</h1><p class="cp-question">${esc(v.question)}</p></header>`,
    moduleNavigation(lesson.id,{course,lessons,lang,file}),
    `<section class="cp-experience" id="begin-with-experience" data-concept-section="experience"><div class="cp-label">${t(lang,'Observe','Observe')}</div><h2>${t(lang,'Begin with experience','Comece com a experiência')}</h2>${paragraphs(v.experience)}</section>`,
    `<section class="cp-central-idea" id="central-idea" data-concept-section="central"><div class="cp-label">${t(lang,'Steiner’s account','A concepção de Steiner')}</div><h2>${t(lang,'The central idea','A ideia central')}</h2><p>${esc(v.centralIdea)}</p></section>`,
    `<section class="cp-terminology" id="useful-terminology" data-concept-section="terminology"><h2>${t(lang,'Useful terminology','Terminologia útil')}</h2><dl>${terms.map(term => `<dt>${link(file,conceptRoute(term),value(term,lang,'term'),lang)}</dt><dd>${esc(value(term,lang,'definition'))}</dd>`).join('')}</dl></section>`,
    `<section class="cp-explanation" id="building-the-concept" data-concept-section="teaching"><h2>${t(lang,'Building the concept','Construindo o conceito')}</h2>${paragraphs(v.explanation)}${comparisons}</section>`,
    `<aside class="cp-distinction" id="keep-the-distinction" data-concept-section="distinction"><h2>${t(lang,'Keep this distinction','Conserve esta distinção')}</h2><p>${esc(v.distinction)}</p></aside>`,
    `<section class="cp-concept-map" id="connected-ideas" data-concept-section="connections" aria-labelledby="connected-ideas-heading"><h2 id="connected-ideas-heading">${t(lang,'How the ideas connect','Como as ideias se conectam')}</h2><div class="cp-map-center"><h3>${link(file,conceptRoute(central),value(central,lang,'term'),lang)}</h3><p>${esc(value(central,lang,'definition'))}</p></div><ul class="cp-map-relations">${relationships}</ul></section>`,
    practice ? practiceBody(practice,{lang,file},true) : '',
    `<section class="cp-reflection" id="reflection" data-concept-section="reflection"><h2>${t(lang,'Reflect in your own words','Reflita com suas palavras')}</h2><p class="cp-reflection-question">${esc(v.reflection.question)}</p><details class="cp-course-notes"><summary>${t(lang,'Reveal course notes','Revelar notas do curso')}</summary>${paragraphs(v.reflection.notes)}</details></section>`,
    `<section class="cp-takeaways" id="takeaways" data-concept-section="takeaways"><h2>${t(lang,'What to remember','O que lembrar')}</h2>${list(v.takeaways)}</section>`,
    v.deeper?.length ? `<section class="cp-deeper-study" id="deeper-study" data-concept-section="deeper"><h2>${t(lang,'Optional deeper study','Aprofundamento opcional')}</h2>${v.deeper.map(item => `<details class="cp-deeper"><summary>${esc(item.title)}</summary>${paragraphs(item.paragraphs)}</details>`).join('')}</section>` : '',
    studyControls(lang),
    sourceReferences(lesson.sources,{course,lang,file}),
    `<nav class="cp-lesson-navigation" aria-label="${t(lang,'Lesson navigation','Navegação das lições')}">${previous ? link(file,lessonRoute(course,previous),'← '+value(previous,lang,'title'),lang) : link(file,`${courseRoute(course)}/index.html`,t(lang,'← Course introduction','← Introdução do curso'),lang)}${next ? link(file,lessonRoute(course,next),value(next,lang,'title')+' →',lang,'class="cp-next"') : link(file,`${courseRoute(course)}/index.html`,t(lang,'Return to the course map →','Retornar ao mapa do curso →'),lang,'class="cp-next"')}</nav></article>`
  ].join('');
}

export function renderCourseLanding({course, lessons, concepts, lang, file}) {
  const v = course[lang] ?? {}, order = orderFor(course,lessons), first = find(lessons,order[0],'first lesson');
  const modules = course.modules ?? [];
  return `<article class="cp-course" ${progressAttributes(course,lessons)}><section class="cp-course-hero"><p class="cp-label">${t(lang,'Learn · Rudolf Steiner · GA 9','Aprenda · Rudolf Steiner · GA 9')}</p><div class="identity-course-heading"><h1>${esc(value(course,lang,'title'))}</h1>${renderCourseArtwork(file,course.id)}</div>${v.question ? `<p class="cp-question">${esc(v.question)}</p>` : ''}${v.subtitle ? `<p class="cp-lead">${esc(v.subtitle)}</p>` : ''}${paragraphs(v.introduction ?? v.intro ?? v.description)}<div class="cp-actions">${link(file,lessonRoute(course,first),t(lang,'Begin with the first question','Comece com a primeira pergunta'),lang,'class="cp-button"')}<a href="#modules">${t(lang,'View the course map','Veja o mapa do curso')}</a><a data-concept-resume hidden href="${esc(relative(file,base(lang)+lessonRoute(course,first)))}">${t(lang,'Continue studying','Continue estudando')}</a></div></section>${v.purpose?.length ? `<section><h2>${t(lang,'What this course develops','O que este curso desenvolve')}</h2>${paragraphs(v.purpose)}</section>` : ''}${v.audience?.length ? `<section><h2>${t(lang,'Who it is for','Para quem é o curso')}</h2>${paragraphs(v.audience)}</section>` : ''}${v.outcomes?.length ? `<section><h2>${t(lang,'What you can learn','O que você pode aprender')}</h2>${list(v.outcomes)}</section>` : ''}${v.approach?.length ? `<section><h2>${t(lang,'How to study','Como estudar')}</h2>${paragraphs(v.approach)}</section>` : ''}<section class="cp-course-progress"><h2>${t(lang,'Your course map','Seu mapa do curso')}</h2><p data-concept-progress-summary>${order.length} ${t(lang,'connected lessons; study marks are optional','lições conectadas; as marcas de estudo são opcionais')}</p><label class="cp-save"><input type="checkbox" data-concept-save disabled> ${t(lang,'Save my study in this browser','Salvar meu estudo neste navegador')}</label><p data-concept-status role="status" aria-live="polite"></p></section><section class="cp-modules" id="modules"><h2>${t(lang,'Follow the questions','Acompanhe as perguntas')}</h2>${modules.map(module => { const ids = module.lessonIds ?? lessons.filter(lesson => lesson.moduleId === module.id).map(lesson => lesson.id); return `<section class="cp-module" id="module-${esc(semantic(module.id))}"><h3>${esc(value(module,lang,'title'))}</h3>${value(module,lang,'question') ? `<p class="cp-module-question">${esc(value(module,lang,'question'))}</p>` : ''}${paragraphs(value(module,lang,'description'))}<p data-concept-module-summary data-concept-members="${esc(JSON.stringify(ids))}"></p>${lessonCards(ids,{course,lessons,lang,file})}</section>`; }).join('')}${!modules.length ? lessonCards(order,{course,lessons,lang,file}) : ''}</section>${course.synthesis && modules.length ? `<section class="cp-synthesis-entry"><h2>${t(lang,'Bring the course together','Reúna o curso')}</h2>${lessonCards([course.synthesis.id],{course,lessons,lang,file})}</section>` : ''}${v.synthesis ? `<section class="cp-course-synthesis"><h2>${t(lang,'Bring the whole picture together','Reúna a visão do conjunto')}</h2>${paragraphs(v.synthesis)}</section>` : ''}<section class="cp-course-concepts"><h2>${t(lang,'Return to a concept','Retome um conceito')}</h2><ul class="cp-concept-links">${concepts.map(concept => `<li>${link(file,conceptRoute(concept),value(concept,lang,'term'),lang)}</li>`).join('')}</ul></section><section class="cp-reading-context"><h2>${t(lang,'The book remains available','O livro continua disponível')}</h2><p>${t(lang,'This course explains the ideas without requiring the book. The detailed reading commentary follows the supplied source in its own order.', 'Este curso explica as ideias sem exigir a leitura do livro. O comentário detalhado acompanha a fonte fornecida em sua própria ordem.')}</p>${link(file,'read/theosophy/index.html',t(lang,'Read Steiner in context','Leia Steiner no contexto'),lang)}</section>${sourceReferences(course.sources,{course,lang,file})}</article>`;
}

export function renderConceptPage(concept, {course, lessons, concepts, practices, lang, file}) {
  const v = concept[lang], relatedLessons = lessons.filter(lesson => lesson.conceptIds.includes(concept.id));
  const relatedPractices = practices.filter(practice => practice.conceptIds.includes(concept.id));
  return `<article class="cp-concept" ${progressAttributes(course,lessons)}><p class="cp-label">${t(lang,'Explore concepts · Steiner’s terminology','Explore conceitos · Terminologia de Steiner')}</p><h1>${esc(v.term)}</h1>${v.alsoCalled?.length ? `<p class="cp-also-called">${t(lang,'Also called','Também chamado')}: ${esc(v.alsoCalled.join(', '))}</p>` : ''}${concept.german ? `<p lang="de" class="cp-german">${esc(concept.german)}</p>` : ''}<p class="cp-definition">${esc(v.definition)}</p>${paragraphs(v.explanation)}<aside class="cp-distinction"><h2>${t(lang,'Keep this distinction','Conserve esta distinção')}</h2><p>${esc(v.distinction)}</p></aside><section class="cp-concept-map"><h2>${t(lang,'Related concepts and relationships','Conceitos relacionados e suas relações')}</h2><ul class="cp-map-relations">${concept.related.map(edge => {const item = find(concepts,edge.id,'related concept');return `<li><h3>${link(file,conceptRoute(item),value(item,lang,'term'),lang)}</h3><p>${esc(edge[lang])}</p></li>`;}).join('')}</ul></section><section><h2>${t(lang,'Develop the idea in a lesson','Desenvolva a ideia numa lição')}</h2>${lessonCards(relatedLessons.map(lesson=>lesson.id),{course,lessons,lang,file})}</section>${relatedPractices.length ? `<section><h2>${t(lang,'Related practice','Prática relacionada')}</h2><ul>${relatedPractices.map(practice=>`<li>${link(file,practiceRoute(practice),value(practice,lang,'title'),lang)}<p>${esc(value(practice,lang,'purpose'))}</p></li>`).join('')}</ul></section>` : ''}${sourceReferences(concept.sources,{course,lang,file})}</article>`;
}

export function renderPracticePage(practice, {course, lessons, concepts, practices, lang, file}) {
  return `<article class="cp-practice-page" ${progressAttributes(course,lessons)}><p class="cp-label">${t(lang,'Practice · Learn through attention','Pratique · Aprenda com atenção')}</p><h1>${esc(value(practice,lang,'title'))}</h1>${practiceBody(practice,{lang,file})}<section><h2>${t(lang,'Understand the practice in its lesson','Compreenda a prática em sua lição')}</h2>${lessonCards(practice.lessonIds,{course,lessons,lang,file})}</section><section><h2>${t(lang,'Concepts to keep in view','Conceitos a considerar')}</h2><ul class="cp-concept-links">${practice.conceptIds.map(id=>{const concept=find(concepts,id,'practice concept');return `<li>${link(file,conceptRoute(concept),value(concept,lang,'term'),lang)}</li>`;}).join('')}</ul></section>${sourceReferences(practice.sources,{course,lang,file})}</article>`;
}

export function renderCourseSynthesis({course, lessons, concepts, practices, lang, file}) {
  const synthesis = course.synthesis, v = synthesis[lang];
  if (!v?.title || !v.question || !Array.isArray(v.bigPicture) || !Array.isArray(v.reviewQuestions)) throw new Error('Incomplete course synthesis');
  const map = v.bigPicture.map(cluster => `<li><h3>${esc(cluster.title)}</h3><p>${esc(cluster.relationship)}</p><ul class="cp-concept-links">${cluster.conceptIds.map(id=>{const concept=find(concepts,id,'synthesis concept');return `<li>${link(file,conceptRoute(concept),value(concept,lang,'term'),lang)}</li>`;}).join('')}</ul></li>`).join('');
  const previousId = orderFor(course,lessons).at(-2), previous = find(lessons,previousId,'last teaching lesson');
  return [
    `<article class="cp-synthesis" ${progressAttributes(course,lessons,synthesis)}>`,
    `<nav class="cp-breadcrumb" aria-label="${t(lang,'Course location','Localização no curso')}">${link(file,`${courseRoute(course)}/index.html`,value(course,lang,'title'),lang)}<span>${t(lang,'Whole-course synthesis','Síntese do curso')}</span></nav>`,
    `<h1>${esc(v.title)}</h1><p class="cp-question">${esc(v.question)}</p>`,
    moduleNavigation(synthesis.id,{course,lessons,lang,file}),
    `<section class="cp-synthesis-map" data-concept-section="connections"><h2>${t(lang,'The whole picture','A visão do conjunto')}</h2><ul class="cp-map-clusters">${map}</ul></section>`,
    `<section class="cp-takeaways" data-concept-section="takeaways"><h2>${t(lang,'What to keep in view','O que considerar no conjunto')}</h2>${list(v.takeaways)}</section>`,
    `<section class="cp-review" data-concept-section="review"><h2>${t(lang,'Return to the main questions','Retome as perguntas principais')}</h2>${v.reviewQuestions.map(item=>`<div class="cp-review-question"><h3>${esc(item.question)}</h3><details class="cp-course-notes"><summary>${t(lang,'Reveal course notes','Revelar notas do curso')}</summary>${paragraphs(item.notes)}</details></div>`).join('')}</section>`,
    `<section class="cp-glossary" data-concept-section="glossary"><h2>${t(lang,'A connected glossary','Um glossário conectado')}</h2><dl>${concepts.map(concept=>`<dt>${link(file,conceptRoute(concept),value(concept,lang,'term'),lang)}</dt><dd>${esc(value(concept,lang,'definition'))}</dd>`).join('')}</dl></section>`,
    `<section class="cp-practice-overview" data-concept-section="practice-overview"><h2>${t(lang,'Practices to return to','Práticas para retomar')}</h2><ul>${practices.map(practice=>`<li><h3>${link(file,practiceRoute(practice),value(practice,lang,'title'),lang)}</h3><p>${esc(value(practice,lang,'purpose'))}</p></li>`).join('')}</ul></section>`,
    `<section class="cp-continuing"><h2>${t(lang,'Continue your study','Continue seu estudo')}</h2><ul>${v.continuing.map(item=>{if(!/^[a-z0-9/-]+\.html$/.test(item.route)||item.route.split('/').some(part=>part==='..'||part==='.')||item.route.startsWith('/'))throw new Error('Invalid further-study route');return `<li><h3>${link(file,item.route,item.title,lang)}</h3><p>${esc(item.description)}</p></li>`;}).join('')}</ul></section>`,
    studyControls(lang), sourceReferences(synthesis.sources,{course,lang,file}),
    `<nav class="cp-lesson-navigation" aria-label="${t(lang,'Lesson navigation','Navegação das lições')}">${link(file,lessonRoute(course,previous),'← '+value(previous,lang,'title'),lang)}${link(file,`${courseRoute(course)}/index.html`,t(lang,'Return to the course map →','Retornar ao mapa do curso →'),lang,'class="cp-next"')}</nav></article>`
  ].join('');
}
