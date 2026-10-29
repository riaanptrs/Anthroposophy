'use strict';
// Preserve the current hash route when comparing the two complete course versions.
function documentaryLanguageTarget(){
 for(const link of document.querySelectorAll('[data-course-language-switch]')){
  const target=new URL(link.href,location.href);target.hash=location.hash;link.href=target.href;
 }
}
window.addEventListener('hashchange',documentaryLanguageTarget);
documentaryLanguageTarget();
