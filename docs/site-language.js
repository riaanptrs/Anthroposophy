(function () {
  'use strict';
  const configNode = document.getElementById('site-language-config');
  const script = document.currentScript;
  if (!configNode || !script || document.documentElement.dataset.siteLanguageReady) return;
  let config, base;
  try {
    config = JSON.parse(configNode.textContent);
    base = new URL('./', script.src);
    if (base.origin !== location.origin) return;
  } catch { return; }
  document.documentElement.dataset.siteLanguageReady = 'true';
  const key = 'anthroposophy-site-language-v1:' + base.pathname;
  const valid = value => value === 'en' || value === 'pt-BR';
  const read = () => { try { const value = localStorage.getItem(key); return valid(value) ? value : null; } catch { return null; } };
  const remember = value => { if (valid(value)) try { localStorage.setItem(key, value); } catch { /* Links remain usable without storage. */ } };
  const withContext = href => {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(base.pathname)) return null;
    const requested = [...url.searchParams];
    url.search = location.search;
    for (const key of new Set(requested.map(([name]) => name))) url.searchParams.delete(key);
    for (const [name, value] of requested) url.searchParams.append(name, value);
    url.hash = location.hash;
    return url;
  };
  const refreshLinks = () => {
    for (const link of document.querySelectorAll('a[data-site-language-choice]')) {
      if (!link.dataset.siteLanguageHref) link.dataset.siteLanguageHref = link.getAttribute('href');
      const target = withContext(link.dataset.siteLanguageHref);
      if (target) link.href = target.href;
    }
  };
  refreshLinks();
  document.addEventListener('click', event => {
    if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
    const control = event.target.closest('[data-site-language-choice]');
    if (!control) return;
    const choice = control.dataset.siteLanguageChoice;
    if (!valid(choice)) return;
    if (control.tagName === 'A') {
      const target = withContext(control.dataset.siteLanguageHref || control.getAttribute('href'));
      if (!target) return;
      control.href = target.href;
    }
    remember(choice); // Only an explicit language control writes this preference.
    if (control.hasAttribute('data-site-language-stay')) {
      event.preventDefault();
      const prompt = document.getElementById('site-language-suggestion');
      if (prompt) prompt.remove();
    }
  });
  // Restoring a page from history updates links but never redirects it again.
  window.addEventListener('pageshow', refreshLinks);
  window.addEventListener('hashchange', refreshLinks);
  window.addEventListener('popstate', refreshLinks);
  const rootEntry = config.rootEntry === true && (location.pathname === base.pathname || location.pathname === base.pathname + 'index.html');
  if (!rootEntry) return; // Explicit /pt/, /en/ and existing English deep links win.
  const preference = read();
  let historyTraversal = false;
  try { historyTraversal = performance.getEntriesByType('navigation')[0]?.type === 'back_forward'; } catch { /* Optional navigation timing API. */ }
  if (preference === 'en' && !historyTraversal) {
    const target = withContext(new URL('en/index.html', base).href);
    if (target && target.pathname !== location.pathname) location.replace(target.href);
    return;
  }
  if (preference || !/^en(?:-|$)/i.test(navigator.language || '')) return;
  const prompt = document.createElement('aside');
  prompt.id = 'site-language-suggestion';
  prompt.className = 'site-language-suggestion';
  prompt.setAttribute('aria-label', 'Escolha do idioma');
  const message = document.createElement('p');
  message.textContent = 'Seu navegador usa inglês. Prefere continuar em inglês?';
  const choices = document.createElement('div');
  const english = document.createElement('a');
  english.textContent = 'Continue in English';
  english.lang = 'en';
  english.dataset.siteLanguageChoice = 'en';
  english.href = withContext(new URL('en/index.html', base).href).href;
  const portuguese = document.createElement('button');
  portuguese.type = 'button';
  portuguese.textContent = 'Continuar em português';
  portuguese.dataset.siteLanguageChoice = 'pt-BR';
  portuguese.setAttribute('data-site-language-stay', '');
  choices.append(english, portuguese);
  prompt.append(message, choices);
  const header = document.querySelector('header');
  if (header) header.insertAdjacentElement('afterend', prompt);
  else document.body.insertBefore(prompt, document.body.firstChild);
})();
