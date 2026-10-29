import {esc} from './learning-html.mjs';
import {familyGuide} from '../content/waldorf-family-guide.mjs';

// Kept independent of the whole-course builder so this small addition can be
// reviewed and rendered without rewriting the historical lesson records.
export function renderFamilyGuideDevelopment(lang) {
 const d=familyGuide[lang]?.development;
 if(!d)throw new Error('Unsupported family-guide language: '+lang);
 const p=text=>`<p>${esc(text)}</p>`;
 return `<section id="developmental-periods" aria-labelledby="developmental-periods-title"><h2 id="developmental-periods-title">${esc(d.title)}</h2>${p(d.intro)}${d.stages.map(stage=>`<section id="development-${stage.id}"><h3>${esc(stage.title)}</h3>${p(stage.experience)}<p><strong>${esc(d.exampleLabel)}:</strong> ${esc(stage.example)}</p></section>`).join('')}${p(d.after)}<p><a href="foundations/seven-year-periods.html">${esc(d.linkLabel)}</a></p><details><summary>${esc(d.check.title)}</summary>${p(d.check.question)}<details><summary>${esc(d.check.answerTitle)}</summary>${p(d.check.answer)}</details></details><details><summary>${esc(familyGuide[lang].sourceTitle)}</summary>${p(d.source)}</details></section>`;
}
