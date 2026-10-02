import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('.sites-runtime/biodynamic-course-preview/docs');
if(!fs.existsSync(path.join(root,'biodynamics/index.html')))throw new Error('Build the private course first: node scripts/build-biodynamic-agriculture.mjs --draft');
const portIndex=process.argv.indexOf('--port');
const port=portIndex<0?4174:Number(process.argv[portIndex+1]);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Choose a valid local preview port.');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
http.createServer((request,response)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname)}catch{response.writeHead(400).end();return}
  const filename=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!filename.startsWith(root+path.sep)){response.writeHead(403).end();return}
  fs.readFile(filename,(error,body)=>{
    if(error){response.writeHead(404).end('Not found');return}
    response.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});
    response.end(body);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Private Biodynamic Agriculture preview serving exact staged files on port ${port}.`));
