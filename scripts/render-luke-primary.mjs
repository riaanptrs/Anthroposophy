import fs from 'node:fs';
// Luke's current EPUB-based primary teaching supersedes the earlier short-PDF
// teaching in humanities-clear-lessons.json. Keep its diagrams and references
// together rather than regenerating the earlier primary layer.
export const reviewedLukeLessons=JSON.parse(fs.readFileSync(new URL('../content/according-to-luke-reviewed-primary.json',import.meta.url),'utf8')).lessons;
export function reviewedLukePrimary(id,lang){
 const row=reviewedLukeLessons.find(r=>r.id===id);
 if(!row||!['en','pt'].includes(lang)||!row[lang]?.startsWith('<section class="batch-first-reading"'))throw Error(`Missing reviewed Luke primary teaching: ${id}/${lang}`);
 return row[lang];
}
