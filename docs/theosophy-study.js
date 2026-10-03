/* Optional Theosophy study marks. Reuses existing notebook records; no grading or requests. */
(() => {
  'use strict';
  const main = document.querySelector('.theosophy-study[data-theosophy-order]');
  if (!main) return;
  const pt = document.documentElement.lang === 'pt-BR';
  const say = (en, br) => pt ? br : en;
  // Shared answer controls run first; keep their behavior and shorten only this course's result.
  for (const quiz of main.querySelectorAll('fieldset.learning-quiz')) {
    quiz.addEventListener('click', event => {
      if (!event.target.closest?.('[data-check-answer]')) return;
      const feedback = quiz.querySelector('[data-quiz-feedback]');
      if (!feedback) return;
      if (quiz.dataset.feedback === 'correct') feedback.textContent = say('Correct.', 'Correto.');
      else if (quiz.dataset.feedback === 'retry') feedback.textContent = say('Try again.', 'Tente novamente.');
    });
  }
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const canonical = value => {
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    const raw = String(value).replace(/^theosophy\//, '');
    return /^\d{1,2}$/.test(raw) && Number(raw) <= 27
      ? 'theosophy/' + String(Number(raw)).padStart(2, '0') : null;
  };
  let order;
  try {
    const values = JSON.parse(main.dataset.theosophyOrder);
    if (!Array.isArray(values) || !values.length || values.length > 28) return;
    order = values.map(canonical);
    if (order.some(id => !id) || new Set(order).size !== order.length) return;
  } catch { return; }
  const valid = value => {
    const id = canonical(value);
    return order.includes(id) ? id : null;
  };
  const prefix = 'anthro-study-v1:';
  const pref = prefix + 'enabled';
  const lastKey = prefix + 'last';
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const read = key => { try { return JSON.parse(get(key) || 'null'); } catch { return null; } };
  const put = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const enabled = () => get(pref) === 'yes';
  const record = id => object(read(prefix + id));
  const studyId = valid(main.dataset.theosophyStudyId || '');
  const note = main.querySelector('[data-theosophy-note]');
  const buttons = [...main.querySelectorAll('[data-theosophy-complete]')];
  const saves = [...main.querySelectorAll('[data-theosophy-save]')];
  const statuses = [...main.querySelectorAll('[data-theosophy-status]')];
  const oldNotes = main.querySelector('[data-theosophy-old-notes]');
  const exportButton = main.querySelector('[data-theosophy-export]');
  const language = pt ? 'pt' : 'en';
  let complete = false, visitComplete = false, noteDirty = false, stateDirty = false, timer;
  const announce = text => { for (const status of statuses) status.textContent = text; };

  // The catalogue provides the order; a saved URL may resume only this course and site prefix.
  function safeResume(last) {
    if (!last || last.course !== 'theosophy' || typeof last.url !== 'string') return null;
    try {
      const current = location.pathname.match(/^(.*?)(?:pt\/)?(?:lessons\/\d{2}\.html|(?:read\/)?theosophy\/.*)$/);
      const url = new URL(last.url, location.href);
      const match = url.pathname.match(/^(.*?)(?:pt\/)?lessons\/(\d{2})\.html$/);
      const id = match && valid(match[2]);
      if (!current || !match || !id || match[1] !== current[1] || url.origin !== location.origin) return null;
      url.pathname = current[1] + (pt ? 'pt/' : '') + 'lessons/' + id.split('/')[1] + '.html';
      url.search = ''; url.hash = '';
      return {url, id};
    } catch { return null; }
  }

  function renderProgress() {
    const active = enabled();
    const resume = active ? safeResume(object(read(lastKey))) : null;
    const rows = [...main.querySelectorAll('[data-theosophy-progress]')];
    for (const row of rows) {
      const id = valid(row.dataset.theosophyProgress);
      if (!id) continue;
      const studied = active && record(id).complete === true;
      const current = !studied && (id === studyId || id === resume?.id);
      row.classList.toggle('is-studied', studied);
      row.classList.toggle('is-current', current);
      const label = row.querySelector('[data-theosophy-progress-label]');
      if (label) label.textContent = studied
        ? say('✓ Completed', '✓ Concluída')
        : current ? say('▶ Current', '▶ Atual') : say('○ Not started', '○ Não iniciada');
    }
    for (const summary of main.querySelectorAll('[data-theosophy-progress-summary]')) {
      const chapter = summary.dataset.theosophyChapter;
      const subset = [...new Set(rows.filter(row => !chapter || row.dataset.theosophyChapter === chapter)
        .map(row => valid(row.dataset.theosophyProgress)).filter(Boolean))];
      const ids = subset.length ? subset : chapter ? [] : order;
      const count = active ? ids.filter(id => record(id).complete === true).length : 0;
      summary.textContent = active
        ? say(`${count} of ${ids.length} readings completed on this device.`, `${count} de ${ids.length} leituras concluídas neste dispositivo.`)
        : say('Study marks are optional; saving keeps them on this device.', 'As marcações são opcionais; o salvamento as conserva neste dispositivo.');
    }
    for (const link of main.querySelectorAll('[data-theosophy-resume]')) {
      if (!link.dataset.theosophyStart) link.dataset.theosophyStart = link.getAttribute('href') || '';
      link.href = resume ? resume.url.href : link.dataset.theosophyStart;
    }
    for (const save of saves) save.checked = active;
  }

  function paintCompletion() {
    for (const button of buttons) {
      button.textContent = complete
        ? say('Completed ✓ — mark unfinished', 'Concluída ✓ — marcar como não concluída')
        : say('Mark reading completed', 'Marcar leitura como concluída');
      button.setAttribute('aria-pressed', String(complete));
    }
  }

  function restoreNotes() {
    if (!studyId || !enabled()) return;
    const saved = record(studyId), notes = object(saved[language]);
    if (note && !noteDirty) note.value = typeof notes.after === 'string' ? notes.after : '';
    if (!oldNotes) return;
    oldNotes.replaceChildren();
    for (const [key, title] of [['first', say('Earlier first attempt', 'Primeira tentativa anterior')], ['source', say('Earlier source note', 'Anotação anterior sobre a fonte')]]) {
      if (typeof notes[key] !== 'string' || !notes[key].trim()) continue;
      const heading = document.createElement('h3'), text = document.createElement('p');
      heading.textContent = title; text.textContent = notes[key];
      text.className = 'theosophy-saved-text'; oldNotes.append(heading, text);
    }
    oldNotes.hidden = !oldNotes.childNodes.length;
  }

  function remember() {
    if (!studyId || !enabled()) return;
    put(lastKey, {url: location.href.split('#')[0], title: main.querySelector('h1')?.textContent || '', course: 'theosophy'});
  }

  function saveNow() {
    if (!studyId || !enabled() || (!noteDirty && !stateDirty)) return;
    const previous = record(studyId);
    const updated = {...previous, complete, updated: new Date().toISOString()};
    if (note && noteDirty) updated[language] = {...object(previous[language]), after: note.value};
    if (put(prefix + studyId, updated)) {
      noteDirty = false; stateDirty = false; remember(); renderProgress();
      announce(say('Saved on this device.', 'Salvo neste dispositivo.'));
    } else announce(say('Saving is unavailable. Your work remains here; export your note before leaving.', 'Não foi possível salvar. Seu trabalho continua aqui; exporte a anotação antes de sair.'));
  }

  function refresh() {
    if (studyId) {
      complete = enabled() ? record(studyId).complete === true : visitComplete;
      paintCompletion(); restoreNotes();
    }
    renderProgress();
  }
  for (const control of [...buttons, ...saves, ...(exportButton ? [exportButton] : [])]) control.disabled = false;
  document.documentElement.classList.add('theosophy-js');
  refresh(); remember(); renderProgress();

  for (const save of saves) save.addEventListener('change', () => {
    if (save.checked) {
      try { localStorage.setItem(pref, 'yes'); }
      catch {
        save.checked = false;
        announce(say('Browser saving is unavailable. Reading and answer checks still work.', 'O salvamento não está disponível. A leitura e as perguntas continuam funcionando.'));
        return;
      }
      if (studyId) {
        const saved = record(studyId);
        if (!stateDirty) complete = saved.complete === true || visitComplete;
        restoreNotes(); paintCompletion();
        if (visitComplete) stateDirty = true;
        saveNow(); remember();
      }
      announce(say('Saving is enabled on this device.', 'O salvamento está ativado neste dispositivo.'));
    } else {
      clearTimeout(timer); visitComplete = complete;
      try { localStorage.removeItem(pref); }
      catch { announce(say('The browser could not change the saving preference.', 'O navegador não conseguiu mudar a preferência de salvamento.')); refresh(); return; }
      announce(say('Saving is off. Existing notes and marks remain on this device.', 'O salvamento está desativado. As anotações e marcações existentes permanecem neste dispositivo.'));
    }
    renderProgress();
  });

  for (const button of buttons) button.addEventListener('click', () => {
    if (!studyId) return;
    complete = !complete; visitComplete = complete; stateDirty = true;
    paintCompletion(); saveNow();
    if (!enabled()) announce(say('Mark changed for this visit. Enable saving to keep it.', 'Marcação alterada nesta visita. Ative o salvamento para conservá-la.'));
  });
  note?.addEventListener('input', () => {
    noteDirty = true; clearTimeout(timer); timer = setTimeout(saveNow, 450);
  });

  exportButton?.addEventListener('click', () => {
    if (!studyId) return;
    const saved = record(studyId), recordNotes = {...object(saved[language])};
    if (note) recordNotes.after = note.value;
    const labels = {first: say('Earlier first attempt', 'Primeira tentativa anterior'), source: say('Earlier source note', 'Anotação anterior sobre a fonte'), after: say('Personal note', 'Anotação pessoal')};
    const lines = [main.querySelector('h1')?.textContent || '', location.href.split('#')[0]];
    for (const lang of ['en', 'pt']) {
      const entries = lang === language ? recordNotes : object(saved[lang]);
      const parts = Object.entries(labels).filter(([key]) => typeof entries[key] === 'string' && entries[key].trim());
      if (parts.length) lines.push('\n' + (lang === 'pt' ? 'Português' : 'English'), ...parts.map(([key, label]) => '\n' + label + '\n' + entries[key]));
    }
    const url = URL.createObjectURL(new Blob([lines.join('\n')], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url;
    link.download = studyId.replace('/', '-') + '-notes.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(say('Notes exported.', 'Anotações exportadas.'));
  });
  window.addEventListener('pagehide', saveNow);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', event => { if (!event.key || event.key.startsWith(prefix)) refresh(); });
})();
