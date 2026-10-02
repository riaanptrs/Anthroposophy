/* Optional progress for this course. Reading and answer checks need no saved record. */
(() => {
  'use strict';
  const main = document.querySelector('main[data-introduction-owned="true"]');
  if (!main) return;

  const key = 'anthro-introduction-v1:progress';
  const validId = value => typeof value === 'string' && /^(0[1-9]|1\d|2[0-8])$/.test(value);
  const empty = () => ({version: 1, completedIds: [], lastLesson: null});
  const lesson = main.matches('[data-intro-study-id]') ? main : main.querySelector('[data-intro-study-id]');
  const studyId = validId(lesson?.dataset.introStudyId) ? lesson.dataset.introStudyId : null;
  const language = lesson?.dataset.introLanguage || main.dataset.introLanguage || document.documentElement.lang;
  const pt = language === 'pt' || language === 'pt-BR';
  const say = (en, br) => pt ? br : en;
  const buttons = [...main.querySelectorAll('button[data-intro-complete]')];
  const statuses = [...main.querySelectorAll('[data-intro-status]')];
  const links = [...main.querySelectorAll('a[data-intro-continue]')];
  const summaries = [...main.querySelectorAll('[data-intro-progress]')];
  const announce = message => { for (const status of statuses) status.textContent = message; };

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (!saved || typeof saved !== 'object' || Array.isArray(saved) || saved.version !== 1
        || !Array.isArray(saved.completedIds) || saved.completedIds.length > 28
        || !saved.completedIds.every(validId)
        || (saved.lastLesson !== null && !validId(saved.lastLesson))) return {state: empty(), exists: false};
      return {state: {version: 1, completedIds: [...new Set(saved.completedIds)], lastLesson: saved.lastLesson}, exists: true};
    } catch { return {state: empty(), exists: false}; }
  }

  let loaded = loadProgress();
  let state = loaded.state;
  let recordExists = loaded.exists;
  let unsaved = false;

  function saveProgress() {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      recordExists = true;
      unsaved = false;
      return true;
    } catch {
      unsaved = true;
      return false;
    }
  }

  function availableIds(element) {
    const raw = element.dataset.introAvailable || main.dataset.introAvailable || '';
    const ids = raw.split(',').map(value => value.trim());
    return ids.length && ids.every(validId) && new Set(ids).size === ids.length ? ids : [];
  }

  // Destinations come from the current language's route and available IDs, never stored URLs.
  function destination(link, id) {
    if (!validId(id) || !availableIds(link).includes(id)) return null;
    const route = location.pathname.match(/^(.*\/(?:pt\/)?introduction-to-anthroposophy\/)(?:index\.html|parts\/[a-z-]+\.html|lessons\/\d{2}\.html)?$/);
    if (!route) return null;
    try {
      const base = new URL(link.dataset.introLessonBase || 'lessons/', location.href);
      const expectedPath = route[1] + 'lessons/';
      if (base.origin !== location.origin || base.pathname !== expectedPath || base.search || base.hash) return null;
      const url = new URL(id + '.html', base);
      return url.origin === location.origin && url.pathname === expectedPath + id + '.html' ? url : null;
    } catch { return null; }
  }

  function render() {
    const complete = studyId && state.completedIds.includes(studyId);
    for (const button of buttons) {
      button.disabled = !studyId;
      button.setAttribute('aria-pressed', String(Boolean(complete)));
      button.textContent = complete
        ? say('Studied ✓ — mark unfinished', 'Estudada ✓ — marcar como não concluída')
        : say('Mark lesson studied', 'Marcar lição como estudada');
    }
    for (const link of links) {
      if (!link.dataset.introStart) link.dataset.introStart = link.getAttribute('href') || '';
      if (!link.dataset.introStartLabel) link.dataset.introStartLabel = link.textContent;
      const url = recordExists ? destination(link, state.lastLesson) : null;
      link.setAttribute('href', url ? url.href : link.dataset.introStart);
      const linkPt = (link.dataset.introLanguage || language) === 'pt' || (link.dataset.introLanguage || language) === 'pt-BR';
      link.textContent = url
        ? (linkPt ? `Continuar a lição ${Number(state.lastLesson)} →` : `Continue lesson ${Number(state.lastLesson)} →`)
        : link.dataset.introStartLabel;
    }
    for (const summary of summaries) {
      const ids = availableIds(summary).length ? availableIds(summary) : availableIds(links[0] || main);
      const count = ids.filter(id => state.completedIds.includes(id)).length;
      summary.textContent = recordExists || unsaved
        ? (unsaved
          ? say(`${count} of ${ids.length} available lessons marked studied for this visit.`, `${count} de ${ids.length} lições disponíveis marcadas como estudadas nesta visita.`)
          : say(`${count} of ${ids.length} available lessons marked studied on this device.`, `${count} de ${ids.length} lições disponíveis marcadas como estudadas neste dispositivo.`))
        : say('Study marks are optional. Marking a lesson saves progress on this device.', 'As marcações são opcionais. Ao marcar uma lição, o progresso é salvo neste dispositivo.');
    }
  }

  function remember() {
    // An initial visit does not opt in. A valid existing record permits remembering the lesson.
    if (!studyId || !recordExists || state.lastLesson === studyId) return;
    state.lastLesson = studyId;
    if (!saveProgress()) announce(say('Your mark stays here for this visit; saving is unavailable.', 'Sua marcação permanece nesta visita; o salvamento está indisponível.'));
  }

  function refresh() {
    if (!unsaved) {
      loaded = loadProgress();
      state = loaded.state;
      recordExists = loaded.exists;
    }
    render();
  }

  render();
  remember();
  render();
  for (const button of buttons) button.addEventListener('click', () => {
    if (!studyId) return;
    const ids = new Set(state.completedIds);
    if (ids.has(studyId)) ids.delete(studyId);
    else ids.add(studyId);
    state = {version: 1, completedIds: [...ids].sort(), lastLesson: studyId};
    const saved = saveProgress();
    render();
    announce(saved
      ? say('Study mark saved on this device.', 'Marcação de estudo salva neste dispositivo.')
      : say('Study mark changed for this visit. Saving is unavailable.', 'Marcação de estudo alterada nesta visita. O salvamento está indisponível.'));
  });
  window.addEventListener('pageshow', () => { refresh(); remember(); render(); });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) refresh(); });
})();
