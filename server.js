'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const routes = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/config.js': ['config.js', 'text/javascript; charset=utf-8'],
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');

  if (urlPath === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    if (req.method !== 'HEAD') res.end('ok'); else res.end();
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
  }
  const route = Object.prototype.hasOwnProperty.call(routes, urlPath) ? routes[urlPath] : null;
  if (!route) { res.writeHead(404); res.end('Not Found'); return; }
  fs.readFile(path.join(root, route[0]), (err, body) => {
    if (err) { res.writeHead(500); res.end('Server Error'); return; }
    res.writeHead(200, { 'Content-Type': route[1] });
    if (req.method === 'HEAD') res.end(); else res.end(body);
  });
});

server.listen(port, '0.0.0.0', () => console.log('ATOM static site listening on port ' + port));
