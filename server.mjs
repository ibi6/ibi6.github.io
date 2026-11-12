import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.md':'text/plain','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let f=path.resolve(base,'.'+name);if(f!==base&&!f.startsWith(base+path.sep)){res.writeHead(403);return res.end();}if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');res.writeHead(200,{'Content-Type':(types[path.extname(f)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-cache'});fs.createReadStream(f).pipe(res);}catch{res.writeHead(404);res.end('Not found');}}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
