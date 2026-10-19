import fs from 'node:fs';
import {title as beesTitle,lessons as beesLessons} from '../content/bees/course.mjs';
import {sections as beesSections} from '../content/bees/reference.mjs';
import {modules as esotericModules} from '../content/esoteric-christianity/course.mjs';
import {loadWaldorfContent} from './waldorf-content.mjs';
const read=f=>JSON.parse(fs.readFileSync('content/'+f,'utf8'));
const strip=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const title=(route)=>strip(fs.readFileSync('docs/'+route,'utf8').match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||route);
const coverage=JSON.parse(fs.readFileSync('reviews/pedagogy/chapter-coverage.json')).records;
export function workspaceCourses(){
 const catalogue=read('learning-system-catalogue.json').courses;
 const homes={foundations:'learn/foundations/index.html','theosophy-reading':'read/theosophy/index.html',waldorf:'learn/waldorf/index.html'};
 const result=[];
 for(const id of [...new Set(coverage.map(r=>r.course))]){
  if(id==='learn/bees')continue; // Bees owns its source-defined adapter below.
  if(id==='theosophy')continue; // Approved semantic Theosophy has its own layout and storage UI.
  const home=homes[id]||id+'/index.html';
  const rows=coverage.filter(r=>r.course===id);
  const cat=catalogue.find(c=>c.route===(id==='theosophy-reading'?'theosophy':id));
  let lessons=rows.map(r=>({route:r.path.slice(5),en:title(r.path.slice(5)),pt:title(r.partner.slice(5))}));
  let groups=[];
  if(cat){
   const byId=new Map(cat.lessons.map(l=>[l.id,l.pathEn.slice(5)]));
   groups=cat.parts.map(p=>({en:p.titleEn,pt:p.titlePt,routes:p.groups.flatMap(g=>g.lessonIds||[]).map(n=>byId.get(n)).filter(Boolean)}));
   for(const l of lessons)l.optional=cat.lessons.find(x=>x.pathEn.slice(5)===l.route)?.optional===true;
   const order=cat.lessonIds.map(n=>byId.get(n));lessons.sort((a,b)=>order.indexOf(a.route)-order.indexOf(b.route));
  }
  if(id==='waldorf'){
   const items=loadWaldorfContent();const labels={foundations:['Foundations','Fundamentos'],development:['Development','Desenvolvimento'],grades:['Grades 1–9','Do 1º ao 9º ano'],subjects:['Subject pathways','Percursos das matérias'],parents:['Parent questions','Perguntas das famílias']};
   lessons=items.map(x=>({route:x.route,en:title(x.route),pt:title('pt/'+x.route),group:x.group}));
   groups=Object.entries(labels).map(([g,[en,pt]])=>({en,pt,routes:lessons.filter(x=>x.group===g).map(x=>x.route)}));
  }
  if(id==='foodwise'){const c=read('foodwise/course.json');groups=c.modules.map(m=>({en:m.title.en,pt:m.title.pt,routes:c.lessons.filter(l=>l.module===m.id).map(l=>'foodwise/lessons/'+String(l.id).padStart(2,'0')+'.html')}));}
  if(id==='biodynamics'){const c=read('biodynamic-agriculture-course.json');groups=c.parts.map(p=>({en:p.titleEn,pt:p.titlePt,routes:p.lessonIds.map(n=>'biodynamics/lessons/'+String(n).padStart(2,'0')+'.html')}));}

  if(id==='foundations'){
   const items=read('learning-system-sources.json'),en=['Entering Anthroposophy','The human being','Human destiny','The spiritual cosmos','Knowledge and freedom','Christ and human evolution','Anthroposophy in practice','Final synthesis'],pt=['Entrar na antroposofia','O ser humano','Destino humano','O cosmos espiritual','Conhecimento e liberdade','Cristo e evolução humana','Antroposofia na prática','Síntese final'];
   groups=en.map((label,i)=>({en:label,pt:pt[i],routes:items.filter(x=>x.part===i+1).map(x=>'learn/lessons/'+String(x.id).padStart(2,'0')+'.html')}));
  }
  if(id==='introduction-to-anthroposophy'){const c=read('introduction-anthroposophy-course.json');groups=c.parts.map(p=>({en:p.titleEn,pt:p.titlePt,routes:p.lessonIds.map(n=>id+'/lessons/'+String(n).padStart(2,'0')+'.html')}));}
  if(id==='learn/esoteric-christianity')groups=esotericModules.map(([en,pt],i)=>({en,pt,routes:lessons.slice(i*4,i*4+4).map(l=>l.route)}));
  if(id==='nutrition'){const c=read('nutrition/course.json');groups=[{en:'Orientation',pt:'Orientação',routes:['nutrition/00.html']},...c.chapters.map(ch=>({en:'Chapter '+ch.id,pt:'Capítulo '+ch.id,routes:c.lessons.filter(l=>l.chapter===ch.id).map(l=>'nutrition/'+String(l.id).padStart(2,'0')+'.html')})),{en:'Synthesis',pt:'Síntese',routes:['nutrition/17.html']}];}
  if(!groups.length){for(let i=0;i<lessons.length;i+=8)groups.push({en:`Lessons ${i+1}–${Math.min(i+8,lessons.length)}`,pt:`Lições ${i+1}–${Math.min(i+8,lessons.length)}`,routes:lessons.slice(i,i+8).map(l=>l.route)});}
  const included=new Set(groups.flatMap(g=>g.routes));const extra=lessons.filter(l=>!included.has(l.route));if(extra.length)groups.push({en:'Further readings and practices',pt:'Leituras e práticas complementares',routes:extra.map(l=>l.route)});
  const known=new Set(lessons.map(l=>l.route));groups=groups.map(g=>({...g,routes:[...new Set(g.routes)].filter(r=>known.has(r))})).filter(g=>g.routes.length);
  result.push({id,home,en:title(home),pt:title('pt/'+home),lessons,groups});
 }
 const beeRoute=l=>'learn/bees/lessons/'+String(l.id).padStart(2,'0')+'.html';
 result.push({id:'bees',home:'learn/bees/index.html',en:beesTitle.en,pt:beesTitle.pt,lessons:beesLessons.map(l=>({route:beeRoute(l),en:l.en.title,pt:l.pt.title})),groups:[...beesSections.filter(s=>s.id!=='drawings').map(s=>({en:s.en,pt:s.pt,routes:beesLessons.filter(l=>l.section===s.id).map(beeRoute)})),{en:'Final synthesis',pt:'Síntese final',routes:[beeRoute(beesLessons.at(-1))]}]});
 return result;
}
