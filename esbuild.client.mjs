import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

// Build TypeScript
await esbuild.build({
  entryPoints: ['src/client/main.ts'],
  bundle: true,
  outfile: 'public/app.js',
  sourcemap: true,
  target: 'es2020',
  format: 'iife',
  globalName: 'HeatMapApp'
});

// Process CSS with esbuild (minify and bundle)
await esbuild.build({
  entryPoints: ['src/client/style.css'],
  bundle: true,
  outfile: 'public/style.css',
});

// Copy HTML
fs.copyFileSync(
  'src/client/index.html',
  'public/index.html'
);
