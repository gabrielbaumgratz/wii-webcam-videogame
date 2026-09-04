# Wii Web Videogame

Uma coletânea de mini-jogos para navegador controlada inteiramente pelo movimento do seu corpo, utilizando a sua webcam.

Nenhum hardware extra é necessário. O seu dedo atua como o mouse para a navegação e a sua mão atua como o controle durante as partidas.

---

## Como Funciona

- **Captura e Rastreamento:** O jogo acessa a sua webcam e detecta a geometria da sua mão instantaneamente.
- **Navegação (Dwell Click):** A ponta do seu dedo indicador controla o cursor do menu. Ao manter o dedo parado sobre um botão por 1.5s, o clique é acionado automaticamente, eliminando o uso do mouse convencional.
- **Jogos Disponíveis:**
  - **Tênis 3D:** Mova a mão no eixo vertical e horizontal para alinhar a raquete em profundidade. O jogo utiliza o sistema de pontuação oficial do esporte real (15, 30, 40, Iguais e Vantagem).
  - **Moto Racer:** Desloque a mão lateralmente para guiar a motocicleta e desviar dos obstáculos na pista.
  - **Hóquei:** Defenda seu lado do campo movendo a mão na vertical para rebater o disco.

## Como Rodar na sua Máquina

Os navegadores modernos bloqueiam o acesso à câmera ao abrir arquivos HTML diretamente do disco. Portanto, é necessário iniciar um servidor local.

1. Clone o repositório:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-videogame.git
   cd wii-webcam-videogame
   ```
2. Inicie o servidor local (Exemplo utilizando Node.js):
   ```bash
   npx http-server -p 8000
   ```
3. Acesse `http://localhost:8000` em seu navegador.
4. Conceda a permissão de uso da câmera.

---

## Tecnologias Utilizadas

O projeto foi desenvolvido para rodar de forma leve e responsiva direto no navegador (client-side).

- **Frontend:** HTML5, CSS3 e JavaScript puro (Vanilla JS). Renderização gráfica feita via Canvas API.
- **Inteligência Artificial:** O rastreamento de movimento utiliza a biblioteca de visão computacional **MediaPipe** (do Google). 
- **Performance:** A inteligência artificial é executada sobre **WebAssembly (WASM)**. Isso permite que o navegador processe o feed da câmera usando código otimizado de baixo nível em tempo real (cerca de 60 quadros por segundo), sem a necessidade de enviar dados para servidores externos.

---

## Privacidade e Segurança

Toda a arquitetura do projeto é baseada em processamento local. Nenhuma imagem, vídeo ou dado pessoal é transmitido pela internet, salvo na nuvem ou acessado por terceiros. A leitura da câmera ocorre estritamente na memória do seu navegador apenas para extrair as coordenadas geométricas da mão.

---

## Próximos Passos (Roadmap)

- **Integração Mobile:** Utilização do giroscópio e acelerômetro do smartphone como controle alternativo à câmera, utilizando um servidor Python com WebSockets.
- **Multiplayer Local (Split-Screen):** Suporte para dois jogadores competirem no mesmo ambiente, dividindo a tela do computador.
- **Novo Jogo (Golfe):** Desenvolvimento de uma mecânica de *swing* baseada na aceleração do braço.
