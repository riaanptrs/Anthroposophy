import fs from 'node:fs';
import assert from 'node:assert/strict';
import {withPortugueseSourceLabels} from './portuguese-source-labels.mjs';
import {meditationLessons} from '../content/meditation-course.mjs';
import {texts} from '../content/meditation-texts.mjs';
import {esc} from './learning-html.mjs';

const files=fs.readdirSync('docs',{recursive:true}).filter(f=>f.endsWith('.html')).sort();
const english=files.filter(f=>!f.startsWith('pt/')),portuguese=files.filter(f=>f.startsWith('pt/'));
const missing=english.filter(f=>!files.includes('pt/'+f));
const exceptions={
 waldorf:{reason:'The 98-page Waldorf course is English-only; no Portuguese course translation exists.',pages:missing.filter(f=>f.startsWith('learn/waldorf/'))},
 nutrition:{reason:'The Portuguese entry identifies the complete Nutrition lessons as English-only.',pages:missing.filter(f=>f.startsWith('nutrition/'))},
 research:{reason:'Research indexes are bilingual; original research-note bodies remain in English.',pages:missing.filter(f=>f.startsWith('research/notes/'))}
};
assert.deepEqual(missing,[...Object.values(exceptions).flatMap(e=>e.pages)].sort(),'A new English-only route needs review');
for(const file of english)assert.ok(/<html\b[^>]*\blang="en"/.test(fs.readFileSync('docs/'+file,'utf8')),file+' English document language');
for(const file of portuguese) {
 const html=fs.readFileSync('docs/'+file,'utf8');
 assert.ok(/<html\b[^>]*\blang="pt-BR"/.test(html),file+' Portuguese document language');
 assert.ok(files.includes(file.slice(3)),file+' English counterpart');
}
const hub=fs.readFileSync('docs/pt/learn/index.html','utf8');
assert.ok(hub.includes('Compreendendo a educação Waldorf (em inglês)')&&hub.includes('ainda não há uma versão em português'), 'Waldorf availability must be explicit');
const bank=JSON.parse(fs.readFileSync('content/passage-study.json','utf8'));
const translated=withPortugueseSourceLabels(bank);
for(const [i,p] of translated.entries()) {
 for(const field of ['titlePt','locatorPt','editionPt'])assert.ok(p[field]?.trim(),p.course+' missing '+field);
 for(const [key,value] of Object.entries(bank[i]))assert.deepEqual(p[key],value,'Historical source field changed: '+p.course+'/'+key);
 const numbers=text=>text.match(/\d+/g)||[];
 if(!bank[i].locatorPt)assert.deepEqual(numbers(p.locatorPt),numbers(p.locator),p.course+' source locator numbers changed in translation');
}
const catalogue=JSON.parse(fs.readFileSync('content/learning-system-catalogue.json','utf8'));
let descriptions=0;
for(const course of catalogue.courses)for(const part of course.parts)for(const group of part.groups)if(group.sourceSection) {
 assert.ok(group.sourceSectionPt?.trim(),course.route+'/'+group.id+' Portuguese source description');descriptions++;
}
for(const lesson of meditationLessons) {
 const html=fs.readFileSync(`docs/pt/meditation/${String(lesson.id).padStart(2,'0')}.html`,'utf8');
 assert.ok(html.includes(esc(lesson.refsPt)),'Translated meditation reference '+lesson.id);
 assert.ok(!html.includes(esc(lesson.refs)),'English meditation reference left in Portuguese session '+lesson.id);
 for(const id of lesson.texts)assert.ok(html.includes(esc(texts.find(t=>t.id===id).sourcePt)),'Translated verse source '+id);
}
const report={
 locale:'pt-BR',englishPages:english.length,portuguesePages:portuguese.length,pairedPages:portuguese.length,
 englishOnlyPages:missing.length,exceptions,localizedPassageMetadata:translated.filter((p,i)=>p!==bank[i]).length,localizedChapterSourceDescriptions:descriptions,
 reviewScope:['Coverage and document language checked across every HTML page.','Bilingual JSON question counts and answer indices compared separately: 780 paired blocks, 1,163 question/option entries; no structural mismatches.','Manual wording review: shared hubs, source labels, meditation references and selected teaching passages from Foundations, Esoteric Christianity, Introduction, Biodynamics, Agriculture, Foodwise, Encountering the Self, Ancient Myths and Meditation.','This is not a sentence-by-sentence certification of all 613 Portuguese pages.'],
 waldorfTranslation:'missing'
};
if(process.argv.includes('--report'))fs.writeFileSync('content/portuguese-language-review.json',JSON.stringify(report,null,2)+'\n');
console.log(`Portuguese checks passed: ${portuguese.length} paired pages, ${translated.length} localized passage records, ${descriptions} source descriptions. English-only: ${exceptions.waldorf.pages.length} Waldorf, ${exceptions.nutrition.pages.length} Nutrition, ${exceptions.research.pages.length} research notes.`);
