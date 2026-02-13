import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/client/main.ts'],
  bundle: true,
  outfile: 'public/app.js',
  sourcemap: true,
  target: 'es2020',
  format: 'iife',
  globalName: 'HeatMapApp'
});
