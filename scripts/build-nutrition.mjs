import fs from 'node:fs';
import {esc, shell, write} from './learning-html.mjs';

// This renderer supports the deliberately limited Markdown used by this unit.
// Escape all source text before adding markup; source documents are not HTML.
const inline = text => esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
function markdown(text) {
  const lines = text.split('\n');
  const output = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const heading = line.match(/^(#{1,6}) (.+)$/);
    if (heading) { output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); i++; continue; }
    if (line.startsWith('|') && /^\|[ :|-]+\|$/.test(lines[i + 1] || '')) {
      const cells = row => row.slice(1, -1).split('|').map(cell => cell.trim());
      const headers = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]));
      output.push(`<div class="nutrition-table"><table><thead><tr>${headers.map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const item = line.match(/^(?:- |\d+\. )(.+)$/);
    if (item) {
      const ordered = /^\d+\./.test(line), tag = ordered ? 'ol' : 'ul';
      const pattern = ordered ? /^\d+\. (.+)$/ : /^- (.+)$/;
      const items = [];
      while (i < lines.length) {
        const next = lines[i].match(pattern);
        if (!next) break;
        items.push(`<li>${inline(next[1])}</li>`);
        i++;
      }
      output.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    const paragraph = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(?:#|\||- |\d+\. )/.test(lines[i])) paragraph.push(lines[i++]);
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return output.join('\n');
}

const unit = JSON.parse(fs.readFileSync(new URL('../content/nutrition-lesson-plans.json', import.meta.url), 'utf8'));
const lessons = unit.blocks.filter(block => /^## Lesson \d /.test(block));
if (lessons.length !== 6) throw new Error('Nutrition unit must contain six complete lessons.');
for (const block of lessons) {
  const sequence = block.split('### Teaching sequence')[1].split('###')[0];
  const minutes = [...sequence.matchAll(/— (\d+) minutes:/g)].reduce((total, match) => total + Number(match[1]), 0);
  if (minutes !== 50) throw new Error('Every nutrition lesson must total 50 minutes.');
}
const title = block => block.split('\n')[0].replace(/^## /, '');
const links = lessons.map((lesson, i) => `<li><a href="${String(i + 1).padStart(2, '0')}.html">${esc(title(lesson))}</a><p>50 minutes · teacher explanation, activity and assessment</p></li>`).join('');
const resources = `<nav class="nutrition-resources" aria-label="Teaching resources"><a href="print.html">Printable full unit</a><a href="nutrition-lesson-plans.md" download>Download the lesson plans</a></nav>`;
function emit(file, heading, content, lang = 'en', partner) {
  let html = shell(file, heading, content, lang, {partner, className:'learning-course nutrition-unit', description:lang === 'en' ? 'Six detailed nutrition and food lesson plans with explanations, activities and assessment for ages 10 to 14.' : 'Seis planos de aula sobre alimentação e nutrição, disponíveis em inglês.'});
  html = html.replace('</head>', `<link rel="stylesheet" href="${lang === 'pt' ? '../../' : '../'}nutrition.css"></head>`);
  write(file, html);
}
const support = unit.blocks.filter(block => !/^## Lesson \d /.test(block) && !block.startsWith('## Unit sequence'));
emit('docs/nutrition/index.html', unit.title, `<div class="eyebrow">Teacher resource · six lessons · 50 minutes each</div><h1>${esc(unit.title)}</h1>${markdown(unit.blocks[0])}${resources}<section id="lesson-sequence"><h2>The six lessons</h2><ol class="nutrition-sequence">${links}</ol></section>${support.slice(1).map(markdown).join('\n')}`, 'en', 'docs/pt/nutrition/index.html');
for (let i = 0; i < lessons.length; i++) {
  const id = String(i + 1).padStart(2, '0'), heading = title(lessons[i]);
  const previous = i ? `<a href="${String(i).padStart(2, '0')}.html">Previous lesson</a>` : '<a href="index.html">Unit overview</a>';
  const next = i < lessons.length - 1 ? `<a href="${String(i + 2).padStart(2, '0')}.html">Next lesson</a>` : '<a href="index.html">Final assessment and references</a>';
  emit(`docs/nutrition/${id}.html`, heading, `<p class="breadcrumb"><a href="index.html">Nutrition teacher unit</a></p><div class="eyebrow">Teacher lesson plan · English · ages 10 to 14 assumed</div><h1>${esc(heading)}</h1>${resources}${markdown(lessons[i].split('\n').slice(1).join('\n'))}<nav class="lesson-navigation" aria-label="Lesson navigation">${previous}<a href="index.html#lesson-sequence">All six lessons</a>${next}</nav>`);
}
emit('docs/nutrition/print.html', unit.title, `<h1>${esc(unit.title)}</h1><p class="nutrition-screen-only">Use your browser’s Print command to print or save this complete unit as a PDF. <a href="index.html">Return to the unit overview</a>.</p>${unit.blocks.map(markdown).join('\n')}`);
emit('docs/pt/nutrition/index.html', 'Planos de aula sobre alimentação e nutrição', `<div class="eyebrow">Recurso para professores · material em inglês</div><h1>Planos de aula sobre alimentação e nutrição</h1><p class="lead">Seis aulas de 50 minutos com explicações, atividades e avaliação. A faixa etária adotada para o planejamento é de 10 a 14 anos.</p><p>Os planos completos estão disponíveis em inglês. Esta página apresenta o recurso em português; não é uma tradução das aulas.</p><ol><li>Por que o corpo precisa de alimentos</li><li>Origem dos alimentos e variedade</li><li>Nutrientes e suas funções</li><li>Digestão e absorção</li><li>Preparo, segurança e rótulos</li><li>Planejamento de uma refeição prática e nutritiva</li></ol><p><a class="button" href="../../nutrition/index.html" lang="en">Abrir os planos completos em inglês</a></p><p><a href="../../nutrition/print.html" lang="en">Versão para impressão em inglês</a> · <a href="../../nutrition/nutrition-lesson-plans.md" download>Baixar os planos em inglês</a></p><p>A unidade diferencia as interpretações espirituais de Rudolf Steiner das explicações científicas atuais sobre nutrição. A degustação é opcional e as atividades devem respeitar alergias, necessidades alimentares, cultura e acesso aos alimentos.</p>`, 'pt', 'docs/nutrition/index.html');
write('docs/nutrition/nutrition-lesson-plans.md', `# ${unit.title}\n\n${unit.blocks.join('\n\n')}\n`);
console.log('Built nutrition teacher unit: six lessons, two landing pages, printable unit and download.');
