// Login validates the access token with Google's UserInfo endpoint.
// This static app stores workout data locally; it has no protected server database.
(() => {
  const clientId='320635472769-hrmi2sorgpdgp6vncjk8b02hbdami8av.apps.googleusercontent.com';
  let user=null,busy=false;
  const button=document.querySelector('#login-google'), message=document.querySelector('#login-message');
  function failure(text){busy=false;button.disabled=false;message.textContent=text;}
  function login(){
    if(busy)return;
    if(!window.google?.accounts?.oauth2){failure('O Google ainda não carregou. Verifique a conexão e tente novamente.');return;}
    busy=true;button.disabled=true;message.textContent='Escolha sua conta na janela do Google.';
    try{
      const client=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:'openid email profile',include_granted_scopes:false,
        callback:async response=>{
          if(response.error||!response.access_token){failure('Login não autorizado. Tente novamente.');return;}
          try{
            const result=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:`Bearer ${response.access_token}`},cache:'no-store'});
            if(!result.ok)throw Error();
            const profile=await result.json();
            if(typeof profile.sub!=='string'||!profile.sub||profile.sub.length>255)throw Error();
            user={sub:profile.sub,name:profile.name||profile.email||'Sua conta',email:profile.email||''};
            window.RitmoAccount.open(user);
            document.querySelector('#account-name').textContent=user.name;
            document.querySelector('#account-name').title=user.email;
            document.querySelector('#account-avatar').textContent=user.name.slice(0,1).toUpperCase();
            document.querySelector('#login-screen').classList.add('hidden');
            document.querySelector('#app-shell').classList.remove('hidden');
            busy=false;button.disabled=false;
            const lifetime=Math.max(1,Number(response.expires_in)||3600);
            setTimeout(logout,lifetime*1000);
          }catch{user=null;failure('Não foi possível confirmar sua conta Google. Tente novamente.');}
        },error_callback:()=>failure('A janela foi fechada ou bloqueada. Permita pop-ups e tente novamente.')});
      client.requestAccessToken({prompt:'select_account'});
    }catch{failure('Não foi possível abrir o login Google. Confira a origem autorizada no Google Cloud.');}
  }
  function logout(){window.RitmoAccount?.save();user=null;location.reload();}
  window.RitmoAuth={getUser:()=>user,login,logout};
  button.onclick=login;document.querySelector('#logout').onclick=logout;
})();
