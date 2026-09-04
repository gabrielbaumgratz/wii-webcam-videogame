# Wii Web - Motion Controlled Ping Pong 🏓📷

Bem-vindo ao **Wii Web Ping Pong**, um experimento de jogo de navegador que traz a experiência mágica do Nintendo Wii e do Xbox Kinect direto para o seu computador, usando apenas a sua webcam!

Nenhum controle extra é necessário. Sua mão é a raquete!

## 🌟 Como Funciona a Magia?

O projeto utiliza a biblioteca **MediaPipe** (do Google) para realizar Inteligência Artificial de visão computacional diretamente no seu navegador, sem precisar enviar imagens para a nuvem.

1. **Captura:** O jogo acessa a sua webcam.
2. **Rastreamento:** O modelo de IA de "Hand Tracking" detecta os pontos articulares da sua mão em tempo real (focando na palma/dedo médio).
3. **Tradução de Movimento:** A posição vertical (Y) da sua mão no mundo real é mapeada diretamente para a posição da raquete azul na tela do jogo.
4. **Física:** O JavaScript (com HTML5 Canvas) cuida da física da bolinha, da raquete do computador (IA adversária) e do sistema de pontuação!

Tudo isso rodando de forma leve, fluida e a incríveis 60 frames por segundo no cliente.

## 🚀 Como Rodar e Jogar na sua Máquina

Como os navegadores modernos bloqueiam o acesso à webcam por motivos de segurança em arquivos locais (`file:///`), você precisa rodar o jogo através de um servidor web local. É muito fácil:

### Pré-requisitos
- Ter o [Node.js](https://nodejs.org/) ou o [Python](https://www.python.org/) instalados no seu computador.
- Uma webcam funcional.

### Passos:
1. Clone este repositório:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-pingpong.git
   cd wii-webcam-pingpong
   ```
2. Inicie o servidor local:
   - **Usando Node.js:** 
     ```bash
     npx http-server -p 8000
     ```
   - **Ou usando Python:**
     ```bash
     python -m http.server 8000
     ```
3. Abra o seu navegador e acesse: [http://localhost:8000](http://localhost:8000)
4. **IMPORTANTE:** Permita o uso da câmera quando o navegador solicitar!
5. Aguarde alguns segundos para a IA carregar. Fique na frente da câmera, levante a mão e jogue!

## 🎮 O Futuro do Projeto (Próximos Passos)
O projeto está em constante evolução! Em breve adicionaremos:
- Menu interativo com Níveis de Dificuldade.
- HUD (janela no canto) estilo Kinect mostrando o rastreamento da sua mão.
- **Novos Jogos:** Tênis (Perspectiva 3D/Terceira Pessoa), Golfe e um Jogo de Corrida de Moto.

---
Feito com 💙, JavaScript puro e IA de ponta. Divirta-se!
