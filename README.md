<div align="center">

# 🏋️ Ritmo — Meus Treinos

**Seu treino, seu ritmo.**  
Aplicação web responsiva para organizar fichas, acompanhar cargas e registrar sua evolução na academia.

### 🌐 [**ACESSAR O RITMO — ABRIR APLICATIVO**](https://thaisdossantos.github.io/ritmo-treinos/)

[![Acessar aplicativo](https://img.shields.io/badge/Acessar%20o%20Ritmo-Abrir%20site-206744?style=for-the-badge)](https://thaisdossantos.github.io/ritmo-treinos/)

[Documentação completa](docs/PROJECT.md) · [Arquitetura](docs/ARCHITECTURE.md) · [Código-fonte](src/)

</div>

## Sobre o projeto

O **Ritmo** é um aplicativo de acompanhamento de treinos de musculação, pensado para uso no celular durante a academia. O usuário entra com sua conta Google, seleciona a ficha do dia, registra cargas, acompanha o cronômetro e salva sessões no histórico.

O projeto utiliza **HTML, CSS e JavaScript nativo**, sem backend próprio, e é publicado pelo **GitHub Pages**.

## Funcionalidades

- **Login com Google** e opção de sair.
- **Fichas de treino por dia**, com exercícios, séries, repetições e observações.
- **Personalização da ficha:** adicionar, editar ou remover exercícios.
- **Registro de cargas**, consulta da última carga e ajustes rápidos `+` / `−` para valores numéricos simples.
- **Sessão ativa:** cronômetro, exercícios concluídos e barra de progresso.
- **Timer de descanso:** 30, 60 ou 90 segundos.
- **Histórico de sessões:** duração, conclusão e cargas.
- **Google Agenda:** conexão OAuth, envio manual e envio automático opcional com autorização válida.
- **Backup JSON**, importação de backup e exportação CSV.
- **PWA:** instalação na tela inicial, cache de recursos estáticos e Wake Lock quando suportado.
- **Layout responsivo**, adequado a desktop e smartphone.

> **Privacidade e dados:** o histórico é armazenado no `localStorage` do navegador, separado por identificador da conta Google. **Não há sincronização de treinos entre dispositivos**; exporte backups para preservar seus registros. Login e integração Google Agenda exigem conexão com a internet.

## Tecnologias

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=github&logoColor=white)

**Integrações:** Google Identity Services, Google Calendar API, Service Worker, Cache Storage e Screen Wake Lock API.

## Estrutura

```text
.github/workflows/  # Deploy GitHub Pages
docs/               # Documentação técnica e de arquitetura
public/             # Manifest, ícones e Service Worker
src/
  index.html        # Interface principal
  assets/styles/    # Estilos base e componentes
  js/
    app.js          # Ponto de entrada
    core/           # Treinos e Wake Lock
    services/       # Autenticação, Google Agenda e extensões
    ui/             # Pontos de extensão de interface
    utils/          # Utilitários
```

> A modularização está em evolução: `src/js/core/workout.js` ainda concentra parte da interface e persistência; alguns arquivos são extensões preparadas para futuras extrações.

## Executar localmente

```bash
git clone https://github.com/ThaisdosSantos/ritmo-treinos.git
cd ritmo-treinos
mkdir -p dist
cp -R src/. dist/
cp -R public/. dist/
python3 -m http.server 8000 --directory dist
```

Acesse **http://localhost:8000**. Para testar OAuth localmente, autorize essa origem no projeto Google Cloud.

## Publicação

O workflow [deploy.yml](.github/workflows/deploy.yml) publica os arquivos de `src/` e `public/` no GitHub Pages quando há push em `main`. Em **Settings → Pages**, configure **Source: GitHub Actions**.

**Aplicativo:** **https://thaisdossantos.github.io/ritmo-treinos/**

## Documentação para desenvolvedores

📘 **[Documentação completa — funcionalidades, arquitetura, fluxos, dados, segurança, testes e deploy](docs/PROJECT.md)**

📐 [Notas de arquitetura e migração](docs/ARCHITECTURE.md)

## Licença

Distribuído sob a [Licença MIT](LICENSE).
