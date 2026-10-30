/* Theosophy review layout. Moves existing nodes; never reads or writes study storage. */
(() => {
  'use strict';
  if (!document.body.hasAttribute('data-theosophy-workspace')) return;
  const main = document.querySelector('main[data-concept-course="theosophy"]');
  if (!main) return;
  const pt = document.documentElement.lang === 'pt-BR';
  const say = (en, br) => pt ? br : en;
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  };
  const panel = (node, title, id) => {
    if (!node) return;
    const wrapper = make('details', 'tw-panel');
    wrapper.id = id;
    wrapper.append(make('summary', '', title));
    node.before(wrapper); wrapper.append(node);
    return wrapper;
  };
  const overview = main.querySelector('.cp-course');
  if (overview) {
    const hero = overview.querySelector('.cp-course-hero');
    const modules = overview.querySelector('.cp-modules');
    const progress = overview.querySelector('.cp-course-progress');
    const synthesis = overview.querySelector('.cp-synthesis-entry');
    // Keep introductions and guidance intact, below the early curriculum.
    const about = make('details', 'tw-panel tw-about');
    about.id = 'course-guidance';
    about.append(make('summary', '', say('About this course and how to study', 'Sobre o curso e como estudar')));
    for (const node of [...overview.children]) {
      if (node === hero || node === progress) continue;
      if (node === modules) break;
      about.append(node);
    }
    const subtitle = hero.querySelector('.cp-lead');
    if (subtitle) about.append(subtitle);
    for (const paragraph of [...hero.querySelectorAll(':scope > p:not(.cp-label):not(.cp-question)')]) about.append(paragraph);
    hero.after(progress, modules);
    if (synthesis) modules.after(synthesis);
    (synthesis || modules).after(about);
    for (const [index, section] of [...modules.querySelectorAll('.cp-module')].entries()) {
      const details = make('details', 'tw-module');
      const summary = make('summary');
      summary.append(section.querySelector('h3'));
      const status = section.querySelector('[data-concept-module-summary]');
      if (status) summary.append(status);
      details.append(summary);
      const lessonList=section.querySelector('.cp-lesson-list');
      if(lessonList)details.append(lessonList);
      for (const child of [...section.childNodes]) details.append(child);
      details.open = index === 0;
      section.append(details);
    }
    panel(overview.querySelector('.cp-sources'), say('Sources and context', 'Fontes e contexto'), 'course-sources');
    document.body.classList.add('tw-ready', 'tw-overview');
  } else {
    const article = main.querySelector('.cp-lesson, .cp-synthesis');
    const map = article?.querySelector('.cp-module-navigation');
    const navigation = article?.querySelector('.cp-lesson-navigation');
    if (!article || !map || !navigation) return;
    const breadcrumb = article.querySelector('.cp-breadcrumb');
    const toolbar = make('div', 'tw-toolbar');
    const position = make('span', 'tw-position');
    const order = JSON.parse(main.dataset.conceptOrder);
    position.textContent = `${say('Lesson', 'Lição')} ${order.indexOf(main.dataset.conceptLesson) + 1} ${say('of', 'de')} ${order.length}`;
    const home = breadcrumb.querySelector('a').cloneNode(true);
    toolbar.append(home, position);
    main.before(toolbar);
    const sidebar = make('aside', 'tw-sidebar');
    sidebar.setAttribute('aria-label', say('Course curriculum', 'Currículo do curso'));
    sidebar.append(map);
    map.open = true;
    main.prepend(sidebar);
    const jump = make('nav', 'tw-section-links');
    jump.setAttribute('aria-label', say('In this lesson', 'Nesta lição'));
    const reading = article.querySelector('.cp-first-reading,[data-flow-step="question"]');
    reading.id ||= 'short-reading';
    const depth = article.querySelector('.cp-retained-depth');
    depth.id ||= 'full-reading';
    const sources = panel(article.querySelector('.cp-sources'), say('Sources and context', 'Fontes e contexto'), 'lesson-sources');
    const study = panel(article.querySelector('.cp-study-controls'), say('Personal study', 'Estudo pessoal'), 'personal-study');
    // Original source anchors, controls and aria-labelledby headings stay intact.
    for (const [id, text] of [[reading.id,say('Lesson','Lição')],[depth.id,say('Go deeper','Aprofundar')],[sources.id,say('Sources','Fontes')],[study.id,say('My study','Meu estudo')]]) {
      const a = make('a','',text); a.href = '#' + id; jump.append(a);
    }
    reading.before(jump);
    const index = make('nav', 'tw-depth-index');
    index.setAttribute('aria-label', say('Deeper reading sections', 'Seções de aprofundamento'));
    index.append(make('p','',say('Explore a section', 'Explore uma seção')));
    for (const section of depth.children) {
      const heading = section.querySelector?.('h2');
      if (!heading) continue;
      section.id ||= `depth-section-${index.children.length}`;
      const a = make('a','',heading.textContent); a.href = '#' + section.id; index.append(a);
    }
    depth.querySelector(':scope > summary').after(index);
    navigation.classList.add('tw-pagination');
    const shortLabels = [say('← Previous', '← Anterior'),say('Next →', 'Próxima →')];
    [...navigation.querySelectorAll('a')].forEach((a,i) => {
      const title = a.textContent;
      a.replaceChildren(make('span','tw-nav-label', shortLabels[i]),make('span','tw-nav-title',title));
      if (i === 1 && !a.getAttribute('href').includes('/lessons/') && a.getAttribute('href').includes('index.html')) a.firstChild.textContent = say('Course map →','Mapa do curso →');
    });
    const dialog = make('dialog', 'tw-drawer');
    dialog.id = 'chapter-drawer';
    dialog.setAttribute('aria-labelledby','chapter-drawer-title');
    const dialogHead = make('div','tw-drawer-heading');
    const heading = make('h2','',say('Chapters','Capítulos')); heading.id='chapter-drawer-title';
    const close = make('button','tw-close',say('Close','Fechar')); close.type='button';
    dialogHead.append(heading,close); dialog.append(dialogHead); main.append(dialog);
    const trigger = make('button','tw-chapters',say('Chapters','Capítulos')); trigger.type='button';
    trigger.setAttribute('aria-controls',dialog.id); trigger.setAttribute('aria-expanded','false'); trigger.setAttribute('aria-haspopup','dialog');
    toolbar.prepend(trigger);
    const mobile = matchMedia('(max-width: 1000px)');
    const siteNav = document.querySelector('.cp-header .system-nav');
    const siteHeader = siteNav?.parentElement;
    const closeDrawer = () => { if(dialog.open)dialog.close(); };
    trigger.addEventListener('click', () => {
      dialog.showModal(); document.body.classList.add('tw-drawer-open');
      trigger.setAttribute('aria-expanded','true'); close.focus();
      requestAnimationFrame(()=>map.querySelector('[aria-current="page"]')?.scrollIntoView({block:'nearest'}));
    });
    close.addEventListener('click',closeDrawer);
    dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;
      const targets=[...dialog.querySelectorAll('button,a[href],input,select,textarea,summary')].filter(node=>!node.disabled&&node.getClientRects().length&&getComputedStyle(node).display!=='none');
      const first=targets[0],last=targets.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDrawer();}});
    dialog.addEventListener('close',()=>{
      document.body.classList.remove('tw-drawer-open');trigger.setAttribute('aria-expanded','false');
      if(mobile.matches)trigger.focus();else home.focus();
    });
    const placeMap = () => {
      closeDrawer();
      (mobile.matches ? dialog : sidebar).append(map);
      if (siteNav) (mobile.matches ? dialog : siteHeader).append(siteNav);
      trigger.hidden = !mobile.matches;
      requestAnimationFrame(()=>{if(!mobile.matches){const current=map.querySelector('[aria-current="page"]');if(current)sidebar.scrollTop+=current.getBoundingClientRect().top-sidebar.getBoundingClientRect().top-80;}});
    };
    mobile.addEventListener('change',placeMap);placeMap();
    const measure = () => {
      document.documentElement.style.setProperty('--tw-bottom',`${navigation.getBoundingClientRect().height}px`);
      document.documentElement.style.setProperty('--tw-top',`${toolbar.getBoundingClientRect().height}px`);
    };
    new ResizeObserver(measure).observe(navigation);
    new ResizeObserver(measure).observe(toolbar);
    document.body.classList.add('tw-ready','tw-lesson');measure();
    window.addEventListener('beforeprint',closeDrawer);
  }
  function revealHash() {
    if (!location.hash) return;
    let target;
    try { target=document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if(!target)return;
    for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
    requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  }
  window.addEventListener('hashchange',revealHash);
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href^="#"]');
    if(a && a.hash===location.hash)revealHash();
  });
  revealHash();
  let printStates;
  window.addEventListener('beforeprint',()=>{
    if(printStates)return;
    printStates=[...main.querySelectorAll('details')].map(node=>[node,node.open]);
    for(const [node] of printStates)node.open=true;
  });
  window.addEventListener('afterprint',()=>{for(const [node,open] of printStates||[])node.open=open;printStates=null;});
})();
