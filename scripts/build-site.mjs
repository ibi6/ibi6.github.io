import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
execFileSync(process.execPath,[path.join(root,'build-notes.mjs')],{stdio:'inherit'});
const sandbox={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'data.js'),'utf8'),sandbox,{timeout:1000});
if(!sandbox.window.SITE_DATA?.repos?.length)throw Error('Missing project data');
// Strict allowlist: never package credentials, .git, settings, local tools, or test artifacts.
const out=path.join(root,'dist');await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});
for(const item of ['index.html','data.js','css','js','notes'])await fs.cp(path.join(root,item),path.join(out,item),{recursive:true});
await fs.writeFile(path.join(out,'.nojekyll'),'');
console.log('Built dist/ (static files only).');
