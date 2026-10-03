/* Optional semantic study records. No requests, grading or automatic imports. */
(() => {
  'use strict';
  const root = document.querySelector('main[data-concept-platform-owned="true"][data-concept-course]');
  if (!root) return;
  const slug = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
  const course = root.dataset.conceptCourse;
  if (!slug.test(course)) return;
  const pt = document.documentElement.lang === 'pt-BR', language = pt ? 'pt' : 'en';
  const say = (en, br) => pt ? br : en;
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const states = ['not-started','exploring','studied','reviewed'];
  const labels = pt ? ['Não iniciada','Explorando','Estudada','Revisada'] : ['Not started','Exploring','Studied','Reviewed'];
  let order, routes;
  try {
    order = JSON.parse(root.dataset.conceptOrder); routes = JSON.parse(root.dataset.conceptRoutes);
    if (!Array.isArray(order) || !order.length || order.length > 150 || new Set(order).size !== order.length || !object(routes)) return;
    if (order.some(id => typeof id !== 'string' || !slug.test(id) || !new RegExp('^'+course+'/lessons/[a-z][a-z0-9]*(?:-[a-z0-9]+)*\\.html$').test(routes[id]))) return;
    if (new Set(order.map(id => routes[id])).size !== order.length) return;
  } catch { return; }
  const logicalPage = root.dataset.conceptPage;
  if (typeof logicalPage !== 'string' || !/^(?:pt\/)?[a-z][a-z0-9/-]*\.html$/.test(logicalPage) || logicalPage.split('/').some(part=>part==='..'||part==='.') || !location.pathname.endsWith('/'+logicalPage)) return;
  const scope = location.pathname.slice(0,-logicalPage.length);
  const currentPath = logicalPage.replace(/^pt\//,'');
  if (!new RegExp('^(?:'+course+'/(?:index\\.html|lessons/[a-z][a-z0-9-]*\\.html)|concepts/[a-z][a-z0-9-]*\\.html|practice/[a-z][a-z0-9-]*\\.html)$').test(currentPath)) return;
  const id = root.dataset.conceptLesson || null;
  if (id && (!order.includes(id) || routes[id] !== currentPath)) return;
  const prefix = 'anthro-concept-v1:', preference = prefix+'enabled';
  const keyFor = id => prefix+course+':'+id, lastKey = prefix+course+':last';
  const key = id ? keyFor(id) : null;
  const saves = [...root.querySelectorAll('[data-concept-save]')];
  const stateControl = root.querySelector('[data-concept-state]');
  const bookmark = root.querySelector('[data-concept-bookmark]');
  const note = root.querySelector('[data-concept-reflection]');
  const exportButton = root.querySelector('[data-concept-export]');
  const deleteButton = root.querySelector('[data-concept-delete]');
  const statuses = [...root.querySelectorAll('[data-concept-status]')];
  const dirty = new Set();
  let timer, session = {version:1,state:'not-started',bookmarked:false,en:{reflection:''},pt:{reflection:''}};
  function get(key) { try { return {raw:localStorage.getItem(key),blocked:false}; } catch { return {raw:null,blocked:true}; } }
  function read(key) {
    const stored = get(key);
    if (stored.blocked || stored.raw === null) return {...stored,value:null,malformed:false};
    try { const value = JSON.parse(stored.raw); return {...stored,value,malformed:!object(value)}; }
    catch { return {...stored,value:null,malformed:true}; }
  }
  function put(key,value) { try { localStorage.setItem(key,value); return true; } catch { return false; } }
  function remove(key) { try { localStorage.removeItem(key); return true; } catch { return false; } }
  const enabled = () => get(preference).raw === 'yes';
  const validRecord = value => object(value) && value.version === 1
    && (value.state === undefined || states.includes(value.state))
    && (value.bookmarked === undefined || typeof value.bookmarked === 'boolean')
    && ['en','pt'].every(lang => value[lang] === undefined || (object(value[lang]) && (value[lang].reflection === undefined || typeof value[lang].reflection === 'string')));
  function record(id) {
    const stored = read(keyFor(id));
    return {...stored,malformed:stored.malformed || (stored.value !== null && !validRecord(stored.value))};
  }
  function announce(message) { for (const status of statuses) status.textContent = message; }
  function problem(stored) {
    announce(stored.blocked
      ? say('Browser saving is unavailable. Your reflection remains here; export it before leaving.','O salvamento no navegador está indisponível. Sua reflexão continua aqui; exporte-a antes de sair.')
      : say('Saved work could not be opened and has been kept. Export a copy or explicitly delete this lesson’s saved study.','O estudo salvo não pôde ser aberto e foi preservado. Exporte uma cópia ou apague explicitamente o estudo salvo desta lição.'));
  }
  function restore() {
    if (!id) return;
    const stored = record(id);
    if (stored.blocked || stored.malformed) { problem(stored); return; }
    const saved = stored.value || {};
    if (!dirty.has('state')) session.state = saved.state || 'not-started';
    if (!dirty.has('bookmarked')) session.bookmarked = saved.bookmarked === true;
    for (const lang of ['en','pt']) if (!dirty.has(lang+'.reflection')) session[lang] = {...(saved[lang] || {}),reflection:saved[lang]?.reflection || ''};
  }
  function target(id,lang = language) { return new URL(scope+(lang === 'pt' ? 'pt/' : '')+routes[id],location.origin).href; }
  function resume() {
    const stored = read(lastKey), last = stored.value;
    if (stored.malformed || !last || last.version !== 1 || !order.includes(last.id) || typeof last.url !== 'string') return null;
    try {
      const url = new URL(last.url);
      if (url.origin !== location.origin || ![target(last.id,'en'),target(last.id,'pt')].some(href=>new URL(href).pathname === url.pathname)) return null;
      return target(last.id);
    } catch { return null; }
  }
  function remember() {
    if (!id || !enabled()) return;
    const previous = read(lastKey);
    if (previous.blocked || previous.malformed || (previous.value && previous.value.version !== 1)) return;
    put(lastKey,JSON.stringify({...previous.value,version:1,id,url:target(id),updated:new Date().toISOString()}));
  }
  function paint() {
    for (const save of saves) { save.disabled=false;save.checked=enabled(); }
    if (stateControl) { stateControl.disabled=false;stateControl.value=session.state; }
    if (bookmark) { bookmark.disabled=false;bookmark.setAttribute('aria-pressed',String(session.bookmarked));bookmark.textContent=session.bookmarked?say('Bookmarked','Favorita'):say('Bookmark this lesson','Favoritar esta lição'); }
    if (note && note.value !== session[language].reflection) note.value=session[language].reflection;
    if (exportButton) exportButton.disabled=false;
    if (deleteButton) deleteButton.disabled=false;
    const forId = entry => { if(entry === id)return session;const stored=record(entry);return !stored.blocked&&!stored.malformed ? stored.value||{} : {}; };
    for (const row of root.querySelectorAll('[data-concept-progress]')) {
      const entry=row.dataset.conceptProgress;if(!order.includes(entry))continue;
      const saved=forId(entry),state=states.includes(saved.state)?saved.state:'not-started';
      row.dataset.conceptSavedState=state;
      const label=row.querySelector('[data-concept-progress-label]');if(label)label.textContent=labels[states.indexOf(state)];
      const flag=row.querySelector('[data-concept-bookmark-label]');if(flag)flag.hidden=saved.bookmarked!==true;
    }
    const studied = ids => ids.filter(entry=>['studied','reviewed'].includes(forId(entry).state)).length;
    for (const summary of root.querySelectorAll('[data-concept-progress-summary]')) summary.textContent=say(`${studied(order)} of ${order.length} lessons studied. Study marks are optional.`,`${studied(order)} de ${order.length} lições estudadas. As marcas de estudo são opcionais.`);
    for (const summary of root.querySelectorAll('[data-concept-module-summary]')) {
      try { const members=JSON.parse(summary.dataset.conceptMembers).filter(entry=>order.includes(entry));summary.textContent=say(`${studied(members)} of ${members.length} studied`,`${studied(members)} de ${members.length} estudadas`); }catch{}
    }
    for (const anchor of root.querySelectorAll('[data-concept-resume]')) { const href=resume();anchor.hidden=!href;if(href)anchor.href=href; }
  }
  function saveNow() {
    clearTimeout(timer);
    if (!id || !enabled() || !dirty.size) return true;
    const stored=record(id);
    if(stored.blocked||stored.malformed){problem(stored);return false;}
    const next={...(stored.value||{}),version:1,updated:new Date().toISOString()};
    if(dirty.has('state'))next.state=session.state;
    if(dirty.has('bookmarked'))next.bookmarked=session.bookmarked;
    for(const lang of ['en','pt'])if(dirty.has(lang+'.reflection'))next[lang]={...(stored.value?.[lang]||{}),reflection:session[lang].reflection};
    if(!put(key,JSON.stringify(next))){problem({blocked:true});return false;}
    dirty.clear();restore();remember();paint();announce(say('Saved in this browser.','Salvo neste navegador.'));return true;
  }
  function changed(field) {
    dirty.add(field);clearTimeout(timer);paint();
    if(enabled())timer=setTimeout(saveNow,400);
    else announce(say('This change is only here for this visit. Enable saving or export before leaving.','Esta alteração fica apenas nesta visita. Ative o salvamento ou exporte antes de sair.'));
  }
  restore();paint();remember();
  for(const save of saves)save.addEventListener('change',()=>{
    clearTimeout(timer);
    if(save.checked){
      if(!put(preference,'yes')){paint();problem({blocked:true});return;}
      restore();const ok=saveNow();remember();paint();if(ok)announce(say('Saving is on. Existing study marks remain separate from other courses.','O salvamento está ativo. As marcas existentes continuam separadas das de outros cursos.'));
    }else{
      const ok=saveNow();const removed=remove(preference);paint();
      if(!removed)problem({blocked:true});
      else announce(ok?say('Saving is off. Saved study has been kept.','O salvamento está desativado. O estudo salvo foi preservado.'):say('Saving is off. Saved work is kept; export your current reflection before leaving.','O salvamento está desativado. O estudo salvo foi preservado; exporte a reflexão atual antes de sair.'));
    }
  });
  stateControl?.addEventListener('change',()=>{if(states.includes(stateControl.value)){session.state=stateControl.value;changed('state');}});
  bookmark?.addEventListener('click',()=>{session.bookmarked=!session.bookmarked;changed('bookmarked');});
  note?.addEventListener('input',()=>{session[language].reflection=note.value;changed(language+'.reflection');});
  exportButton?.addEventListener('click',()=>{
    const stored=record(id),state=labels[states.indexOf(session.state)];
    const text=[root.querySelector('h1')?.textContent||id,target(id),state,session.bookmarked?say('Bookmarked','Favorita'):'','English',session.en.reflection,'Português',session.pt.reflection];
    if(stored.malformed&&stored.raw)text.push(say('Preserved unreadable saved work','Estudo salvo ilegível preservado'),stored.raw);
    const url=URL.createObjectURL(new Blob([text.join('\n\n')],{type:'text/plain;charset=utf-8'})),anchor=document.createElement('a');
    anchor.href=url;anchor.download=course+'-'+id+'-reflection.txt';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    announce(say('Reflection exported.','Reflexão exportada.'));
  });
  deleteButton?.addEventListener('click',()=>{
    clearTimeout(timer);
    if(!remove(key)){problem({blocked:true});return;}
    const last=read(lastKey);if(last.value?.id===id)remove(lastKey);
    dirty.clear();session={version:1,state:'not-started',bookmarked:false,en:{reflection:''},pt:{reflection:''}};paint();
    announce(say('This lesson’s saved study was deleted in both languages.','O estudo salvo desta lição foi apagado nos dois idiomas.'));
  });
  window.addEventListener('pagehide',saveNow);
  window.addEventListener('pageshow',()=>{restore();paint();remember();});
  window.addEventListener('storage',event=>{if(!event.key||event.key.startsWith(prefix)){clearTimeout(timer);restore();paint();}});
})();
