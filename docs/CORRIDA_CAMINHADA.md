# Corrida e Caminhada — Ritmo

## Funcionalidades
- Aba Corrida com seletor Corrida/Caminhada, cronômetro, GPS via `watchPosition`, distância por Haversine, pace médio e pace atual estimado em janela de 30 s.
- Splits completos por quilômetro; elevação positiva estimada usando altitudes fornecidas pelo GPS; cadência inserida manualmente (navegadores não oferecem contagem confiável de passos).
- Mapa Leaflet/OpenStreetMap e miniaturas de rotas no histórico.
- Importação GPX com pontos `trkpt` e timestamps, exportação GPX por atividade.
- Tênis com limite de quilometragem e desgaste calculado pelo histórico.
- Comparação **aproximada** de percursos com início a até 200 m e distância similar; não são segmentos Strava.
- Histórico e tênis separados por conta Google e sincronizados no MongoDB Atlas.

## Limitações importantes
- Sincronização MongoDB: após atualizar o backend Render, corridas, rotas e tênis são sincronizados com a conta Google. Sem conexão, os dados permanecem locais até uma próxima tentativa. Exporte GPX regularmente.
- Rotas GPS contêm localização pessoal sensível. Evite compartilhar GPX publicamente.
- GPS do navegador pode ser suspenso com tela bloqueada, PWA em segundo plano ou economia de bateria, especialmente no iPhone. Não promete rastreamento contínuo com a tela apagada.
- Pace atual é estimado por posições recentes; leituras ruins podem causar flutuações.
- Cadência não é detectada automaticamente, e a elevação depende da disponibilidade/precisão de altitude GPS.
- GPX importado exige pontos com latitude, longitude e tempo. Arquivos TCX não são suportados nesta versão.
- Leaflet e tiles do OpenStreetMap precisam de internet e estão sujeitos à política de uso do provedor.
- A comparação de rotas é aproximada, não um algoritmo de correspondência de trajetos.
