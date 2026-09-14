import fs from 'node:fs';
import path from 'node:path';
// Work only on rendered text, never attributes, code, form fields or existing links.
const excluded=new Set(['a','script','style','textarea','title','code','pre','svg','button','select']);
const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
export const worldTerms=/\b(?:(?:mineral|plant|vegetable|animal) (?:world|kingdom)s?|(?:mundo|reino) (?:mineral|vegetal|animal|das plantas|dos animais|dos minerais))\b/giu;
export const terms=/\b(?:(?:mineral|plant|vegetable|animal) (?:world|kingdom)s?|(?:mundo|reino) (?:mineral|vegetal|animal|das plantas|dos animais|dos minerais)|physical (?:bod(?:y|ies)|organi[sz]ation|member)s?|etheric(?: or life)?(?: (?:bod(?:y|ies)|organi[sz]ation|member)s?)?|ether bod(?:y|ies)|life[- ]bod(?:y|ies)|astral(?: (?:bod(?:y|ies)|organi[sz]ation|member)s?)?|corpos? (?:físicos?|etéricos?|astrais|astral|vitais|vital|de (?:éter|vida))|organizaç(?:ão|ões) (?:física|físicas|etérica|etéricas|astral|astrais)|etéric[oa]s?|astral|astrais)\b/giu;
export function targetFor(term){
 if(/world|kingdom|mundo|reino/i.test(term))return /minera/i.test(term)?'mineral-world':/animal|animais/i.test(term)?'animal-world':'plant-world';
 return /astr/i.test(term)?'astral-body':/physical|físic/i.test(term)?'physical-body':'etheric-body';
}
export function linkTerms(html,url,matcher=terms){
 const stack=[];let count=0;
 const result=html.replace(/<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]*>|[^<]+/gi,token=>{
  if(token.startsWith('<')){
   if(/^<!--|^<!|^<(script|style|textarea)\b/i.test(token))return token;
   const close=token.match(/^<\/([\w-]+)/);if(close){const i=stack.lastIndexOf(close[1].toLowerCase());if(i>=0)stack.length=i;return token;}
   const open=token.match(/^<([\w-]+)/);if(open&&!voids.has(open[1].toLowerCase())&&!/\/\s*>$/.test(token))stack.push(open[1].toLowerCase());
   return token;
  }
  if(!stack.includes('body')||stack.some(t=>excluded.has(t)))return token;
  return token.replace(matcher,term=>{count++;return `<a class="constitution-ref" href="${url}#${targetFor(term)}">${term}</a>`;});
 });
 return {html:result,count};
}
export function buildLinks(){
 let count=0,pages=0;
 for(const relative of fs.readdirSync('docs',{recursive:true}).filter(f=>f.endsWith('.html'))){
  if(relative.replaceAll('\\','/').includes('reference/human-constitution.html')||relative==='learning-review.html')continue;
  const file=path.join('docs',relative);let html=fs.readFileSync(file,'utf8');
  const pt=html.includes('<html lang="pt-BR"'),base=pt?'docs/pt':'docs';
  const url=path.relative(path.dirname(file),`${base}/reference/human-constitution.html`).replaceAll('\\','/');
  const normalized=relative.replaceAll('\\','/');
  if(/^(?:pt\/)?(?:index\.html|lessons\/(?:00|03|06)\.html)$/.test(normalized)&&!html.includes('class="constitution-entry"')){
   const entry=`<aside class="constitution-entry"><p><a href="${url}"><strong>${pt?'Entenda os corpos físico, etérico e astral':'Understand the physical, etheric and astral bodies'} →</strong></a></p><p>${pt?'Referência ilustrada para todos os cursos. Comece pela comparação e retome cada termo quando precisar.':'An illustrated reference for every course. Begin with the comparison and revisit each term when needed.'}</p></aside>`;
   html=html.replace(/(<main\b[^>]*>)/,`$1${entry}`);
  }
  const result=linkTerms(html,url);count+=result.count;if(result.count)pages++;
  html=result.html;
  if((html.includes('constitution-ref')||html.includes('constitution-entry'))&&!html.includes('constitution.css')){
   const css=path.relative(path.dirname(file),'docs/constitution.css').replaceAll('\\','/');
   html=html.replace('</head>',`<link rel="stylesheet" href="${css}"></head>`);
  }
  fs.writeFileSync(file,html);
 }
 console.log(`Linked ${count} terminology mentions across ${pages} pages.`);
}
// Explicit invocation keeps helpers importable by the verification script.
