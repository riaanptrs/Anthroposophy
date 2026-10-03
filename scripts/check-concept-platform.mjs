import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {loadConceptCourse} from '../content/theosophy-concept-course.mjs';
import {conceptPlatformRoutes, isConceptPlatformOwned} from './concept-platform-owned.mjs';
import {platformArea, platformNav, platformSite} from './platform-architecture.mjs';
import {esc, wholeElement} from './learning-html.mjs';

// This check needs the final authored model. It never writes or builds pages.
// --model-only validates authoring before a public build; --docs-dir accepts an
// isolated completed output tree without changing logical docs/ route semantics.
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argumentsList = process.argv.slice(2);
let docsDir = path.join(repository, 'docs'), modelOnly = false;
for (let i = 0; i < argumentsList.length; i++) {
  if (argumentsList[i] === '--model-only') modelOnly = true;
  else if (argumentsList[i] === '--docs-dir' && argumentsList[i + 1]) docsDir = path.resolve(argumentsList[++i]);
  else throw new Error(`Unknown or incomplete argument: ${argumentsList[i]}`);
}
const languages = ['en', 'pt'];
const nonempty = value => typeof value === 'string' && Boolean(value.trim());
const requireText = (value, message) => assert.ok(nonempty(value), message);
const requireTexts = (value, message, min = 1, max = Infinity) => {
  assert.ok(Array.isArray(value) && value.length >= min && value.length <= max && value.every(nonempty), message);
};
const attribute = (tag, name) => tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'))?.[2];
const unescape = text => String(text).replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, entity) => ({amp:'&', lt:'<', gt:'>', quot:'"', '#39':"'", nbsp:' '}[entity]));
const plain = html => unescape(String(html).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const visible = (html, text, label) => assert.ok(plain(html).includes(plain(esc(text))), label);
const at = (html, marker, label = marker) => {
  const position = html.indexOf(marker);
  assert.ok(position >= 0, `Missing ${label}`);
  const start = html.lastIndexOf('<', position), end = html.indexOf('>', position);
  assert.ok(start >= 0 && end > start, `Invalid element ${label}`);
  const opening = html.slice(start, end + 1);
  return {position:start, opening, html:wholeElement(html.slice(start), opening)};
};
const section = (html, name, label) => at(html, `data-concept-section="${name === 'source-end' ? 'sources' : name}"`, `${label}: ${name}`);
const localFile = route => path.join(docsDir, route);
const routeFor = (route, lang) => `${lang === 'pt' ? 'pt/' : ''}${route}`;
const sameSet = (actual, expected, label) => assert.deepEqual([...actual].sort(), [...expected].sort(), label);
const hashes = value => crypto.createHash('sha256').update(value).digest('hex');
const nativeNotes = (html, question, notes, label) => {
  visible(html, question, `${label}: native reflection question`);
  const details = [...html.matchAll(/<details\b[^>]*>/gi)].map(match => ({position:match.index, opening:match[0], html:wholeElement(html.slice(match.index), match[0])}));
  const questionPosition = html.indexOf(esc(question));
  assert.ok(questionPosition >= 0, `${label}: authored reflection question is rendered directly`);
  const answer = details.find(item => item.position + item.html.length > questionPosition);
  assert.ok(answer && notes.every(note => plain(answer.html).includes(plain(esc(note)))), `${label}: the question's native disclosure contains its own notes`);
  assert.ok(answer, `${label}: all course notes must be present in native details`);
  assert.ok(!/\sopen(?:\s|=|>)/i.test(answer.opening), `${label}: answer is initially optional`);
  assert.ok(/<summary\b[^>]*>\s*[\s\S]*?\S[\s\S]*?<\/summary>/i.test(answer.html), `${label}: named native answer disclosure`);
};
function authoredGuards(value, label) {
  if (Array.isArray(value)) return value.forEach((entry, i) => authoredGuards(entry, `${label}[${i}]`));
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!/^(?:quotes?|quoteEn|quotePt|excerpt(?:En|Pt)?|selectedExcerpt|sourceAssignments|quiz|checks|score|answerIndex)$/i.test(key), `${label}: unsupported copied passage or graded payload ${key}`);
    authoredGuards(child, `${label}.${key}`);
  }
}
function validateModel(model) {
  const {course, lessons, concepts, practices, readingCourse} = model;
  assert.deepEqual(platformSite.destinations.map(item => item.id), ['learn', 'concepts', 'practice', 'read'], 'The four primary platform areas');
  assert.deepEqual(platformSite.languages, languages, 'Complete bilingual platform');
  assert.equal(course.modules.length, 5, 'Five conceptual modules from the full source audit');
  assert.ok(lessons.length > 0 && concepts.length > 0 && practices.length > 0, 'Authored teaching, concepts and everyday practices');
  authoredGuards(lessons, 'teaching'); authoredGuards(concepts, 'concepts'); authoredGuards(practices, 'practices');

  // Bounds/graph resolution are checked by loadConceptCourse. Coverage here is a
  // separate requirement: a valid set of partial references is not a full course.
  const sources = lessons.flatMap(lesson => lesson.sources);
  const coveredReadings = new Set(sources.flatMap(source => source.readingIds));
  sameSet(coveredReadings, new Set(readingCourse.order.filter(id => id !== 22)), 'Every original reading context, including the introduction, supports the new curriculum');
  for (const chapter of readingCourse.source.chapters) {
    const ranges = sources.filter(source => source.chapter === chapter.number).map(source => source.captures);
    const missing = [];
    for (let capture = chapter.captures[0]; capture <= chapter.captures[1]; capture++) {
      if (!ranges.some(([first, last]) => capture >= first && capture <= last)) missing.push(capture);
    }
    assert.deepEqual(missing, [], `All verified primary captures covered in chapter ${chapter.number}`);
  }
  assert.equal(readingCourse.source.author, 'Rudolf Steiner');
  assert.equal(readingCourse.source.translator, 'Elizabeth Douglas Shields');
  assert.equal(readingCourse.source.translationYear, 1910);
  assert.equal(readingCourse.source.printedPaginationEstablished, false, 'No invented printed pagination');
  for (const practice of practices) {
    assert.ok(practice.lessonIds.some(id => model.lessonById.get(id)?.practiceId === practice.id), `Practice ${practice.id} has an actual teaching invitation`);
  }
  const synthesis = course.synthesis;
  sameSet(new Set(synthesis.sources.map(source => source.chapter)), new Set([1, 2, 3, 4]), 'Final synthesis covers all four source chapters');
  authoredGuards(synthesis, 'synthesis');
  for (const lang of languages) {
    const copy = synthesis[lang];
    requireText(copy?.title, `Synthesis ${lang} title`); requireText(copy?.question, `Synthesis ${lang} question`);
    assert.equal(copy.bigPicture?.length, 5, `Synthesis ${lang} five conceptual clusters`);
    for (const cluster of copy.bigPicture) {
      requireText(cluster.title, `Synthesis ${lang} cluster title`);
      requireText(cluster.relationship, `Synthesis ${lang} cluster relationship`);
      requireTexts(cluster.conceptIds, `Synthesis ${lang} cluster concepts`);
      assert.equal(new Set(cluster.conceptIds).size, cluster.conceptIds.length, 'Unique cluster concepts');
      for (const id of cluster.conceptIds) assert.ok(model.conceptById.has(id), `Unknown synthesis concept ${id}`);
    }
    requireTexts(copy.takeaways, `Synthesis ${lang} takeaways`, 3);
    assert.equal(copy.reviewQuestions?.length, 10, `Exactly ten native reflection questions in ${lang}`);
    assert.equal(new Set(copy.reviewQuestions.map(item => item.question)).size, 10, `Distinct review questions in ${lang}`);
    for (const [i, question] of copy.reviewQuestions.entries()) {
      requireText(question.question, `Synthesis ${lang} question ${i + 1}`);
      requireTexts(question.notes, `Synthesis ${lang} course notes ${i + 1}`);
    }
    assert.ok(Array.isArray(copy.continuing) && copy.continuing.length > 0, `Synthesis ${lang} continuing study`);
    for (const entry of copy.continuing) {
      requireText(entry.title, 'Continuing title'); requireText(entry.description, 'Continuing purpose');
      assert.ok(/^[a-z][a-z0-9/_-]*\.html(?:#[a-z][a-z0-9_-]*)?$/.test(entry.route), `Local continuing route: ${entry.route}`);
    }
  }
  assert.equal(synthesis.en.reviewQuestions.length, synthesis.pt.reviewQuestions.length, 'Bilingual review-question count');
}
function validateBaseline() {
  const file = path.join(repository, '.sites-runtime/concept-platform/baseline.json');
  if (!fs.existsSync(file)) return {banks:0, retained:0, available:false};
  const baseline = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.ok(baseline.courseBanks && typeof baseline.courseBanks === 'object', 'Baseline contains source-bank hashes');
  for (const [relative, hash] of Object.entries(baseline.courseBanks)) {
    assert.ok(/^content\/[a-z0-9-]+\.json$/.test(relative) && /^[a-f0-9]{64}$/.test(hash), 'Valid private preservation baseline entry');
    const source = path.join(repository, relative);
    assert.ok(fs.existsSync(source), `Preserved source bank ${relative}`);
    assert.equal(hashes(fs.readFileSync(source)), hash, `Unchanged source bank ${relative}`);
  }
  let retained = 0;
  if (!modelOnly) for (const relative of Object.keys(baseline.files || {})) {
    if (!relative.startsWith('docs/')) continue;
    const route = relative.slice(5);
    assert.ok(fs.existsSync(localFile(route)), `Retained public path ${relative}`);
    retained++;
  }
  return {banks:Object.keys(baseline.courseBanks).length, retained, available:true};
}
function validateLinks(html, route, cache) {
  const origin = localFile(route);
  for (const tag of html.matchAll(/<(?:a|link|script|img|source|use)\b[^>]*>/gi)) {
    for (const name of ['href', 'src']) {
      const raw = attribute(tag[0], name);
      if (!raw) continue;
      const url = unescape(raw);
      if (/^(?:https?:|data:|mailto:|tel:)/i.test(url)) continue;
      assert.ok(!/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(url), `${route}: unsupported or prefix-breaking URL ${url}`);
      const [resource, encodedAnchor] = url.split('#');
      let target = resource ? path.resolve(path.dirname(origin), decodeURIComponent(resource.split('?')[0])) : path.resolve(origin);
      assert.ok(target.startsWith(docsDir + path.sep), `${route}: URL leaves public output ${url}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      assert.ok(fs.existsSync(target) && fs.statSync(target).isFile(), `${route}: missing URL ${url}`);
      if (encodedAnchor) {
        const anchor = decodeURIComponent(encodedAnchor);
        const content = cache.get(target) ?? fs.readFileSync(target, 'utf8'); cache.set(target, content);
        assert.ok([...content.matchAll(/\sid=["']([^"']+)["']/g)].some(match => match[1] === anchor), `${route}: missing fragment ${url}`);
      }
    }
  }
}
function validateShell(html, route) {
  const lang = route.startsWith('pt/') ? 'pt' : 'en', logical = `docs/${route}`;
  assert.ok(isConceptPlatformOwned(route, html), `${route}: exact route ownership`);
  assert.match(html, new RegExp(`<html\\b[^>]*\\blang="${lang === 'pt' ? 'pt-BR' : 'en'}"`), `${route}: declared language`);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${route}: one page title`);
  assert.ok(html.includes('concept-platform.css'), `${route}: scoped platform stylesheet`);
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${route}: unique element IDs`);
  for (const tag of html.matchAll(/<[^/!][^>]*>/g)) {
    for (const name of ['aria-labelledby', 'aria-describedby', 'for']) {
      const value = attribute(tag[0], name);
      if (value) for (const id of value.split(/\s+/)) assert.ok(ids.includes(id), `${route}: accessible reference ${name}=${id}`);
    }
  }
  const partner = route.startsWith('pt/') ? route.slice(3) : `pt/${route}`;
  const alternate = [...html.matchAll(/<link\b[^>]*>/gi)].find(match => attribute(match[0], 'rel') === 'alternate' && attribute(match[0], 'hreflang') === (lang === 'pt' ? 'en' : 'pt-BR'));
  assert.ok(alternate, `${route}: language partner`);
  assert.equal(path.resolve(path.dirname(localFile(route)), unescape(attribute(alternate[0], 'href'))), path.resolve(localFile(partner)), `${route}: exact bilingual route partner`);
  assert.ok(!/sediment:\/\/|\/workspace\/|C:\\Users\\|file_[a-f0-9]{16,}|Starting in\s+\d/.test(html), `${route}: private-source noise`);
  const declarations = [...html.matchAll(/data-concept-platform-owned=["']true["']/g)];
  assert.equal(declarations.length, 1, `${route}: single platform ownership declaration`);
  const nav = at(html, 'data-platform-nav', `${route}: global navigation`);
  assert.equal((html.match(/<nav\b[^>]*\bdata-platform-nav(?:\s|=|>)/g) || []).length, 1, `${route}: one global navigation`);
  assert.equal(nav.html, platformNav(logical, lang, platformArea(logical, html)), `${route}: complete four-area navigation and active state`);
  return lang;
}
function validateLesson(html, lesson, lang, model, route) {
  const copy = lesson[lang];
  const order = ['experience', 'central', 'teaching', 'connections', ...(lesson.practiceId ? ['practice'] : []), 'reflection', 'takeaways', ...(copy.deeper.length ? ['deeper'] : []), 'source-end'];
  const sections = new Map(order.map(name => [name, section(html, name, route)]));
  const positions = order.map(name => sections.get(name).position);
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), `${route}: experience-to-source teaching sequence`);
  const actual = [...html.matchAll(/data-concept-section="([^"]+)"/g)].map(match => match[1] === 'sources' ? 'source-end' : match[1]);
  assert.equal(actual.length, new Set(actual).size, `${route}: distinct lesson sections`);
  for (const name of order) assert.ok(actual.includes(name), `${route}: substantive section ${name}`);
  assert.equal(actual.at(-1), 'source-end', `${route}: primary references conclude authored content`);
  assert.equal(actual.includes('practice'), Boolean(lesson.practiceId), `${route}: practice only when authored`);
  assert.equal(actual.includes('deeper'), Boolean(copy.deeper.length), `${route}: deeper study only when authored`);
  visible(html, copy.title, `${route}: authored title`); visible(html, copy.question, `${route}: learning question`);
  for (const text of copy.experience) visible(sections.get('experience').html, text, `${route}: concrete experience`);
  visible(sections.get('central').html, copy.centralIdea, `${route}: central concept`);
  for (const text of copy.explanation) visible(sections.get('teaching').html, text, `${route}: complete concept teaching`);
  visible(html, copy.distinction, `${route}: genuine distinction`);
  for (const edge of lesson.connections) {
    visible(sections.get('connections').html, edge[lang], `${route}: explained connection ${edge.id}`);
    assert.ok(sections.get('connections').html.includes(`concepts/${edge.id}.html`), `${route}: linked concept ${edge.id}`);
  }
  for (const id of lesson.termIds) visible(html, model.conceptById.get(id)[lang].term, `${route}: useful terminology ${id}`);
  if (lesson.practiceId) {
    const practice = model.practiceById.get(lesson.practiceId)[lang], block = sections.get('practice').html;
    visible(block, practice.purpose, `${route}: practice purpose`);
    for (const step of practice.steps) visible(block, step, `${route}: practical step`);
  }
  nativeNotes(sections.get('reflection').html, copy.reflection.question, copy.reflection.notes, route);
  for (const takeaway of copy.takeaways) visible(sections.get('takeaways').html, takeaway, `${route}: takeaway`);
  for (const deeper of copy.deeper) {
    visible(sections.get('deeper').html, deeper.title, `${route}: optional deeper title`);
    for (const text of deeper.paragraphs) visible(sections.get('deeper').html, text, `${route}: optional deeper teaching`);
  }
  const mainElement = at(html, 'id="main"', `${route}: main content`), main = mainElement.html;
  assert.ok(!/<blockquote\b|data-(?:answer|check-answer|retry|score|quiz-feedback)=?|type=["']radio["']|class=["'][^"']*\b(?:learning-quiz|guided-quiz)\b/i.test(main), `${route}: reflection without copied passages or graded quizzes`);
  // "Note 9 points readers to ..." is a source pointer, not a point score.
  assert.ok(!/(?<!\bnote\s)(?<!\bnota\s)\b\d+\s*(?:points?|pontos?)\b|receive full marks|pontuação máxima|correct answer|resposta correta/i.test(plain(main)), `${route}: no scoring or answer verdict`);
  const upstream = html.slice(mainElement.position, sections.get('source-end').position);
  assert.ok(!/PDF\s+captures?|capturas?\s+(?:do\s+)?PDF|assigned reading|source-assignment|read\s+captures?|leia\s+as?\s+capturas/i.test(plain(upstream)), `${route}: source assignments follow the lesson`);
  validateSources(sections.get('source-end').html, lesson.sources, lang, model, route);
}
function validateSources(html, sources, lang, model, route) {
  visible(html, 'Rudolf Steiner', `${route}: actual source author`);
  visible(html, model.readingCourse.source.translator, `${route}: primary translator`);
  assert.match(plain(html), /\bGA\s*9\b/, `${route}: verified GA 9 reference`);
  assert.ok([...plain(html).matchAll(/\bGA\s*(\d+)\b/g)].every(match => match[1] === '9'), `${route}: no invented GA references in primary source block`);
  for (const source of sources) for (const id of source.readingIds) {
    const target = `${lang === 'pt' ? 'pt/' : ''}lessons/${String(id).padStart(2, '0')}.html`;
    const linked = [...html.matchAll(/<a\b[^>]*>/g)].some(match => {
      const href = attribute(match[0], 'href');
      return href && path.resolve(path.dirname(localFile(route)), unescape(href).split('#')[0]) === path.resolve(localFile(target));
    });
    assert.ok(linked, `${route}: retained source reading ${id}`);
  }
}
function validateSynthesis(html, lang, model, route) {
  const copy = model.course.synthesis[lang];
  visible(html, copy.title, `${route}: synthesis title`); visible(html, copy.question, `${route}: synthesis question`);
  const map = section(html, 'connections', route).html;
  for (const cluster of copy.bigPicture) {
    visible(map, cluster.title, `${route}: conceptual cluster title`);
    visible(map, cluster.relationship, `${route}: connected whole-course explanation`);
    for (const id of cluster.conceptIds) {
      visible(map, model.conceptById.get(id)[lang].term, `${route}: synthesis concept ${id}`);
      assert.ok(map.includes(`concepts/${id}.html`), `${route}: linked synthesis concept ${id}`);
    }
  }
  for (const takeaway of copy.takeaways) visible(html, takeaway, `${route}: synthesis takeaway`);
  const review = section(html, 'review', route).html;
  for (const [index, question] of copy.reviewQuestions.entries()) {
    const first = review.indexOf(esc(question.question));
    const last = index + 1 < copy.reviewQuestions.length ? review.indexOf(esc(copy.reviewQuestions[index + 1].question)) : review.length;
    assert.ok(first >= 0 && last > first, `${route}: authored review sequence ${index + 1}`);
    nativeNotes(review, question.question, question.notes, `${route}: review ${index + 1}`);
  }
  assert.equal((review.match(/<details\b/gi) || []).length, 10, `${route}: exactly ten native review disclosures`);
  const glossary = section(html, 'glossary', route).html;
  for (const concept of model.concepts) {
    visible(glossary, concept[lang].term, `${route}: glossary term ${concept.id}`);
    visible(glossary, concept[lang].definition, `${route}: glossary definition ${concept.id}`);
    assert.ok(glossary.includes(`concepts/${concept.id}.html`), `${route}: glossary concept context ${concept.id}`);
  }
  const practices = section(html, 'practice-overview', route).html;
  for (const practice of model.practices) {
    visible(practices, practice[lang].title, `${route}: practice overview ${practice.id}`);
    assert.ok(practices.includes(`practice/${practice.id}.html`), `${route}: linked practice ${practice.id}`);
  }
  validateSources(section(html, 'source-end', route).html, model.course.synthesis.sources, lang, model, route);
}
function validateOutput(model) {
  assert.ok(fs.existsSync(docsDir), `Completed output tree ${docsDir}`);
  const routes = fs.readdirSync(docsDir, {recursive:true}).filter(name => name.endsWith('.html')).map(name => name.split(path.sep).join('/')).sort();
  const expected = conceptPlatformRoutes(model), actual = new Set(), pages = new Map(), cache = new Map();
  for (const route of routes) {
    assert.ok(!fs.lstatSync(localFile(route)).isSymbolicLink(), `${route}: output is not a symlink`);
    const html = fs.readFileSync(localFile(route), 'utf8'); pages.set(route, html);
    const global = [...html.matchAll(/<nav\b[^>]*\bdata-platform-nav(?:\s|=|>)/g)];
    assert.equal(global.length, 1, `${route}: global navigation reaches retained pages`);
    assert.equal(wholeElement(html.slice(global[0].index), global[0][0]), platformNav(`docs/${route}`, route.startsWith('pt/') ? 'pt' : 'en', platformArea(`docs/${route}`, html)), `${route}: route-aware global navigation`);
    if (html.includes('data-concept-platform-owned="true"')) actual.add(route);
  }
  sameSet(actual, expected, 'Exactly the manifest-owned bilingual prototype routes; no missing/stale owned pages');
  assert.equal(isConceptPlatformOwned('unlisted-prototype.html', 'data-concept-platform-owned="true"'), false, 'Marker cannot grant ownership outside the manifest');
  assert.equal(isConceptPlatformOwned('theosophy/lessons/../index.html', 'data-concept-platform-owned="true"'), false, 'Traversal cannot grant route ownership');
  for (const route of expected) {
    const html = pages.get(route), lang = validateShell(html, route);
    validateLinks(html, route, cache);
    const id = route.replace(/^pt\//, '').match(/^theosophy\/lessons\/([a-z0-9-]+)\.html$/)?.[1];
    if (id === model.course.synthesis.id) validateSynthesis(html, lang, model, route);
    else if (id) validateLesson(html, model.lessonById.get(id), lang, model, route);
    const conceptId = route.replace(/^pt\//, '').match(/^concepts\/([a-z0-9-]+)\.html$/)?.[1];
    if (conceptId && conceptId !== 'index') {
      const concept = model.conceptById.get(conceptId), copy = concept[lang];
      for (const text of [copy.term, copy.definition, ...copy.explanation, copy.distinction]) visible(html, text, `${route}: complete concept`);
      for (const edge of concept.related) visible(html, edge[lang], `${route}: meaningful related concept`);
      for (const lesson of model.lessons.filter(item => item.conceptIds.includes(conceptId))) assert.ok(html.includes(`theosophy/lessons/${lesson.id}.html`), `${route}: teaching context ${lesson.id}`);
      validateSources(section(html, 'source-end', route).html, concept.sources, lang, model, route);
    }
    const practiceId = route.replace(/^pt\//, '').match(/^practice\/([a-z0-9-]+)\.html$/)?.[1];
    if (practiceId && practiceId !== 'index') {
      const practice = model.practiceById.get(practiceId), copy = practice[lang];
      for (const text of [copy.title, copy.purpose, copy.duration, ...copy.steps, copy.reflection, ...copy.notes, copy.sourceBasis]) visible(html, text, `${route}: complete voluntary practice`);
      nativeNotes(html, copy.reflection, copy.notes, route);
      for (const id of practice.lessonIds) assert.ok(html.includes(`theosophy/lessons/${id}.html`), `${route}: linked teaching context ${id}`);
      validateSources(section(html, 'source-end', route).html, practice.sources, lang, model, route);
    }
  }
  return {ownedPages:expected.size, sitePages:routes.length};
}

const model = loadConceptCourse();
validateModel(model);
const output = modelOnly ? {ownedPages:0, sitePages:0} : validateOutput(model);
const preservation = validateBaseline();
console.log(`Concept platform passed: ${model.lessons.length} teaching lessons + synthesis, ${model.concepts.length} concepts, ${model.practices.length} practices, ${output.ownedPages} bilingual prototype pages, ${output.sitePages} pages with four-area navigation; ${preservation.available ? `${preservation.banks} source banks and ${preservation.retained} public paths preserved` : 'optional private preservation baseline unavailable'}.${modelOnly ? ' Model-only check; rendered pages untested.' : ''}`);
