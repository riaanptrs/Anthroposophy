/* Adapt the standalone hash router to the common, tab-local reading controls.
   Documentary reflections and completion remain owned by app.js. */
(() => {
 'use strict';
 const main=document.getElementById('main');
 if(!main||main.dataset.documentaryControlsReady)return;
 main.dataset.documentaryControlsReady='true';
 function refresh(){
  const reading=main.querySelector('.lesson-main,.source-main');
  if(reading)reading.setAttribute('data-documentary-reading','');
  document.dispatchEvent(new Event('anthroposophy:reading-content-changed'));
 }
 // app.js replaces the direct children of main on navigation and completion.
 // Toolbar insertion is deeper in the tree and does not trigger this observer.
 new MutationObserver(refresh).observe(main,{childList:true});
 refresh();
})();
