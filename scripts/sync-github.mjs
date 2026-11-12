import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cfg=JSON.parse(await fs.readFile(path.join(root,'sync.config.json'),'utf8'));
if(!/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(cfg.username))throw Error('Invalid username');
const token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN;
async function api(endpoint,query){
  if(!token){
    const args=['api',endpoint];if(query)args.push('-f','query='+query);
    const r=spawnSync('gh',args,{encoding:'utf8',maxBuffer:8*1024*1024,windowsHide:true});
    if(r.status!==0)throw Error('GitHub request failed: '+endpoint.split('?')[0]+' (run gh auth login locally or provide GH_TOKEN)');
    return JSON.parse(r.stdout);
  }
  for(let attempt=0;attempt<3;attempt++){
    const r=await fetch('https://api.github.com/'+endpoint,{method:query?'POST':'GET',headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Hang-Portfolio-Sync'},body:query?JSON.stringify({query}):undefined,signal:AbortSignal.timeout(30000)});
    if(r.ok)return r.json();
    if(r.status<500||attempt===2)throw Error('GitHub request failed: HTTP '+r.status+' '+endpoint.split('?')[0]);
    await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
  }
}
const user=await api('users/'+cfg.username);
let all=[];
for(let page=1;;page++){
 const rows=await api(`users/${cfg.username}/repos?type=owner&sort=pushed&per_page=100&page=${page}`);
 if(!Array.isArray(rows))throw Error('Invalid repository response');
 all.push(...rows);if(rows.length<100)break;
}
const selected=all.filter(r=>!r.private&&(!cfg.excludeForks||!r.fork)&&(!cfg.excludeArchived||!r.archived)&&!cfg.exclude.includes(r.name));
const rank=n=>{const i=cfg.featured.indexOf(n);return i<0?cfg.featured.length:i;};
selected.sort((a,b)=>rank(a.name)-rank(b.name)||b.pushed_at.localeCompare(a.pushed_at));
if(!selected.length)throw Error('No repositories selected; old snapshot retained');
const repos=[];
for(const r of selected){
 const langs=await api(`repos/${cfg.username}/${encodeURIComponent(r.name)}/languages`);
 if(Object.values(langs).some(v=>!Number.isFinite(v)||v<0))throw Error('Invalid languages');
 repos.push({name:r.name,desc:r.description||'',lang:r.language||'',stars:r.stargazers_count,forks:r.forks_count,pushed:r.pushed_at.slice(0,10),home:/^https?:\/\//i.test(r.homepage||'')?r.homepage:'',url:r.html_url,topics:r.topics||[],langs});
}
// Calendar contains dates and counts only; no private repository names or activity details are exported.
const result=await api('graphql',`{user(login:"${cfg.username}"){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`);
if(result.errors)throw Error('Contribution calendar could not be fetched');
const cal=result.data?.user?.contributionsCollection?.contributionCalendar;
const days=cal?.weeks.flatMap(w=>w.contributionDays)||[];
if(days.length<300||days.length>380)throw Error('Incomplete contribution calendar; old snapshot retained');
for(let i=0;i<days.length;i++){
 if(!Number.isInteger(days[i].contributionCount)||days[i].contributionCount<0)throw Error('Invalid contribution count');
 if(i&&Date.parse(days[i].date)-Date.parse(days[i-1].date)!==86400000)throw Error('Contribution dates are not consecutive');
}
if(days.reduce((s,d)=>s+d.contributionCount,0)!==cal.totalContributions)throw Error('Contribution total mismatch');
const now=new Date().toISOString();
const data={snapshot:now.slice(0,10),syncedAt:now,user:{login:user.login,url:user.html_url,avatar:user.avatar_url,publicRepos:user.public_repos,followers:user.followers,following:user.following,joined:user.created_at.slice(0,10)},calendar:{total:cal.totalContributions,start:days[0].date,end:days.at(-1).date,counts:days.map(d=>d.contributionCount)},repos};
const target=path.join(root,'data.js');
await fs.writeFile(target+'.pending','// Generated from public GitHub data. Do not edit.\nwindow.SITE_DATA = '+JSON.stringify(data,null,1)+';\n');
await fs.rename(target+'.pending',target);
console.log(`Synced @${cfg.username}: ${repos.length} public repositories, ${days.length} calendar days, ${cal.totalContributions} contributions.`);
