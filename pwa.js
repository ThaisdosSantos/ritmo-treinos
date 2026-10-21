// Offline shell and screen wake lock are optional enhancements.
(()=>{if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let lock=null,requesting=false,active=false;
const status=()=>document.querySelector('#wake-status');
function label(message){const el=status();if(el)el.textContent=message}
async function acquire(){if(!active||document.visibilityState!=='visible'||lock||requesting)return;if(!('wakeLock'in navigator)){label('Seu dispositivo não oferece bloqueio de tela ativo.');return}requesting=true;try{const sentinel=await navigator.wakeLock.request('screen');if(!active||document.visibilityState!=='visible'){await sentinel.release();return}lock=sentinel;label('✓ Tela mantida ativa durante o treino.');sentinel.addEventListener('release',()=>{if(lock===sentinel){lock=null;if(active&&document.visibilityState==='visible'){label('Proteção de tela interrompida.');setTimeout(acquire,1500)}}})}catch{label('Não foi possível manter a tela ativa neste dispositivo.')}finally{requesting=false}}
async function release(){const current=lock;lock=null;if(current)try{await current.release()}catch{}label('Tela ativa durante o treino, quando permitido.')}
window.RitmoWakeLock={setActive(value){active=!!value;if(active)acquire();else release()}};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&active)acquire()});
})();