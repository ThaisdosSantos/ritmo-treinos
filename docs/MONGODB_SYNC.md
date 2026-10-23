# MongoDB Atlas + Ritmo (GitHub Pages)

## Segurança primeiro
A senha de banco foi exposta em uma captura de tela. **Redefina-a no Atlas** antes de publicar. Nunca armazene MONGODB_URI no frontend, no Git ou no chat.

## Backend
1. MongoDB Atlas: crie banco `ritmo_db`, usuário com permissão readWrite **apenas nesse banco** e configure Network Access para o servidor.
2. No serviço de hospedagem Node.js (por exemplo, Render), conecte o repositório, defina **Root Directory** como `backend`, **Build** `npm install`, **Start** `npm start`.
3. Configure variáveis de ambiente **privadas**:
   - `MONGODB_URI`: string SRV completa, incluindo usuário, **nova** senha codificada para URL e banco `ritmo_db`.
   - `GOOGLE_CLIENT_ID`: Client ID OAuth do login Google usado no frontend.
   - `FRONTEND_ORIGIN`: `https://thaisdossantos.github.io`
   - `NODE_ENV`: `production`
4. Confirme que `https://SEU-BACKEND/api/health` retorna `{"status":"ok"}`.
5. No Ritmo, entre com Google, abra **Configurações → Sincronização na nuvem**, cole `https://SEU-BACKEND` e clique **Conectar e sincronizar**. Repita em cada dispositivo. O histórico local será mesclado com o remoto.
6. Faça backup JSON de cada dispositivo antes da primeira sincronização. Não apague os dados locais.

## Escopo da primeira versão
- API autenticada por token OAuth Google validado pelo servidor, com checagem do Client ID e identidade do usuário.
- `GET /api/sync` e `POST /api/sync` fazem mesclagem do histórico por ID e propagam exclusões.
- A interface mantém histórico offline, sincroniza ao fazer login, ao voltar a ficar online e após alterações locais.
- O endpoint é configurável no próprio navegador, sem inserir credenciais MongoDB no frontend.
- **Limitação atual:** cargas e fichas personalizadas permanecem locais; a sincronização na nuvem cobre o histórico concluído. Para sincronização completa das fichas, é necessária uma etapa adicional com controle de versão e conflitos.
- Se a API estiver offline ou a autenticação expirar, o histórico continua salvo localmente e será sincronizado após nova autenticação.

## Diagnóstico
- HTTP 401: entre novamente com Google; confira GOOGLE_CLIENT_ID.
- Erro de CORS: confira FRONTEND_ORIGIN (somente origem, sem caminho).
- Falha de banco: confira MONGODB_URI, senha, acesso de rede no Atlas.
- Render em plano gratuito pode demorar a iniciar após inatividade.
