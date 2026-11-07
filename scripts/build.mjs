import {mkdir, copyFile, rm} from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
await rm(dist, {recursive: true, force: true});
await mkdir(dist, {recursive: true});
for (const name of ['index.html', 'styles.css', 'app.js', 'core.js', 'favicon.svg', '.nojekyll']) await copyFile(new URL(name, root), new URL(name, dist));
console.log('Готово: dist/');
