import fs from 'node:fs';
import path from 'node:path';
import {esc, wholeElement} from './learning-html.mjs';
import {platformArea, platformNav, platformSupportNav} from './platform-architecture.mjs';

const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'))?.[2];
const hasClass = (tag, name) => (attribute(tag, 'class') || '').split(/\s+/).includes(name);
const hasMarker = (tag, marker) => new RegExp(`\\s${marker}(?:\\s|=|>)`, 'i').test(tag);

function removeNavigations(html, matches) {
  const openings = /<nav\b[^>]*>/gi;
  let result = '', cursor = 0;
  for (let match; (match = openings.exec(html));) {
    if (!matches(match[0])) continue;
    const element = wholeElement(html.slice(match.index), match[0]);
    result += html.slice(cursor, match.index);
    cursor = match.index + element.length;
    openings.lastIndex = cursor;
  }
  return result + html.slice(cursor);
}

function foundationReturns(html) {
  const opening = /<main\b[^>]*>/i.exec(html);
  if (!opening) throw new Error('Foundations lesson has no main landmark');
  const main = wholeElement(html.slice(opening.index), opening[0]);
  // Scope this to lesson content: the main Learn navigation also uses
  // ../index.html, and must continue to point to the platform course hub.
  const updated = main.replace(/\bhref=(["'])\.\.\/index\.html(#part-[1-8])?\1/g, (_, quote, fragment = '') => `href=${quote}../foundations/index.html${fragment}${quote}`);
  return html.slice(0, opening.index) + updated + html.slice(opening.index + main.length);
}

function sharedNavigationStyles(html, logicalFile) {
  const asset = 'docs/concept-platform.css';
  const href = path.posix.relative(path.posix.dirname(logicalFile), asset);
  let retained = false;
  html = html.replace(/<link\b[^>]*>/gi, tag => {
    if ((attribute(tag, 'rel') || '').toLowerCase() !== 'stylesheet') return tag;
    const url = attribute(tag, 'href');
    if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(url)) return tag;
    const resource = url.split(/[?#]/)[0];
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(logicalFile), resource));
    if (target !== asset) return tag;
    if (retained) return '';
    retained = true;
    // Existing cache parameters and any page-specific link attributes survive.
    return tag;
  });
  if (!retained) html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="${esc(href)}"></head>`);
  return html;
}

/** Apply after every content generator; this pass changes navigation only. */
export function applyPlatformNavigation(docsDir = 'docs') {
  const root = path.resolve(docsDir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error('Platform navigation requires an existing docs tree');
  const routes = fs.readdirSync(root, {recursive:true}).filter(name => name.endsWith('.html')).map(name => name.split(path.sep).join('/')).sort();
  const writes = [];
  let foundationLessons = 0;
  for (const route of routes) {
    const file = path.join(root, route);
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error(`Platform navigation refuses a symlink: ${route}`);
    const before = fs.readFileSync(file, 'utf8');
    if (!/<\/header>/i.test(before) || !/<\/body>/i.test(before) || !/<\/head>/i.test(before)) throw new Error(`Incomplete platform page shell: ${route}`);
    const logicalFile = `docs/${route}`, lang = route.startsWith('pt/') ? 'pt' : 'en';
    const area = platformArea(route, before);
    let after = removeNavigations(before, tag => hasClass(tag, 'system-nav') || hasMarker(tag, 'data-platform-nav'));
    after = removeNavigations(after, tag => hasClass(tag, 'platform-support-nav') || hasMarker(tag, 'data-platform-support'));
    after = after.replace(/<\/header>/i, `${platformNav(logicalFile, lang, area)}</header>`);
    const support = platformSupportNav(logicalFile, lang);
    after = /<\/footer>/i.test(after)
      ? after.replace(/<\/footer>/i, `${support}</footer>`)
      : after.replace(/<\/body>/i, `<footer class="platform-footer">${support}</footer></body>`);
    after = sharedNavigationStyles(after, logicalFile);
    if (/^(?:pt\/)?learn\/lessons\/(?:0[1-9]|[12]\d|3[0-6])\.html$/.test(route)) {
      after = foundationReturns(after);
      foundationLessons += 1;
    }
    if (after !== before) writes.push([file, after, route]);
  }
  // Validate the whole tree before mutating any rendered page.
  for (const [file, html] of writes) fs.writeFileSync(file, html);
  return {pages:routes.length, changedFiles:writes.map(([, , route]) => route), foundationLessons};
}
