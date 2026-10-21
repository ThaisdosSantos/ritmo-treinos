/* Google Identity Services: access tokens stay in memory, never in browser storage. */
(() => {
  const CLIENT_ID = '320635472769-hrmi2sorgpdgp6vncjk8b02hbdami8av.apps.googleusercontent.com';
  const SCOPE = 'https://www.googleapis.com/auth/calendar.events.owned';
  let token = null, expiresAt = 0, client = null, connecting = false;
  const inFlight = new Map();
  const valid = () => Boolean(token && Date.now() < expiresAt);
  function status(message) {
    const e = document.querySelector('#google-status');
    if (e) e.textContent = message;
    const b = document.querySelector('#google-connect');
    if (b) b.disabled = connecting;
  }
  function connect() {
    if (!window.google?.accounts?.oauth2) {
      status('O serviço Google não carregou. Verifique sua conexão e tente novamente.'); return;
    }
    if (connecting) return;
    connecting = true;
    status('Aguardando sua autorização no Google…');
    try {
      client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID, scope: SCOPE,
        callback: response => {
          connecting = false;
          if (response.error || !response.access_token || !google.accounts.oauth2.hasGrantedAllScopes(response, SCOPE)) {
            token = null; expiresAt = 0;
            status('Permissão da Agenda não concedida. Conecte novamente e autorize o acesso.'); return;
          }
          token = response.access_token;
          expiresAt = Date.now() + Math.max(0, Number(response.expires_in || 0) - 60) * 1000;
          const enabled = document.querySelector('#google-auto');
          if (enabled) enabled.checked = true;
          status('Agenda conectada. Ao salvar novas sessões, o envio será automático enquanto a autorização estiver válida.');
        },
        error_callback: () => {
          connecting = false;
          status('A janela Google foi fechada ou bloqueada. Permita pop-ups e tente novamente.');
        }
      });
      client.requestAccessToken({prompt:'select_account'});
    } catch {
      connecting = false;
      status('Não foi possível abrir o Google. Confira a origem JavaScript autorizada nas configurações OAuth.');
    }
  }
  function disconnect() {
    const current = token;
    token = null; expiresAt = 0;
    const box = document.querySelector('#google-auto');
    if (box) box.checked = false;
    if (current && window.google?.accounts?.oauth2) google.accounts.oauth2.revoke(current, () => {});
    status('Agenda desconectada. As próximas sessões serão salvas apenas no histórico.');
  }
  function buildEvent(s, plan) {
    const id = 'ritmo' + s.id.toLowerCase().replace(/-/g, '');
    if (!/^ritmo[0-9a-f]{32}$/.test(id)) throw new Error('Sessão sem identificador válido.');
    const start = new Date(s.start).toISOString(), end = new Date(s.end).toISOString();
    if (s.end <= s.start) throw new Error('O término deve ser posterior ao início.');
    const seconds = Math.floor((s.end-s.start)/1000);
    const elapsed = [Math.floor(seconds/3600), Math.floor(seconds/60)%60, seconds%60].map(x=>String(x).padStart(2,'0')).join(':');
    return {
      id, summary:`Treino ${'ABCDE'[s.day]} - Concluído`,
      start:{dateTime:start}, end:{dateTime:end},
      description:`${plan[0]} · ${plan[1]}\nDuração: ${elapsed}\n${s.done.filter(Boolean).length}/${plan[3].length} exercícios concluídos\n\n` +
        plan[3].map((e,i)=>s.done[i]?`${e[0]} · ${e[1]} · ${s.weights[i]} kg`:null).filter(Boolean).join('\n'),
      extendedProperties:{private:{ritmoSessionId:s.id}}
    };
  }
  async function send(s, plan) {
    if (!valid()) throw new Error('Reconecte o Google Agenda em Configurações e tente novamente.');
    const body = buildEvent(s, plan);
    const headers = {Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
    const base = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    let response;
    try { response = await fetch(base,{method:'POST',headers,body:JSON.stringify(body)}); }
    catch { throw new Error('Sem confirmação do Google. Tente novamente: o identificador da sessão evita duplicações.'); }
    if (response.status === 401) {
      token = null; expiresAt = 0;
      status('Autorização expirada. Conecte a Agenda novamente.');
      throw new Error('Autorização expirada. Reconecte o Google Agenda.');
    }
    if (response.status === 409) {
      response = await fetch(`${base}/${body.id}`,{headers});
      if (!response.ok) throw new Error('Evento já existe, mas não foi possível confirmar. Tente novamente.');
      const existing = await response.json();
      if (existing.status === 'cancelled' || existing.extendedProperties?.private?.ritmoSessionId !== s.id)
        throw new Error('O evento existente foi removido ou não corresponde à sessão. Confira sua Agenda.');
      return {id:existing.id};
    }
    if (!response.ok) {
      if(response.status===403) throw new Error('Acesso negado. Confira a permissão da Agenda e se a Calendar API está habilitada no Google Cloud.');
      if(response.status===429) throw new Error('Limite temporário do Google. Aguarde e tente novamente pelo histórico.');
      throw new Error('O Google não confirmou o evento. Tente novamente pelo histórico.');
    }
    const event = await response.json();
    if (event.id !== body.id) throw new Error('Não foi possível validar a confirmação do evento.');
    return {id:event.id};
  }
  function sync(s, plan) {
    if (inFlight.has(s.id)) return inFlight.get(s.id);
    const operation = send(s,plan).finally(()=>inFlight.delete(s.id));
    inFlight.set(s.id,operation); return operation;
  }
  window.RitmoGoogle = {connect, disconnect, valid, sync, buildEvent};
  document.querySelector('#google-connect').onclick = connect;
  document.querySelector('#google-disconnect').onclick = disconnect;
  document.querySelector('#google-auto').onchange = e => {
    if(e.target.checked && !valid()) {e.target.checked=false;status('Conecte a Agenda primeiro para habilitar o envio automático.');}
  };
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden && token && !valid()) status('Autorização expirada. Reconecte a Agenda antes de enviar novas sessões.');
  });
})();
