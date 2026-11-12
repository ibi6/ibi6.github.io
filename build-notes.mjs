// Build notes/*.md into notes/notes.js. Plain Markdown and optional frontmatter supported.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url)),dir=path.join(root,'notes');
function fileDate(f){
 try{const d=execFileSync('git',['log','-1','--format=%cs','--','notes/'+f],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();if(d)return d;}catch{}
 return fs.statSync(path.join(dir,f)).mtime.toISOString().slice(0,10);
}
const notes=fs.readdirSync(dir).filter(f=>f.endsWith('.md')&&!/^readme\.md$/i.test(f)).map(f=>{
 const raw=fs.readFileSync(path.join(dir,f),'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
 const m=raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/),meta={};
 if(m)for(const line of m[1].split('\n')){const i=line.indexOf(':');if(i>0)meta[line.slice(0,i).trim()]=line.slice(i+1).trim();}
 let body=(m?m[2]:raw).trim();
 const title=meta.title||body.match(/^#\s+(.+)$/m)?.[1]||f.replace(/\.md$/,'').replace(/^\d{4}-\d{2}-\d{2}-?/,'').replaceAll('-',' ');
 const date=meta.date||f.match(/^\d{4}-\d{2}-\d{2}/)?.[0]||fileDate(f);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error(f+': invalid date');
 if(!body||!title)throw Error(f+': title and content cannot be empty');
 if(body.startsWith('# '+title+'\n'))body=body.slice(title.length+3).trim();
 const summary=meta.summary||body.split('\n').find(l=>l.trim()&&!/^(#|```|[-*] )/.test(l))?.replace(/[`*]/g,'').slice(0,120)||'';
 return {slug:f.replace(/\.md$/,''),title,date,tags:(meta.tags||'').split(/[,，]/).map(s=>s.trim()).filter(Boolean),summary,minutes:Math.max(1,Math.round(body.length/400)),body};
}).sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
fs.writeFileSync(path.join(dir,'notes.js'),'// Generated from notes/*.md\nwindow.SITE_NOTES = '+JSON.stringify(notes,null,1)+';\n');
console.log(`已打包 ${notes.length} 篇笔记`);
