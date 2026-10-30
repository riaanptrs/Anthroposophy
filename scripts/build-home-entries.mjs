import fs from 'node:fs';
import path from 'node:path';
// These source-owned entries preserve the established Portuguese default,
// explicit English /en entry, language preference controls and current design.
// Legacy course builders may render temporary homepages earlier in the build.
export function buildHomeEntries(){
 for(const [name,target] of [['default','docs/index.html'],['en','docs/en/index.html'],['pt','docs/pt/index.html']]){
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,fs.readFileSync(new URL('../content/home-entries/'+name+'.html',import.meta.url)));
 }
}
