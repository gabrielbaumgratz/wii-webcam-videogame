const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '')));

let hostSocket = null;

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'host_connect') {
                hostSocket = ws;
                console.log('🎮 Tela Principal do PC Conectada!');
            } else if (data.type === 'controller_data') {
                if (hostSocket && hostSocket.readyState === WebSocket.OPEN) {
                    hostSocket.send(JSON.stringify(data));
                }
            }
        } catch (e) {
            console.error('Mensagem inválida', e);
        }
    });

    ws.on('close', () => {
        if (ws === hostSocket) {
            hostSocket = null;
            console.log('❌ PC Desconectado.');
        }
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`✅ Servidor Local rodando em: http://localhost:${PORT}`);
    console.log(`📱 Para conectar o celular, rode em outro terminal: npm run tunnel`);
});
