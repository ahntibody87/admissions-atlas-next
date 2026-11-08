const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.jpg':'image/jpeg','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
  if(pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, '.'+pathname);
  if(!file.startsWith(root+path.sep) || pathname.split('/').some(x=>x.startsWith('.')) || !types[path.extname(file)]) { res.writeHead(403); return res.end(); }
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}
    const headers={'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
    const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
    let start=0,end=stat.size-1,code=200;
    if(match){start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;code=206;if(start>end){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;}
    headers['Content-Length']=end-start+1;res.writeHead(code,headers);
    if(req.method==='HEAD')return res.end();
    fs.createReadStream(file,{start,end}).pipe(res);
  });
});
const port=Number(process.env.PORT)||4173;
server.listen(port,'127.0.0.1',()=>console.log('ATAA preview: http://127.0.0.1:'+port));
