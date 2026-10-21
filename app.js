const plans=[
['Segunda','Quadríceps e posteriores','Panturrilha / Quadríceps / Posteriores / Glúteo',[
['Panturrilha','4 × 15','30','Progredindo a carga e priorizando a execução.'],['Passada livre','1 × 200','0'],['Extensora','3 × 15–12–10','19','Drop na última série.'],['Cadeira flexora','4 × 15–12–10–8','34,3 / 42,3 / 49,3 / 56,3'],['Agachamento livre','3 × 12–10–8','40 / 50 / 60'],['Leg press','4 × 15–12–10–8','90 / 110 / 130 / 150']]],
['Terça','Costas e trapézio','Costas / Trapézio / Tríceps / Cardio 35 min',[
['Panturrilha','3 × 12','30','Progredindo carga; prioridade no movimento.'],['Remada baixa com triângulo','3 × 12–10–8','26 / 33 / 35,3'],['Puxada supinada alta, unilateral','3 × 12–10–8','10 / 12,5 / 12,5'],['Puxada alta / pegada neutra na barra','3 × 12–10–8','26 / 33 / 40'],['FacePull','3 × 12–10–8','20','Drop na última série.'],['Bíceps concentrado','3 × 8 a 12','677','Carga transcrita como “677”: confirme antes de executar. O título da ficha cita tríceps e cardio, mas o PDF não detalha esses exercícios.']]],
['Quarta','Inferiores','Inferiores',[
['Abdominal infra paralelas com pernas estendidas','4 × 15','0'],['Cadeira abdutora','4 × 20','0'],['Búlgaro','4 × 15–12–10–8','22'],['Mesa flexora','3 × 12–10–8','33'],['Cadeira flexora','4 × 15–12–10–8','54','Segura 2 s na contração e controla a subida.'],['Stiff','3 × 15–12–8','20'],['Leg press','4 × 15–12–10–8','130']]],
['Quinta','Peito, ombro e bíceps','Peito / Ombro / Bíceps',[
['Panturrilha','4 × 15','35'],['Voador','3 × 12–10–8','21,3'],['Desenvolvimento','3 × 12–10–8','23'],['Lateral com halteres','3 × 15–12–10','6','Drop na última série: 4 sessões de 10 reduzindo carga.'],['FacePull','4 × 15–12–10–8','15'],['Bíceps concentrado','3 × 12–10–8','7']]],
['Sexta','Inferiores','Inferiores',[
['Panturrilha','4 × 15–12–10–8','40'],['Elevação pélvica','3 × 12–10–8','50 / 80 / 110'],['Cadeira abdutora','3 × 15','75'],['Flexora em pé unilateral','3 × 12–10–8','7,2'],['Stiff','3 × 12–10–8','60'],['Mesa flexora','3 × 12–10–8','33'],['Extensora','3 × 12–10–8','79','Drop na última série: 3 sessões de 8 repetições.']]]];
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const blankState=()=>({selected:Math.min(4,Math.max(0,new Date().getDay()-1)),weights:plans.map(p=>p[3].map(e=>e[2])),done:[],session:null,history:[]});let storageKey=null,state=blankState();let draft=null;
function save(){if(!storageKey)return false;try{localStorage.setItem(storageKey,JSON.stringify(state));return true}catch{toast('Não foi possível salvar. Exporte seus dados para evitar perda.');return false}}
function toast(s){const e=document.createElement('div');e.className='toast';e.textContent=s;document.body.append(e);setTimeout(()=>e.remove(),4500)}
function duration(ms){let s=Math.max(0,Math.floor(ms/1000));return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(n=>String(n).padStart(2,'0')).join(':')}
function render(){let d=state.selected,p=plans[d];$('#week').innerHTML=plans.map((p,i)=>`<button class="day ${i===d?'selected':''}" data-day="${i}" ${state.session?'disabled':''}><small>TREINO ${'ABCDE'[i]}</small><b>${p[0]}</b><small>${p[1]}</small></button>`).join('');$('#daylabel').textContent=`TREINO ${'ABCDE'[d]} · ${p[0].toUpperCase()}`;$('#title').textContent=p[1];$('#exercises').innerHTML=p[3].map((e,i)=>`<div class="exercise ${state.done[i]?'done':''}"><span class="num">${String(i+1).padStart(2,'0')}</span><div><b>${esc(e[0])}</b><small>${esc(e[1])}${e[3]?'<br>'+esc(e[3]):''}</small></div><label class="weight"><input aria-label="Carga de ${esc(e[0])}" data-weight="${i}" value="${esc(state.weights[d][i])}" maxlength="80"><span>kg</span></label><input type="checkbox" data-done="${i}" aria-label="Concluir ${esc(e[0])}" ${state.done[i]?'checked':''} ${!state.session?'disabled':''}></div>`).join('');let n=state.done.filter(Boolean).length,total=p[3].length;$('#count').textContent=`${n} de ${total}`;$('#percent').textContent=`${Math.round(n/total*100)}% dos exercícios concluídos`;$('#bar').style.width=n/total*100+'%';$('#start').classList.toggle('hidden',!!state.session);$('#finish').classList.toggle('hidden',!state.session);$('#sessionstate').textContent=state.session?'TREINO EM ANDAMENTO':'SUA SESSÃO';$('#timerhint').textContent=state.session?'Seu tempo, seu ritmo.':'Tudo pronto para começar?';tick()}
function tick(){$('#clock').textContent=duration(state.session?Date.now()-state.session.start:0)}setInterval(tick,1000);document.addEventListener('visibilitychange',tick);
$('#week').onclick=e=>{const b=e.target.closest('[data-day]');if(!b||state.session)return;state.selected=+b.dataset.day;state.done=[];save();render()};$('#exercises').oninput=e=>{if(e.target.dataset.weight!==undefined){state.weights[state.selected][+e.target.dataset.weight]=e.target.value;save()}};$('#exercises').onchange=e=>{if(e.target.dataset.done!==undefined&&state.session){state.done[+e.target.dataset.done]=e.target.checked;save();render()}};
$('#start').onclick=()=>{state.done=[];state.session={start:Date.now()};save();render()};$('#finish').onclick=()=>{if(!state.session)return;draft={id:crypto.randomUUID(),day:state.selected,start:state.session.start,end:Date.now(),done:[...state.done],weights:[...state.weights[state.selected]]};state.session=null;state.pending=draft;save();render();showSummary(draft)};
function showSummary(s){draft=s;let n=s.done.filter(Boolean).length,t=plans[s.day][3].length;$('#summarycontent').innerHTML=`<div class="clock">${duration(s.end-s.start)}</div><p><b>${n} de ${t} exercícios · ${Math.round(n/t*100)}%</b></p><p>${esc(plans[s.day][0])} · ${esc(plans[s.day][1])}<br><small>${new Date(s.start).toLocaleString('pt-BR')} até ${new Date(s.end).toLocaleTimeString('pt-BR')}</small></p><p class="note">O histórico será salvo neste navegador. Se o envio automático estiver ativado e autorizado, a sessão também será enviada à Agenda.</p>`;$('#summary').showModal()}
function persistDraft(){if(draft&&!state.history.some(s=>s.id===draft.id)){state.history.unshift(draft)}state.pending=null;state.done=[];save();render();history()}
$('#confirm').onclick=()=>{const session=draft;if(!session)return;persistDraft();$('#summary').close();draft=null;toast('Sessão salva no histórico.');if($('#google-auto').checked)syncSession(session)};$('#close').onclick=()=>{persistDraft();$('#summary').close();draft=null};$('#summary').addEventListener('cancel',e=>{e.preventDefault();$('#close').click()});
function calendar(s){let p=plans[s.day],n=s.done.filter(Boolean).length;let text=`Duração: ${duration(s.end-s.start)}\n${n}/${p[3].length} exercícios concluídos\n`+p[3].filter((e,i)=>s.done[i]).map(e=>{let i=p[3].indexOf(e);return `${e[0]} · ${e[1]} · ${s.weights[i]} kg`}).join('\n');let iso=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');let q=new URLSearchParams({action:'TEMPLATE',text:`Treino ${'ABCDE'[s.day]} - Concluído`,dates:iso(s.start)+'/'+iso(s.end),details:text});window.open('https://calendar.google.com/calendar/render?'+q,'_blank','noopener,noreferrer')}
function history(){$('#historylist').innerHTML=state.history.length?state.history.map((s,i)=>`<div class="historyitem"><div class="titlebar"><b>Treino ${'ABCDE'[s.day]} · ${esc(plans[s.day][1])}</b><span class="tag">${duration(s.end-s.start)}</span></div><p class="note">${new Date(s.start).toLocaleString('pt-BR')} · ${s.done.filter(Boolean).length}/${plans[s.day][3].length} exercícios</p><details><summary>Ver exercícios e cargas</summary><p class="note">${plans[s.day][3].map((e,k)=>`${s.done[k]?'✓':'○'} ${esc(e[0])}: ${esc(s.weights[k])} kg`).join('<br>')}</p></details><p class="note" role="status">${esc(s.googleSync==='synced'?'✓ Enviado ao Google Agenda':s.googleError||'Ainda não enviado à Agenda')}</p><button class="secondary" data-sync="${i}" ${s.googleSync==='synced'?'disabled':''}>${s.googleSync==='synced'?'Enviado':'Enviar ao Google Agenda'}</button><button class="secondary" data-calendar="${i}">Adicionar manualmente ↗</button></div>`).join(''):'<h2>Seu primeiro treino começa aqui.</h2><p class="muted">As sessões finalizadas aparecerão neste espaço.</p>'}
$('#historylist').onclick=e=>{if(e.target.dataset.calendar!==undefined)calendar(state.history[+e.target.dataset.calendar]);if(e.target.dataset.sync!==undefined)syncSession(state.history[+e.target.dataset.sync])};document.querySelector('nav').onclick=e=>{let b=e.target.closest('[data-view]');if(!b)return;document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hidden',s.id!==b.dataset.view));document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));history()};$('#export').onclick=()=>{let u=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='ritmo-treinos.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};$('#date').textContent=new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long'});render();history();

const syncingSessions = new Set();
async function syncSession(session) {
  if(!session || session.googleSync==='synced' || syncingSessions.has(session.id)) return;
  if(!window.RitmoGoogle?.valid()) {
    session.googleError='Reconecte o Google Agenda em Configurações e envie pelo histórico.';
    save();history();toast(session.googleError);return;
  }
  syncingSessions.add(session.id);session.googleError='Enviando à Agenda…';save();history();
  try {
    const result=await window.RitmoGoogle.sync(session, plans[session.day]);
    session.googleSync='synced';session.googleEventId=result.id;delete session.googleError;
    toast('Treino enviado ao Google Agenda.');
  } catch(error) {session.googleSync='pending';session.googleError=error.message;toast(error.message);}
  finally {syncingSessions.delete(session.id);save();history();}
}

window.RitmoAccount={save,open(user){
 storageKey='ritmo-account-v1:'+user.sub;
 let stored=null;try{stored=JSON.parse(localStorage.getItem(storageKey));}catch{}
 state=stored&&Array.isArray(stored.weights)&&Array.isArray(stored.history)?stored:blankState();
 draft=null;render();history();
 try{$('#recover-legacy').classList.toggle('hidden',!localStorage.getItem('ritmo-v1')||!!stored);}catch{}
 if(state.pending)queueMicrotask(()=>showSummary(state.pending));
}};
$('#recover-legacy').onclick=()=>{
 if(!storageKey)return;
 if(!confirm('Confirma que os treinos anteriores deste navegador são seus? Eles serão copiados para esta conta.'))return;
 try{const old=JSON.parse(localStorage.getItem('ritmo-v1'));if(!old||!Array.isArray(old.history)||!Array.isArray(old.weights))throw Error();state=old;if(!save())return;render();history();$('#recover-legacy').classList.add('hidden');toast('Treinos anteriores recuperados.');}catch{toast('Não foi possível recuperar os dados antigos.');}
};
