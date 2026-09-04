# Wii Web - Mini Games 🏓🎾🏍️

Bem-vindo ao **Wii Web Hub**, um experimento de jogos de navegador que traz a experiência mágica do Nintendo Wii e do Xbox Kinect direto para o seu computador, usando apenas a sua webcam! 

Nenhum controle extra é necessário. **O seu dedo é o mouse e a sua mão é a raquete!**

---

## 🔒 Privacidade e Segurança (Não estamos te espionando!)
Entendemos que dar permissão de câmera para o navegador pode ser desconfortável. Por isso, queremos deixar nossa arquitetura totalmente transparente:

- **100% Local (Client-Side):** Absolutamente nenhuma imagem, vídeo ou dado pessoal sai do seu computador.
- **Sem Servidores de Nuvem:** Toda a Inteligência Artificial e a leitura dos movimentos rodam localmente dentro da memória do seu próprio navegador (via WebAssembly). 
- Ninguém está te observando. O uso da câmera é temporário e estritamente restrito à aba do jogo para calcular a posição geométrica da sua mão. Se não se sentir confortável, o projeto no futuro suportará o uso do seu Smartphone como controle!

---

## 🌟 Como Funciona a Magia?

O projeto utiliza a biblioteca **MediaPipe** (do Google) para realizar Inteligência Artificial de visão computacional diretamente no seu navegador.

1. **Captura:** O jogo acessa a sua webcam de forma segura.
2. **Rastreamento:** O modelo de "Hand Tracking" detecta os pontos articulares da sua mão a 60 quadros por segundo.
3. **Cursor Mágico:** O ponto do seu dedo indicador controla um cursor flutuante. Fixe o dedo sobre um botão por 1.5s para clicar nele ("Dwell Click").
4. **Jogos:** 
   - **Tênis 3D:** Mova a mão para encontrar a bolinha no ar em profundidade, usando as regras reais do esporte (15, 30, 40).
   - **Moto Racer:** Desloque a mão para os lados para desviar dos obstáculos em uma estrada.
   - **Hóquei:** Defenda seu lado movendo a mão para cima e para baixo.

## 🚀 Como Rodar na sua Máquina

Como os navegadores bloqueiam o acesso à webcam em arquivos locais (`file:///`), você precisa rodar o jogo através de um servidor local simples. 

1. Clone o repositório:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-videogame.git
   cd wii-webcam-videogame
   ```
2. Inicie o servidor local (Usando Node.js):
   ```bash
   npx http-server -p 8000
   ```
3. Abra o navegador e acesse: `http://localhost:8000`
4. Permita o uso da câmera e divirta-se!

## 🎮 O Futuro do Projeto (Próximos Passos)
Este projeto está em constante evolução. Nossas próximas grandes atualizações incluem:
- 📱 **O Smartphone como Controle:** Integração via Python e WebSockets para usar o acelerômetro do seu celular como um verdadeiro "Wii Remote".
- 👥 **Multiplayer Local (Tela Dividida):** Suporte para dois jogadores jogarem no mesmo computador, dividindo a tela.
- ⛳ **Golfe:** Novo jogo para praticar o swing de golfe.

---
Feito com 💙, JavaScript puro e IA de ponta. Divirta-se!
