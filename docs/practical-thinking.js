/* Optional local notes and study marks for Practical Training in Thought. */
(() => {
  'use strict';
  const main = document.querySelector('main[data-practical-thinking-owned="true"]');
  const route = location.pathname.match(/^((?:\/Anthroposophy)?\/(?:pt\/)?)practical-thinking\/(index\.html|tools\.html|source-notes\.html|lessons\/(?:0[0-9]|1[0-2])\.html|parts\/(?:practical|observation|training|judgment)\.html)$/);
  if (!main || !route) return;

  const pt = document.documentElement.lang === 'pt-BR';
  if (pt !== route[1].endsWith('/pt/')) return;
  const lang = pt ? 'pt' : 'en';
  // The current page supplies the site prefix and language. Stored URLs never supply destinations.
  const courseBase = route[1] + 'practical-thinking/';
  const sitePrefix = pt && route[1].endsWith('/pt/') ? route[1].slice(0, -3) : route[1];
  const matchLesson = route[2].match(/^lessons\/((?:0[0-9]|1[0-2]))\.html$/);
  const lessonId = matchLesson ? matchLesson[1] : null;
  if ((lessonId && main.dataset.thoughtRoute !== lessonId)
    || (!lessonId && main.hasAttribute('data-thought-route'))) return;

  const say = (en, br) => pt ? br : en;
  const core = ['00', '01', '10', '02', '03', '05', '06', '07', '08', '11', '12', '09'];
  const inventory = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const recordPrefix = 'anthro-study-v1:practical-thinking/';
  const preferenceKey = 'anthro-study-v1:enabled';
  const resumeKey = 'anthro-study-v1:practical-thinking:last';
  const globalResumeKey = 'anthro-study-v1:last';
  const validId = id => typeof id === 'string' && inventory.includes(id);
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const statuses = [...main.querySelectorAll('[data-thought-status]')];
  const saveBoxes = [...main.querySelectorAll('input[data-thought-save]')];
  const fields = [...main.querySelectorAll('textarea[data-thought-note]')]
    .filter(field => ['date', 'exercise', 'noticed', 'changed'].includes(field.dataset.thoughtNote));
  const completeButtons = [...main.querySelectorAll('button[data-thought-complete]')];
  const legacy = main.querySelector('[data-thought-legacy]');
  const legacyDetails = main.querySelector('[data-thought-legacy-details]');
  const journal = main.querySelector('[data-thought-journal]');
  const labels = {
    date: say('Date', 'Data'), exercise: say('Exercise', 'Exercício'),
    noticed: say('What I noticed', 'O que percebi'), changed: say('What changed', 'O que mudou'),
    first: say('First attempt', 'Primeira tentativa'), source: say('Reading connection', 'Ligação com a leitura'),
    after: say('Revised answer', 'Resposta revisada'), session1: say('Practice session 1', 'Sessão prática 1'),
    session2: say('Practice session 2', 'Sessão prática 2'), session3: say('Practice session 3', 'Sessão prática 3')
  };
  const fieldLabel = name => Object.hasOwn(labels, name) ? labels[name] : name;
  const announce = message => { for (const status of statuses) status.textContent = message; };
  const textValue = value => typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const hasNotes = notes => object(notes) && Object.values(notes).some(value =>
    typeof value === 'string' ? Boolean(value.trim()) : value !== null && value !== undefined);

  function get(key) {
    try { return {available: true, raw: localStorage.getItem(key)}; }
    catch { return {available: false, raw: null}; }
  }
  function read(key) {
    const result = get(key);
    if (!result.available || result.raw === null) return {...result, value: null, malformed: false};
    try { return {...result, value: JSON.parse(result.raw), malformed: false}; }
    catch { return {...result, value: null, malformed: true}; }
  }
  function readRecord(id) {
    const result = read(recordPrefix + id);
    const value = result.value;
    const malformed = result.malformed || (result.raw !== null && (!object(value)
      || ['en', 'pt'].some(language => value[language] !== undefined && !object(value[language]))
      || (value.complete !== undefined && typeof value.complete !== 'boolean')));
    return {...result, malformed, value: malformed || !object(value) ? {} : value};
  }
  function put(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch { return false; }
  }
  function remove(key) {
    try { localStorage.removeItem(key); return true; }
    catch { return false; }
  }
  let saving = get(preferenceKey).raw === 'yes';
  let loaded = lessonId ? readRecord(lessonId) : {available: true, raw: null, malformed: false, value: {}};
  let cached = loaded.value;
  let complete = cached.complete === true;
  let completeDirty = false;
  const pending = new Map();
  let timer;

  function destination(id) {
    return validId(id) ? new URL(courseBase + 'lessons/' + id + '.html', location.origin) : null;
  }
  function storedRoute(value) {
    if (!object(value) || value.course !== 'practical-thinking' || typeof value.url !== 'string') return null;
    try {
      const url = new URL(value.url, location.href);
      if (url.origin !== location.origin || url.search || url.hash) return null;
      const paths = [sitePrefix + 'practical-thinking/lessons/', sitePrefix + 'pt/practical-thinking/lessons/'];
      const prefix = paths.find(path => url.pathname.startsWith(path));
      if (!prefix) return null;
      const suffix = url.pathname.slice(prefix.length);
      const match = suffix.match(/^((?:0[0-9]|1[0-2]))\.html$/);
      return match && validId(match[1]) ? match[1] : null;
    } catch { return null; }
  }
  function remember() {
    if (!saving || !lessonId) return;
    const ok = put(resumeKey, JSON.stringify({course: 'practical-thinking', route: lessonId,
      url: destination(lessonId).href, title: main.querySelector('h1')?.textContent || ''}));
    if (!ok) announce(say('Saving is unavailable. Your text remains here; export a copy before leaving.',
      'Não foi possível salvar. Seu texto continua aqui; exporte uma cópia antes de sair.'));
  }
  function snapshot() {
    const notes = {...(object(cached[lang]) ? cached[lang] : {})};
    for (const field of fields) notes[field.dataset.thoughtNote] = field.value;
    return {...cached, [lang]: notes, complete};
  }
  function currentRecord(id) {
    return id === lessonId ? {value: snapshot(), raw: loaded.raw, malformed: loaded.malformed}
      : readRecord(id);
  }
  function restoreFields() {
    for (const field of fields) {
      const name = field.dataset.thoughtNote;
      if (!pending.has(name)) field.value = typeof cached[lang]?.[name] === 'string' ? cached[lang][name] : '';
    }
    if (!completeDirty) complete = cached.complete === true;
  }
  function lessonLabel(id) {
    const number = core.indexOf(id) + 1;
    return number ? say('Lesson ' + number, 'Lição ' + number)
      : say('Optional forecasting exercise', 'Exercício opcional de previsão');
  }
  function addNotes(parent, notes, excludeCurrent = false) {
    for (const [name, value] of Object.entries(object(notes) ? notes : {})) {
      if (excludeCurrent && ['date', 'exercise', 'noticed', 'changed'].includes(name)) continue;
      if (typeof value === 'string' && !value.trim()) continue;
      const heading = document.createElement('h3');
      const paragraph = document.createElement('p');
      heading.textContent = fieldLabel(name);
      paragraph.textContent = textValue(value);
      paragraph.style.whiteSpace = 'pre-wrap';
      parent.append(heading, paragraph);
    }
  }
  function renderLegacy() {
    if (!legacy || !legacyDetails) return;
    legacy.replaceChildren();
    // Reading older text remains available even when automatic saving is off.
    for (const language of ['en', 'pt']) {
      const notes = object(cached[language]) ? cached[language] : {};
      const keys = Object.keys(notes).filter(name => !['date', 'exercise', 'noticed', 'changed'].includes(name)
        && (typeof notes[name] !== 'string' || notes[name].trim()));
      if (!keys.length) continue;
      const heading = document.createElement('h3');
      heading.textContent = language === 'en' ? say('English notes', 'Anotações em inglês')
        : say('Portuguese notes', 'Anotações em português');
      legacy.append(heading);
      addNotes(legacy, notes, true);
    }
    legacyDetails.hidden = !legacy.children.length;
  }
  function renderComplete() {
    for (const button of completeButtons) {
      button.disabled = !lessonId;
      button.setAttribute('aria-pressed', String(complete));
      button.textContent = complete ? say('Studied ✓ — mark unfinished', 'Estudada ✓ — marcar como não concluída')
        : say('Mark lesson studied', 'Marcar lição como estudada');
    }
    for (const box of saveBoxes) {
      box.disabled = false;
      box.checked = saving;
    }
    for (const button of main.querySelectorAll('[data-thought-export], [data-thought-delete]')) button.disabled = !lessonId;
  }
  function renderProgress() {
    const marked = new Set();
    let anySaved = false;
    for (const id of core) {
      const record = currentRecord(id);
      if (record.raw !== null && !record.malformed) anySaved = true;
      if (record.value.complete === true) marked.add(id);
    }
    const visitOnly = completeDirty;
    for (const summary of main.querySelectorAll('[data-thought-progress]')) {
      const part = summary.dataset.thoughtProgress;
      const ids = part === 'all' ? core : /^[1-4]$/.test(part) ? core.slice((Number(part) - 1) * 3, Number(part) * 3) : [];
      if (!ids.length) continue;
      const count = ids.filter(id => marked.has(id)).length;
      summary.textContent = anySaved || visitOnly
        ? (visitOnly
          ? say(`${count} of ${ids.length} lessons marked studied, including this visit.`, `${count} de ${ids.length} lições marcadas como estudadas, incluindo esta visita.`)
          : say(`${count} of ${ids.length} lessons marked studied on this device.`, `${count} de ${ids.length} lições marcadas como estudadas neste dispositivo.`))
        : part === 'all' ? say('Study marks are optional. You can save them on this device.', 'As marcações de estudo são opcionais. Você pode salvá-las neste dispositivo.') : '';
    }
    const last = storedRoute(read(resumeKey).value) || storedRoute(read(globalResumeKey).value);
    for (const link of main.querySelectorAll('a[data-thought-resume]')) {
      if (!link.dataset.thoughtStart) link.dataset.thoughtStart = link.getAttribute('href') || '';
      if (!link.dataset.thoughtStartLabel) link.dataset.thoughtStartLabel = link.textContent;
      link.setAttribute('href', last ? destination(last).href : link.dataset.thoughtStart);
      link.textContent = last ? say('Continue: ' + lessonLabel(last) + ' →', 'Continuar: ' + lessonLabel(last) + ' →')
        : link.dataset.thoughtStartLabel;
      link.hidden = !last;
    }
  }
  function collect() {
    return inventory.flatMap(id => {
      const record = currentRecord(id);
      return record.malformed || hasNotes(record.value.en) || hasNotes(record.value.pt)
        ? [{id, ...record}] : [];
    });
  }
  function renderJournal() {
    if (!journal) return;
    const entries = collect();
    journal.replaceChildren();
    for (const button of main.querySelectorAll('[data-thought-journal-export]')) button.disabled = !entries.length;
    if (!entries.length) {
      const paragraph = document.createElement('p');
      paragraph.textContent = say('No saved practice notes are available on this device yet.',
        'Ainda não há anotações práticas salvas neste dispositivo.');
      journal.append(paragraph);
    }
    for (const entry of entries) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const link = document.createElement('a');
      summary.textContent = lessonLabel(entry.id);
      link.href = destination(entry.id).href;
      link.textContent = say('Open lesson', 'Abrir lição');
      details.append(summary, link);
      for (const language of ['en', 'pt']) {
        if (!hasNotes(entry.value[language])) continue;
        const heading = document.createElement('h3');
        heading.textContent = language === 'en' ? say('English notes', 'Anotações em inglês')
          : say('Portuguese notes', 'Anotações em português');
        details.append(heading);
        addNotes(details, entry.value[language]);
      }
      if (entry.malformed) {
        const paragraph = document.createElement('p');
        paragraph.textContent = say('This saved record could not be read. Export includes its original text.',
          'Não foi possível ler este registro salvo. A exportação inclui o texto original.');
        details.append(paragraph);
      }
      journal.append(details);
    }
  }
  function render() { renderComplete(); renderLegacy(); renderProgress(); renderJournal(); }

  function save() {
    clearTimeout(timer);
    if (!lessonId || !saving || (!pending.size && !completeDirty)) return;
    const fresh = readRecord(lessonId);
    if (!fresh.available || fresh.malformed) {
      announce(fresh.malformed
        ? say('The existing saved record could not be read and was kept unchanged. Export a copy of your text.',
          'Não foi possível ler o registro salvo existente; ele foi mantido. Exporte uma cópia do seu texto.')
        : say('Saving is unavailable. Your text remains here; export a copy before leaving.',
          'Não foi possível salvar. Seu texto continua aqui; exporte uma cópia antes de sair.'));
      return;
    }
    const next = {...fresh.value,
      [lang]: {...(object(fresh.value[lang]) ? fresh.value[lang] : {}), ...Object.fromEntries(pending)},
      ...(completeDirty ? {complete} : {}), updated: new Date().toISOString()};
    if (!put(recordPrefix + lessonId, JSON.stringify(next))) {
      announce(say('Saving is unavailable. Your text remains here; export a copy before leaving.',
        'Não foi possível salvar. Seu texto continua aqui; exporte uma cópia antes de sair.'));
      return;
    }
    pending.clear();
    completeDirty = false;
    loaded = {available: true, malformed: false, value: next, raw: JSON.stringify(next)};
    cached = next;
    restoreFields();
    render();
    announce(say('Saved on this device.', 'Salvo neste dispositivo.'));
    remember();
  }
  function download(name, text) {
    const url = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportEntry(entry) {
    const lines = [lessonLabel(entry.id), destination(entry.id).href];
    for (const language of ['en', 'pt']) {
      if (!object(entry.value[language])) continue;
      lines.push('', language === 'en' ? 'English' : 'Português');
      for (const [name, value] of Object.entries(entry.value[language])) lines.push('', fieldLabel(name), textValue(value));
    }
    lines.push('', say('Marked studied: ', 'Marcada como estudada: ') + String(entry.value.complete === true));
    if (entry.malformed && entry.raw !== null) lines.push('', say('Original unreadable saved record:', 'Registro original salvo que não pôde ser lido:'), entry.raw);
    return lines.join('\n');
  }
  function refresh() {
    saving = get(preferenceKey).raw === 'yes';
    if (lessonId) {
      const fresh = readRecord(lessonId);
      if (fresh.available && !fresh.malformed) {
        loaded = fresh;
        cached = fresh.value;
        restoreFields();
      }
    }
    render();
  }

  restoreFields();
  render();
  if (loaded.malformed) announce(say('An existing saved record could not be read. It has been kept unchanged; you can still practise and export.',
    'Não foi possível ler um registro salvo existente. Ele foi mantido; você pode praticar e exportar.'));
  else if (!loaded.available) announce(say('Storage is unavailable. You can practise here and export your notes.',
    'O armazenamento está indisponível. Você pode praticar aqui e exportar suas anotações.'));
  else if (loaded.raw !== null) announce(say('Your saved notes and study mark are available on this device.',
    'Suas anotações e marcação de estudo salvas estão disponíveis neste dispositivo.'));
  remember();
  renderProgress();

  for (const box of saveBoxes) box.addEventListener('change', () => {
    const wanted = box.checked;
    const ok = wanted ? put(preferenceKey, 'yes') : remove(preferenceKey);
    if (!ok) {
      for (const item of saveBoxes) item.checked = saving;
      announce(say('The saving setting could not be changed. Your text remains here; export a copy.',
        'Não foi possível alterar a opção de salvamento. Seu texto continua aqui; exporte uma cópia.'));
      return;
    }
    saving = wanted;
    renderComplete();
    announce(wanted ? say('Saving is enabled on this device.', 'O salvamento está ativado neste dispositivo.')
      : say('Automatic saving is off. Existing notes remain available until you delete them.',
        'O salvamento automático está desativado. As anotações existentes continuam disponíveis até serem excluídas.'));
    if (saving) { save(); remember(); }
    renderProgress();
  });
  for (const field of fields) field.addEventListener('input', () => {
    pending.set(field.dataset.thoughtNote, field.value);
    clearTimeout(timer);
    timer = setTimeout(save, 350);
    if (!saving) announce(say('Your text is here for this visit. Enable saving or export a copy to keep it.',
      'Seu texto permanece nesta visita. Ative o salvamento ou exporte uma cópia para conservá-lo.'));
  });
  for (const button of completeButtons) button.addEventListener('click', () => {
    if (!lessonId) return;
    complete = !complete;
    completeDirty = true;
    renderComplete();
    renderProgress();
    save();
    if (!saving) announce(say('Study mark changed for this visit. Enable saving to keep it.',
      'Marcação de estudo alterada nesta visita. Ative o salvamento para conservá-la.'));
  });
  for (const button of main.querySelectorAll('[data-thought-export]')) button.addEventListener('click', () => {
    if (!lessonId) return;
    download('practical-thinking-' + lessonId + '-notes.txt', exportEntry({id: lessonId, ...currentRecord(lessonId)}));
    announce(say('Notes exported in both languages, including earlier saved fields.',
      'Anotações exportadas nos dois idiomas, incluindo os campos salvos anteriores.'));
  });
  for (const button of main.querySelectorAll('[data-thought-journal-export]')) button.addEventListener('click', () => {
    const entries = collect();
    if (!entries.length) return;
    download('practical-thinking-journal.txt', entries.map(exportEntry).join('\n\n---\n\n'));
    announce(say('Practice notes exported in both languages.', 'Anotações práticas exportadas nos dois idiomas.'));
  });
  for (const button of main.querySelectorAll('[data-thought-delete]')) button.addEventListener('click', () => {
    if (!lessonId) return;
    if (!remove(recordPrefix + lessonId)) {
      announce(say('Saved notes could not be deleted. Your text remains here.',
        'Não foi possível excluir as anotações salvas. Seu texto continua aqui.'));
      return;
    }
    clearTimeout(timer);
    pending.clear();
    completeDirty = false;
    complete = false;
    cached = {};
    loaded = {available: true, raw: null, malformed: false, value: {}};
    for (const field of fields) field.value = '';
    if (storedRoute(read(resumeKey).value) === lessonId) remove(resumeKey);
    render();
    announce(say('Notes and the study mark for this lesson were deleted in both languages.',
      'As anotações e a marcação de estudo desta lição foram excluídas nos dois idiomas.'));
  });
  window.addEventListener('pagehide', save);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === preferenceKey || event.key === resumeKey
      || event.key === globalResumeKey || event.key?.startsWith(recordPrefix)) refresh();
  });
})();
