# Arquitetura do Ritmo

Aplicação estática sem build de framework. `src/` contém HTML, CSS e JavaScript modular por arquivos; `public/` contém recursos PWA. O GitHub Actions copia ambos para `dist/` e publica no GitHub Pages.

## Migração segura

A lógica original foi preservada em `src/js/core/workout.js` para evitar perda de dados. `auth.service.js` e `calendar.service.js` continuam executando a autenticação Google e a integração Agenda; a persistência continua usando `ritmo-account-v1:<sub>` no localStorage. Os módulos auxiliares criados são pontos de extensão para refatorações posteriores, não substituições funcionais.

## Atenção

O login e a sincronização Google requerem internet. O service worker só faz cache dos recursos estáticos. Ative **GitHub Actions** em Settings > Pages > Build and deployment > Source. A publicação permanece no endereço do repositório.
