// Exact editorial exceptions for original course prose; no source quote is changed.
import fs from 'node:fs';
import {esc} from './learning-html.mjs';
const corrections=JSON.parse(fs.readFileSync(new URL('../reviews/pedagogy/language-editorial-corrections.json',import.meta.url)));
const plain=s=>s.replace(/<[^>]+>/g,'').replace(/&quot;/g,'"').replace(/&#39;|&#039;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
export function applyDocumentedLanguageCorrections(text){
 for(const c of corrections){
  const a=c.before||c.old,b=c.after||c.new;
  // Keep replacements bounded by their full reviewed context when one is recorded.
  text=text.replaceAll(JSON.stringify(a).slice(1,-1),JSON.stringify(b).slice(1,-1));
  text=text.replaceAll(esc(a),esc(b)).replaceAll(a,b);
  if(c.before)text=text.replace(/<(p|li|span|h[1-6]|summary)\b[^>]*>[\s\S]*?<\/\1>/g,block=>plain(block)===a?block.replaceAll(esc(c.old),esc(c.new)).replaceAll(c.old,c.new):block);
 }
 return text;
}
