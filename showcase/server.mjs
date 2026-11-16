import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3210);
const files = {
 '/':['index.html','text/html'], '/index.html':['index.html','text/html'],
 '/style.css':['style.css','text/css'], '/app.js':['app.js','text/javascript']
};
let cache = null, expires = 0;
async function dailyQuote() {
 if (cache && Date.now() < expires) return cache;
 const res = await fetch('https://zenquotes.io/api/today',{signal:AbortSignal.timeout(6500)});
 if (!res.ok) throw Error(`ZenQuotes returned ${res.status}`);
 const data = await res.json(), item = Array.isArray(data) ? data[0] : null;
 if (!item || typeof item.q !== 'string' || !item.q.trim()) throw Error('No quote');
 cache = {text:item.q.trim().slice(0,450),author:String(item.a || 'Unknown').slice(0,100)};
 expires = Date.now() + 30 * 60 * 1000;
 return cache;
}
createServer(async (req,res) => {
 const path = (req.url || '/').split('?')[0];
 res.setHeader('X-Content-Type-Options','nosniff');
 if (req.method !== 'GET') { res.writeHead(405); return res.end('Method not allowed'); }
 if (path === '/healthz') { res.writeHead(200,{'Content-Type':'text/plain'}); return res.end('ok'); }
 if (path === '/api/quote') {
  try { const quote = await dailyQuote(); res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}); return res.end(JSON.stringify(quote)); }
  catch { res.writeHead(503,{'Content-Type':'application/json'}); return res.end(JSON.stringify({error:'Quote service unavailable'})); }
 }
 const file = files[path];
 if (!file) { res.writeHead(404); return res.end('Not found'); }
 try { const data = await readFile(join(root,file[0])); res.writeHead(200,{'Content-Type':`${file[1]}; charset=utf-8`}); res.end(data); }
 catch { res.writeHead(500); res.end('Server error'); }
}).listen(port,process.env.HOST || '127.0.0.1',() => console.log(`Daily Spark showcase: http://localhost:${port}`));