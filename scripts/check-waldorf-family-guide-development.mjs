import assert from 'node:assert/strict';
import fs from 'node:fs';
import {esc} from './learning-html.mjs';
import {familyGuide} from '../content/waldorf-family-guide.mjs';
import {renderFamilyGuideDevelopment} from './waldorf-family-guide-development.mjs';

for(const lang of ['en','pt']) {
 const d=familyGuide[lang].development,html=renderFamilyGuideDevelopment(lang);
 assert.deepEqual(d.stages.map(stage=>stage.id),['goodness','beauty','truth'],'Both languages retain the three distinct educational emphases');
 assert.equal((html.match(/<h3>/g)||[]).length,6);
 for(const text of [d.whyTitle,...d.why,d.parentStepsTitle,...d.parentSteps,d.sharedReadingLabel,d.applicationNote,d.takeawayTitle,...d.takeaways,d.primaryLabel])assert.ok(html.includes(esc(text)),'Parent application text is retained');
 assert.equal((html.match(/<details>/g)||[]).length,3,'Reflection, explained answer, and sources stay optional native disclosures');
 assert.ok(d.stages.every(stage=>stage.experience.length>160&&stage.example.length>100),'Each phase explains an inner relationship and a usable example');
 for(const stage of d.stages) {
  for(const value of [stage.title,stage.experience,stage.example,stage.adultAction,stage.anotherExample,stage.notMeaning])assert.ok(html.includes(esc(value)));
 }
 for(const text of [d.intro,d.after,d.check.question,d.check.answer,d.source])assert.ok(html.includes(esc(text)));
 assert.ok(d.source.includes('CW 293')&&d.source.includes('CW 302')&&d.source.includes('156–158'),'The public note identifies the exact primary witnesses');
 assert.ok(html.includes('href="foundations/seven-year-periods.html"'));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(ids.length,new Set(ids).size);
 assert.ok(!/<script|onclick=|role="button"/.test(html),'All teaching and answers remain usable without JavaScript');
 if(process.argv.includes('--rendered')) {
  const base=`docs/${lang==='pt'?'pt/':''}learn/waldorf/`,page=fs.readFileSync(base+'family-guide.html','utf8');
  assert.ok(page.includes(html),'Final generated guide contains the reviewed complete section');
  assert.ok(page.includes('href="#developmental-periods"'),'Section is discoverable in guide navigation');
  assert.ok(page.indexOf('id="learning"')<page.indexOf('id="developmental-periods"')&&page.indexOf('id="developmental-periods"')<page.indexOf('id="grades"'),'Developmental explanation precedes curriculum application');
  assert.ok(fs.existsSync(base+'foundations/seven-year-periods.html'),'The continuation lesson exists');
 }
}
assert.throws(()=>renderFamilyGuideDevelopment('fr'),/Unsupported/);
console.log('Passed bilingual family-guide development: three explained phases, practical examples, optional reasoned check, primary locators, no-JS disclosures'+(process.argv.includes('--rendered')?', and final generated placement.':'.'));
