/* Course-specific navigation, shared reading layout. No study-storage access. */
(() => {
 'use strict';
 const data=document.getElementById('cw-data');if(!data)return;
 const config=JSON.parse(data.textContent),main=document.querySelector('main');if(!main)return;
 const pt=document.documentElement.lang==='pt-BR',lang=pt?'pt':'en',say=(a,b)=>pt?b:a;
 if(!location.pathname.endsWith('/'+config.page))return;
 const scope=location.pathname.slice(0,-config.page.length),url=r=>scope+(pt?'pt/':'')+r;
 const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 const anchor=(route,text)=>{const a=make('a','',text);a.href=url(route);return a;};
 const fold=(node,label,id)=>{const d=make('details','cw-panel');d.id=id;d.append(make('summary','',label));node.before(d);d.append(node);return d;};
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function curriculum(course){
  const nav=make('nav','cw-curriculum');nav.setAttribute('aria-label',say('Course curriculum','Currículo do curso'));
  nav.append(anchor(course.home,say('Course overview','Visão geral do curso')));
  const map=new Map(course.lessons.map(l=>[l.route,l]));
  course.groups.forEach((g,i)=>{const details=make('details','cw-module');const sum=make('summary','',g[lang]);details.append(sum);details.open=g.routes.includes(config.route)||(config.role==='overview'&&i===0);const list=make('ol');
   for(const route of g.routes){const l=map.get(route);if(!l)continue;const li=make('li'),a=anchor(route,l[lang]+(l.optional?say(' · optional',' · opcional'):''));if(route===config.route)a.setAttribute('aria-current','page');li.append(a);list.append(li);}details.append(list);nav.append(details);});
  return nav;
 }
 function lookup(nav,placeholder){
  const label=make('label','cw-search-label',placeholder),input=make('input');input.type='search';label.append(input);nav.before(label);
  input.addEventListener('input',()=>{const q=normalize(input.value.trim());for(const group of nav.querySelectorAll('.cw-module')){let count=0;for(const li of group.querySelectorAll('li')){const match=normalize(li.textContent).includes(q);li.hidden=!match;if(match)count++;}group.hidden=!count;if(q)group.open=!!count;}});
 }
 if(config.role==='catalogue'){
  const cards=[...main.querySelectorAll('.identity-directory-course,.identity-course-card,.platform-directory > li,.platform-card')];if(!cards.length)return;
  const heading=main.querySelector('h1'),intro=main.querySelector('.lead'),startHere=main.querySelector('.course-start-here');const guidance=make('details','cw-panel cw-catalogue-guidance');guidance.append(make('summary','',say('Learning paths and course guidance','Percursos de aprendizagem e orientação')));
  const grid=make('div','cw-catalogue-grid');cards.forEach(c=>{c.classList.add('cw-course-card');grid.append(c);});
  for(const n of [...main.childNodes])guidance.append(n);
  main.append(heading);if(intro)main.append(intro);if(startHere){const guide=make('details','cw-start-guide');guide.append(make('summary','',say('New here? Find your starting course','Chegando agora? Encontre seu curso inicial')),startHere);main.append(guide);}
  const label=make('label','cw-search-label',say('Find a course','Encontre um curso')),input=make('input');input.type='search';input.placeholder=say('Search by title or subject','Busque por título ou assunto');label.append(input);
  const subjectLabel=make('label','cw-subject-label',say('Browse by subject','Explorar por tema')),subject=make('select');
  const subjects=[['all','All subjects','Todos os temas'],['foundations','Getting started','Primeiros passos'],['thinking','Thinking & freedom','Pensar e liberdade'],['inner','Inner development','Desenvolvimento interior'],['education','Education & relationships','Educação e relações'],['nature','Nature & food','Natureza e alimentação'],['arts','Art & colour','Arte e cor'],['society','Society & culture','Sociedade e cultura']];
  for(const [value,en,pt]of subjects){const o=make('option','',say(en,pt));o.value=value;subject.append(o);}subjectLabel.append(subject);
  const filters=make('div','cw-catalogue-filters');filters.append(label,subjectLabel);
  const topics={foundations:['learn/foundations/','introduction-to-anthroposophy/','start-now/','learn/steiner-documentary/'],thinking:['philosophy-of-freedom/','practical-thinking/'],inner:['theosophy/','read/theosophy/','higher-worlds/','meditation/','according-to-luke/','learn/esoteric-christianity/'],education:['learn/waldorf/','temperaments/','mystery-temperaments/','understand-temperament/','understanding-temperaments/','encountering-the-self/','learn/phases/'],nature:['agriculture/','biodynamics/','what-is-biodynamics/','foodwise/','nutrition/','learn/bees/'],arts:['colour/'],society:['toward-threefold-society/','ancient-myths/']};
  for(const card of cards){
   const a=card.querySelector('h3 a,h2 a');if(!a)continue;
   const route=new URL(a.href).pathname.slice(scope.length).replace(/^pt\//,'');
   card.dataset.courseSubject=Object.keys(topics).find(k=>topics[k].some(prefix=>route.startsWith(prefix)))||'inner';
   let content=card.querySelector('.identity-course-copy,.identity-directory-copy');
   if(!content){content=make('div','identity-directory-copy');while(card.firstChild)content.append(card.firstChild);card.append(content);}
   const meta=config.catalogueCourses?.find(c=>c.route===route);
   if(meta){const m=make('p','cw-course-meta',say(`${meta.lessons} lessons · At your own pace`,`${meta.lessons} lições · No seu ritmo`));content.append(m);}
   const existingAction=card.querySelector('.identity-card-action,.cw-course-action');
   if(existingAction){existingAction.textContent=say('View course →','Ver curso →');existingAction.setAttribute('aria-label',say('View course: ','Ver curso: ')+a.textContent);const row=existingAction.closest('p')||existingAction;row.classList.add('cw-course-action-row');content.append(row);}
   if(!existingAction){const action=make('a','cw-course-action',say('View course →','Ver curso →'));action.href=a.href;action.setAttribute('aria-label',say('View course: ','Ver curso: ')+a.textContent);content.append(action);}
  }
  const clear=make('button','cw-reset-search',say('Clear filters','Limpar filtros'));clear.type='button';clear.hidden=true;
  const status=make('p','cw-results');status.setAttribute('role','status');const controls=make('nav','cw-catalogue-pages');controls.setAttribute('aria-label',say('Course results pages','Páginas dos resultados de cursos'));
  const previous=make('button','',say('Previous page','Página anterior')),next=make('button','',say('Next page','Próxima página'));previous.type=next.type='button';controls.append(previous,next);
  let at=0;const size=matchMedia('(max-width:600px)').matches?6:9;
  function paint(){const q=normalize(input.value.trim()),matches=cards.filter(c=>normalize(c.textContent).includes(q)&&(subject.value==='all'||c.dataset.courseSubject===subject.value));cards.forEach(c=>c.hidden=true);matches.slice(at*size,(at+1)*size).forEach(c=>c.hidden=false);status.textContent=matches.length?say(`${matches.length} ${matches.length===1?'result':'results'} · page ${at+1} of ${Math.ceil(matches.length/size)}`,`${matches.length} ${matches.length===1?'resultado':'resultados'} · página ${at+1} de ${Math.ceil(matches.length/size)}`):say('No courses match. Try another title or subject.','Nenhum curso encontrado. Tente outro título ou assunto.');previous.disabled=at===0;next.disabled=(at+1)*size>=matches.length;controls.hidden=matches.length<=size;clear.hidden=!q&&subject.value==='all';}
  input.addEventListener('input',()=>{at=0;paint();});previous.onclick=()=>{at--;paint();label.scrollIntoView({block:'start'});};next.onclick=()=>{at++;paint();label.scrollIntoView({block:'start'});};
  subject.addEventListener('change',()=>{at=0;paint();});clear.addEventListener('click',()=>{input.value='';subject.value='all';at=0;paint();input.focus();});
  main.append(filters,status,clear,grid,controls,guidance);paint();document.body.classList.add('cw-ready','cw-catalogue');
 } else if(config.role==='overview'){
  const course=config.course,heading=main.querySelector('h1');const original=make('div','cw-original-overview');while(main.firstChild)original.append(main.firstChild);
  const hero=make('section','cw-hero');hero.append(heading);const artwork=original.querySelector('.identity-course-art');if(artwork)hero.append(artwork);
  const lead=[...original.querySelectorAll('.lead,.subtitle,.cp-lead')].find(e=>e.textContent.trim().length>35&&e.textContent.trim().length<260);if(lead){lead.classList.add('cw-overview-lead');hero.append(lead);}
  const resume=original.querySelector('[data-study-resume],[data-ec-resume],[data-learning-resume],[data-intro-continue]');if(resume){resume.classList.add('cw-resume');hero.append(resume);}
  for(const summary of original.querySelectorAll('[data-intro-progress],[data-learning-progress-summary]')){summary.classList.add('cw-count');hero.append(summary);}
  const coreLessons=course.lessons.filter(l=>!l.optional),optionalCount=course.lessons.length-coreLessons.length;
  const first=coreLessons[0]||course.lessons[0];const start=anchor(first.route,say('Begin the course','Comece o curso'));start.className='cw-start';hero.append(start,make('p','cw-count',say(`${coreLessons.length} lessons${optionalCount?` + ${optionalCount} optional`:''} · choose a chapter or read in order`,`${coreLessons.length} lições${optionalCount?` + ${optionalCount} opcional`:''} · escolha um capítulo ou leia em sequência`)));
  const nav=curriculum(course);const wrapper=make('section','cw-overview-curriculum');wrapper.id='workspace-curriculum';wrapper.append(make('h2','',say('Your course curriculum','Currículo do curso')),nav);
  const about=make('details','cw-panel');about.append(make('summary','',say('About this course, sources and study tools','Sobre o curso, fontes e ferramentas de estudo')),original);
  main.append(hero,wrapper,about);lookup(nav,say('Find a lesson','Encontre uma lição'));
  document.body.classList.add('cw-ready','cw-overview');
 } else {
  const course=config.course,reading=make('article','cw-reading');while(main.firstChild)reading.append(main.firstChild);main.append(reading);
  // Essential teaching belongs beside its questions. Move existing nodes so
  // anchors, accessible descriptions, listeners and study identities survive.
  const firstReading=reading.querySelector('.batch-first-reading');
  if(firstReading&&course.id==='introduction-to-anthroposophy'){
   const questions=firstReading.querySelector('.batch-clarity-check')?.previousElementSibling;
   for(const selector of ['#member-cards','#world-relationships','#death-transition','#concept-architecture']){
    const aid=reading.querySelector(selector);if(aid)firstReading.insertBefore(aid,questions||null);
   }
   for(const selector of ['#pathways','.intro-progress-controls']){const tool=reading.querySelector(selector);if(tool)firstReading.after(tool);}
  }
  if(firstReading&&course.id==='foundations'){
   const notebook=reading.querySelector('.learning-notebook');if(notebook)firstReading.after(notebook);
  }
  const nav=curriculum(course),side=make('aside','cw-sidebar');side.setAttribute('aria-label',say('Course navigation','Navegação do curso'));side.append(nav);main.prepend(side);
  const resources=make('details','cw-module cw-resources');resources.append(make('summary','',say('Course resources','Recursos do curso')));
  for(const old of [...reading.querySelectorAll('.wf-breadcrumb,.wf-nav,.foodwise-nav,.learning-breadcrumb,.bio-breadcrumb,.ec-reference-nav')])if(!old.closest('details'))resources.append(old);
  if(resources.children.length>1)nav.append(resources);
  const index=course.lessons.findIndex(l=>l.route===config.route),current=course.lessons[index],coreLessons=course.lessons.filter(l=>!l.optional),coreIndex=coreLessons.findIndex(l=>l.route===config.route);
  const toolbar=make('div','cw-toolbar'),trigger=make('button','cw-chapters',say('Chapters','Capítulos'));trigger.type='button';
  const position=make('span','cw-position',current?.optional?say('Optional practice','Prática opcional'):index>=0?say(`Lesson ${coreIndex+1} of ${coreLessons.length}`,`Lição ${coreIndex+1} de ${coreLessons.length}`):say('Course reference','Referência do curso'));
  const home=anchor(course.home,say('Course','Curso'));home.title=course[lang];toolbar.append(trigger,home,position);main.before(toolbar);
  // Preserve special source-owned sequences, including optional practices and Waldorf branches.
  const oldSequence=reading.querySelector('.lesson-navigation,.foodwise-next,.wf-prev-next,.ec-lesson-nav,.learning-navigation');
  const oldLinks=oldSequence?[...oldSequence.querySelectorAll('a')]:[];
  const previous=oldLinks.find(a=>/←|previous|anterior/i.test(a.textContent));const next=oldLinks.find(a=>/→|next|próxim|seguinte/i.test(a.textContent)&&a!==previous);
  const bar=make('nav','cw-pagination');bar.setAttribute('aria-label',say('Lesson navigation','Navegação das lições'));
  const addDirection=(original,fallback,text)=>{if(!original&&!fallback)return;const a=original?original.cloneNode(true):anchor(fallback.route,fallback[lang]);let title=a.textContent.replace(/[←→]/g,'').replace(/^\s*(?:previous|next|anterior|próxima|seguinte)\s*:?\s*/i,'').trim();if(!title){const destination=course.lessons.find(l=>url(l.route)===a.pathname);title=destination?.[lang]||fallback?.[lang]||course[lang];}a.replaceChildren(make('span','cw-direction',text),make('span','cw-nav-title',title));a.removeAttribute('id');for(const attr of [...a.attributes])if(attr.name.startsWith('data-'))a.removeAttribute(attr.name);bar.append(a);};
  addDirection(previous,index>0?course.lessons[index-1]:{route:course.home,[lang]:course[lang]},say('← Previous','← Anterior'));
  if(index>=0)addDirection(next,course.lessons[index+1]||{route:course.home,[lang]:course[lang]},index===course.lessons.length-1&&!next?say('Course overview →','Visão geral →'):say('Next →','Próxima →'));
  else if(next)addDirection(next,null,say('Next →','Próxima →'));
  main.append(bar);if(oldSequence)oldSequence.hidden=true;
  if(course.id==='introduction-to-anthroposophy'&&index===course.lessons.length-1&&reading.querySelector('#pathways')){
   const last=bar.lastElementChild;last.href='#pathways';last.querySelector('.cw-direction').textContent=say('Next study →','Próximo estudo →');
  }
  const contents=make('nav','cw-section-links');contents.setAttribute('aria-label',say('In this lesson','Nesta lição'));
  const depth=reading.querySelector('.batch-retained-depth,.cp-retained-depth,.wf-original-record,.wf-retained-record');
  if(depth){depth.id||='workspace-depth';const a=make('a','',say('Go deeper','Aprofundar'));a.href='#'+depth.id;contents.append(a);}
  const studies=[...reading.querySelectorAll('.study-notebook,.learning-notebook,.ec-study-controls,.wf-study,.thought-study')].filter(e=>!e.closest('.cw-panel')&&!(course.id==='foundations'&&e.matches('.learning-notebook')));
  studies.forEach((e,i)=>{const d=fold(e,say('Personal study','Estudo pessoal'),'workspace-study-'+i);if(i===0){const a=make('a','',say('My study','Meu estudo'));a.href='#'+d.id;contents.append(a);}});
  const thought=reading.querySelector('.thought-practice');if(thought&&!studies.length){thought.id||='workspace-practice-study';const a=make('a','',say('My study','Meu estudo'));a.href='#'+thought.id;contents.append(a);}
  const sectionIndex=make('details','cw-page-index');sectionIndex.append(make('summary','',say('On this page','Nesta página')));const list=make('ul');
  [...reading.querySelectorAll('h2')].filter(h=>!h.closest('nav,dialog,.wf-original')).forEach((h,i)=>{h.id||='workspace-section-'+i;const li=make('li'),a=make('a','',h.textContent);a.href='#'+h.id;li.append(a);list.append(li);});sectionIndex.append(list);contents.append(sectionIndex);
  const h1=reading.querySelector('h1');(h1?.closest('header')||h1||reading.firstElementChild).after(contents);
  const drawer=make('dialog','cw-drawer');drawer.id='workspace-chapters';drawer.setAttribute('aria-labelledby','workspace-chapters-title');
  const drawerHead=make('div','cw-drawer-heading'),title=make('h2','',say('Chapters','Capítulos'));title.id='workspace-chapters-title';const close=make('button','',say('Close','Fechar'));close.type='button';drawerHead.append(title,close);drawer.append(drawerHead);main.append(drawer);
  trigger.setAttribute('aria-controls',drawer.id);trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
  const media=matchMedia('(max-width:1000px)'),siteNav=document.querySelector('body > header .system-nav'),header=siteNav?.parentElement;
  function closeDrawer(){if(drawer.open)drawer.close();}
  trigger.onclick=()=>{drawer.showModal();trigger.setAttribute('aria-expanded','true');document.body.classList.add('cw-drawer-open');close.focus();requestAnimationFrame(()=>nav.querySelector('[aria-current]')?.scrollIntoView({block:'nearest'}));};close.onclick=closeDrawer;
  drawer.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');document.body.classList.remove('cw-drawer-open');(media.matches?trigger:home).focus();});
  drawer.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...drawer.querySelectorAll('button,a[href],input,summary')].filter(x=>!x.disabled&&x.checkVisibility());const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  drawer.addEventListener('click',e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)closeDrawer();}});
  function place(){closeDrawer();(media.matches?drawer:side).append(nav);if(siteNav)(media.matches?drawer:header).append(siteNav);trigger.hidden=!media.matches;requestAnimationFrame(()=>{const a=nav.querySelector('[aria-current]');if(a&&!media.matches)side.scrollTop+=a.getBoundingClientRect().top-side.getBoundingClientRect().top-80;});}
  media.addEventListener('change',place);place();
  const measure=()=>{document.documentElement.style.setProperty('--cw-bottom',bar.getBoundingClientRect().height+'px');document.documentElement.style.setProperty('--cw-top',toolbar.getBoundingClientRect().height+'px');};const observer=new ResizeObserver(measure);observer.observe(bar);observer.observe(toolbar);
  document.body.classList.add('cw-ready','cw-lesson');measure();window.addEventListener('beforeprint',closeDrawer);
 }
 function reveal(){let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}if(!target)return;for(let n=target;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
 window.addEventListener('hashchange',reveal);document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.hash===location.hash)reveal();});if(location.hash)reveal();
 let printState;window.addEventListener('beforeprint',()=>{if(printState)return;printState=[...main.querySelectorAll('details,[hidden]')].map(e=>[e,e.open,e.hidden]);for(const [e]of printState){if(e.tagName==='DETAILS')e.open=true;if(e.matches('.cw-course-card,.cw-module,.cw-module li'))e.hidden=false;}});
 window.addEventListener('afterprint',()=>{for(const [e,open,hidden]of printState||[]){if(e.tagName==='DETAILS')e.open=open;e.hidden=hidden;}printState=null;});
})();
