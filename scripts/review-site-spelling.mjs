// npm packages are installed outside the repository; no text leaves this machine.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=process.argv[2];if(!root)throw Error('Pass the local QA package root containing node_modules.');
const imp=p=>{const base=root+'/node_modules/'+p+'/';const meta=JSON.parse(fs.readFileSync(base+'package.json'));return import(pathToFileURL(base+(meta.main||'index.js')));};
const {loadModule}=await imp('hunspell-asm');
const factory=await loadModule();
const make=name=>{const base=root+'/node_modules/'+name+'/';return factory.create(factory.mountBuffer(fs.readFileSync(base+'index.aff')),factory.mountBuffer(fs.readFileSync(base+'index.dic')));};
const spellers={pt:make('dictionary-pt'),en:make('dictionary-en-gb')};
const us=make('dictionary-en');
const input=JSON.parse(fs.readFileSync('/workspace/scratch/language-extract.json','utf8'));
const unknown=new Map(),cache=new Map();let checked=0,quoted=0;
for(const b of input.uniqueBlocks){
 if(b.quote){quoted++;continue;}
 const lang=b.lang.startsWith('pt')?'pt':b.lang.startsWith('en')?'en':null;if(!lang)continue;
 for(const token of b.text.normalize('NFC').matchAll(/\p{L}+(?:['’]\p{L}+)?/gu)){
  const word=token[0].replaceAll('’',"'"),key=lang+'|'+word;
  if(word.length<2)continue;checked++;
  if(!cache.has(key))cache.set(key,spellers[lang].spell(word)||(lang==='en'&&us.spell(word)));
  if(cache.get(key))continue;
  if(!unknown.has(key))unknown.set(key,{language:lang,word,acceptedOtherLanguage:lang==='pt'?(spellers.en.spell(word)||us.spell(word)):spellers.pt.spell(word),blocks:0,examples:[]});
  const r=unknown.get(key);r.blocks++;if(r.examples.length<3)r.examples.push({text:b.text,path:b.pages[0],block:b.id});
 }
}
const result={status:'editorial-triage-required',pages:input.pages.length,uniqueBlocks:input.uniqueBlocks.length,tokensChecked:checked,quotedBlocksExcluded:quoted,dictionaries:['dictionary-pt (Brazilian Portuguese)','dictionary-en-gb','dictionary-en'],findings:[...unknown.values()].sort((a,b)=>b.blocks-a.blocks),limits:input.limitations};
fs.writeFileSync('/workspace/scratch/spelling-findings.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,findings:result.findings.length}));
