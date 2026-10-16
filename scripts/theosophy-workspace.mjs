import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {relative, esc} from './learning-html.mjs';

// Deliberately limited to the Theosophy course overview and semantic lessons.
// The original document remains a complete, usable no-JavaScript fallback.
export function applyTheosophyWorkspace(html, file) {
  if (!/^docs\/(?:pt\/)?theosophy\/(?:index\.html|lessons\/[a-z-]+\.html)$/.test(file)) return html;
  const assets = ['theosophy-workspace.css', 'theosophy-workspace.js'].map(name => {
    const hash = createHash('sha256').update(fs.readFileSync(new URL('./assets/' + name, import.meta.url))).digest('hex').slice(0,12);
    const href = esc(relative(file, 'docs/' + name)) + '?v=' + hash;
    return name.endsWith('.css') ? `<link rel="stylesheet" href="${href}">` : `<script defer src="${href}"></script>`;
  }).join('');
  return html.replace('</head>', assets + '</head>').replace('<body ', '<body data-theosophy-workspace="preview" ');
}
