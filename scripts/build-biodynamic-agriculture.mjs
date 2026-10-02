import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {esc, n, relative, quiz, shell} from './learning-html.mjs';
import {biodynamicCourseData, readBiodynamicJSON, assertBiodynamicPublicationReady} from './biodynamic-course-data.mjs';

const draft = process.argv.includes('--draft');
const {course, parts, lessons} = biodynamicCourseData();
if (!draft) assertBiodynamicPublicationReady(course);
const output = draft ? path.resolve('.sites-runtime/biodynamic-course-preview/docs') : path.resolve('docs');
const route = course.route;
const version = createHash('sha256').update(fs.readFileSync('docs/guided-study.v1.js')).digest('hex').slice(0,12);
const courseScriptVersion = createHash('sha256').update(fs.readFileSync('scripts/assets/biodynamic-course.js')).digest('hex').slice(0,12);
const courseStyleVersion = createHash('sha256').update(fs.readFileSync('scripts/assets/biodynamic-course.css')).digest('hex').slice(0,12);
const paragraphs = values => (Array.isArray(values) ? values : [values]).filter(Boolean).map(value => `<p>${esc(value)}</p>`).join('');
const list = values => `<ul>${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;
const text = (item, key, lang) => item[key + (lang === 'pt' ? 'Pt' : 'En')];
const fileFor = (lang, tail='index.html') => `docs/${lang === 'pt' ? 'pt/' : ''}${route}/${tail}`;
const lessonFor = (id, lang) => fileFor(lang, `lessons/${n(id)}.html`);
const partFor = (part, lang) => fileFor(lang, `parts/${part.slug}.html`);
const roman = ['I','II','III','IV','V','VI'];
const library = readBiodynamicJSON('biodynamic-practice-library.json');
const modern = readBiodynamicJSON('biodynamic-modern-evidence.json');
for (const lesson of lessons) for (const lang of ['en','pt']) for (const id of lesson[lang].modernReferences || []) {
  if (!modern.sources.some(source=>source.id===id)) throw new Error('Lesson '+lesson.id+' cites an unknown or unreviewed teaching source: '+id);
}
if (!draft) {
  if (modern.sources.some(source=>source.verificationStatus!=='verified'||source.reviewedForTeaching!==true)) throw new Error('Modern teaching-source verification is incomplete.');
  for (const lesson of lessons) {
    const source=lesson.source;
    if (course.sourceAuthority==='supplied-markdown') {
      if (source.markdownVerified!==true || !source.captures?.length || !source.captures.includes(source.quoteCapture) || source.captures.some(capture=>!Number.isInteger(capture)||capture<1||capture>course.canonical.captureCount)) throw new Error('Missing verified canonical Markdown locator at lesson '+lesson.id);
    } else if (source.pdfVerified!==true || typeof source.verifiedPages!=='string' || !source.verifiedPages.trim()) throw new Error('Missing verified canonical PDF locator at lesson '+lesson.id);
  }
}
if (draft) {
  fs.mkdirSync(path.dirname(output), {recursive:true});
  // This dedicated ignored output is owned by this generator; remove stale preview pages.
  fs.rmSync(output, {recursive:true, force:true});
  fs.cpSync('docs', output, {recursive:true});
}
for (const asset of ['biodynamic-course.css', 'biodynamic-course.js']) fs.copyFileSync(`scripts/assets/${asset}`, path.join(output, asset));

function page(file, title, body, lang, partner, studyId) {
  const pt = lang === 'pt', t = (en,br) => pt ? br : en;
  const modernNotice = modern.sources.some(source=>source.verificationStatus!=='verified') ? t(' Modern-reference verification is incomplete.',' A verificação das referências modernas está incompleta.') : '';
  const banner = draft ? `<aside class="bio-draft" role="note"><strong>${t('Private course preview','Prévia privada do curso')}</strong><p>${t('This preview uses the supplied Markdown editions and original teaching diagrams.','Esta prévia usa as edições Markdown fornecidas e diagramas didáticos originais.')}${modernNotice}</p></aside>` : '';
  let html = shell(file, title, banner + body, lang, {partner, className:'learning-course biodynamic-course'}).replace('class="learning-course biodynamic-course"','class="learning-course biodynamic-course" data-biodynamics-owned="true"');
  html = html.replace('</head>', `<link rel="stylesheet" href="${relative(file,'docs/biodynamic-course.css')}?v=${courseStyleVersion}"><link rel="stylesheet" href="${relative(file,'docs/guided-study.v1.css')}?v=practice-1"><script defer src="${relative(file,'docs/guided-study.v1.js')}?v=${version}"></script><script defer src="${relative(file,'docs/biodynamic-course.js')}?v=${courseScriptVersion}"></script></head>`);
  if (studyId) html = html.replace('data-biodynamics-owned="true"', `data-biodynamics-owned="true" data-study-id="${route}/${n(studyId)}"`);
  html = html.replace('<header>', '<header class="bio-header">');
  html = html.replace('</header>', `<nav class="system-nav" data-biodynamic-nav aria-label="${t('Main navigation','Navegação principal')}">${[['learn/index.html',t('Learn Anthroposophy','Aprenda antroposofia')],['books/index.html',t('Study the Books','Estude os livros')],['themes/index.html',t('Themes and Applications','Temas e aplicações')],['research/index.html',t('Research / Source Library','Pesquisa / Biblioteca de fontes')]].map(([tail,label])=>`<a${tail==='books/index.html'?' aria-current="true"':''} href="${relative(file,'docs/'+(pt?'pt/':'')+tail)}">${label}</a>`).join('')}</nav></header>`);
  const target = path.resolve(output, path.relative('docs', file));
  if (!target.startsWith(output + path.sep)) throw new Error('Biodynamic page target leaves its output directory: ' + file);
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.writeFileSync(target, html);
}

function breadcrumb(file, lang, part) {
  const t = (a,b) => lang === 'pt' ? b : a;
  return `<nav class="bio-breadcrumb" aria-label="${t('Study location','Localização no estudo')}"><a href="${relative(file,fileFor(lang))}">${esc(text(course,'title',lang))}</a>${part ? ` / <a href="${relative(file,partFor(part,lang))}">${t('Part','Parte')} ${roman[part.id-1]}</a>` : ''}</nav>`;
}

function mechanism(steps, lang, title) {
  const t = (a,b) => lang === 'pt' ? b : a;
  return `<figure class="bio-process"><figcaption>${esc(title || t('How the process works in Steiner’s model','Como funciona o processo no modelo de Steiner'))}</figcaption><ol>${steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><p class="bio-credit">${t('Original course diagram of the relationships explained above.','Diagrama original do curso com as relações explicadas acima.')}</p></figure>`;
}

function farmCycle(data, lang) {
  const t = (a,b) => lang === 'pt' ? b : a;
  const steps = values => `<ol class="bio-cycle-steps">${values.map(value=>`<li>${esc(value)}</li>`).join('')}</ol>`;
  return `<figure class="bio-process" data-farm-cycle><figcaption>${esc(data.caption)}</figcaption><div class="bio-cycle">${steps(data.start)}<div class="bio-cycle-paths">${data.paths.map(route=>`<section><h3>${esc(route.title)}</h3>${steps(route.steps)}<p><strong>${t('Return paths','Caminhos de retorno')}</strong></p><ul class="bio-cycle-returns">${route.returns.map(value=>`<li>${esc(value)}</li>`).join('')}</ul></section>`).join('')}</div><p class="bio-cycle-rejoin">${esc(data.end)}</p></div><p>${esc(data.note)}</p><p class="bio-credit">${esc(data.credit)}</p></figure>`;
}

function table(data) {
  return `<div class="bio-table" data-table-scroll tabindex="0" role="region" aria-label="${esc(data.caption)}"><table><caption>${esc(data.caption)}</caption><thead><tr>${data.headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row => `<tr>${row.map((cell,i) => i ? `<td>${esc(cell)}</td>` : `<th scope="row">${esc(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>${data.credit ? `<p class="bio-credit">${esc(data.credit)}</p>` : ''}`;
}

function sourceBlock(lesson, lang) {
  const pt = lang === 'pt', t = (a,b) => pt ? b : a, source = lesson.source;
  const label = source.sectionEn ? text(source,'section',lang) : t(`Lecture ${source.lecture}`,`Palestra ${source.lecture}`);
  const locator = course.sourceAuthority === 'supplied-markdown'
    ? t(`Canonical Markdown captures ${source.captures.join(', ')}`,`Capturas ${source.captures.join(', ')} do Markdown canônico`)
    : course.canonical.paginationVerified
    ? (course.canonical.paginationKind==='pdf-page' ? t(`Canonical PDF pages ${source.verifiedPages}`,`Páginas ${source.verifiedPages} do PDF canônico`) : t(`Canonical printed edition pages ${source.verifiedPages}`,`Páginas impressas ${source.verifiedPages} da edição canônica`))
    : t(`Canonical Markdown captures ${source.captures.join(', ')} · printed pagination unverified`,`Capturas ${source.captures.join(', ')} do Markdown canônico · paginação impressa não verificada`);
  return `<section class="learning-source bio-source" id="read-steiner" data-biodynamic-source><div class="eyebrow">${t('Read Steiner','Leia Steiner')}</div><h2>Rudolf Steiner · <cite>Agriculture Course — GA 327</cite></h2><p>${esc(label)} · ${esc(source.date)}</p><p class="source-locator">${esc(locator)}</p><blockquote><p>${esc(text(source,'quote',lang))}</p></blockquote><p class="bio-credit">${esc(course.canonical.title)} · ${t('Catherine E. Creeger and Malcolm Gardner, 1993','Catherine E. Creeger e Malcolm Gardner, 1993')} · ${t('excerpt at Markdown capture','trecho na captura do Markdown')} ${source.quoteCapture}.${pt ? ' Tradução de estudo em português preparada para o curso.' : ''}</p>${source.additional?.length ? `<details><summary>${t('Related passages and discussion','Passagens e discussão relacionadas')}</summary><ul>${source.additional.map(item => `<li>${esc(text(item,'label',lang))} · ${esc(item.date)} · ${t('canonical Markdown captures','capturas do Markdown canônico')} ${item.captures.join(', ')}</li>`).join('')}</ul></details>` : ''}</section>`;
}

function references(ids, lang) {
  if (!ids?.length) return '';
  const t = (a,b) => lang === 'pt' ? b : a;
  return `<details class="bio-references" data-deep-study><summary>${t('Modern context: source references','Contexto moderno: referências')}</summary><ul>${ids.map(id => {
    const source = [...modern.sources,...(modern.optionalReadings||[])].find(item => item.id === id);
    if (!source) throw new Error(`Unknown modern source ${id}`);
    const identity = [source.authors || source.organization, source.year, source.version].filter(Boolean).map(value=>esc(String(value))).join(' · ');
    const optional = modern.optionalReadings?.some(item=>item.id===id);
    const status = optional ? t('optional bibliographic lead; full text not reviewed','indicação bibliográfica opcional; texto completo não revisado') : source.verificationStatus !== 'verified' ? t('proposed reading; verification still required before publication','leitura proposta; verificação necessária antes da publicação') : '';
    return `<li><a href="${esc(source.url)}">${esc(source.title)}</a>${identity ? ` · ${identity}` : ''}${status ? ` · ${status}` : ''}</li>`;
  }).join('')}</ul></details>`;
}

function noteField(id, field, label, rows=4) {
  return `<label for="${id}">${esc(label)}</label><textarea id="${id}" class="study-note" data-note-field="${field}" rows="${rows}"></textarea>`;
}

function consent(lang) {
  const t = (a,b) => lang === 'pt' ? b : a;
  return `<label class="study-consent js-only"><input type="checkbox" data-save-notes> ${t('Save notes and study marks on this device across all courses','Salvar anotações e marcações neste dispositivo em todos os cursos')}</label><p>${t('This optional saving preference applies across courses and does not sync between devices. Export a copy before clearing site data.','Esta preferência opcional de salvamento vale para todos os cursos e não sincroniza dispositivos. Exporte uma cópia antes de limpar os dados do site.')}</p><p data-note-status role="status">${t('Text stays in this page unless saving is enabled.','O texto permanece nesta página, a menos que o salvamento esteja ativado.')}</p><noscript><p>${t('Copy your notes or use a paper notebook before leaving. Sources and expandable answers work without JavaScript.','Copie suas notas ou use um caderno antes de sair. As fontes e respostas expansíveis funcionam sem JavaScript.')}</p></noscript>`;
}

function observation(value, lang) {
  const t = (a,b) => lang === 'pt' ? b : a;
  return `<section id="observe" class="bio-observe"><h2>${t('Observe','Observe')}</h2>${paragraphs(value.task)}${value.record?.length ? list(value.record) : ''}<p><strong>${t('Then interpret','Depois interprete')}:</strong> ${esc(value.interpretation)}</p>${[1,2,3].map(i => noteField(`bio-session-${i}`,`session${i}`,t(`Visit ${i}: date, conditions, observations, then a separate interpretation`,`Visita ${i}: data, condições, observações e uma interpretação separada`))).join('')}</section>`;
}

function notebook(lang) {
  const t = (a,b) => lang === 'pt' ? b : a;
  return `<section class="study-notebook"><h2>${t('Revisit your explanation','Retome sua explicação')}</h2><details><summary>${t('Compare with your first answer','Compare com sua primeira resposta')}</summary><p data-first-preview></p></details>${noteField('bio-after','after',t('Revised explanation, supporting passage and one remaining question','Explicação revista, trecho de apoio e uma pergunta que permanece'))}<p>${t('Mark studied when you can explain the agricultural question, the proposed mechanism and what your observations establish.','Marque como estudada quando conseguir explicar a questão agrícola, o mecanismo proposto e o que suas observações estabelecem.')}</p><div class="study-actions js-only"><button type="button" class="study-button" data-complete aria-pressed="false">${t('Mark lesson studied','Marcar lição como estudada')}</button><button type="button" class="study-button" data-export>${t('Export notes','Exportar anotações')}</button><button type="button" class="study-button" data-delete>${t('Delete this lesson’s notes (both languages)','Excluir notas desta lição (ambos os idiomas)')}</button></div></section>`;
}

function synthesis(part, lang) {
  const t = (a,b) => lang === 'pt' ? b : a, v = part[lang].synthesis;
  return `<section id="synthesis" class="bio-synthesis"><h2>${t('Part synthesis','Síntese da parte')}</h2>${paragraphs(v.summary)}${v.cycle ? farmCycle(v.cycle,lang) : mechanism(v.steps,lang,t('Bring the relationships together','Relacione os processos'))}${(v.tables||[]).map(table).join('')}<h3>${esc(v.question)}</h3><details><summary>${t('Show a model answer','Ver uma resposta-modelo')}</summary>${paragraphs(v.answer)}</details></section>`;
}

for (const lang of ['en','pt']) {
  const t = (a,b) => lang === 'pt' ? b : a, opposite = lang === 'pt' ? 'en' : 'pt', file = fileFor(lang);
  const introduction = t('Explore Steiner’s conception of the farm as a living individuality, the relationships among soil, plants and animals, the preparations, cosmic rhythms, and how these ideas relate to contemporary agriculture.','Explore a concepção de Steiner da fazenda como individualidade viva, as relações entre solo, plantas e animais, os preparados, os ritmos cósmicos e a relação dessas ideias com a agricultura contemporânea.');
  const body = `<section class="bio-hero"><div class="eyebrow">GA 327 · 1924</div><h1>${esc(text(course,'title',lang))}</h1><p class="bio-subtitle">${esc(text(course,'subtitle',lang))}</p><p class="lead">${esc(text(course,'description',lang))}</p><p>${introduction}</p><div class="bio-actions"><a class="bio-button" href="lessons/01.html">${t('Begin course','Começar o curso')} →</a><a class="bio-button" data-biodynamic-resume href="lessons/01.html">${t('Continue studying','Continuar estudando')} →</a><a class="bio-button" href="practice/index.html">${t('Practice library','Biblioteca de práticas')}</a></div><p data-biodynamic-progress-summary></p></section><section><h2>${t('How the course develops','Como o curso se desenvolve')}</h2><ol class="bio-development">${parts.map(part => `<li>${esc(text(part,'title',lang))}</li>`).join('')}</ol></section><section id="parts"><h2>${t('The six parts','As seis partes')}</h2><div class="bio-grid">${parts.map(part => `<article class="bio-card"><div class="eyebrow">${t('Part','Parte')} ${roman[part.id-1]}</div><h3><a href="parts/${part.slug}.html">${esc(text(part,'title',lang))}</a></h3><p>${esc(part[lang].question)}</p><p>${t('Lessons','Lições')} ${part.lessonIds[0]}–${part.lessonIds.at(-1)}</p><p data-biodynamic-part-progress="${part.id}"></p></article>`).join('')}</div></section><section class="bio-support"><h2>${t('Sources and optional study','Fontes e estudo opcional')}</h2><p><a href="sources.html">${t('Source editions, lecture map and verification','Edições, mapa das palestras e verificação')} →</a></p><p><a href="background.html">${t('Courtney, GA 230 and GA 136: supporting reading','Courtney, GA 230 e GA 136: leituras de apoio')} →</a></p><p><a href="${relative(file,`docs/${lang==='pt'?'pt/':''}agriculture/index.html`)}">${t('Retained complete-lecture reading companion','Curso de leitura integral preservado')} →</a></p></section>`;
  page(file,text(course,'title',lang),body,lang,fileFor(opposite));

  for (const part of parts) {
    const file = partFor(part,lang), v = part[lang];
    const body = `${breadcrumb(file,lang)}<div class="eyebrow">${t('Part','Parte')} ${roman[part.id-1]} ${t('of VI','de VI')}</div><h1>${esc(text(part,'title',lang))}</h1><p class="lead">${esc(v.question)}</p><p><strong>${t('Source lectures','Palestras-fonte')}:</strong> ${esc(v.sources)}</p><h2>${t('What you will learn','O que você aprenderá')}</h2>${list(v.outcomes)}<h2>${t('Lessons','Lições')}</h2><ol start="${part.lessonIds[0]}" class="bio-lesson-list">${part.lessons.map(lesson => `<li data-biodynamic-lesson="${lesson.id}"><h3><a href="${relative(file,lessonFor(lesson.id,lang))}">${esc(text(lesson,'title',lang))}</a></h3><p>${esc(lesson[lang].question)}</p><span data-biodynamic-study-label hidden></span></li>`).join('')}</ol>${synthesis(part,lang)}<nav class="lesson-navigation"><a href="${relative(file,fileFor(lang))}">← ${t('Course contents','Conteúdo do curso')}</a><a href="${relative(file,lessonFor(part.lessonIds[0],lang))}">${t('Begin this part','Começar esta parte')} →</a>${parts[part.id] ? `<a href="${relative(file,partFor(parts[part.id],lang))}">${t('Next part','Próxima parte')} →</a>` : ''}</nav>`;
    page(file,text(part,'title',lang),body,lang,partFor(part,opposite));
  }

  for (const [position,lesson] of lessons.entries()) {
    const file = lessonFor(lesson.id,lang), part = parts.find(part => part.id === lesson.part), v = lesson[lang], previous = lessons[position-1], next = lessons[position+1];
    const headings = {proposal:t('What Steiner is proposing','O que Steiner propõe'),example:t('Agricultural example','Exemplo agrícola'),anthroposophy:t('Anthroposophical interpretation','Interpretação antroposófica'),modernContext:t('Modern agricultural context','Contexto agrícola moderno')};
    const sections = ['proposal','example','anthroposophy','modernContext'].map(key => `<section class="bio-${key}"><h2>${headings[key]}</h2>${paragraphs(v[key])}${key === 'proposal' ? (v.cycle ? farmCycle(v.cycle,lang) : mechanism(v.model,lang,v.modelCaption)) : ''}</section>`).join('');
    const project = v.project ? `<section id="portrait-of-a-living-place"><h2>${esc(v.project.title)}</h2>${paragraphs(v.project.introduction)}${list(v.project.tasks)}<details><summary>${t('An original worked example','Um exemplo comentado original')}</summary>${paragraphs(v.project.model)}</details></section>` : '';
    const body = `${breadcrumb(file,lang,part)}<article><div class="eyebrow">${esc(text(course,'title',lang))} · ${t('Part','Parte')} ${roman[part.id-1]} ${t('of VI','de VI')} · ${t('Lesson','Lição')} ${lesson.id} ${t('of 24','de 24')}</div><h1>${esc(text(lesson,'title',lang))}</h1><section class="bio-question"><h2>${t('Agricultural question','Questão agrícola')}</h2><p class="lead">${esc(v.question)}</p>${paragraphs(v.intro)}</section>${sourceBlock(lesson,lang)}<div class="study-guidebar"><button type="button" class="study-button js-only" data-reading-view aria-pressed="false">${t('Open all study notes','Abrir todas as notas de estudo')}</button></div><section class="study-attempt">${noteField('bio-first','first',t('Your initial explanation of the agricultural question','Sua explicação inicial da questão agrícola'))}${consent(lang)}</section>${sections}${(v.tables||[]).map(table).join('')}<aside class="learning-distinction"><h2>${t('What this does and does not establish','O que isso estabelece e o que não estabelece')}</h2>${paragraphs(v.limits)}</aside>${references(v.modernReferences,lang)}${v.optional?.length ? `<details class="bio-optional" data-deep-study><summary>${t('Optional deeper study','Aprofundamento opcional')}</summary>${v.optional.map(item => `<p><a href="${relative(file,`docs/${lang==='pt'?'pt/':''}${item.route}`)}">${esc(item.title)}</a> · ${esc(item.label)}</p>`).join('')}</details>` : ''}<section class="study-return"><h2>${t('Connect the source to your explanation','Relacione a fonte à sua explicação')}</h2>${noteField('bio-source','source',t('Passage, lecture reference and what it supports or challenges','Trecho, referência à palestra e o que ele apoia ou questiona'))}</section><section id="understanding" class="learning-checks"><h2>${t('Check your understanding','Confira sua compreensão')}</h2>${v.checks.map((check,i) => quiz(check,lang,`biodynamics-${lesson.id}-${i}`)).join('')}<noscript><p>${t('Answer in your own words, then reveal the explanation.','Responda com suas palavras e depois revele a explicação.')}</p></noscript></section>${observation(v.observe,lang)}${project}${notebook(lang)}<section class="learning-continue"><h2>${t('Connection','Ligação')}</h2>${paragraphs(v.connection)}</section>${lesson.id === part.lessonIds.at(-1) ? `<p><a href="${relative(file,partFor(part,lang))}#synthesis">${t('Bring this part together','Relacione as ideias desta parte')} →</a></p>` : ''}</article><nav class="lesson-navigation" aria-label="${t('Lesson navigation','Navegação das lições')}"><a href="${relative(file,previous ? lessonFor(previous.id,lang) : fileFor(lang))}">← ${t('Previous','Anterior')}</a><a href="${relative(file,partFor(part,lang))}">${t('Part contents','Conteúdo da parte')}</a>${next ? `<a href="${relative(file,lessonFor(next.id,lang))}">${t('Next','Próxima')} →</a>` : `<a href="${relative(file,fileFor(lang,'practice/index.html'))}">${t('Continue observing','Continue observando')} →</a>`}</nav>`;
    page(file,text(lesson,'title',lang),body,lang,lessonFor(lesson.id,opposite),lesson.id);
  }

  const practiceFile = fileFor(lang,'practice/index.html');
  const practiceBody = `${breadcrumb(practiceFile,lang)}<h1>${t('Biodynamic practice library','Biblioteca de práticas biodinâmicas')}</h1><p class="lead">${t('Observation tools and concept references for a place you can revisit. These entries explain historical indications; they are not operational preparation or pest-treatment recipes.','Ferramentas de observação e referências conceituais para um lugar que você possa revisitar. Os verbetes explicam indicações históricas; não são receitas operacionais de preparados ou tratamento de pragas.')}</p><p>${t('For hands-on preparation work, use a verified contemporary protocol and guidance from an experienced trainer. Material identity, handling and field conditions require more detail than these historical descriptions.', 'Para fazer preparados na prática, use um protocolo contemporâneo verificado e orientação de uma pessoa experiente. Identificação dos materiais, manejo e condições de campo exigem mais detalhes do que estas descrições históricas.')}</p><p><a href="${relative(practiceFile,fileFor(lang,'sources.html'))}">${t('Source editions and current references','Edições-fonte e referências atuais')} →</a></p><nav aria-label="${t('Practice categories','Categorias de práticas')}">${library.categories.map(category => `<a href="#${category.id}">${esc(text(category,'title',lang))}</a>`).join(' · ')}</nav>${library.categories.map(category => `<section id="${category.id}"><h2>${esc(text(category,'title',lang))}</h2>${category.entries.map(entry => `<article id="${entry.id}" class="bio-library-entry"><h3>${esc(text(entry,'title',lang))}</h3>${paragraphs(entry[lang].observation)}<dl><dt>${t('Steiner’s original indication','Indicação original de Steiner')}</dt><dd>${esc(entry[lang].steiner)}</dd><dt>${t('Later practice','Prática posterior')}</dt><dd>${esc(entry[lang].later)}</dd><dt>${t('Modern evidence','Evidência moderna')}</dt><dd>${esc(entry[lang].evidence)}</dd></dl><p><a href="${relative(practiceFile,lessonFor(entry.lessonId,lang))}">${t('Study the source and explanation','Estude a fonte e a explicação')} →</a></p></article>`).join('')}</section>`).join('')}`;
  page(practiceFile,t('Practice library','Biblioteca de práticas'),practiceBody,lang,fileFor(opposite,'practice/index.html'));

  const sourceFile = fileFor(lang,'sources.html');
  const originalMap = readBiodynamicJSON('agriculture-source-map.json');
  const sourceBody = `${breadcrumb(sourceFile,lang)}<h1>${t('Sources and editions','Fontes e edições')}</h1><h2>${t('Canonical course edition','Edição canônica do curso')}</h2><p>Rudolf Steiner · <cite>${esc(course.canonical.title)}</cite> · GA 327 · ${t('translated by','tradução de')} Catherine E. Creeger ${t('and','e')} Malcolm Gardner · ${t('edited by','edição de')} Malcolm Gardner · Bio-Dynamic Farming and Gardening Association, Inc. · 1993.</p><p>${t('The supplied Markdown records SteinerBooks branding and 1993 title/copyright information. The course uses this captured Creeger/Gardner text as its canonical source.','O Markdown fornecido registra a marca SteinerBooks e informações de título e direitos de 1993. O curso usa esse texto capturado de Creeger/Gardner como fonte canônica.')}</p><h2>${t('Comparison edition','Edição de comparação')}</h2><p>Rudolf Steiner · <cite>${esc(course.comparison.title)}</cite> · GA 327 · George Adams · Rudolf Steiner Press, 2012 · ${t('translation first published in 1958','tradução publicada inicialmente em 1958')}.</p><h2>${t('Locators and verification','Localizadores e verificação')}</h2><p>${t('This course is based on the supplied Markdown editions. Quotations are verified within their assigned captures; capture numbers identify source positions, not printed book pages. All course figures are original teaching diagrams based on the text. The historical book PDFs and their drawings have not been inspected.','Este curso se baseia nas edições Markdown fornecidas. As citações foram verificadas em suas capturas; os números das capturas identificam posições na fonte, não páginas impressas. Todas as figuras do curso são diagramas didáticos originais baseados no texto. Os PDFs históricos e seus desenhos não foram inspecionados.')}</p><p>${t('The canonical witness contains 192 supplied Markdown captures; Adams contains 178. These are separate digital capture sequences, not matching printed page numbers. All eight lectures and four discussions are present. The 1993 export ends during its bibliography, before the remaining bibliography, index and colour plates. Its diagrams and handwritten material cannot be authenticated through OCR.','A versão canônica contém 192 capturas do Markdown fornecido; a de Adams contém 178. São sequências distintas de capturas digitais, não números coincidentes de páginas impressas. Todas as oito palestras e quatro discussões estão presentes. A exportação de 1993 termina durante a bibliografia, antes do restante da bibliografia, índice e pranchas coloridas. Seus diagramas e manuscritos não podem ser autenticados pelo OCR.')}</p><p>${t('Portuguese passages are course study translations of the canonical English excerpts. Original explanation diagrams are labelled separately from historical drawings. The six parts and 24 lessons are a course arrangement, not Steiner’s lecture divisions.','Os trechos portugueses são traduções de estudo dos trechos ingleses canônicos. Os diagramas didáticos originais são identificados separadamente dos desenhos históricos. As seis partes e 24 lições são uma organização didática, não divisões das palestras de Steiner.')}</p><h2>${t('The eight lectures','As oito palestras')}</h2>${table({caption:t('GA 327 source sequence','Sequência de fontes de GA 327'),headers:[t('Lecture','Palestra'),t('Date','Data'),t('Canonical Markdown captures','Capturas do Markdown canônico')],rows:originalMap.lectures.map(row => [String(row.number),row.date,`${row.creeger.first}–${row.creeger.last}`])})}<h2>${t('Discussion and additional material','Discussões e material adicional')}</h2>${table({caption:t('Additional source contexts','Contextos adicionais das fontes'),headers:[t('Section','Seção'),t('Date','Data'),t('Canonical captures','Capturas canônicas')],rows:[...originalMap.discussions.map(row=>[t(`Discussion ${row.number}`,`Discussão ${row.number}`),row.date,`${row.creeger.first}–${row.creeger.last}`]),[t('Experimental Circle address','Discurso ao Círculo Experimental'),'1924-06-11','142–148'],[t('Report to Society members','Relato aos membros da Sociedade'),'1924-06-20','9–17']]})}<p>${t('The report, address, forewords, remembered supplements and editorial notes have separate contexts and authorship. They are not extra Koberwitz lectures.','O relato, discurso, prefácios, suplementos de memória e notas editoriais têm contextos e autorias separados. Não são palestras adicionais de Koberwitz.')}</p><h2>${t('Modern reference register','Registro de referências modernas')}</h2>${references(modern.sources.map(source=>source.id),lang)}${modern.optionalReadings?.length ? `<h2>${t('Optional research papers','Artigos de pesquisa opcionais')}</h2><p>${t('These corrected bibliographic leads are retained for further reading. Their full texts were not reviewed and they do not support this course’s research claims.','Estas indicações bibliográficas corrigidas são mantidas para leitura posterior. Seus textos completos não foram revisados e não fundamentam as afirmações de pesquisa deste curso.')}</p>${references(modern.optionalReadings.map(source=>source.id),lang)}` : ''}<p><a href="https://rsarchive.org/Lectures/GA327/">${t('Steiner Archive: secondary verification source','Steiner Archive: fonte secundária de verificação')}</a></p>`;
  page(sourceFile,t('Sources and editions','Fontes e edições'),sourceBody,lang,fileFor(opposite,'sources.html'));

  const backgroundFile = fileFor(lang,'background.html');
  const routes = [
    ['what-is-biodynamics/lessons/01.html',t('Hugh Courtney’s introduction','Introdução de Hugh Courtney'),t('Secondary commentary and historical orientation; it does not supply Steiner’s own lecture wording.','Comentário secundário e orientação histórica; não fornece a redação das palestras de Steiner.')],
    ['what-is-biodynamics/chapters/elementals-elementals-1.html',t('GA 230: elemental beings','GA 230: seres elementais'),t('Optional after plant development in lesson 7. Study the author’s spiritual interpretation separately from field observations.','Opcional após o desenvolvimento vegetal na lição 7. Estude a interpretação espiritual do autor separadamente das observações de campo.')],
    ['what-is-biodynamics/chapters/spiritual-beings-spiritual-1.html',t('GA 136: spiritual beings','GA 136: seres espirituais'),t('Optional cosmological background; GA 327 governs the new course sequence.','Contexto cosmológico opcional; GA 327 orienta a nova sequência do curso.')],
    ['what-is-biodynamics/index.html',t('The retained anthology','A antologia preservada'),t('The source collection retains its distinct authors, translations and lecture references.','A coleção de fontes conserva seus diferentes autores, traduções e referências às palestras.')],
    ['agriculture/index.html',t('Full lecture reading companion','Curso de leitura integral'),t('The eighteen-reading companion preserves every former source-reading URL and its original assignments.','O curso complementar de dezoito leituras preserva todos os URLs das leituras-fonte anteriores e suas indicações originais.')]
  ];
  const backgroundBody = `${breadcrumb(backgroundFile,lang)}<h1>${t('Optional Anthroposophical background','Contexto antroposófico opcional')}</h1><p>${t('Begin with the agricultural question and GA 327. These retained materials deepen particular questions after soil, plants and the farm have been introduced.','Comece pela questão agrícola e por GA 327. Estes materiais preservados aprofundam questões específicas depois da introdução do solo, das plantas e da fazenda.')}</p>${routes.map(([route,title,description]) => `<section><h2><a href="${relative(backgroundFile,`docs/${lang==='pt'?'pt/':''}${route}`)}">${esc(title)}</a></h2><p>${esc(description)}</p></section>`).join('')}`;
  page(backgroundFile,t('Optional background','Contexto opcional'),backgroundBody,lang,fileFor(opposite,'background.html'));
}
const {linkBiodynamicCourse}=await import('./link-biodynamic-course.mjs');
linkBiodynamicCourse({docsDir:output});
console.log(`Built private=${draft}: ${lessons.length} paired Biodynamic Agriculture lessons, six parts, practice library and source/background pages.`);
