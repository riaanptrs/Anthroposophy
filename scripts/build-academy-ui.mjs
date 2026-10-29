import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {esc} from './learning-html.mjs';
export function applyAcademyPolish(docsDir='docs') {
 const root=path.resolve(docsDir),searchPages={en:[],pt:[]};
 for(const asset of ['platform-polish.css','platform-polish.js'])fs.copyFileSync(new URL('./assets/'+asset,import.meta.url),path.join(root,asset));
 const routes=fs.readdirSync(root,{recursive:true}).filter(route=>route.endsWith('.html')).sort();
 for(const route of routes){
 const file=path.join(root,route),logicalFile='docs/'+route;
 let after=fs.readFileSync(file,'utf8');
 const lang=/<html[^>]*lang=["']pt/i.test(after)?'pt':'en';
    after=after.replace(/<link[^>]*href=["'][^"']*platform-polish\.css[^"']*["'][^>]*>|<script[^>]*src=["'][^"']*platform-polish\.js[^"']*["'][^>]*><\/script>/gi,'');
    const polish=name=>esc(path.posix.relative(path.posix.dirname(logicalFile),'docs/'+name));
    const polishHash=createHash('sha256').update(fs.readFileSync(path.join(root,'platform-polish.css'))).update(fs.readFileSync(path.join(root,'platform-polish.js'))).digest('hex').slice(0,12);
    after=after.replace(/<\/head>/i,`<link rel="stylesheet" href="${polish('platform-polish.css')}?v=${polishHash}"><script defer src="${polish('platform-polish.js')}?v=${polishHash}"></script></head>`);
    const textOnly=value=>value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '})[m]).replace(/\s+/g,' ').trim();
    if(!/(?:print|download)\.html$/.test(route)&&route!=='index.html')searchPages[lang].push({route,title:textOnly(after.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||route),text:textOnly(after.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'')});

 fs.writeFileSync(file,after);
 }
 for(const lang of ['en','pt'])fs.writeFileSync(path.join(root,'search-index-'+lang+'.json'),JSON.stringify(searchPages[lang]));
 console.log('Academy interface and search: '+routes.length+' pages.');
}
