import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import handler from 'serve-handler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');
const port = Number(process.env.PORT) || 3000;

if (!existsSync(distPath)) {
  console.error('ERROR: dist/ folder not found. Run "npm run build" first.');
  process.exit(1);
}

const server = http.createServer((request, response) =>
  handler(request, response, {
    public: distPath,
    rewrites: [{ source: '**', destination: '/index.html' }],
  })
);

server.listen(port, '0.0.0.0', () => {
  console.log(`SmartCity app running on http://0.0.0.0:${port}`);
});
