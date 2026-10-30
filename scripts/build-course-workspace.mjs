import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {relative} from './learning-html.mjs';
import {workspaceCourses} from './course-workspace-data.mjs';
export function refreshCourseWorkspaceAssets(){
 const hashes={};
 for(const asset of ['course-workspace.css','course-workspace.js']){fs.copyFileSync(new URL('./assets/'+asset,import.meta.url),'docs/'+asset);hashes[asset]=createHash('sha256').update(fs.readFileSync('docs/'+asset)).digest('hex').slice(0,12);}
 for(const route of fs.readdirSync('docs',{recursive:true}).filter(r=>r.endsWith('.html'))){const file=path.join('docs',route),html=fs.readFileSync(file,'utf8');const after=html.replace(/(\b(?:href|src)="[^"?]*\/(course-workspace\.(?:css|js)))(?:\?v=[^"]*)?("[^>]*>)/g,(_,href,asset,end)=>`${href}?v=${hashes[asset]}${end}`).replace(/(\b(?:href|src)="(course-workspace\.(?:css|js)))(?:\?v=[^"]*)?("[^>]*>)/g,(_,href,asset,end)=>`${href}?v=${hashes[asset]}${end}`);if(after!==html)fs.writeFileSync(file,after);}
}
export function buildCourseWorkspace(){
 const courses=workspaceCourses(),pages=[],assets=['course-workspace.css','course-workspace.js'];
 for(const asset of assets)fs.copyFileSync('scripts/assets/'+asset,'docs/'+asset);
 const hashes=Object.fromEntries(assets.map(a=>[a,createHash('sha256').update(fs.readFileSync('docs/'+a)).digest('hex').slice(0,12)]));
 const files=[];function walk(dir){for(const x of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,x.name);if(x.isDirectory())walk(f);else if(f.endsWith('.html'))files.push(f);}}walk('docs');
 for(const file of files){const page=file.slice(5).replaceAll('\\','/'),route=page.replace(/^pt\//,'');let course=courses.find(c=>c.lessons.some(l=>l.route===route)||c.home===route);
  const catalogue=['learn/index.html','books/index.html'].includes(route);
  // Course-owned companions retain their own content and existing sequence controls.
  if(!course&&!catalogue)course=courses.find(c=>c.id!=='foundations'&&c.id!=='theosophy-reading'&&route.startsWith(c.home.replace(/index.html$/,'')));
  if(!course&&!catalogue)continue;
  const role=catalogue?'catalogue':course.home===route?'overview':course.lessons.some(l=>l.route===route)?'lesson':/\/index\.html$/.test(route)?'section':'reference';
  // Source-owned overviews keep their chapter path, detailed studies and edition scope visible.
  if(['phases','philosophy-of-freedom'].includes(course?.id)&&role==='overview')continue;
  const config={page,route,role,course:course||null,...(catalogue?{catalogueCourses:courses.map(c=>({route:c.home,lessons:c.lessons.length}))}:{})};let html=fs.readFileSync(file,'utf8');
  if(html.includes('id="cw-data"'))throw Error('Workspace pass requires fresh build: '+file);
  const head=assets.map(a=>a.endsWith('.css')?`<link rel="stylesheet" href="${relative(file,'docs/'+a)}?v=${hashes[a]}">`:`<script defer src="${relative(file,'docs/'+a)}?v=${hashes[a]}"></script>`).join('');
  html=html.replace('</head>',head+'</head>').replace('</body>',()=>`<script type="application/json" id="cw-data">${JSON.stringify(config).replace(/</g,'\\u003c')}</script></body>`);
  fs.writeFileSync(file,html);pages.push({page,course:course?.id||null,role});
 }
 const report={courses:courses.map(({id,home,lessons,groups})=>({id,home,lessons:lessons.length,groups:groups.length})),pages};
 fs.mkdirSync('reviews/ux',{recursive:true});fs.writeFileSync('reviews/ux/course-workspace-coverage.json',JSON.stringify(report,null,2)+'\n');
 console.log(`Course workspace: ${courses.length} course adapters + approved Theosophy; ${pages.length} bilingual pages.`);
 return report;
}
