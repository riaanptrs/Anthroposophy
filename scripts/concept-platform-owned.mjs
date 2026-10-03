import {loadConceptCourse} from '../content/theosophy-concept-course.mjs';

const hubRoutes = ['index.html', 'learn/index.html', 'learn/foundations/index.html', 'concepts/index.html', 'practice/index.html', 'read/index.html', 'books/index.html'];
let cached;

export function conceptPlatformRoutes(model = loadConceptCourse()) {
  const core = [...hubRoutes, 'theosophy/index.html',
    ...model.course.lessonIds.map(id => `theosophy/lessons/${id}.html`),
    ...model.concepts.map(concept => `concepts/${concept.id}.html`),
    ...model.practices.map(practice => `practice/${practice.id}.html`)];
  return new Set(core.flatMap(route => [route, `pt/${route}`]));
}

/** Ownership is an exact validated manifest, never a broad folder exemption. */
export function isConceptPlatformOwned(route, html) {
  if (!String(html).includes('data-concept-platform-owned="true"')) return false;
  const local = String(route).replace(/^docs\//, '');
  if (local.includes('\\') || local.startsWith('/') || local.split('/').some(part => !part || part === '.' || part === '..')) return false;
  cached ??= conceptPlatformRoutes();
  return cached.has(local);
}
