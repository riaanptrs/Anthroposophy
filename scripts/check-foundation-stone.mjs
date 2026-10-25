import fs from 'node:fs';
import assert from 'node:assert/strict';
import {foundationTeaching,foundationPractice} from '../content/foundation-stone-teaching.mjs';
import {texts} from '../content/meditation-texts.mjs';
for(const lang of ['en','pt']){
 const prefix=lang==='pt'?'docs/pt':'docs',study=fs.readFileSync(prefix+'/meditation/06.html','utf8'),practice=fs.readFileSync(prefix+'/meditation/07.html','utf8');
 assert.equal(foundationTeaching[lang].movements.length,3);
 for(const m of foundationTeaching[lang].movements){assert.equal(m.fields.length,5);assert.ok(m.meaning.length>100&&m.question&&m.answer);}
 assert.equal((study.match(/data-foundation-movement=/g)||[]).length,3);
 for(const id of ['foundation-study','foundation-pathway','foundation-dialogue','foundation-map','foundation-translations','foundation'])assert.ok(study.includes(`id="${id}"`));
 assert.equal(foundationTeaching[lang].translationRows.length,3);
 assert.ok(study.includes('Geist-Erinnern')&&study.includes('Geist-Besinnen')&&study.includes('Geist-Erschauen'));
 assert.ok(study.includes('George Adams')&&study.includes('Pauline Wehrle')&&study.includes('Richard Seddon'));
 assert.ok(study.includes('In Christo morimur'));
 assert.ok(foundationTeaching[lang].source.includes('35–42'));
 assert.equal(foundationPractice[lang].plan.length,4);
 assert.ok(practice.includes('id="foundation-practice"')&&practice.includes('class="foundation-practice-excerpt"'));
 const excerpt=texts.find(t=>t.id==='foundation')[lang].split('\n\n')[0];assert.ok(excerpt.length>150);
 const index=fs.readFileSync(prefix+'/meditation/index.html','utf8');
 assert.ok(index.includes('47')&&index.includes('06.html#foundation-study')&&index.includes('07.html#foundation-practice'));
}
console.log('Passed: bilingual Foundation Stone study and practice, three human/cosmic relationships, original diagram, three-version term comparison, variant attribution, four-session learning plan and course entry links.');
