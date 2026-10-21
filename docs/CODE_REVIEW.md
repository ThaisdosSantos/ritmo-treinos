# Revisão de código e padrões de manutenção

## Escopo da revisão

Revisão estática dos módulos JavaScript do Ritmo, com JSDoc nas fronteiras relevantes, padronização de utilitários e documentação das responsabilidades existentes. **Não foi executada uma suíte de testes automatizados nem testes E2E em dispositivos reais.** A refatoração foi deliberadamente incremental para reduzir o risco de regressões em login, histórico e OAuth.

## Convenções adotadas

- **JSDoc** em módulos, funções com efeitos colaterais e contratos de entrada/saída relevantes.
- Tipos por `@typedef`, `@param`, `@returns` e `@throws` onde acrescentam informação.
- Funções pequenas em arquivos utilitários; sem comentários repetindo a sintaxe.
- Identificadores e caminhos de persistência preservados por compatibilidade.
- Não persistir access tokens Google em armazenamento local.
- Priorizar escape de dados externos ao renderizar HTML e validação ao importar backups.

## Diagnóstico técnico

| Prioridade | Ponto | Observação / recomendação |
| --- | --- | --- |
| Alta | `core/workout.js` | Arquivo monolítico concentra DOM, regras, estado, persistência e histórico. Extrair por etapas com testes de regressão. |
| Alta | Autenticação | O token de login tem expiração temporizada e a aplicação recarrega no logout. Testar comportamento em abas suspensas e dispositivos móveis. |
| Alta | Dados locais | O histórico fica no navegador, sem backup remoto. Reforçar exportação e validação de importação antes de qualquer mudança de schema. |
| Alta | OAuth Google Agenda | Permissões e publicação do consentimento Google Cloud são dependências externas; token pode expirar e impedir envio automático. |
| Média | Fichas personalizadas | Usar IDs estáveis de exercício no futuro para preservar histórico/cargas ao renomear ou reordenar. |
| Média | Testes | Inexistência de testes unitários/E2E integrados. Cobrir importação, evolução de carga, timers e Calendar API com mocks. |
| Média | Acessibilidade | Validar navegação por teclado, contraste e feedback de estados em leitores de tela. |
| Média | Service Worker | Cache versionado manualmente; manter lista de recursos sincronizada com deploy e testar atualização offline. |
| Baixa | CSS | `main.css` e estilos de componentes podem ser consolidados gradualmente em tokens e responsabilidades claras. |

## Estratégia de refatoração recomendada

1. Introduzir testes de caracterização para funções de domínio, estado e backups **antes** de extrair `workout.js`.
2. Mover persistência e validação de backups para `storage.service.js`, mantendo `ritmo-account-v1:<sub>`.
3. Extrair modelo de ficha e histórico para funções puras, evitando dependências do DOM.
4. Separar view/renderização, eventos de interface e controle de descanso.
5. Centralizar mensagens de erro, timeouts, tratamento de OAuth e chamadas HTTP.
6. Automatizar verificações de lint, testes e validação do build estático no GitHub Actions.

## Checklist para Pull Requests

- [ ] Mudança mantém os dados locais existentes?
- [ ] O usuário pode importar/exportar seus dados?
- [ ] Fluxos de login e Agenda continuam funcionando?
- [ ] O PWA atualiza o cache dos arquivos alterados?
- [ ] O comportamento funciona em mobile e com teclado?
- [ ] O README e a documentação técnica refletem a implementação?
- [ ] Houve verificação de sintaxe, testes ou justificativa para sua ausência?

**Nota:** os arquivos auxiliares criados na reorganização continuam sendo pontos de extensão. Não se deve afirmar que a extração de domínio e UI está concluída.
