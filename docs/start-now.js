document.addEventListener('DOMContentLoaded',()=>{
 const orientation=document.querySelector('[data-start-now-orientation]'),hero=document.querySelector('main > .cw-hero');
 if(orientation&&hero)hero.after(orientation);
 const search=document.querySelector('#sn-search'),status=document.querySelector('[data-sn-results]');
 if(search){search.disabled=false;search.addEventListener('input',()=>{const q=search.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();let count=0;for(const card of document.querySelectorAll('[data-sn-entry]')){const text=card.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();card.hidden=!text.includes(q);if(!card.hidden)count++;}status.textContent=count+' '+(document.documentElement.lang==='en'?'lessons':'lições');});}
});
