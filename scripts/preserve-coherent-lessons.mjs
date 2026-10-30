import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {esc,wholeElement} from './learning-html.mjs';

const ledger=JSON.parse(fs.readFileSync(new URL('../content/coherent-lesson-preservation.json',import.meta.url),'utf8'));
const ids=html=>[...html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)].map(m=>m[2]);

/** Preserve public deep links and two reviewed source annotations after owners
 * render a fresh lesson. The authored ledger removes any runtime Git dependency.
 */
export function preserveCoherentLessons(docsDir='docs'){
 const root=path.resolve(docsDir),report={baseline:ledger.baselineCommit,lessons:0,changedPages:0,anchorsAdded:0,sourceSectionsCovered:0,sourceSectionsRestored:0};
 for(const row of ledger.lessons){
  if(!/^(?:pt\/)?(?:learn|introduction-to-anthroposophy|theosophy)\/lessons\/[^/]+\.html$/.test(row.route)||row.route.includes('..'))throw Error('Invalid coherent lesson preservation route: '+row.route);
  const file=path.join(root,row.route);let html=fs.readFileSync(file,'utf8');const original=html;
  if(!/\sdata-lesson-flow=["']canonical["']/.test(html))throw Error('Preservation requires a canonical lesson: '+row.route);
  if(row.sourceOverride){
   report.sourceSectionsCovered++;
   const tag=html.match(/<section\b[^>]*\sid=["']source["'][^>]*>/)?.[0];
   const source=tag&&wholeElement(html,tag);
   if(!source)throw Error('Reviewed source section is missing: '+row.route);
   if(source!==row.sourceOverride.html){html=html.replace(source,row.sourceOverride.html);report.sourceSectionsRestored++;}
  }
  const present=new Set(ids(html)),missing=row.domIds.filter(id=>!present.has(id));
  if(missing.length){
   const opening=html.match(/<details\b[^>]*\sdata-flow-step=["']depth["'][^>]*>\s*<summary\b[^>]*>[\s\S]*?<\/summary>/)?.[0];
   if(!opening)throw Error('Optional depth section is missing: '+row.route);
   const anchors=missing.map(id=>`<span id="${esc(id)}" class="flow-legacy-anchor" aria-hidden="true"></span>`).join('');
   html=html.replace(opening,opening+anchors);report.anchorsAdded+=missing.length;
  }
  if(html!==original){fs.writeFileSync(file,html);report.changedPages++;}
  report.lessons++;
 }
 console.log(`Preserved ${report.lessons} coherent lessons: ${report.anchorsAdded} historical anchors added, ${report.sourceSectionsRestored} reviewed source sections restored.`);
 return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))preserveCoherentLessons(process.argv[2]||'docs');
