import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {esc} from './learning-html.mjs';

const sourceDirectory = fileURLToPath(new URL('./assets/identity/', import.meta.url));
const repositoryDirectory = fileURLToPath(new URL('../', import.meta.url));
const themes = new Set(['violet', 'teal', 'clay', 'gold', 'green']);

// Course colours and symbols are editorial design choices. They do not assert
// Steiner correspondences or reproduce an institutional/historical emblem.
const subjects = new Map([
  ['foundations', ['violet', 'unfolding']],
  ['introduction-to-anthroposophy', ['violet', 'unfolding']],
  ['theosophy', ['violet', 'human-being']],
  ['lessons', ['violet', 'human-being']],
  ['philosophy-of-freedom', ['teal', 'freedom']],
  ['freedom', ['teal', 'freedom']],
  ['higher-worlds', ['clay', 'higher-worlds']],
  ['according-to-luke', ['gold', 'unfolding-gold']],
  ['colour', ['gold', 'colour']],
  ['temperaments', ['clay', 'temperaments']],
  ['mystery-temperaments', ['clay', 'temperaments']],
  ['understand-temperament', ['clay', 'temperaments']],
  ['understanding-temperaments', ['clay', 'temperaments']],
  ['ancient-myths', ['violet', 'human-being']],
  ['agriculture', ['green', 'agriculture']],
  ['biodynamics', ['green', 'agriculture']],
  ['what-is-biodynamics', ['green', 'agriculture']],
  ['toward-threefold-society', ['teal', 'society']],
  ['encountering-the-self', ['green', 'education']],
  ['waldorf', ['green', 'education']],
  ['practical-thinking', ['teal', 'thinking']],
  ['meditation', ['clay', 'higher-worlds']],
  ['learn', ['violet', 'unfolding']],
  ['concepts', ['violet', 'human-being']],
  ['practice', ['teal', 'thinking']],
  ['read', ['clay', 'unfolding']],
  ['books', ['clay', 'unfolding']],
  ['research', ['teal', 'thinking']],
  ['themes', ['gold', 'colour']],
]);

function routeSegments(route) {
  if (typeof route !== 'string') throw new TypeError('A visual theme needs a route or subject identifier');
  let normalized = route.replaceAll('\\', '/').split(/[?#]/, 1)[0];
  if (path.posix.isAbsolute(normalized)) {
    normalized = path.relative(repositoryDirectory, normalized).replaceAll('\\', '/');
  }
  normalized = normalized.replace(/^\.\//, '').replace(/^docs\//, '').replace(/^pt\//, '');
  return normalized.split('/').filter(Boolean);
}

function subjectFor(route) {
  const parts = routeSegments(route);
  if (parts[0] === 'read' && parts[1] === 'theosophy') return subjects.get('theosophy');
  if (parts[0] === 'learn' && parts[1] === 'foundations') return subjects.get('foundations');
  if (parts[0] === 'learn' && parts[1] === 'waldorf') return subjects.get('waldorf');
  const key = (parts[0] ?? '').replace(/\.html$/, '');
  return subjects.get(key) ?? ['violet', 'unfolding'];
}

/** Stable accent for a course identifier or an English/Portuguese page route. */
export function visualThemeFor(route) {
  const [theme] = subjectFor(route);
  if (!themes.has(theme)) throw new Error(`Unknown identity theme: ${theme}`);
  return theme;
}

function assetUrl(file, filename) {
  if (typeof file !== 'string' || !file.endsWith('.html')) throw new TypeError('Identity rendering needs an HTML page path');
  const normalized = file.replaceAll('\\', '/');
  const logicalFile = path.posix.isAbsolute(normalized)
    ? path.relative(repositoryDirectory, normalized).replaceAll('\\', '/')
    : normalized;
  if (!/^docs\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/.test(logicalFile)) throw new Error(`Identity page is outside the public docs routes: ${file}`);
  const target = `docs/assets/identity/illustrations/${filename}`;
  const relative = path.posix.relative(path.posix.dirname(logicalFile), target);
  const hash = createHash('sha256').update(fs.readFileSync(path.join(sourceDirectory, 'illustrations', filename))).digest('hex').slice(0, 12);
  return esc(`${relative}?v=${hash}`);
}

/** An original unfolding brand mark, decorative beside the written site name. */
export function renderIdentityMark() {
  return '<svg class="identity-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="44" height="44" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M25 42C22 26 9 24 7 10C23 11 25 21 25 42C28 26 41 24 43 10C27 11 25 21 25 42"/><path d="M25 7V17M14 3L17 11M36 3L33 11"/></g></svg>';
}

/** An original course cover. The surrounding course title supplies its meaning. */
export function renderCourseArtwork(file, id) {
  if (typeof id !== 'string' || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Invalid course artwork identifier: ${id}`);
  const [theme, artwork] = subjectFor(id);
  return `<div class="identity-course-art theme-${theme}" data-identity-art="${esc(id)}"><img src="${assetUrl(file, `${artwork}.svg`)}" width="480" height="260" alt="" aria-hidden="true" loading="lazy" decoding="async"></div>`;
}

/** Original layered colour, growth and light for the homepage. */
export function renderIdentityHero(file) {
  return `<figure class="identity-hero-art" aria-hidden="true"><img src="${assetUrl(file, 'learning-landscape.svg')}" width="560" height="410" alt="" decoding="async"></figure>`;
}

/** Copy local fonts, their licenses and original editorial graphics deterministically. */
export function copyVisualAssets(docsDir = 'docs') {
  const output = path.resolve(docsDir, 'assets/identity');
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.cpSync(sourceDirectory, output, {recursive: true});
  return output;
}
