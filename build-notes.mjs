// 把 notes/*.md 打包成 notes/notes.js（这样直接双击 index.html 也能读到笔记）
// 用法：node build-notes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'notes');
const notes = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${f}: 缺少文件头（--- 包起来的那几行）`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  if (!meta.title || !meta.date) throw new Error(`${f}: 文件头里要有 title 和 date`);
  const body = m[2].trim();
  return {
    slug: f.replace(/\.md$/, ''), title: meta.title, date: meta.date,
    tags: (meta.tags || '').split(/[,，]/).map(s => s.trim()).filter(Boolean),
    summary: meta.summary || '', minutes: Math.max(1, Math.round(body.length / 400)), body,
  };
}).sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(path.join(dir, 'notes.js'),
  '// 自动生成，别手改。改 .md 后运行 node build-notes.mjs\nwindow.SITE_NOTES = ' + JSON.stringify(notes, null, 1) + ';\n');
console.log(`已打包 ${notes.length} 篇笔记`);
