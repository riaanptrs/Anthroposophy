(()=>{
 const input=document.querySelector('[data-phases-search]');if(!input)return;
 const lang=document.documentElement.lang.startsWith('pt'),rows=[...document.querySelectorAll('[data-phases-entry]')],groups=[...document.querySelectorAll('[data-phases-module]')],status=document.querySelector('[data-phases-results]');
 const normalize=s=>s.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 document.querySelector('[data-phases-search-label]').hidden=false;
 input.addEventListener('input',()=>{const words=normalize(input.value).trim().split(/\s+/).filter(Boolean);for(const row of rows)row.hidden=!words.every(w=>normalize(row.dataset.search).includes(w));for(const g of groups)g.hidden=![...g.querySelectorAll('[data-phases-entry]')].some(r=>!r.hidden);const count=rows.filter(r=>!r.hidden).length;status.textContent=lang?`${count} de ${rows.length} lições`:`${count} of ${rows.length} lessons`;});
})();
