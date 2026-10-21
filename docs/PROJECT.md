# Documentação técnica e funcional — Ritmo

> **Versão da documentação:** 1.0 · **Público:** desenvolvedores, mantenedores e colaboradores · **Idioma:** pt-BR  
> **Aplicação:** [Abrir Ritmo](https://thaisdossantos.github.io/ritmo-treinos/) · **Código:** [GitHub](https://github.com/ThaisdosSantos/ritmo-treinos)

## 1. Visão geral

O **Ritmo** é uma aplicação web responsiva para acompanhar treinos de musculação. Permite consultar fichas por dia da semana, registrar cargas, marcar exercícios concluídos, controlar o tempo da sessão e os descansos, consultar o histórico e opcionalmente enviar sessões ao Google Agenda.

O projeto prioriza uso em dispositivos móveis, operação sem servidor próprio e persistência local. **Não é uma plataforma com banco de dados em nuvem:** a identidade Google delimita os dados no navegador, mas não sincroniza o histórico entre dispositivos.

### Objetivos e público-alvo

- **Praticantes de musculação:** acompanhamento rápido da ficha durante a execução.
- **Usuários recorrentes:** visualização de cargas anteriores e evolução no histórico.
- **Mantenedores:** base estática de baixo custo, organizada por responsabilidade, publicada no GitHub Pages.

### Escopo atual

| Área | Comportamento implementado |
| --- | --- |
| Identidade | Login com conta Google via Google Identity Services; botão de sair |
| Fichas | Cinco dias (segunda a sexta) com exercícios, séries, repetições, cargas e observações |
| Personalização | Edição, inclusão e remoção de exercícios; salvamento local |
| Execução | Iniciar/finalizar sessão; marcar exercícios concluídos; progresso percentual |
| Cargas | Campo editável, incremento/decremento de 1 kg para valores numéricos únicos, última carga do histórico |
| Tempo | Cronômetro de sessão e descanso de 30/60/90 segundos; descanso disparado ao marcar exercício |
| Histórico | Sessões finalizadas, duração, exercícios/cargas, status de envio à Agenda |
| Google Agenda | Conexão OAuth separada, envio manual pelo histórico e envio automático opcional enquanto o token estiver válido |
| Dados | Backup JSON, importação JSON, exportação CSV e recuperação de dados legados quando disponíveis |
| Mobile/PWA | Layout responsivo, manifest, ícones, Service Worker e tentativa de manter a tela ativa durante a sessão |

**Limites importantes:** o estado de conclusão é por **exercício**, não por série individual; não há backend, autenticação persistente offline, sincronização entre aparelhos, notificações push nem garantia de funcionamento do Google Agenda sem internet.

## 2. Stack e decisões técnicas

| Camada | Tecnologia | Responsabilidade |
| --- | --- | --- |
| Interface | HTML5, CSS3 e JavaScript (ES Modules) | Renderização e interações no navegador |
| Autenticação | Google Identity Services + UserInfo | Autorização e identificação do usuário |
| Calendário | Google Calendar API + OAuth 2.0 | Criação de eventos de treino autorizados |
| Persistência | `localStorage` | Fichas, cargas, sessão ativa e histórico |
| Offline | Service Worker + Cache Storage | Cache de recursos estáticos |
| Tela ativa | Screen Wake Lock API | Solicitar tela ligada durante treino |
| Hospedagem | GitHub Pages + GitHub Actions | Publicação estática por workflow |

A aplicação **não utiliza React, Node.js em produção, servidor de API ou banco de dados remoto**. O navegador executa o código diretamente; o deploy copia arquivos estáticos.

## 3. Organização do repositório

```text
ritmo-treinos/
├── .github/workflows/deploy.yml     # CI/CD: publicação no Pages
├── docs/
│   ├── PROJECT.md                   # Este documento
│   └── ARCHITECTURE.md              # Notas de arquitetura/migração
├── public/
│   ├── manifest.json                # Metadados de instalação PWA
│   ├── icons/                       # Ícones SVG e PNG
│   └── sw.js                        # Cache offline do app shell
├── src/
│   ├── index.html                   # Estrutura HTML e elementos da UI
│   ├── assets/styles/
│   │   ├── base/                    # Variáveis e reset
│   │   ├── components/              # Estilos visuais organizados
│   │   └── main.css                 # Estilos base e importações
│   └── js/
│       ├── app.js                   # Entry point: ordem dos imports
│       ├── core/workout.js          # Estado, ficha, histórico e UI de treino
│       ├── core/timer.js            # Registro PWA e Wake Lock
│       ├── services/auth.service.js # Login e logout Google
│       ├── services/calendar.service.js # OAuth e Calendar API
│       ├── services/storage.service.js  # Ponto de extensão (não usado pelo core)
│       ├── config/constants.js      # Constantes auxiliares
│       ├── ui/                       # Pontos de extensão para views/componentes
│       └── utils/                    # Funções auxiliares
├── .editorconfig
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── LICENSE
└── README.md
```

### Estado real da modularização

A migração para `src/` preservou a implementação original em `core/workout.js`, inclusive lógica de UI, armazenamento e descanso. Portanto, **a separação por diretórios não significa que todas as responsabilidades já foram extraídas**. Os módulos `storage.service.js`, `ui/`, `utils/` e `config/` são pontos de extensão. Evite presumir que mudanças neles afetem automaticamente o fluxo de treino.

A ordem de importação de `src/js/app.js` importa: calendário → treino → autenticação → PWA. Os módulos legados expõem APIs globais em `window` para interoperabilidade.

## 4. Fluxos funcionais

### 4.1 Autenticação e isolamento local

1. O usuário clica em **Entrar com Google**.
2. O Google Identity Services solicita um access token para identidade.
3. O cliente consulta `https://openidconnect.googleapis.com/v1/userinfo`.
4. O identificador `sub` da conta seleciona o namespace local `ritmo-account-v1:<sub>`.
5. O aplicativo carrega o estado dessa conta no **navegador atual**.
6. Ao sair, a interface é recarregada; o login precisará ser realizado novamente.

**Atenção:** não existe sessão de backend. O login é necessário para acessar a interface, mas os registros armazenados no `localStorage` não são criptografados nem sincronizados com a conta Google. Outros perfis de navegador/dispositivos não compartilham esses dados automaticamente.

### 4.2 Execução do treino

1. Selecionar o dia/ficha (A–E).
2. Consultar exercícios, séries, repetições e cargas anteriores.
3. Ajustar a carga atual manualmente; `+` e `−` funcionam para carga numérica única.
4. Iniciar a sessão para habilitar marcação de exercícios e cronômetro.
5. Marcar exercícios concluídos; o progresso é atualizado e o descanso pode iniciar.
6. Finalizar, conferir o resumo e salvar no histórico.
7. Opcionalmente enviar a sessão para o Google Agenda.

A sessão ativa guarda o horário inicial, permitindo recomputar a duração por diferença entre timestamps. O resumo pendente é recuperável conforme o estado local salvo.

### 4.3 Descanso e Wake Lock

O timer de descanso oferece atalhos de **30, 60 e 90 segundos** e pode ser iniciado ao concluir um exercício. O cronômetro geral é independente.

Durante uma sessão ativa, `core/timer.js` solicita `navigator.wakeLock.request('screen')`, quando suportado. O navegador pode negar ou liberar a solicitação por bateria, visibilidade ou política do dispositivo. Ao encerrar a sessão, o lock é liberado. **Não existe garantia de tela sempre ligada em todos os aparelhos.**

### 4.4 Histórico e integração com Agenda

O histórico guarda dados da sessão (identificador, dia, início/fim, exercícios concluídos e cargas) e apresenta ações para envio à Agenda.

A integração possui **autorização OAuth própria**, distinta do login. O usuário deve escolher a mesma conta Google usada no Ritmo. Os tokens ficam em memória e expiram; após expiração é preciso reconectar. O envio automático depende de autorização válida e da opção habilitada. A opção manual abre a interface do Google Agenda para criação de evento, sem exigir escrita via API.

**Configuração externa obrigatória:** o projeto OAuth no Google Cloud precisa ter a origem JavaScript correta, API Calendar habilitada, escopos autorizados e política de consentimento compatível com o público. Para permitir acesso de qualquer usuário, a publicação/verificação do app no Google Cloud pode ser necessária; alterações apenas no frontend não removem a restrição de aplicativo em modo de teste.

## 5. Modelo de dados e persistência

A persistência principal usa a chave:

```text
ritmo-account-v1:<google-user-sub>
```

Representação **ilustrativa** do estado (campos reais podem evoluir):

```json
{
  "selected": 0,
  "weights": [["30", "0"], [], [], [], []],
  "done": [true, false],
  "session": {"start": 1790000000000},
  "history": [],
  "customPlans": [],
  "pending": null
}
```

- `selected`: índice do treino selecionado (0–4).
- `weights`: matriz de cargas por dia/exercício; cargas podem ser strings com progressões como `90 / 110 / 130`.
- `done`: indicadores de conclusão da sessão atual.
- `session`: sessão ativa ou `null`.
- `history`: sessões salvas, com identificador, horários, cargas, exercícios e status de sincronização.
- `customPlans`: fichas personalizadas.
- `pending`: resumo aguardando confirmação, quando aplicável.

### Exportação, importação e riscos

O backup JSON contém o estado local e metadados de formato/versão; a importação aceita arquivos compatíveis e **substitui os dados da conta atual após confirmação**. A importação limita o tamanho do arquivo e valida a estrutura. A exportação CSV destina-se à consulta/análise, **não** à restauração integral do estado.

Faça backup antes de limpar dados do navegador, trocar de dispositivo ou executar migrações. Não há recuperação em servidor. Evite inserir tokens, segredos ou informações privadas no repositório.

## 6. PWA e comportamento offline

`public/manifest.json` define nome, escopo, ícones e modo `standalone`. `public/sw.js` armazena os recursos essenciais no Cache Storage e atende solicitações do próprio domínio a partir do cache quando a rede falha.

**O que funciona offline:** arquivos estáticos previamente armazenados em cache e dados locais existentes, sujeitos ao estado de autenticação e às políticas do navegador.

**O que exige internet:** primeiro login/relogin Google, consentimento OAuth, obtenção de perfil, sincronização de eventos e recursos externos do Google.

Ao modificar a lista de arquivos cacheados, atualize a versão `CACHE` do Service Worker e valide instalação, atualização e modo offline. A origem HTTPS do GitHub Pages atende aos requisitos de contexto seguro do PWA/Wake Lock.

## 7. Execução local

Requer um navegador moderno e um servidor HTTP estático (não abra o HTML por `file://`, pois ES Modules e Service Worker possuem restrições de origem).

```bash
git clone https://github.com/ThaisdosSantos/ritmo-treinos.git
cd ritmo-treinos
mkdir -p dist
cp -R src/. dist/
cp -R public/. dist/
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. O servidor Python é usado apenas para desenvolvimento local, não em produção.

O OAuth exige que a origem usada em testes esteja cadastrada como **origem JavaScript autorizada** no Google Cloud (por exemplo, `http://localhost:8000`). Não adicione segredos OAuth ao frontend; o client ID público não é um segredo.

## 8. Deploy e configuração

O workflow `.github/workflows/deploy.yml` é acionado por push em `main` ou manualmente:

1. Faz checkout do repositório.
2. Copia `src/.` e `public/.` para `dist/`.
3. Publica o artefato no GitHub Pages usando as actions oficiais.

No repositório, configure **Settings → Pages → Build and deployment → Source: GitHub Actions**. A publicação mantém a URL:

**https://thaisdossantos.github.io/ritmo-treinos/**

O workflow pressupõe que a raiz pública seja o conteúdo combinado de `src/` e `public/`. Os caminhos relativos do manifest, CSS, módulos e Service Worker devem ser mantidos compatíveis com essa composição.

## 9. Segurança, privacidade e limitações

- **Tokens OAuth:** tratados em memória no cliente; não persistir access tokens em `localStorage`, logs ou commits.
- **Dados de treino:** permanecem no navegador e não possuem criptografia adicional pela aplicação.
- **Identidade:** validar a conta do Google Agenda contra a conta ativa do Ritmo.
- **Permissões:** solicitar apenas escopos necessários; revogar autorização quando aplicável.
- **Entrada do usuário:** preservar escape/validação de textos antes de inserção no DOM; backups importados não devem executar HTML ou scripts.
- **Disponibilidade:** o app pode abrir parcialmente offline, mas login/Agenda dependem da rede.
- **Recuperação:** backups JSON são essenciais, pois limpeza do navegador remove o histórico local.
- **Escalabilidade:** sem API e banco de dados, não há sincronização multi-dispositivo, gestão centralizada ou recuperação remota.
- **Verificação OAuth:** a configuração de consentimento/publicação do Google é responsabilidade do projeto no Google Cloud.

## 10. Qualidade e testes recomendados

Não há suíte automatizada de testes unitários ou E2E integrada neste repositório. Antes de publicar, valide manualmente:

- Login e logout, incluindo falha de pop-up/rede e troca de conta.
- Separação de dados por `sub` no mesmo navegador.
- Edição de ficha, inclusão/remoção, cargas simples e progressivas.
- Início, conclusão, resumo, histórico e recuperação de sessão pendente.
- Descanso 30/60/90 s, mudança de aba e Wake Lock em Android/iOS.
- Backup JSON → importação → comparação de dados; exportação CSV.
- OAuth Calendar (consentimento, conta divergente, token expirado, envio manual/automático).
- Instalação PWA, atualização do Service Worker e recursos estáticos offline.
- Responsividade em larguras pequenas, foco visível, teclado e leitores de tela.

### Convenções de manutenção

1. Preferir mudanças pequenas e revisáveis, com Pull Requests.
2. Preservar a chave de armazenamento e oferecer migração explícita se o esquema mudar.
3. Documentar novos campos de estado e efeitos colaterais de OAuth.
4. Manter funções de UI separadas de regras de negócio ao extrair gradualmente o `workout.js`.
5. Evitar dependências externas desnecessárias e nunca versionar credenciais.
6. Atualizar documentação e cache PWA junto de mudanças estruturais.

## 11. Roadmap técnico sugerido (não implementado)

- Extrair persistência e validação para `storage.service.js`.
- Separar domínio de treinos, renderização de views e timers.
- Criar testes unitários e E2E (especialmente backup, cronômetros e OAuth).
- Adicionar validação de schema versionado para backups.
- Implementar sincronização entre dispositivos **somente** após definir backend, autorização e política de privacidade.
- Melhorar observabilidade e tratamento de erros sem registrar dados sensíveis.

---

**Manutenção:** mudanças de comportamento devem ser acompanhadas de atualização deste documento e do [README](../README.md). Para notas sobre a migração de pastas, consulte [ARCHITECTURE.md](ARCHITECTURE.md).
