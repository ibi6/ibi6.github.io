(() => {
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const ease='cubic-bezier(.16,1,.3,1)';
const running=new Set();
function animate(el,frames,options){const a=el.animate(frames,{fill:'backwards',...options});running.add(a);a.finished.catch(()=>{}).finally(()=>running.delete(a));return a;}
function stop(){running.forEach(a=>a.cancel());running.clear();}
reduced.addEventListener('change',()=>{if(reduced.matches)stop();});
const pages={home:'homePage',projects:'projects',github:'github',notes:'notes',contact:'contact'};
let lastPage='';
function entrance(){const key=document.body.dataset.page;if(key===lastPage)return;lastPage=key;stop();if(reduced.matches)return;const page=document.getElementById(pages[key]);if(!page)return;
const candidates=key==='home'?page.querySelectorAll('.eyebrow,.lead,.hero-cta,.city-cap'):page.querySelectorAll(':scope > .sec-h,:scope > .proj-wrap > .proj-list,:scope > .proj-wrap > .proj-view,:scope > .gh-stats,:scope > .heat-card,:scope > .notes-editorial,:scope > .big-link,:scope > .contact-extra');
[...candidates].filter(el=>el.getBoundingClientRect().top<innerHeight).forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(22px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],{duration:720,delay:i*65,easing:ease}));}
new MutationObserver(entrance).observe(document.body,{attributes:true,attributeFilter:['data-page']});entrance();
const preview=document.getElementById('projView');
new MutationObserver(()=>{if(reduced.matches)return;const art=preview.querySelector('svg'),body=preview.querySelector('.pv-body');if(art)animate(art,[{opacity:.15,transform:'translateY(12px) scale(.94)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:700,easing:ease});if(body)animate(body,[{opacity:0,transform:'translateX(14px)'},{opacity:1,transform:'translateX(0)'}],{duration:580,delay:70,easing:ease});}).observe(preview,{childList:true});
// Pointer light stays local to a card; touch and reduced-motion never run it.
document.querySelectorAll('.detail-card,.feature,.skill').forEach(card=>{card.classList.add('motion-card');let queued=false,x=0,y=0;
card.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;const r=card.getBoundingClientRect();x=e.clientX-r.left;y=e.clientY-r.top;if(!queued){queued=true;requestAnimationFrame(()=>{card.style.setProperty('--light-x',x+'px');card.style.setProperty('--light-y',y+'px');queued=false;});}});});
// A short tactile press, without persistent transforms or layout changes.
document.querySelectorAll('.btn,.proj,.tag,.view-toggle button,.project-focus').forEach(button=>button.addEventListener('pointerdown',()=>{if(reduced.matches)return;animate(button,[{scale:'1'},{scale:'.96'},{scale:'1'}],{duration:300,easing:'cubic-bezier(.2,.8,.2,1)'});}));
})();
