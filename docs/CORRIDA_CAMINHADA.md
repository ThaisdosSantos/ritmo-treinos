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

## Controles durante a atividade (2026-10)
- Iniciar atividade, pausar/retomar manualmente e concluir com confirmação para evitar toque acidental.
- Pausa automática opcional: com leituras GPS sucessivas indicando velocidade inferior a aproximadamente 0,8 km/h por pelo menos 3 segundos. Depende da frequência e qualidade do GPS; não é garantida quando o navegador suspende as leituras.
- Tempo e pace consideram o tempo ativo, descontando pausas. A distância não é acumulada enquanto pausado.
- Mapa inicialmente bloqueado para evitar capturar gestos de rolagem. Botões permitem desbloquear e recentralizar no último ponto GPS.
- Alertas visíveis de GPS negado, impreciso ou sem atualização por mais de 20 segundos.
- Sinalização de quilômetros com vibração (quando suportada) e dois bipes opcionais; som pode exigir interação prévia e pode ser silenciado pelo sistema.
- A cadência continua manual, pois navegadores não oferecem contagem confiável de passos.

## Recursos avançados
- Pausar e concluir exigem pressionar por 2,5 segundos; concluir ainda solicita confirmação. Teclado: segurar Enter ou Espaço.
- Badge de qualidade GPS por precisão reportada: até 20 m (forte), até 45 m (moderada), acima disso/sem leitura (sem sinal confiável). Indicadores são aproximações, não garantia de qualidade da rota.
- Acompanhamento automático do mapa, botão 🎯 para reativar e marcadores A/B para início e fim (também no histórico).
- Perfil SVG de altitude e pace estimados; a altimetria depende de coordenadas com elevação e não estará disponível para todas as rotas.
- Recordes pessoais: maior distância, melhor split de 1 km registrado e melhor 5 km estimado pelo pace médio da atividade. A estimativa de 5 km não representa um recorde oficial de segmento.
- Tênis padrão é selecionado automaticamente em novas atividades e sincronizado com o MongoDB, com alerta quando a quilometragem ultrapassa o limite configurado.
- Avisos de split sonoros/vibratórios continuam sujeitos às permissões do navegador e limitações de iOS.
