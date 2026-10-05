import assert from 'node:assert/strict';
import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync('content/foodwise/course.json','utf8'));
assert.equal(c.status,'published-ocr-edition');assert.equal(c.lessons.length,39);assert.equal(c.modules.length,7);
assert.equal(c.ingredients.length,23);assert.equal(c.recipes.length,3);
const chapters=new Set(c.lessons.flatMap(l=>l.chapters));for(let i=0;i<=20;i++)assert(chapters.has(i),`Chapter ${i} lacks teaching`);
const ingredients=new Set(c.ingredients.map(i=>i.slug)),recipes=new Set(c.recipes.map(r=>r.slug));
for(const lang of ['en','pt']){
 const root=`docs/${lang==='pt'?'pt/':''}foodwise/`;
 for(const l of c.lessons){
  assert(c.modules.some(m=>m.id===l.module));assert(l.pages.length);assert(l.pages.every(p=>Number.isInteger(p)&&p>0&&p<=272));
  for(const field of ['title','opening','teaching','connection','activity','question','answer'])assert(l[field][lang]?.length>5,`${l.id} ${field} ${lang}`);
  assert(l.teaching[lang].length>350,`${l.id} needs an explanation`);
  for(const i of l.ingredients)assert(ingredients.has(i));if(l.recipe)assert(recipes.has(l.recipe));
  const html=fs.readFileSync(root+`lessons/${String(l.id).padStart(2,'0')}.html`,'utf8');
  assert(html.includes('<details>')&&html.includes('<summary>'));assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert(html.includes('hreflang='));assert(!html.includes('<textarea'));assert(!html.includes('data-learning-id'));
  if(l.choices){assert.equal(l.choices.length,3);assert(l.correctChoice>=0&&l.correctChoice<3);assert(html.includes('data-foodwise-choice'));}
 }
 for(const r of c.recipes){assert.equal(r.provenance,'original-course-recipe');assert.equal(r.tested,false);for(const key of ['yieldEstimate','timeEstimate','equipment','doneness','substitutions','allergens','storage','childTask'])assert(r[key][lang]);assert(r.ingredients.every(i=>/\d+.*(g|ml)/.test(i[lang])));assert(r.steps.length>=3);const html=fs.readFileSync(root+`kitchen/${r.slug}.html`,'utf8');assert(html.includes(lang==='en'?'not kitchen-tested':'não testada na cozinha'));}
 const source=fs.readFileSync(root+'sources.html','utf8');assert(source.includes('32 MiB'));assert(source.includes('228'));assert(source.includes('235'));assert(source.includes('fda.gov'));assert(source.includes('niddk.nih.gov'));
}
assert.equal(c.lessons.filter(l=>l.choices).length,15);
const audit=JSON.parse(fs.readFileSync('content/foodwise/source-audit.json','utf8'));assert.equal(audit.source.pdfDownloaded,false);assert.equal(audit.source.metadataVisualVerification,false);
console.log('Foodwise checks passed: chapter coverage, bilingual explanations, optional questions, original untested recipes and source limits.');
