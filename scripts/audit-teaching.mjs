import fs from 'node:fs';
import path from 'node:path';
const courses=['','higher-worlds','philosophy-of-freedom','according-to-luke','colour','temperaments','understand-temperament','encountering-the-self'];
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const match=(s,re)=>clean(s.match(re)?.[1]||'');
const records=courses.map(course=>({course:course||'theosophy',lessons:fs.readdirSync(path.join('docs',course,'lessons')).filter(f=>f.endsWith('.html')).sort().map(file=>{
 const html=fs.readFileSync(path.join('docs',course,'lessons',file),'utf8');
 const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||html;
 const checks=[...main.matchAll(/<div class="knowledge-check">([\s\S]*?)<\/div>/g)].map(m=>clean(m[1]));
 if(!checks.length){const review=main.match(/<h2>Check your understanding<\/h2>([\s\S]*?)<details><summary>How to assess/);if(review)checks.push(clean(review[1]));}
 return {id:file.slice(0,-5),path:path.posix.join('docs',course,'lessons',file),title:match(main,/<h1[^>]*>([\s\S]*?)<\/h1>/),goal:match(main,/<p class="lead">([\s\S]*?)<\/p>/),headings:[...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m=>clean(m[1])),example:match(main,/<section class="worked-example">([\s\S]*?)<\/section>/),practice:match(main,/<section class="practice">([\s\S]*?)<\/section>/)||match(main,/<div class="practice">([\s\S]*?)<\/div>/),checks,words:clean(main).split(' ').length,details:(main.match(/<details/g)||[]).length,visuals:(main.match(/<svg|<figure|role="img"/g)||[]).length,fullText:clean(main)};
})}));
fs.writeFileSync('content/teaching-audit-inventory.json',JSON.stringify(records,null,2)+'\n');
const requested=process.argv.slice(2);
for(const c of records.filter(c=>!requested.length||requested.includes(c.course))){
 console.log('\nCOURSE '+c.course);
 for(const l of c.lessons)console.log(JSON.stringify({id:l.id,title:l.title,goal:l.goal,example:l.example,practice:l.practice,check:l.checks[0]||'',words:l.words}));
}
