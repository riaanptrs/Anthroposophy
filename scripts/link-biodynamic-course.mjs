import fs from 'node:fs';
import path from 'node:path';
import {esc} from './learning-html.mjs';
import {isBiodynamicOwned} from './biodynamic-owned.mjs';

const courseFile = new URL('../content/biodynamic-agriculture-course.json', import.meta.url);
const marker = (id, body) => `<!-- ${id}:start -->${body}<!-- ${id}:end -->`;
const clear = (html, id) => html.replace(new RegExp(`<!-- ${id}:start -->[\\s\\S]*?<!-- ${id}:end -->`, 'g'), '');

// This helper operates on whichever complete docs tree the caller supplies. It
// neither builds a course nor changes publication readiness or source metadata.
export function linkBiodynamicCourse({docsDir = 'docs'} = {}) {
  const root = path.resolve(docsDir);
  const indexes = ['biodynamics/index.html', 'pt/biodynamics/index.html'];
  const present = indexes.map(relative => {
    const file = path.join(root, relative);
    return fs.existsSync(file) && isBiodynamicOwned(relative, fs.readFileSync(file, 'utf8'));
  });
  if (!present.some(Boolean)) return {linked:false, changedFiles:[]};
  if (!present.every(Boolean)) throw new Error('Biodynamic integration requires both owned language indexes.');
  const course = JSON.parse(fs.readFileSync(courseFile, 'utf8'));
  const changedFiles = [];
  const pendingWrites = [];
  function update(relative, transform) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) return;
    const before = fs.readFileSync(file, 'utf8'), after = transform(before);
    if (before !== after) {
      pendingWrites.push([file, after]);
      changedFiles.push(relative);
    }
  }
  for (const lang of ['en', 'pt']) {
    const pt = lang === 'pt', prefix = pt ? 'pt/' : '';
    const t = (en, br) => pt ? br : en;
    const title = pt ? course.titlePt : course.titleEn;
    update(prefix + 'books/index.html', html => {
      html = clear(clear(html, 'biodynamic-course-card'), 'biodynamic-source-companions');
      for (const route of ['what-is-biodynamics', 'agriculture']) {
        html = html.replace(new RegExp(`<a class="course-card" href="\\.\\./${route}/index\\.html">[\\s\\S]*?<\\/a>`, 'g'), '');
      }
      const card = marker('biodynamic-course-card', `<a class="course-card" href="../biodynamics/index.html"><h2>${esc(title)}</h2><p>${t('Rudolf Steiner · GA 327 · 24 lessons · Six parts', 'Rudolf Steiner · GA 327 · 24 lições · Seis partes')}</p></a>`);
      if (!/<section class="learning-grid">[\s\S]*?<\/section>/.test(html)) throw new Error('Missing book course grid: ' + prefix);
      html = html.replace(/(<section class="learning-grid">[\s\S]*?)(<\/section>)/, `$1${card}$2`);
      const companions = marker('biodynamic-source-companions', `<section id="biodynamic-source-companions"><h2>${t('Optional agricultural source companions', 'Fontes agrícolas complementares opcionais')}</h2><p>${t('These preserved source collections support the 24-lesson Biodynamic Agriculture course. Their original reading sequences, source assignments and study notes remain available.', 'Estas coleções preservadas apoiam o curso de Agricultura biodinâmica com 24 lições. Suas sequências originais, indicações de leitura e anotações continuam disponíveis.')}</p><ul><li><a href="../agriculture/index.html">${t('Agriculture Course: complete lecture reading companion', 'Curso de Agricultura: leitura integral das palestras')}</a> · GA 327</li><li><a href="../what-is-biodynamics/index.html">${t('What Is Biodynamics? — anthology and supporting voices', 'O que é biodinâmica? — antologia e vozes de apoio')}</a> · ${t('Courtney, GA 230 and GA 136', 'Courtney, GA 230 e GA 136')}</li></ul></section>`);
      return html.replace('</main>', companions + '</main>');
    });
    update(prefix + 'themes/index.html', html => {
      html = clear(html, 'biodynamic-theme-onward');
      const onward = marker('biodynamic-theme-onward', `<p data-biodynamic-onward><a href="../biodynamics/index.html"><strong>${t('Begin Biodynamic Agriculture: the 24-lesson course', 'Comece Agricultura biodinâmica: o curso de 24 lições')} →</strong></a></p>`);
      const opening = /(<article\b[^>]*\bid="biodynamics"[^>]*>[\s\S]*?<\/h2>)/;
      if (!opening.test(html)) throw new Error('Missing biodynamics theme: ' + prefix);
      return html.replace(opening, `$1${onward}`);
    });
    for (const route of ['what-is-biodynamics', 'agriculture']) update(prefix + route + '/index.html', html => {
      html = clear(html, 'biodynamic-companion-relationship');
      const relationship = marker('biodynamic-companion-relationship', `<aside class="learning-distinction" data-biodynamic-companion><h2>${t('Optional source companion', 'Fonte complementar opcional')}</h2><p>${t('This preserved reading collection supports the new agricultural course. Begin with the farm, soil, plants and animals in the primary sequence; return here for its complete source readings and separately attributed background.', 'Esta coleção preservada apoia o novo curso agrícola. Comece pela fazenda, solo, plantas e animais na sequência principal; retorne aqui para as leituras integrais e o contexto atribuído às suas fontes.')}</p><p><a href="../biodynamics/index.html">${esc(title)} · ${t('24 lessons', '24 lições')} →</a></p></aside>`);
      return html.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/, `$1${relationship}`);
    });
    for (const tail of ['learn/lessons/32.html', 'learn/lessons/36.html', 'introduction-to-anthroposophy/lessons/25.html']) update(prefix + tail, html => {
      html = clear(html, 'biodynamic-primary-onward');
      const onward = marker('biodynamic-primary-onward', `<aside class="learning-distinction" data-biodynamic-onward><h2>${t('Continue with Biodynamic Agriculture', 'Continue com Agricultura biodinâmica')}</h2><p>${t('Follow the 24-lesson agricultural sequence, then use the preserved anthology and complete-lecture collections as source companions.', 'Siga a sequência agrícola de 24 lições e use a antologia e a coleção integral de palestras preservadas como fontes complementares.')}</p><p><a href="../../biodynamics/index.html">${esc(title)} →</a></p></aside>`);
      if (/<details\b[^>]*\bdata-deep-study/.test(html)) return html.replace(/(<details\b[^>]*\bdata-deep-study)/, `${onward}$1`);
      return html.replace('</article>', onward + '</article>');
    });
  }
  // Validate every existing integration point before changing any rendered file.
  for (const [file, html] of pendingWrites) fs.writeFileSync(file, html);
  return {linked:true, changedFiles};
}
