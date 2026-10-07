import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {loadWaldorfContent,waldorfRoutes,states,gradeSelections,gradeViews,waldorfPresentation} from './waldorf-content.mjs';
import {courseSequence,relatedReadingRoutes} from './waldorf-learning-path.mjs';

const items=loadWaldorfContent(),manifest=JSON.parse(fs.readFileSync('content/waldorf/manifest.json','utf8'));
assert.equal(items.length,62);
assert.deepEqual(manifest.pages,waldorfRoutes(items));
assert.equal(manifest.sourceVerification,'pending');
assert.deepEqual(manifest.content,items.map(({raw,body,...rest})=>rest),'Content manifest matches authoritative Markdown and fingerprints');
assert.deepEqual(Object.fromEntries(Object.keys(states).map(state=>[state,items.filter(i=>i.state===state).length])),{'draft-copy':6,'draft-dossier':9,'draft-outline':46,placeholder:1});
const titles=new Set();
const lesson=n=>items.find(i=>i.title.startsWith('Lesson '+n+' —'));
assert.equal(courseSequence(items,lesson(19)).next,lesson(20),'Foundation lessons continue into development');
assert.equal(courseSequence(items,lesson(20)).previous,lesson(19),'Development links back to the teaching methods');
assert.equal(courseSequence(items,lesson(26)).next.grade,1,'Development continues into Grade 1');
assert.equal(courseSequence(items,items.find(i=>i.grade===9)).atCourseEnd,true,'Grade 9 ends the main sequence');
for(const item of items.filter(i=>['foundations','subjects','parents'].includes(i.group))) {
 const routes=relatedReadingRoutes(item);
 assert.ok(routes.length>=2,item.source+' relevant follow-up readings');
 for(const route of routes)assert.ok(items.some(i=>i.route===route),item.source+' related topic exists');
}
assert.ok(fs.readFileSync('docs/learn/waldorf/index.html','utf8').includes('A suggested reading path'),'Course has a visible study route');
for(const route of manifest.pages) {
 const file='docs/'+route,html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,route+' has one h1');
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),'Unique title '+route);titles.add(title);
 assert.ok(html.includes('data-waldorf-owned="true"'),route+' owner');
 assert.ok(!html.includes('data-concept-platform-owned="true"'),route+' independent course ownership');
 assert.ok(html.includes('name="viewport"'),route+' viewport');
 assert.ok(html.includes('aria-label="Breadcrumb"'),route+' breadcrumbs');
 assert.ok(html.includes('aria-label="Waldorf course"'),route+' course navigation');
 if(/grades\/grade-\d\//.test(route))assert.ok(html.includes('class="wf-reading-frame"')&&html.includes('Educational intentions are not evidence of demonstrated outcomes'),route+' developmental qualifications accompany every grade view');
 assert.ok(!/:chatgpt-content-reference\{|sediment:\/\/|C:\\Users\\|\/workspace\/attachments\//.test(html),route+' no portable-looking internal citation tokens or private paths');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,route+' no duplicate IDs');
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#([^"]+))?"/g)) {
  if(/^[a-z]+:|^\/\//i.test(m[1]))continue;
  let target=path.resolve(path.dirname(file),m[1].split('?')[0]);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),route+' local target '+m[1]);
  if(m[2])assert.ok(fs.readFileSync(target,'utf8').includes(`id="${m[2]}"`),route+' target anchor '+m[2]);
 }
}
for(const item of items) {
 const presentation=waldorfPresentation(item);
 assert.equal(presentation.blocks.map(b=>b.raw).join(''),item.body,item.source+' original blocks remain intact');
 assert.ok(!/Source trace:|Established course copy|Completion work still required|Original content-reference index|assistant message|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(presentation.reading+'\n'+presentation.editorial),item.source+' public copy excludes package traces');
 const html=fs.readFileSync('docs/'+item.route,'utf8');
 assert.ok(html.includes(`data-content-state="${item.state}"`),item.source+' original state');
 assert.ok(html.includes('Source verification is pending'),item.source+' unverified sources');
 assert.ok(html.includes(`data-wf-copy="${item.source}"`),item.source+' full supplied content');
 assert.ok(html.includes('Sources &amp; Origins'),item.source+' source panel');
 if(item.state!=='draft-copy')assert.ok(html.includes('Awaiting final course copy'),item.source+' visible unfinished notice');
 if(item.grade)for(const view of gradeViews)assert.ok(gradeSelections[item.grade][view].length,item.source+' intentional reading view');
}
for(const file of ['docs/learn/index.html','docs/pt/learn/index.html'])assert.ok(fs.readFileSync(file,'utf8').includes('id="waldorf-course"'),file+' discoverable course');
console.log(`Passed Waldorf: ${manifest.pages.length} routes, 62 source fingerprints, states, source panels, titles, anchors, and integration.`);
