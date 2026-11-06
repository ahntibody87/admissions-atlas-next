const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const server = http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
  if(pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, '.'+pathname);
  if(!file.startsWith(root+path.sep) || pathname.split('/').some(x=>x.startsWith('.')) || !types[path.extname(file)]) { res.writeHead(403); return res.end(); }
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);});
});
server.listen(4173,'127.0.0.1',()=>console.log('ATAA preview: http://127.0.0.1:4173'));
