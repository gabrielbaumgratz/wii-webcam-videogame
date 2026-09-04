<div align="center">
  <a href="https://github.com/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/Website-051A42?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
  <a href="https://linkedin.com/in/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://instagram.com/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</div>
<br>
<div align="center">
  <strong>🇧🇷 Português</strong> | 
  <a href="README_EN.md">🇺🇸 English</a> | 
  <a href="README_ES.md">🇪🇸 Español</a> | 
  <a href="README_DE.md">🇩🇪 Deutsch</a>
</div>
<br>

# Wii Web Videogame

Uma coletânea de mini-jogos para navegador controlada inteiramente pelo movimento do seu corpo, utilizando a sua webcam.

Nenhum hardware extra é necessário. O seu dedo atua como o mouse para a navegação e a sua mão atua como o controle durante as partidas.

---

## Como Funciona

- **Captura e Rastreamento:** O jogo acessa a sua webcam e detecta a geometria da sua mão instantaneamente.
- **Navegação (Dwell Click):** A ponta do seu dedo indicador controla o cursor do menu. Ao manter o dedo parado sobre um botão por 1.5s, o clique é acionado automaticamente.
- **Jogos Disponíveis:**
  - **Tênis 3D:** Mova a mão no eixo vertical e horizontal para alinhar a raquete em profundidade. O jogo utiliza o sistema de pontuação oficial do esporte real (15, 30, 40, Iguais e Vantagem).
  - **Moto Racer:** Desloque a mão lateralmente para guiar a motocicleta e desviar dos obstáculos na pista.
  - **Hóquei:** Defenda seu lado do campo movendo a mão na vertical para rebater o disco (Modo Solo ou Tela Dividida local).

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

O projeto foi desenvolvido para rodar de forma leve e responsiva direto no navegador (client-side), com interface baseada na estética *Y2K Futurism* e *Liquid Glass*.

- **Frontend:** HTML5, CSS3 e JavaScript puro (Vanilla JS).
- **Inteligência Artificial:** O rastreamento de movimento utiliza a biblioteca de visão computacional **MediaPipe** (do Google). 
- **Performance:** A inteligência artificial é executada sobre **WebAssembly (WASM)**, processando o feed da câmera usando código otimizado em tempo real.

---

## Privacidade e Segurança

Toda a arquitetura do projeto é baseada em processamento local. Nenhuma imagem, vídeo ou dado pessoal é transmitido pela internet. A leitura da câmera ocorre estritamente na memória do seu navegador apenas para extrair as coordenadas geométricas da mão.

---

## Próximos Passos (Roadmap)

- **Integração Mobile:** Utilização do giroscópio do smartphone como controle alternativo à câmera, utilizando um servidor Python com WebSockets.
- **Novo Jogo (Golfe):** Desenvolvimento de uma mecânica de *swing* baseada na aceleração do braço.
