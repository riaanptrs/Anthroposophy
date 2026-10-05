import fs from 'node:fs';
import path from 'node:path';
import {esc, shell, wholeElement} from './learning-html.mjs';
import {renderCourseArtwork, renderIdentityHero} from './visual-identity.mjs';

export const platformSite = JSON.parse(fs.readFileSync(new URL('../content/platform-site.json', import.meta.url), 'utf8'));
const areas = new Set(platformSite.destinations.map(item => item.id));
const slugPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const copy = (lang, en, pt) => lang === 'pt' ? pt : en;
const locale = lang => {
  if (!platformSite.languages.includes(lang)) throw new Error(`Unsupported platform language: ${lang}`);
  return lang;
};

// All renderers receive logical docs/ paths even when files are written to an
// isolated preview tree. Relative links therefore work both at / and below a
// GitHub Pages repository prefix.
function localRoute(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || /[?#\u0000]/.test(value)) throw new Error('Invalid platform page route');
  const route = value.replace(/^docs\//, '');
  if (route.startsWith('/') || route.split('/').some(part => !part || part === '.' || part === '..') || !/^[a-zA-Z0-9/_-]+\.html$/.test(route)) throw new Error(`Invalid platform page route: ${value}`);
  return route;
}
const withoutLanguage = route => route.replace(/^pt\//, '');
const logical = (route, lang) => `docs/${lang === 'pt' ? 'pt/' : ''}${localRoute(route)}`;
function href(file, route, lang) {
  const from = localRoute(file), to = localRoute(logical(route, locale(lang)));
  return path.posix.relative(path.posix.dirname(from), to) || path.posix.basename(to);
}
function link(file, route, label, lang, attributes = '') {
  return `<a${attributes ? ` ${attributes}` : ''} href="${esc(href(file, route, lang))}">${esc(label)}</a>`;
}
function localized(item, lang, key, fallback = '') {
  return item?.[lang]?.[key] ?? item?.[`${key}${lang === 'pt' ? 'Pt' : 'En'}`] ?? fallback;
}

export function platformNav(file, lang, area = null) {
  locale(lang);
  localRoute(file);
  if (area !== null && !areas.has(area)) throw new Error(`Invalid primary platform area: ${area}`);
  return `<nav class="system-nav" data-platform-nav aria-label="${copy(lang, 'Main navigation', 'Navegação principal')}">${platformSite.destinations.map(item => link(file, item.route, item[lang], lang, area === item.id ? 'aria-current="page"' : '')).join('')}</nav>`;
}

export function platformSupportNav(file, lang) {
  locale(lang);
  const route = withoutLanguage(localRoute(file));
  return `<nav class="platform-support-nav" data-platform-support aria-label="${copy(lang, 'Further study', 'Estudo complementar')}">${platformSite.supportingDestinations.map(item => link(file, item.route, item[lang], lang, route.startsWith(`${item.id}/`) ? 'aria-current="page"' : '')).join('')}</nav>`;
}

export function platformArea(route, html = '') {
  const local = withoutLanguage(localRoute(route));
  let area = null;
  if (/^(?:read|books|lessons)\//.test(local)) area = 'read';
  else if (/^(?:concepts|reference)\//.test(local)) area = 'concepts';
  else if (/^practice\//.test(local)) area = 'practice';
  else if (/^(?:learn|introduction-to-anthroposophy|nutrition)\//.test(local)) area = 'learn';
  else if (/^theosophy\/(?:chapters\/|source-notes\.html$)/.test(local)) area = 'read';
  else if (local.startsWith('theosophy/')) area = 'learn';
  else {
    const collection = platformSite.collections.find(item => local.startsWith(`${item.id}/`));
    if (collection) area = collection.area;
  }
  // A page may declare its area for an independent integration check, but the
  // declaration cannot turn a source guide into a conceptual lesson (or vice versa).
  const declarations = [...String(html).matchAll(/\bdata-platform-area=["']([^"']*)["']/g)].map(match => match[1]);
  for (const declared of declarations) {
    const expected = area ?? 'support';
    if (declared !== expected && !(local === 'index.html' && declared === 'home')) throw new Error(`Platform area conflicts with route ${local}: ${declared}`);
  }
  return area;
}

function semanticRoute(item, prefix) {
  const slug = item?.slug ?? item?.id;
  if (typeof slug !== 'string' || !slugPattern.test(slug)) throw new Error(`Invalid ${prefix} identifier: ${slug}`);
  return `${prefix}/${slug}.html`;
}
function rebase(html, from, to) {
  return html.replace(/\b(href|src)="([^"]+)"/g, (all, attribute, url) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return all;
    const match = url.match(/^([^?#]*)([?#].*)?$/), resource = match[1], suffix = match[2] || '';
    if (!resource) return all;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(from), resource));
    if (!target.startsWith('docs/')) throw new Error(`Foundation link leaves docs: ${url}`);
    return `${attribute}="${esc(path.posix.relative(path.posix.dirname(to), target) || path.posix.basename(target))}${suffix}"`;
  });
}
// These labels describe subjects, not spiritual correspondences assigned to
// the decorative colours and symbols. The source credits stay on every entry.
const courseThemes = {
  foundations: ['Foundations', 'Fundamentos'],
  'introduction-to-anthroposophy': ['Foundations', 'Fundamentos'],
  theosophy: ['The human being', 'O ser humano'],
  'philosophy-of-freedom': ['Thinking and freedom', 'Pensar e liberdade'],
  'higher-worlds': ['Inner development', 'Desenvolvimento interior'],
  'according-to-luke': ['Christianity', 'Cristianismo'],
  colour: ['Colour and art', 'Cor e arte'],
  temperaments: ['Human relationships', 'Relações humanas'],
  'mystery-temperaments': ['Human relationships', 'Relações humanas'],
  'understand-temperament': ['Human relationships', 'Relações humanas'],
  'understanding-temperaments': ['Human relationships', 'Relações humanas'],
  'ancient-myths': ['Myth and consciousness', 'Mito e consciência'],
  agriculture: ['Nature and agriculture', 'Natureza e agricultura'],
  'what-is-biodynamics': ['Nature and agriculture', 'Natureza e agricultura'],
  biodynamics: ['Nature and agriculture', 'Natureza e agricultura'],
  'toward-threefold-society': ['Society', 'Sociedade'],
  'encountering-the-self': ['Education', 'Educação'],
  'practical-thinking': ['Thinking practice', 'Prática do pensar'],
  meditation: ['Inner development', 'Desenvolvimento interior']
};
function courseTheme(item, lang) {
  const theme = courseThemes[item.id];
  return theme ? `<p class="identity-course-theme">${esc(copy(lang, ...theme))}</p>` : '';
}
function card(file, item, lang, route = item.route, {artwork = true} = {}) {
  const title = localized(item, lang, 'title', item.id);
  const text = `${artwork ? courseTheme(item, lang) : ''}<h3>${link(file, route, title, lang)}</h3><p>${esc(localized(item, lang, 'description'))}</p><p class="platform-credit">${esc(localized(item, lang, 'credit'))}</p>`;
  return `<article class="platform-card learning-card${artwork ? ' identity-course-card' : ''}">${artwork ? renderCourseArtwork(file, item.id) + `<div class="identity-course-copy">${text}</div>` : text}</article>`;
}
function cardSection(file, id, title, entries, lang, routeFor = item => item.route, {artwork = true} = {}) {
  const contents = entries.length <= 3
    ? `<div class="platform-grid learning-grid">${entries.map(item => card(file, item, lang, routeFor(item), {artwork})).join('')}</div>`
    : `<ul class="platform-directory">${entries.map(item => {
      const text = `${artwork ? courseTheme(item, lang) : ''}<h3>${link(file, routeFor(item), localized(item, lang, 'title', item.id), lang)}</h3><p>${esc(localized(item, lang, 'description'))}</p><p class="platform-credit">${esc(localized(item, lang, 'credit'))}</p>`;
      return `<li${item.id === 'agriculture' ? ' id="biodynamic-source-companions"' : ''}${artwork ? ' class="identity-directory-course"' : ''}>${artwork ? renderCourseArtwork(file, item.id) + `<div class="identity-directory-copy">${text}</div>` : text}</li>`;
    }).join('')}</ul>`;
  return `<section id="${esc(id)}" aria-labelledby="${esc(id)}-heading"><h2 id="${esc(id)}-heading">${esc(title)}</h2>${contents}</section>`;
}
function indexedSection(file, id, title, entries, lang, prefix, field) {
  if (!entries.length) return '';
  const detailField = prefix === 'concepts' ? 'definition' : 'purpose';
  return `<section id="${esc(id)}"><h2>${esc(title)}</h2><ul class="platform-directory">${entries.map(item => `<li><h3>${link(file, semanticRoute(item, prefix), localized(item, lang, field, item.id), lang)}</h3><p>${esc(localized(item, lang, 'summary', localized(item, lang, 'description', localized(item, lang, detailField, localized(item, lang, 'question')))))}</p></li>`).join('')}</ul></section>`;
}

/** Generate platform hubs only; conceptual course/lesson authorship has a separate owner. */
export function buildPlatformArchitecture({course = {}, lessons = [], concepts = [], practices = [], renderPage = shell, docsDir = 'docs'} = {}) {
  if (![lessons, concepts, practices].every(Array.isArray) || typeof renderPage !== 'function') throw new Error('Invalid platform architecture inputs');
  const output = path.resolve(docsDir), pages = [];
  const physical = file => {
    const route = localRoute(file), target = path.resolve(output, route);
    if (!target.startsWith(output + path.sep)) throw new Error('Platform output leaves docsDir');
    return target;
  };
  const emit = (file, title, body, lang, role, description = '') => {
    const route = localRoute(file), partner = logical(withoutLanguage(route), lang === 'pt' ? 'en' : 'pt');
    let html = renderPage(file, title, body, lang, {partner, description, role});
    if (typeof html !== 'string' || !html.includes('</header>') || !html.includes('</footer>')) throw new Error(`Platform renderer returned an incomplete shell: ${file}`);
    // Custom components may already use this navigation. Replace it deliberately
    // so fallback and integrated renderers have the same exact four-link contract.
    html = html.replace(/<nav\b[^>]*\bclass="[^"]*\bsystem-nav\b[^"]*"[^>]*>[\s\S]*?<\/nav>/g, '');
    html = html.replace('</header>', `${platformNav(file, lang, platformArea(file))}</header>`);
    if (!html.includes('data-platform-support')) html = html.replace('</footer>', `${platformSupportNav(file, lang)}</footer>`);
    const target = physical(file);
    fs.mkdirSync(path.dirname(target), {recursive:true});
    fs.writeFileSync(target, html);
    pages.push(route);
  };

  // Capture both old beginner indexes before replacing either hub. On a repeated
  // invocation, prefer a fresh legacy index and otherwise reuse the actual clone.
  const foundationBodies = new Map();
  for (const lang of platformSite.languages) {
    const original = logical('learn/index.html', lang), clone = logical(platformSite.foundations.route, lang);
    let source, html;
    for (const candidate of [original, clone]) {
      const file = physical(candidate);
      if (!fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, 'utf8');
      if (platformSite.foundations.partAnchors.every(id => text.includes(`id="${id}"`)) && text.includes('data-learning-progress="01"')) {
        source = candidate; html = text; break;
      }
    }
    if (!html) throw new Error(`Missing preserved 36-lesson Foundations contents: ${lang}`);
    let body = wholeElement(html, '<main').replace(/^<main\b[^>]*>/, '').replace(/<\/main>$/, '');
    body = rebase(body, source, clone);
    body = body.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/, `<h1>${copy(lang, 'Foundations of Anthroposophy', 'Fundamentos da antroposofia')}</h1>`);
    foundationBodies.set(lang, body);
  }

  const collections = platformSite.collections;
  const theosophy = {...collections.find(item => item.id === 'theosophy')};
  for (const lang of platformSite.languages) theosophy[lang] = {...theosophy[lang], title:localized(course, lang, 'title', theosophy[lang].title)};

  for (const lang of platformSite.languages) {
    const t = (en, pt) => copy(lang, en, pt), home = logical('index.html', lang), learn = logical('learn/index.html', lang);
    const conceptsFile = logical('concepts/index.html', lang), practice = logical('practice/index.html', lang), read = logical('read/index.html', lang);
    const intro = t('Understand Rudolf Steiner’s ideas through clear courses, thoughtful observation and everyday practice.', 'Compreenda as ideias de Rudolf Steiner por meio de cursos claros, observação atenta e prática cotidiana.');
    const entries = [
      {route:platformSite.foundations.route, title:t('New to Anthroposophy', 'Começando na antroposofia'), text:t('Follow a guided introduction to the central questions.', 'Siga uma introdução guiada às questões centrais.')},
      {route:'learn/index.html', title:t('Choose a course', 'Escolha um curso'), text:t('Develop one subject through connected lessons.', 'Desenvolva um tema por meio de lições relacionadas.')},
      {route:'concepts/index.html', title:t('Explore a concept', 'Explore um conceito'), text:t('Find a clear explanation and follow its relationships.', 'Encontre uma explicação clara e acompanhe suas relações.')}
    ];
    const featured = [theosophy, ...['philosophy-of-freedom', 'higher-worlds'].map(id => collections.find(item => item.id === id))];
    const hero = `<section class="platform-hero learning-hero identity-home-hero" id="intro">
      <div class="identity-hero-copy">
        <p class="identity-eyebrow">${t('Ideas · Observation · Practice', 'Ideias · Observação · Prática')}</p>
        <h1>${t('Learn <span>Anthroposophy</span>', 'Aprenda <span>antroposofia</span>')}</h1>
        <p class="lead">${esc(intro)}</p>
        <div class="identity-hero-actions">${link(home, platformSite.foundations.route, t('Start here', 'Comece aqui'), lang, 'class="identity-primary-action"')}${link(home, 'learn/index.html', t('Explore courses', 'Explore os cursos'), lang)}</div>
      </div>
      ${renderIdentityHero(home)}
    </section>
    <section id="path" aria-labelledby="entry-heading">
      <h2 id="entry-heading">${t('Where would you like to begin?', 'Por onde você gostaria de começar?')}</h2>
      <div class="identity-entry-paths">${entries.map(item => `<article class="identity-entry-path"><h3>${link(home, item.route, item.title, lang)}</h3><p>${esc(item.text)}</p></article>`).join('')}</div>
    </section>
    <section id="courses">
      <div class="identity-section-heading"><h2>${t('Explore the ideas', 'Explore as ideias')}</h2>${link(home, 'learn/index.html', t('All courses', 'Todos os cursos'), lang)}</div>
      <div class="platform-grid learning-grid identity-featured-courses">${featured.map(item => card(home, item, lang)).join('')}</div>
    </section>
    <section id="study-guide" class="learning-method identity-study-method">
      <h2>${t('Understand an idea, then work with it', 'Compreenda uma ideia e depois trabalhe com ela')}</h2>
      <p>${t('Begin with a familiar experience. Build the concept, keep its important distinctions, and try an appropriate exercise. The source references are there when you want to read further.', 'Comece por uma experiência familiar. Desenvolva o conceito, conserve suas distinções importantes e experimente um exercício adequado. As referências às fontes estão disponíveis quando você quiser aprofundar a leitura.')}</p>
      <p>${link(home, 'practice/index.html', t('Find a practice', 'Encontre uma prática'), lang)} · ${link(home, 'read/index.html', t('Read Steiner with commentary', 'Leia Steiner com comentários'), lang)}</p>
    </section>
    <section id="lessons"><p>${link(home, 'read/theosophy/index.html', t('Read Theosophy in its source sequence', 'Leia Teosofia na sequência da fonte'), lang)}</p></section>`;
    const introductionLink = `<p id="introduction-course">${link(home, 'introduction-to-anthroposophy/index.html', t('Explore the Introduction to Anthroposophy', 'Conheça a Introdução à Antroposofia'), lang)}</p>`;
    emit(home, t('Learn Anthroposophy', 'Aprenda antroposofia'), hero + introductionLink, lang, 'home', intro);

    const beginner = collections.filter(item => item.group === 'beginner');
    const learnBody = `<h1>${t('Learn Anthroposophy', 'Aprenda antroposofia')}</h1><p class="lead">${t('Choose a connected course and develop its ideas through questions, explanations and practice.', 'Escolha um curso conectado e desenvolva suas ideias por meio de perguntas, explicações e práticas.')}</p><p>${t('If you are new to Anthroposophy, start with Foundations. The Introduction offers a different seven-part overview. Theosophy develops one work’s central concepts; its detailed reading commentary is available separately.', 'Se você está começando na antroposofia, comece pelos Fundamentos. A Introdução oferece outra visão geral em sete partes. Teosofia desenvolve os conceitos centrais de uma obra; seus comentários detalhados de leitura estão disponíveis separadamente.')}</p>${cardSection(learn, 'beginner-courses', t('Begin with the foundations', 'Comece pelos fundamentos'), beginner, lang)}${cardSection(learn, 'conceptual-courses', t('Develop the ideas of a work', 'Desenvolva as ideias de uma obra'), [theosophy], lang)}${cardSection(learn, 'other-courses', t('Continue with an existing course', 'Continue com um curso existente'), collections.filter(item => item.group !== 'beginner' && item.id !== 'theosophy'), lang)}<section class="platform-foundation-parts"><h2>${t('Return to a Foundations part', 'Retome uma parte dos Fundamentos')}</h2><ol>${platformSite.foundations.partAnchors.map((id, i) => `<li id="${id}">${link(learn, platformSite.foundations.route, t(`Part ${i + 1}`, `Parte ${i + 1}`), lang).replace(/href="([^"]+)"/, `href="$1#${id}"`)}</li>`).join('')}</ol></section>`;
    const nutritionCourse = `<section id="nutrition-course"><h2>${t('Study nutrition in Steiner’s book', 'Estude a nutrição na obra de Steiner')}</h2><h3>${link(learn, 'nutrition/index.html', t('Nutrition: Food, Health and Spiritual Development', 'Nutrição: alimentação, saúde e desenvolvimento espiritual'), lang)}</h3><p>${t('Read all twelve chapters through sixteen guided lessons, an orientation and a final synthesis. Short excerpts, concept explanations, multiple-choice feedback and written responses. The complete course is in English.', 'Leia os doze capítulos em dezesseis lições guiadas, com uma orientação e uma síntese final. Excertos, explicações, questões de múltipla escolha e respostas descritivas. O curso completo está em inglês.')}</p></section>`;
    emit(learn, t('Courses — Learn Anthroposophy', 'Cursos — Aprenda antroposofia'), learnBody + nutritionCourse, lang, 'hub');
    emit(logical(platformSite.foundations.route, lang), t('Foundations of Anthroposophy', 'Fundamentos da antroposofia'), foundationBodies.get(lang), lang, 'course');

    const conceptBody = `<h1>${t('Explore Concepts', 'Explorar conceitos')}</h1><p class="lead">${t('Begin with an idea you want to understand. Follow its relationships, examples and source context.', 'Comece por uma ideia que você deseja compreender. Acompanhe suas relações, exemplos e contexto nas fontes.')}</p>${indexedSection(conceptsFile, 'theosophy-concepts', t('Concepts in Theosophy', 'Conceitos em Teosofia'), concepts, lang, 'concepts', 'term')}<section><h2>${t('The human being: compare the terminology', 'O ser humano: compare a terminologia')}</h2><p>${t('The illustrated reference compares physical, etheric and astral bodies, the I, life and inward experience.', 'A referência ilustrada compara os corpos físico, etérico e astral, o eu, a vida e a experiência interior.')}</p><p>${link(conceptsFile, 'reference/human-constitution.html', t('Open the human-being reference', 'Abra a referência sobre o ser humano'), lang)}</p></section><p>${link(conceptsFile, 'theosophy/index.html', t('Follow these ideas in the Theosophy course', 'Acompanhe essas ideias no curso de Teosofia'), lang)} · ${link(conceptsFile, 'themes/index.html', t('Explore applications by theme', 'Explore aplicações por tema'), lang)}</p>`;
    emit(conceptsFile, t('Explore Concepts', 'Explorar conceitos'), conceptBody, lang, 'hub');

    const practiceBody = `<h1>${t('Practice', 'Praticar')}</h1><p class="lead">${t('Work with an idea through attention, observation or a considered action. Choose an exercise that fits your question and return to its course context.', 'Trabalhe com uma ideia por meio da atenção, da observação ou de uma ação refletida. Escolha um exercício adequado à sua pergunta e retorne ao contexto do curso.')}</p><p>${t('Practices are voluntary. You can reflect aloud, use your own notebook or keep a local note where a course offers that option.', 'As práticas são voluntárias. Você pode refletir em voz alta, usar seu próprio caderno ou guardar uma nota local quando o curso oferece essa opção.')}</p>${indexedSection(practice, 'theosophy-practices', t('Practices connected to Theosophy', 'Práticas relacionadas à Teosofia'), practices, lang, 'practice', 'title')}${cardSection(practice, 'practice-courses', t('Courses with ongoing practice', 'Cursos com prática contínua'), collections.filter(item => item.group === 'applied'), lang)}<section><h2>${t('Observation and artistic work', 'Observação e trabalho artístico')}</h2><ul><li>${link(practice, 'colour/lessons/01.html', t('Observe colour and compare what you remember', 'Observe a cor e compare o que você lembra'), lang)}</li><li>${link(practice, 'encountering-the-self/lessons/15.html', t('Explore form drawing in its educational source context', 'Explore o desenho de formas em seu contexto educacional na fonte'), lang)}</li><li>${link(practice, 'biodynamics/practice/index.html', t('Use the biodynamic observation library', 'Use a biblioteca de observação biodinâmica'), lang)}</li></ul></section>`;
    emit(practice, t('Practice', 'Praticar'), practiceBody, lang, 'hub');

    const readBody = file => `<h1>${t('Read Steiner', 'Ler Steiner')}</h1><p class="lead">${t('Follow a source argument in its original sequence, with selected passages, reading assignments and detailed commentary.', 'Acompanhe um argumento na sequência da fonte, com trechos selecionados, indicações de leitura e comentários detalhados.')}</p><p>${t('Each guide identifies its edition and the material it covers. Translators, introductions and later interpretations keep their own credits.', 'Cada guia identifica sua edição e o material estudado. Tradutores, introduções e interpretações posteriores conservam suas próprias atribuições.')}</p><section id="nutrition-reading"><h2>${t('Nutrition: a source-led anthology course', 'Nutrição: curso de leitura da antologia')}</h2><p>${link(file, 'nutrition/index.html', t('Read all twelve chapters of Nutrition', 'Leia os doze capítulos de Nutrition'), lang)} — ${t('short passages, explanations, comprehension checks and a complete supplied-page map. Full lessons are in English.', 'excertos, explicações, perguntas e mapa de todas as capturas fornecidas. As lições completas estão em inglês.')}</p></section>${cardSection(file, 'steiner-reading', t('Books and lectures by Rudolf Steiner', 'Livros e palestras de Rudolf Steiner'), collections.filter(item => item.group === 'steiner'), lang, item => item.readingRoute || item.route, {artwork:false})}${cardSection(file, 'related-authors', t('Related authors and anthologies', 'Autores relacionados e antologias'), collections.filter(item => item.group === 'related'), lang, item => item.route, {artwork:false})}${cardSection(file, 'applied-reading', t('Sources and study within practical courses', 'Fontes e estudo em cursos práticos'), collections.filter(item => item.group === 'applied'), lang, item => item.route, {artwork:false})}<p>${link(file, 'research/index.html', t('Consult source notes and edition records', 'Consulte notas de fontes e registros das edições'), lang)}</p>`;
    emit(read, t('Read Steiner', 'Ler Steiner'), readBody(read), lang, 'hub');
    const books = logical('books/index.html', lang);
    emit(books, t('Read Steiner', 'Ler Steiner'), readBody(books), lang, 'hub');
  }
  return {pages, routes:[...pages], collections:collections.length, conceptualLessons:lessons.length, concepts:concepts.length, practices:practices.length};
}
