/**
 * @file Recursos progressivos: registro do Service Worker e Screen Wake Lock.
 * @description Falhas nessas APIs não impedem o registro de exercícios.
 */
(()=>{if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let lock=null,requesting=false,active=false;
const status=()=>document.querySelector('#wake-status');
function label(message){const el=status();if(el)el.textContent=message}
/** Solicita tela ligada enquanto uma sessão ativa está visível. @returns {Promise<void>} */
async function acquire(){if(!active||document.visibilityState!=='visible'||lock||requesting)return;if(!('wakeLock'in navigator)){label('Seu dispositivo não oferece bloqueio de tela ativo.');return}requesting=true;try{const sentinel=await navigator.wakeLock.request('screen');if(!active||document.visibilityState!=='visible'){await sentinel.release();return}lock=sentinel;label('✓ Tela mantida ativa durante o treino.');sentinel.addEventListener('release',()=>{if(lock===sentinel){lock=null;if(active&&document.visibilityState==='visible')label('Proteção de tela interrompida; volte ao aplicativo para reativar.')}})}catch{label('Não foi possível manter a tela ativa neste dispositivo.')}finally{requesting=false}}
/** Libera o bloqueio de tela sem afetar a sessão salva. @returns {Promise<void>} */
async function release(){const current=lock;lock=null;if(current)try{await current.release()}catch{}label('Tela ativa durante o treino, quando permitido.')}
window.RitmoWakeLock={setActive(value){active=!!value;if(active)acquire();else release()}};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&active)acquire()});
})();