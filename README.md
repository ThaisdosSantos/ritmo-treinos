# Ritmo — GitHub Pages

Aplicação estática em HTML, CSS e JavaScript. Não requer build, Node.js ou banco de dados.

## Publicar

1. Crie ou escolha um repositório no GitHub.
2. Envie o conteúdo desta pasta para a raiz do repositório: index.html, app.js, google-calendar.js e .nojekyll. Não envie somente o ZIP.
3. Em Settings → Pages, selecione Deploy from a branch, branch main e pasta / (root), e salve.
4. Aguarde a publicação. O endereço costuma ser https://thaisdossantos.github.io/ritmo-treinos/.

## Google Agenda

O Client ID informado já está configurado em google-calendar.js. Ele é público; nenhum Client Secret deve ser incluído no site.

No cliente OAuth de tipo Aplicativo da Web, adicione a origem https://thaisdossantos.github.io em Origens JavaScript autorizadas, SEM o nome do repositório e SEM barra final. Se usar domínio próprio, adicione sua origem HTTPS.
Habilite a Google Calendar API no mesmo projeto. Configure a tela de consentimento e, enquanto estiver em teste, inclua sua conta como usuário de teste.
O fluxo atual usa popup e não requer URI de redirecionamento.
No app, vá a Configurações → Conectar Google Agenda. Confirme a conta e as permissões. Novas sessões confirmadas serão enviadas enquanto a autorização estiver válida. Ao expirar ou recarregar a página, reconecte. Eventos antigos só são enviados quando você solicita pelo histórico.

## Dados e acesso

O app oferece Entrar com Google e Sair. A conta é confirmada com o endpoint UserInfo do Google. Tokens ficam apenas na memória da aba e o login deve ser repetido ao recarregar. O histórico local é separado pelo identificador Google (sub). O botão Sair salva o treino em andamento e limpa a sessão ao recarregar a página. O site continua estático: isso não é proteção de dados no servidor; código e fichas iniciais permanecem públicos.
O histórico e as cargas são mantidos no localStorage do navegador. A mudança de domínio NÃO transfere esse histórico. Antes de migrar, exporte o histórico no site antigo para preservar uma cópia; esta versão ainda não oferece importação.
A autorização Google fica apenas na memória da aba, não nos arquivos ou localStorage.

## Validação

A integração foi testada localmente com respostas simuladas. A autorização real deve ser validada no endereço publicado, depois de cadastrar a origem no Google Cloud.
