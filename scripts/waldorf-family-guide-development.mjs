import {esc} from './learning-html.mjs';
import {familyGuide} from '../content/waldorf-family-guide.mjs';

// This section can be rendered on its own without rewriting historical lessons.
export function renderFamilyGuideDevelopment(lang) {
 const d=familyGuide[lang]?.development;
 if(!d)throw new Error('Unsupported family-guide language: '+lang);
 const p=text=>`<p>${esc(text)}</p>`;
 const primary='https://rsarchive.org/Lectures/GA293/English/RSP1966/19190830a01.html';
 const stages=d.stages.map(stage=>`<section id="development-${stage.id}"><h3>${esc(stage.title)}</h3><p><strong>${esc(stage.adultAction)}</strong></p>${p(stage.experience)}<p><strong>${esc(stage.exampleLabel)}:</strong> ${esc(stage.example)}</p><p><strong>${esc(d.anotherExampleLabel)}:</strong> ${esc(stage.anotherExample)}</p><p><strong>${esc(d.notMeaningLabel)}:</strong> ${esc(stage.notMeaning)}</p></section>`).join('');
 return `<section id="developmental-periods" aria-labelledby="developmental-periods-title"><h2 id="developmental-periods-title">${esc(d.title)}</h2>${p(d.intro)}<section id="why-development-matters"><h3>${esc(d.whyTitle)}</h3>${d.why.map(p).join('')}</section>${p(d.applicationNote)}${stages}<section><h3>${esc(d.takeawayTitle)}</h3><ul>${d.takeaways.map(text=>`<li>${esc(text)}</li>`).join('')}</ul>${p(d.after)}</section><section id="development-at-home"><h3>${esc(d.parentStepsTitle)}</h3><ol>${d.parentSteps.map(text=>`<li>${esc(text)}</li>`).join('')}</ol></section><p><a href="foundations/seven-year-periods.html">${esc(d.linkLabel)}</a></p><details><summary>${esc(d.check.title)}</summary>${p(d.check.question)}<details><summary>${esc(d.check.answerTitle)}</summary>${p(d.check.answer)}</details></details><details><summary>${esc(familyGuide[lang].sourceTitle)}</summary>${p(d.source)}<p><a href="${primary}" lang="en">${esc(d.primaryLabel)}</a></p></details><p><a href="https://chatgpt.com/share/6ae307af-ac9c-83e8-8302-9a0be79a9d06" lang="en">${esc(d.sharedReadingLabel)}</a></p></section>`;
}
