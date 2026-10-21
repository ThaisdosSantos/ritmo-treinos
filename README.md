# Ritmo — Meus Treinos

Aplicativo web responsivo para acompanhamento de treinos, cargas, descanso e histórico.

## Estrutura

- `src/index.html` — interface principal
- `src/assets/styles/` — estilos por responsabilidade
- `src/js/app.js` — entrada dos módulos JavaScript
- `src/js/core/` — treino, timer e Wake Lock
- `src/js/services/` — autenticação, armazenamento e Agenda
- `src/js/ui/` — extensões para componentes e telas
- `public/` — manifest, ícones e service worker
- `.github/workflows/deploy.yml` — deploy automático GitHub Pages

## Publicação

Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**. Cada push em `main` publica `src/` e `public/` na raiz do site.

Consulte [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
