/* Standalone review file only; never emitted into docs or the production build. */
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const out=process.env.PREVIEW_OUTPUT||'/workspace/theosophy-ux-preview',root=path.resolve('docs');
const pages={};for(const prefix of ['', 'pt/'])for(const route of ['index.html',...fs.readdirSync('docs/theosophy/lessons').map(n=>'lessons/'+n)]){const key=prefix+'theosophy/'+route;pages[key]=fs.readFileSync(path.join(root,key),'utf8');}
function asset(file){return 'data:'+({'.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]+';base64,'+fs.readFileSync(file).toString('base64');}
function css(file){return fs.readFileSync(file,'utf8').replace(/@import\s+url\(["']?([^"')]+)["']?\);/g,(_,r)=>css(path.resolve(path.dirname(file),r))).replace(/url\(["']?([^"')]+)["']?\)/g,(all,r)=>r.startsWith('data:')?all:'url("'+asset(path.resolve(path.dirname(file),r))+'")');}
const styles={},scripts={},images={};
for(const [route,html] of Object.entries(pages)){
 for(const m of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)){const key=path.posix.normalize(path.posix.join(path.posix.dirname(route),m[1].split('?')[0]));styles[key]??=css(path.join(root,key));}
 for(const m of html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)){const key=path.posix.normalize(path.posix.join(path.posix.dirname(route),m[1].split('?')[0]));scripts[key]??=fs.readFileSync(path.join(root,key),'utf8');}
 for(const m of html.matchAll(/<img[^>]*src="([^"]+)"/g)){const key=path.posix.normalize(path.posix.join(path.posix.dirname(route),m[1].split('?')[0]));images[key]??=asset(path.join(root,key));}
}
const bundle=zlib.gzipSync(JSON.stringify({pages,styles,scripts,images})).toString('base64');
async function run(packed){
 try {
  const raw=Uint8Array.from(atob(packed),c=>c.charCodeAt(0));const data=JSON.parse(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  const frame=document.querySelector('iframe');let current='theosophy/index.html';
  const resolve=(r,base)=>new URL(r,'https://preview.theosophy.invalid/'+base).pathname.slice(1);
  function render(route,hash='',historyMode='push'){
   if(!data.pages[route]){document.querySelector('#reference').textContent=route+hash;document.querySelector('#outside').showModal();return;}
   current=route;const pt=route.startsWith('pt/');document.querySelector('#language').textContent=pt?'English':'Português';
   let html=data.pages[route];const queued=[];
   html=html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,(_,r)=>'<style>'+data.styles[resolve(r,route)]+'</style>');
   html=html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g,(_,r)=>{const key=resolve(r,route);let code=data.scripts[key];if(key==='concept-platform.js'){code=code.replace("'use strict';","'use strict';const location=new URL("+JSON.stringify('https://preview.theosophy.invalid/'+route)+");").replaceAll('anthro-concept-v1:','anthro-layout-review-v1:');}queued.push(code);return '';});
   html=html.replace(/(<img[^>]*src=")([^"]+)(")/g,(_,a,r,b)=>a+data.images[resolve(r,route)]+b);
   html=html.replace('</head>','<base href="https://preview.theosophy.invalid/'+route+'"></head>');
   const bridge='document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||a.hasAttribute("download"))return;const u=new URL(a.href);if(u.protocol==="blob:")return;e.preventDefault();if(u.hostname==="preview.theosophy.invalid"&&u.pathname==='+JSON.stringify('/'+route)+'&&u.hash){location.hash=u.hash;dispatchEvent(new Event("hashchange"));}else parent.postMessage({theosophyPreview:true,route:u.hostname==="preview.theosophy.invalid"?u.pathname.slice(1):u.href,hash:u.hash},"*");});'+(hash?'location.hash='+JSON.stringify(hash)+';dispatchEvent(new Event("hashchange"));':'');
   const script=code=>'<script>'+code.replace(/<\/script/gi,'<\\/script')+'<'+'/script>';
   html=html.replace('</body>',()=>queued.map(script).join('')+script(bridge)+'</body>');
   frame.srcdoc=html;if(historyMode==='push')history.pushState({route,hash},'', '#'+route+hash);document.querySelector('#notice').hidden=true;
  }
  window.addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.data?.theosophyPreview)render(e.data.route,e.data.hash);});window.addEventListener('popstate',e=>render(e.state?.route||'theosophy/index.html',e.state?.hash||'','replace'));
  document.querySelector('#home').onclick=()=>render((current.startsWith('pt/')?'pt/':'')+'theosophy/index.html');document.querySelector('#long').onclick=()=>render((current.startsWith('pt/')?'pt/':'')+'theosophy/lessons/whole-picture.html');document.querySelector('#language').onclick=()=>render(current.startsWith('pt/')?current.slice(3):'pt/'+current);
  render('theosophy/index.html','','replace');
 }catch(e){document.querySelector('#notice').textContent='This browser could not open the interactive preview. Please use the screenshot PDF for review. '+e.message;}
}
const shell=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Theosophy · private layout review</title><style>html,body{margin:0;height:100%;background:#faf8f2;color:#293b34;font:14px/1.5 system-ui}body{display:flex;flex-direction:column}.review{padding:8px 14px;background:#eee8f2;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.review span{flex:1}.review button{font:inherit;min-height:36px;border:1px solid #bdb0ca;border-radius:5px;background:#fffdf8;color:#543b6b;padding:5px 10px;cursor:pointer}iframe{border:0;width:100%;flex:1;min-height:0}#notice{padding:10px 16px}dialog{max-width:80%;border:1px solid #bdb0ca;border-radius:8px}dialog button{min-height:44px}summary{cursor:pointer}</style><div class="review"><span><strong>Theosophy layout preview</strong> · live site unchanged</span><button id="home">Course</button><button id="long">Long lesson</button><button id="language">Português</button><details><summary>About this preview</summary><p>All 24 lessons and the course overview, in English and Portuguese. Open Chapters, Go deeper, Sources or My study. Review saving is separate from the live site; browser support varies when opening downloaded HTML. Other courses and reference pages are outside this preview. No information is sent to a server.</p></details></div><p id="notice">Opening the offline preview…</p><iframe title="Theosophy course layout preview"></iframe><dialog id="outside"><p>This reference is outside the Theosophy layout preview. Its original link remains unchanged in the review branch.</p><p id="reference"></p><button onclick="this.closest('dialog').close()">Close</button></dialog><script>(${run.toString()})(${JSON.stringify(bundle)});</script></html>`;
fs.writeFileSync(path.join(out,'Theosophy-layout-preview.html'),shell);console.log('Standalone review HTML: '+Buffer.byteLength(shell)+' bytes, '+Object.keys(pages).length+' EN/PT pages.');
