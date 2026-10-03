import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadConceptCourse} from '../content/theosophy-concept-course.mjs';
import {esc, relative} from './learning-html.mjs';
import {buildPlatformArchitecture} from './platform-architecture.mjs';
import {applyPlatformNavigation} from './platform-integration.mjs';
import {renderPlatformPage, renderCourseLanding, renderConceptLesson, renderConceptPage, renderPracticePage, renderCourseSynthesis} from './platform-components.mjs';

function readingShortcuts(course, file, lang) {
  const pt = lang === 'pt', base = pt ? 'docs/pt' : 'docs';
  const link = (route, label, anchor = '') => `<a href="${esc(relative(file, `${base}/${route}`))}${anchor ? '#' + esc(anchor) : ''}">${esc(label)}</a>`;
  const chapters = course.sourceLedger.chapters;
  return `<details class="cp-deeper cp-source-shortcuts" id="structured-readings"><summary>${pt ? 'Comentário detalhado de leitura' : 'Detailed reading commentary'}</summary><p>${pt ? 'Retome a fonte em sua sequência original, com os trechos e as anotações de leitura já disponíveis.' : 'Return to the source in its original sequence, with the existing passages and reading notes.'}</p><div id="part-orientation"><p id="chapter-orientation-orientation">${link('lessons/00.html', pt ? 'Prefácios e introdução' : 'Prefaces and introduction')}</p></div><ul id="part-book">${chapters.map(chapter => `<li id="chapter-book-${esc(chapter.slug)}">${link('read/theosophy/index.html', pt ? chapter.titlePt : chapter.titleEn, `chapter-book-${chapter.slug}`)}</li>`).join('')}</ul><div id="part-synthesis"><p id="chapter-synthesis-synthesis">${link('lessons/22.html', pt ? 'Síntese da leitura do livro' : 'Book-reading synthesis')}</p></div></details>`;
}

/** The last build stage owns new semantic teaching routes and global navigation. */
export function buildConceptPlatform({docsDir = 'docs', model = loadConceptCourse()} = {}) {
  const {course, lessons, concepts, practices} = model;
  if (course.status !== 'ready') throw new Error('The conceptual course is not ready for a public build');
  const renderedLessons = [...lessons, {...course.synthesis, moduleId:'synthesis', conceptIds:[]}];
  const output = path.resolve(docsDir), rendered = [];
  fs.mkdirSync(output, {recursive:true});
  const emit = (route, body, title, description, lang, role) => {
    const local = `${lang === 'pt' ? 'pt/' : ''}${route}`;
    if (local.includes('\\') || local.split('/').some(part => part === '..' || part === '.') || !local.endsWith('.html')) throw new Error('Invalid output route');
    const file = `docs/${local}`, partner = `docs/${lang === 'pt' ? '' : 'pt/'}${route}`;
    const target = path.resolve(output, local);
    if (!target.startsWith(output + path.sep)) throw new Error('Output escapes docs');
    fs.mkdirSync(path.dirname(target), {recursive:true});
    fs.writeFileSync(target, renderPlatformPage(file, title, body, lang, {partner, description, role}));
    rendered.push(local);
  };
  for (const name of ['concept-platform.css', 'concept-platform.js']) fs.copyFileSync(new URL(`./assets/${name}`, import.meta.url), path.join(output, name));
  const architecture = buildPlatformArchitecture({course, lessons, concepts, practices, renderPage:renderPlatformPage, docsDir});
  for (const lang of ['en', 'pt']) {
    const local = route => `docs/${lang === 'pt' ? 'pt/' : ''}${route}`;
    const options = route => ({course, lessons:renderedLessons, concepts, practices, lang, file:local(route)});
    const landingRoute = 'theosophy/index.html';
    let landing = renderCourseLanding(options(landingRoute));
    const shortcuts = readingShortcuts(course, local(landingRoute), lang);
    landing = landing.replace(/(<section class="cp-sources"(?=\s|>))/, shortcuts + '$1');
    if (!landing.includes('id="structured-readings"')) throw new Error('Course source shortcuts not placed before source references');
    emit(landingRoute, landing, course[lang].title, course[lang].subtitle, lang, 'course');
    for (const lesson of lessons) {
      const route = `theosophy/lessons/${lesson.id}.html`;
      emit(route, renderConceptLesson(lesson, options(route)), lesson[lang].title, lesson[lang].question, lang, 'lesson');
    }
    for (const concept of concepts) {
      const route = `concepts/${concept.id}.html`;
      emit(route, renderConceptPage(concept, options(route)), concept[lang].term, concept[lang].definition, lang, 'concept');
    }
    for (const practice of practices) {
      const route = `practice/${practice.id}.html`;
      emit(route, renderPracticePage(practice, options(route)), practice[lang].title, practice[lang].purpose, lang, 'practice');
    }
    const synthesisRoute = `theosophy/lessons/${course.synthesis.id}.html`;
    emit(synthesisRoute, renderCourseSynthesis(options(synthesisRoute)), course.synthesis[lang].title, course.synthesis[lang].question, lang, 'synthesis');
  }
  const integration = applyPlatformNavigation(docsDir);
  console.log(`Concept-led Theosophy: ${lessons.length} teaching lessons + synthesis, ${concepts.length} concepts, ${practices.length} practices; ${integration.pages} pages share four learning areas.`);
  return {rendered:[...architecture.pages, ...rendered], architecture, integration};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildConceptPlatform();
