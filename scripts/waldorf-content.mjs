import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {Marked} from './vendor/marked/marked.mjs';

export const packageRoot = new URL('../waldorf-course/', import.meta.url);
export const rootRoute = 'learn/waldorf/';
export const groups = {foundations:'Foundations', development:'Development', grades:'Grades 1–9', subjects:'Subject pathways', parents:'Parent questions'};
export const states = {'draft-copy':'Lesson draft','draft-dossier':'Research dossier','draft-outline':'Draft outline',placeholder:'Placeholder'};
const overrides = {
 'foundations/02-first-waldorf-school.md':'foundations/first-waldorf-school.html',
 'foundations/07-development-determines-curriculum.md':'foundations/development-determines-curriculum.html',
 'foundations/08-imagination-before-abstraction.md':'foundations/imagination-before-abstraction.html',
 'foundations/09-teaching-through-art.md':'foundations/teaching-through-art.html',
 'foundations/15-music-and-singing.md':'foundations/music.html',
 'development/21-ages-seven-to-nine.md':'development/ages-7-9.html',
 'development/23-ages-nine-to-twelve.md':'development/ages-9-12.html',
 'development/24-threshold-of-causality.md':'development/age-12-causality.html',
 'development/25-puberty-and-authority.md':'development/puberty-authority.html',
 'development/26-adolescence-and-judgment.md':'development/adolescence-judgment.html',
 'subjects/eurythmy-and-movement.md':'subjects/movement-eurythmy.html'
};
export function loadWaldorfContent() {
 return Object.keys(groups).flatMap(group => fs.readdirSync(new URL(group+'/',packageRoot)).filter(f=>f.endsWith('.md')).sort().map(name=>{
  const source = group+'/'+name, raw = fs.readFileSync(new URL(source,packageRoot),'utf8');
  const front = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) throw Error('Missing frontmatter: '+source);
  const title = front[1].match(/^title: "(.*)"$/m)?.[1];
  const state = front[1].match(/^status: (.*)$/m)?.[1];
  if (!title || !states[state] || !/^source_verification: pending$/m.test(front[1])) throw Error('Invalid content status: '+source);
  let route = overrides[source] || group+'/'+name.replace(/^\d+-/,'').replace(/\.md$/,'.html');
  const grade = group === 'grades' ? Number(name.match(/\d+/)[0]) : null;
  if (grade) route = `grades/grade-${grade}/index.html`;
  return {source,group,title,state,grade,route:rootRoute+route,id:group+'-'+name.replace(/\.md$/,''),raw,body:raw.slice(front[0].length).replace(/^\s*# .*\n/,''),sha256:createHash('sha256').update(raw).digest('hex')};
 }));
}
export const gradeViews = ['child','curriculum','why-now'];
// Package/editorial notes belong in the source panel. Preserve every original
// Markdown block and its relative order within each presentation area.
export function waldorfPresentation(item) {
 const tokens=new Marked({gfm:true}).lexer(item.body),blocks=[];let sourceDepth=null,archiveDepth=null;
 for(const token of tokens) {
  if(token.type==='heading'&&archiveDepth!==null&&token.depth<=archiveDepth)archiveDepth=null;
  if(token.type==='heading'&&/^(?:Unresolved citation records|Completion work still required)$/i.test(token.text))archiveDepth=token.depth;
  if(token.type==='heading'&&sourceDepth!==null&&token.depth<=sourceDepth)sourceDepth=null;
  if(token.type==='heading'&&/^(?:Provenance and reading status|Unresolved citation records|Sources and (?:origins|connections)|\d+\. Grade \d+ source map|\d+\. Source discipline for Grade \d+)$/i.test(token.text))sourceDepth=token.depth;
  const plain=token.raw.replace(/^[>\s]+/,'').replace(/\*/g,'');
  const editorial=sourceDepth!==null ||
   (token.type==='heading'&&token.text==='Established course copy') ||
   (token.type==='blockquote'&&/^Status:/.test(plain)) ||
   (token.type==='paragraph'&&/^(?:Status:|Course:|Source trace:|Source: conversation|See \[Sources and provenance\]|This file preserves|Provenance and citation note:)/.test(plain));
  const trace=token.type==='paragraph'&&(/^(?:Source trace:|Source: conversation|Source: same message|Retrieval note:|This file preserves)/i.test(plain)||/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(plain));
  const archive=archiveDepth!==null || trace ||
   (token.type==='heading'&&token.text==='Established course copy') ||
   (token.type==='blockquote'&&/^Status:/.test(plain)) ||
   (token.type==='paragraph'&&/^(?:Status:|Course:)/.test(plain));
  // Retain the supplied qualifications after a trace, without publishing IDs.
  const qualification=trace?token.raw.match(/(?:This (?:remains|is)|These are|The outline records|It overlaps|No PDF)\b[\s\S]*$/)?.[0]:null;
  blocks.push({raw:token.raw,editorial:editorial||archive,archive,displayRaw:archive?(qualification||''):token.raw});
 }
 return {blocks,reading:blocks.filter(b=>!b.editorial).map(b=>b.raw).join(''),editorial:blocks.filter(b=>b.editorial).map(b=>b.displayRaw).join('\n'),archived:blocks.filter(b=>b.archive).map(b=>b.raw).join('')};
}
export function waldorfRoutes(items = loadWaldorfContent()) {
 return [...['index.html','orientation.html','status.html','sources/index.html',...Object.keys(groups).map(g=>g+'/index.html')].map(r=>rootRoute+r),...items.flatMap(i=>[i.route,...(i.grade?gradeViews.map(v=>i.route.replace('index.html',v+'.html')):[])])];
}
// Explicit selections of intact numbered dossier sections. The complete dossier
// remains on the grade landing page; excerpts never replace the source file.
export const gradeSelections = {
 1:{child:[1,2,3,4,5,20,24,27],curriculum:[7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23], 'why-now':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,24,25,26,28]},
 2:{child:[1,2,7,8,28,30],curriculum:[3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,29], 'why-now':[1,2,3,4,5,6,7,8,9,10,13,15,18,23,24,25,27,28,30,31]},
 3:{child:[1,7],curriculum:[2,3,4,5,6], 'why-now':[1,2,3,4,7]},
 4:{child:[1],curriculum:[2,3,4,5,6,7], 'why-now':[1,2,3,4,5]},
 5:{child:[1,3],curriculum:[2,3,4,5,6,7], 'why-now':[1,2,3,4,5,6]},
 6:{child:[1],curriculum:[2,3,4,5,6,7], 'why-now':[1,2,3,4,5,6]},
 7:{child:[1],curriculum:[2,3,4,5,6,7,8], 'why-now':[1,2,3,4,5]},
 8:{child:[1],curriculum:[2,3,4,5,6,7,8,9], 'why-now':[1,2,3,4,8,9]},
 9:{child:[1,2],curriculum:[3,4,5,6,7,8,9,10,11], 'why-now':[1,2,3,4,5,6,7,8,9,10,11]}
};
