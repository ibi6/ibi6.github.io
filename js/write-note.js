(() => {
const root=document.getElementById('notes'),D=window.SITE_DATA;
const repo=`${D.user.login}/${D.user.login}.github.io`;
const wrap=document.createElement('section');wrap.className='write-note';
wrap.innerHTML=`<div class="write-heading"><div><span class="eyebrow">YOUR NOTEBOOK</span><h3>有想法，就写下来。</h3><p>填好内容，去 GitHub 提交一次，网站就会自动更新。</p></div><a id="manageNotes" class="btn" target="_blank" rel="noopener">管理已发布笔记 ↗</a></div><details id="noteComposer"><summary class="btn solid">＋ 新建笔记</summary><form id="noteForm"><div class="write-fields"><label>标题<input name="title" required maxlength="150" placeholder="这次想记录什么？"></label><label>标签<input name="tags" placeholder="前端, 随记（逗号分隔）" maxlength="200"></label></div><label>一句摘要（选填）<input name="summary" maxlength="300" placeholder="让读者知道这篇在聊什么"></label><label>正文 · Markdown<textarea name="body" rows="12" required placeholder="从第一句话开始。支持标题、列表、加粗和代码块。"></textarea></label><p class="write-hint" id="draftHint">草稿只保存在当前浏览器；正式发布需登录你的 GitHub 账号。</p><div class="write-actions"><button class="btn solid" type="submit">去 GitHub 发布 ↗</button><button class="btn" type="button" id="downloadNote">下载 Markdown</button><button class="text-link" type="button" id="clearDraft">清空草稿</button></div><p id="writeStatus" role="status"></p></form></details>`;
root.insertBefore(wrap,document.getElementById('tags'));
document.getElementById('manageNotes').href=`https://github.com/${repo}/tree/main/notes`;
const form=document.getElementById('noteForm'),status=document.getElementById('writeStatus');
const key='hang-note-draft-v1';
try{const data=JSON.parse(localStorage.getItem(key)||'{}');for(const k of ['title','tags','summary','body'])if(typeof data[k]==='string')form.elements[k].value=data[k];}catch{}
form.addEventListener('input',()=>{try{const data=Object.fromEntries(new FormData(form));localStorage.setItem(key,JSON.stringify(data));document.getElementById('draftHint').textContent='草稿已保存在当前浏览器。提交到 GitHub 后才会公开发布。';}catch{document.getElementById('draftHint').textContent='当前浏览器不能保存草稿，请及时下载 Markdown。';}});
function make(){
 const v=Object.fromEntries(new FormData(form));const title=v.title.trim().replace(/[\r\n]/g,' ');const body=v.body.trim();
 if(!title||!body){status.textContent='先填好标题和正文。';return null;}
 const now=new Date(),date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const slug=title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,50)||'note';
 const suffix=now.getTime().toString(36);
 const text=`---\ntitle: ${title}\ndate: ${date}\ntags: ${v.tags.replace(/[\r\n]/g,' ')}\nsummary: ${v.summary.replace(/[\r\n]/g,' ')}\n---\n\n${body}\n`;
 return {text,file:`${date}-${slug}-${suffix}.md`};
}
function download(n){const url=URL.createObjectURL(new Blob([n.text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=n.file;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
form.addEventListener('submit',e=>{e.preventDefault();const n=make();if(!n)return;const url=`https://github.com/${repo}/new/main?filename=${encodeURIComponent('notes/'+n.file)}&value=${encodeURIComponent(n.text)}`;
 if(url.length>7500){download(n);status.textContent='文章较长，已下载 Markdown。点击“管理已发布笔记”，在 GitHub 中选择 Add file → Upload files 上传即可。';return;}
 const w=window.open(url,'_blank','noopener');status.textContent='已打开 GitHub 编辑页。在那里确认内容并点 Commit changes；提交到 main 后会自动发布。草稿会保留，确认上线后可手动清空。';
});
document.getElementById('downloadNote').onclick=()=>{const n=make();if(n){download(n);status.textContent='Markdown 已下载，可直接放入仓库 notes/ 目录。';}};
document.getElementById('clearDraft').onclick=()=>{if(!confirm('清空这个浏览器里的未发布草稿？'))return;form.reset();try{localStorage.removeItem(key);}catch{}status.textContent='草稿已清空。';};
})();
