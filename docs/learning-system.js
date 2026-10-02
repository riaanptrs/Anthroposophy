/* Local learning controls. No network requests or automatic grading of reflections. */
(() => {
  'use strict';
  document.documentElement.classList.add('learning-js');
  const portuguese = document.documentElement.lang === 'pt-BR';
  const say = (english, pt) => portuguese ? pt : english;
  const prefix = 'anthro-learning-v1:';
  const preference = prefix + 'enabled';
  const lastKey = prefix + 'last';
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const read = key => { try { return JSON.parse(get(key) || 'null'); } catch { return null; } };
  const put = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const remove = key => { try { localStorage.removeItem(key); return true; } catch { return false; } };
  const savingEnabled = () => get(preference) === 'yes';
  const lessonKey = id => prefix + 'lesson:' + id;
  const validId = id => /^\d{2}$/.test(id) && Number(id) >= 1 && Number(id) <= 36;

  // A wider table can scroll locally without widening the document itself.
  for (const table of document.querySelectorAll('main table')) {
    if (table.closest('.learning-table-scroll, [data-table-scroll], [role="region"]')) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'learning-table-scroll';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', table.caption?.textContent.trim() || say('Reading table', 'Tabela de leitura'));
    table.before(wrapper);
    wrapper.append(table);
  }

  for (const quiz of document.querySelectorAll('.learning-quiz')) {
    const fieldset = quiz.matches('fieldset') ? quiz : quiz.querySelector('fieldset');
    const choices = [...(fieldset?.querySelectorAll('input[type="radio"]') || [])];
    const check = quiz.querySelector('[data-check-answer]');
    const retry = quiz.querySelector('[data-retry]');
    const feedback = quiz.querySelector('[data-quiz-feedback]');
    const explanation = quiz.querySelector('details.answer-explanation');
    const answer = Number(fieldset?.dataset.answer);
    if (!fieldset || !choices.length || !check || !feedback || !Number.isInteger(answer) || answer < 0 || answer >= choices.length) continue;
    check.disabled = false;
    if (retry) { retry.disabled = false; retry.hidden = true; }
    check.addEventListener('click', event => {
      event.preventDefault();
      const selected = choices.findIndex(choice => choice.checked);
      if (selected < 0) {
        feedback.textContent = say('Choose an answer, or open the explanation below.', 'Escolha uma resposta ou abra a explicação abaixo.');
        fieldset.dataset.feedback = 'waiting';
        choices[0].focus();
        return;
      }
      const matches = selected === answer;
      fieldset.dataset.feedback = matches ? 'correct' : 'retry';
      feedback.textContent = matches
        ? say('That matches the reading. The explanation below shows why.', 'Isso corresponde à leitura. A explicação abaixo mostra por quê.')
        : say('Revisit this distinction and try another answer. The explanation below can help.', 'Retome esta distinção e tente outra resposta. A explicação abaixo pode ajudar.');
      if (explanation) explanation.open = true;
      if (retry) retry.hidden = false;
    });
    retry?.addEventListener('click', event => {
      event.preventDefault();
      for (const choice of choices) choice.checked = false;
      delete fieldset.dataset.feedback;
      feedback.textContent = say('Try again when you are ready.', 'Tente novamente quando quiser.');
      if (explanation) explanation.open = false;
      retry.hidden = true;
      choices[0].focus();
    });
  }

  // This course shares only the unscored quiz behavior above. Its optional
  // progress controller owns a separate record and never reads legacy records.
  if (/\/introduction-to-anthroposophy\//.test(location.pathname)
    && document.querySelector('main[data-introduction-owned="true"]')) return;
  if (/^\/(?:Anthroposophy\/)?(?:pt\/)?practical-thinking\/(?:index\.html|tools\.html|source-notes\.html|lessons\/(?:0[0-9]|1[0-2])\.html|parts\/(?:practical|observation|training|judgment)\.html)$/.test(location.pathname)
    && document.querySelector('main[data-practical-thinking-owned="true"]')) return;

  function safeResume(last) {
    if (!last || !validId(String(last.id))) return null;
    try {
      const url = new URL(last.url, location.href);
      const match = url.pathname.match(/^(.*?)(?:pt\/)?learn\/lessons\/(\d{2})\.html$/);
      if (url.origin !== location.origin || !match || match[2] !== String(last.id)) return null;
      const currentPrefix = location.pathname.includes('/Anthroposophy/') ? '/Anthroposophy/' : '/';
      if (match[1] !== currentPrefix) return null;
      url.pathname = currentPrefix + (portuguese ? 'pt/' : '') + 'learn/lessons/' + match[2] + '.html';
      url.search = '';
      url.hash = '';
      return url;
    } catch { return null; }
  }

  function renderProgress() {
    const rows = [...document.querySelectorAll('[data-learning-progress]')];
    for (const row of rows) {
      const id = row.dataset.learningProgress;
      if (!validId(id)) continue;
      const studied = savingEnabled() && read(lessonKey(id))?.complete === true;
      row.classList.toggle('is-studied', studied);
      let label = row.querySelector('[data-learning-progress-label]');
      if (!label) {
        label = document.createElement('span');
        label.dataset.learningProgressLabel = '';
        label.className = 'learning-progress-label';
        row.append(label);
      }
      label.textContent = studied ? say('Studied ✓', 'Estudada ✓') : '';
      label.hidden = !studied;
    }
    const unique = [...new Set(rows.map(row => row.dataset.learningProgress).filter(validId))];
    const completed = savingEnabled() ? unique.filter(id => read(lessonKey(id))?.complete === true).length : 0;
    for (const summary of document.querySelectorAll('[data-learning-progress-summary]')) {
      summary.textContent = savingEnabled()
        ? say(`${completed} of ${unique.length} lessons marked studied on this device.`, `${completed} de ${unique.length} lições marcadas como estudadas neste dispositivo.`)
        : say('Study marks are optional. Enable saving in a lesson to keep them on this device.', 'As marcações são opcionais. Ative o salvamento numa lição para conservá-las neste dispositivo.');
    }
    const last = savingEnabled() ? read(lastKey) : null;
    const resume = safeResume(last);
    for (const link of document.querySelectorAll('[data-learning-resume]')) {
      if (resume) {
        link.href = resume.href;
        link.textContent = say(`Resume lesson ${Number(last.id)} →`, `Retomar a lição ${Number(last.id)} →`);
        link.hidden = false;
      } else link.hidden = true;
    }
  }
  renderProgress();
  window.addEventListener('pageshow', renderProgress);
  window.addEventListener('storage', event => {
    if (!event.key || event.key.startsWith(prefix)) renderProgress();
  });

  const researchItems = [...document.querySelectorAll('[data-research-item]')];
  const researchSearch = document.querySelector('[data-research-search]');
  const researchFilters = [...document.querySelectorAll('[data-research-filter]')];
  if (researchItems.length && (researchSearch || researchFilters.length)) {
    const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(portuguese ? 'pt-BR' : 'en').trim();
    const entries = researchItems.map(item => ({item, search: normalize(item.dataset.search || item.textContent)}));
    const count = document.querySelector('[data-research-count]');
    let empty = document.querySelector('[data-research-empty]');
    if (!empty) {
      empty = document.createElement('p');
      empty.dataset.researchEmpty = '';
      empty.className = 'research-empty';
      empty.setAttribute('role', 'status');
      empty.hidden = true;
      const grid = researchItems[0].parentElement;
      grid.before(empty);
    }
    function filterResearch() {
      const words = normalize(researchSearch?.value || '').split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const entry of entries) {
        const matches = words.every(word => entry.search.includes(word)) && researchFilters.every(filter => {
          const value = filter.value;
          if (!value || value === 'all') return true;
          const dimension = filter.dataset.researchFilter;
          const actual = entry.item.dataset[dimension] || '';
          return dimension === 'topic' ? actual.split(/\s+/).includes(value) : actual === value;
        });
        entry.item.hidden = !matches;
        if (matches) visible++;
      }
      if (count && count.textContent !== String(visible)) count.textContent = String(visible);
      empty.hidden = visible !== 0;
      empty.textContent = visible === 0
        ? say('No notes match these filters. Change a filter or clear the search.', 'Nenhuma nota corresponde a esses filtros. Mude um filtro ou limpe a pesquisa.')
        : '';
    }
    researchSearch?.addEventListener('input', filterResearch);
    for (const filter of researchFilters) filter.addEventListener('change', filterResearch);
    window.addEventListener('pageshow', filterResearch);
    filterResearch();
  }

  const root = document.querySelector('[data-learning-id]');
  const id = root?.dataset.learningId;
  if (!root || !validId(id)) return;
  const note = root.querySelector('[data-learning-note]');
  const saveBox = root.querySelector('[data-learning-save]');
  const completeButton = root.querySelector('[data-learning-complete]');
  const exportButton = root.querySelector('[data-learning-export]');
  const deleteButton = root.querySelector('[data-learning-delete]');
  const status = root.querySelector('[data-learning-status]');
  if (!note || !saveBox || !completeButton || !exportButton || !deleteButton || !status) return;
  for (const control of [saveBox, completeButton, exportButton, deleteButton]) control.disabled = false;
  const key = lessonKey(id), language = portuguese ? 'pt' : 'en';
  let completed = false, dirty = false, timer;
  const announce = message => { status.textContent = message; };
  function paintCompletion() {
    completeButton.textContent = completed
      ? say('Studied ✓ — mark unfinished', 'Estudada ✓ — marcar como não concluída')
      : say('Mark lesson studied', 'Marcar lição como estudada');
    completeButton.setAttribute('aria-pressed', String(completed));
  }
  function remember() {
    if (savingEnabled()) put(lastKey, JSON.stringify({id, url: location.href.split('#')[0], title: document.querySelector('h1')?.textContent || ''}));
  }
  function restore() {
    const saved = savingEnabled() ? read(key) : null;
    if (saved && typeof saved === 'object') {
      if (typeof saved[language]?.note === 'string') note.value = saved[language].note;
      completed = saved.complete === true;
      announce(say('Your notes were restored from this device.', 'Suas anotações foram recuperadas deste dispositivo.'));
    }
    paintCompletion();
  }
  function save() {
    if (!saveBox.checked || !savingEnabled() || !dirty) return;
    const saved = read(key);
    const previous = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    const ok = put(key, JSON.stringify({...previous, [language]: {note: note.value}, complete: completed, updated: new Date().toISOString()}));
    if (ok) {
      dirty = false;
      remember();
      announce(say('Saved on this device.', 'Salvo neste dispositivo.'));
      renderProgress();
    } else announce(say('Saving is unavailable. Your note remains here; export a copy before leaving.', 'Não foi possível salvar. Sua anotação continua aqui; exporte uma cópia antes de sair.'));
  }
  saveBox.checked = savingEnabled();
  restore();
  if (saveBox.checked && !read(key)) announce(say('Saving is enabled on this device.', 'O salvamento está ativado neste dispositivo.'));
  remember();
  saveBox.addEventListener('change', () => {
    if (saveBox.checked) {
      if (!put(preference, 'yes')) {
        saveBox.checked = false;
        announce(say('Storage is unavailable. Export your note to keep a copy.', 'O armazenamento não está disponível. Exporte sua anotação para conservar uma cópia.'));
        return;
      }
      if (!dirty) restore();
      dirty = true;
      save();
    } else {
      clearTimeout(timer);
      remove(preference);
      announce(say('Automatic saving is off. Existing notes remain until you delete them.', 'O salvamento automático está desativado. As anotações existentes permanecem até você excluí-las.'));
      renderProgress();
    }
  });
  note.addEventListener('input', () => {
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(save, 450);
  });
  window.addEventListener('pagehide', save);
  completeButton.addEventListener('click', () => {
    completed = !completed;
    dirty = true;
    paintCompletion();
    save();
    if (!saveBox.checked) announce(say('Study mark changed for this visit. Enable saving to keep it.', 'Marcação alterada nesta visita. Ative o salvamento para conservá-la.'));
  });
  exportButton.addEventListener('click', () => {
    const title = document.querySelector('h1')?.textContent || say('Learning note', 'Anotação de estudo');
    const content = title + '\n' + location.href.split('#')[0] + '\n\n' + note.value;
    const url = URL.createObjectURL(new Blob([content], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = `anthroposophy-learning-${id}-${language}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(say('Note exported.', 'Anotação exportada.'));
  });
  deleteButton.addEventListener('click', () => {
    if (!remove(key)) {
      announce(say('Could not delete saved notes. Use your browser’s site-data settings.', 'Não foi possível excluir as anotações salvas. Use as configurações de dados do site no navegador.'));
      return;
    }
    clearTimeout(timer);
    if (String(read(lastKey)?.id) === id) remove(lastKey);
    note.value = '';
    completed = false;
    dirty = false;
    paintCompletion();
    announce(say('This lesson’s notes in both languages and study mark were deleted.', 'As anotações desta lição nos dois idiomas e sua marcação foram excluídas.'));
    renderProgress();
  });
})();
