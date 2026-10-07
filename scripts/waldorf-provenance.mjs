import fs from 'node:fs';
import {esc} from './learning-html.mjs';

// Use only complete titles explicitly named in the supplied source register.
const register=fs.readFileSync(new URL('../waldorf-course/SOURCES.md',import.meta.url),'utf8');
const titles=[...new Set([...register.matchAll(/^\| [^|*\n]*\*([^*|\n]+)\*[^|\n]*\|/gm)].map(m=>m[1]))];
export const provenancePattern=/\[(?:BOOK|STEINER|EARLY WALDORF|LATER WALDORF|WALDORF|INTERPRETATION|EXPANSION|MODERN|CONTEMPORARY WALDORF|CONVERSATION|TEXT UNCERTAIN)[A-Z /+—-]*\]/g;

export function provenanceNote(label,named=[]) {
 const text=label==='[BOOK]'?(named.length?'Book attribution — unverified':'Book attribution — source unresolved'):label.slice(1,-1).toLowerCase().replace(/^./,c=>c.toUpperCase()).replace(/waldorf/g,'Waldorf').replace(/steiner/g,'Steiner');
 const names=label==='[BOOK]'&&named.length?` <span class="wf-reference-title">Named in this section: ${esc(named.join('; '))}. Passage verification pending.</span>`:'';
 return `<span class="wf-provenance" data-original-label="${esc(label)}" title="Inherited attribution; source verification pending">${esc(text)}${names}</span>`;
}

export function readableProvenance(html,includeTitles=false) {
 // Each heading starts a fresh scope. Never assign a book from another section
 // or use an unresolved conversation reference to guess a title or locator.
 return html.split(/(?=<h[2-6]\b)/).map(section=>{
  const plain=section.replace(/<[^>]*>/g,'');
  const named=includeTitles?titles.filter(title=>plain.includes(title)):[];
  return section.replace(provenancePattern,label=>provenanceNote(label,named));
 }).join('');
}

export function readableCitationNotes(html) {
 return html
  .replace(/\[(?:Unresolved conversation citation (\d+) — primary-source check pending|unresolved conversation citation (\d+))\]/g,(_,long,short)=>`<span class="wf-citation-note" data-citation-index="${long||short}" data-citation-format="${long?'long':'short'}" title="The supplied draft contains an unresolved source reference">Source verification pending</span>`)
  .replace(/\[UNRESOLVED SOURCE PREVIEW: [^\n]*?\.md\]/g,original=>`<span class="wf-citation-note" data-original-preview-html="${esc(original)}" title="The supplied filename is a source-location clue, not a verified citation">Source verification pending</span>`);
}
