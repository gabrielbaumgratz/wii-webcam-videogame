// ==========================================
// INTEGRAÇÃO SMARTPHONE (WEBSOCKET)
// ==========================================
let ws = null;
window.phoneConnected = false;

function connectSmartphone() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(wsProtocol + '//' + window.location.host);
    
    ws.onopen = () => {
        console.log("Conectado ao Servidor WebSocket!");
        ws.send(JSON.stringify({ type: 'host_connect' }));
    };
    
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'controller_data') {
                window.phoneConnected = true;
                
                if (data.inputType === 'gyro') {
                    // Mapeamento do Giroscópio para (window.hand1X, window.hand1Y)
                    // Gamma (Inclinação Direita/Esquerda): -90 a 90
                    // Beta (Inclinação Frente/Trás): -180 a 180
                    
                    let mappedX = (data.gamma + 45) / 90; // Centro = 0.5
                    let mappedY = (data.beta + 45) / 90;  
                    
                    window.hand1X = Math.max(0, Math.min(1, mappedX));
                    window.hand1Y = Math.max(0, Math.min(1, mappedY));
                } else if (data.inputType === 'button') {
                    // Processar botões A e B como clique de Pinça
                    if (data.key === 'a' || data.key === 'b') {
                        window.isPinching1 = data.pressed;
                    }
                }
            }
        } catch (e) { console.error(e); }
    };
}

// Iniciar conexão WebSocket se estiver no servidor
if (window.location.hostname !== "") {
    connectSmartphone();
}

// ==========================================
// LOCALIZATION (i18n)
// ==========================================
const translations = {
    pt: {
        subtitle: "JOGUE USANDO APENAS A CÂMERA",
        enter_system: "JOGAR",
        global_settings: "CONFIGURAÇÕES",
        sys_config_title: "Configurações",
        cam_sens_title: "Sensibilidade da Câmera",
        cam_sens_desc: "Ajusta a velocidade do cursor e da sua mão no jogo.",
        sens_low: "Baixa", sens_balanced: "Normal", sens_high: "Alta",
        btn_back: "VOLTAR",
        select_module: "Selecionar Jogo",
        hockey_desc: "Hóquei de Mesa 3D",
        tennis_title: "TÊNIS DE QUADRA",
        coming_soon: "Em Breve",
        players_title: "Jogadores",
        mode_1p: "1 Jogador (Vs Máquina)",
        mode_2p: "2 Jogadores (Tela Dividida)",
        diff_title: "Dificuldade",
        diff_easy: "Fácil (10pts)", diff_med: "Médio (20pts)", diff_hard: "Difícil (30pts)", diff_ext: "EXTREMO (40pts)",
        btn_launch: "INICIAR JOGO",
        btn_abort: "SAIR DO JOGO",
        game_offline: "JOGO INDISPONÍVEL NO MOMENTO",
        goal: "GOL!"
    },
    en: {
        subtitle: "PLAY USING ONLY YOUR CAMERA",
        enter_system: "PLAY",
        global_settings: "SETTINGS",
        sys_config_title: "Settings",
        cam_sens_title: "Camera Sensitivity",
        cam_sens_desc: "Adjusts cursor and hand speed in-game.",
        sens_low: "Low", sens_balanced: "Normal", sens_high: "High",
        btn_back: "BACK",
        select_module: "Select Game",
        hockey_desc: "3D Air Hockey",
        tennis_title: "COURT TENNIS",
        coming_soon: "Coming Soon",
        players_title: "Players",
        mode_1p: "1 Player (Vs CPU)",
        mode_2p: "2 Players (Split-Screen)",
        diff_title: "Difficulty",
        diff_easy: "Easy (10pts)", diff_med: "Medium (20pts)", diff_hard: "Hard (30pts)", diff_ext: "EXTREME (40pts)",
        btn_launch: "START GAME",
        btn_abort: "QUIT GAME",
        game_offline: "GAME CURRENTLY UNAVAILABLE",
        goal: "GOAL!"
    },
    es: {
        subtitle: "JUEGA USANDO SOLO TU CÁMARA",
        enter_system: "JUGAR",
        global_settings: "AJUSTES",
        sys_config_title: "Ajustes",
        cam_sens_title: "Sensibilidad de Cámara",
        cam_sens_desc: "Ajusta la velocidad de tu mano en el juego.",
        sens_low: "Baja", sens_balanced: "Normal", sens_high: "Alta",
        btn_back: "VOLVER",
        select_module: "Seleccionar Juego",
        hockey_desc: "Hockey de Mesa 3D",
        tennis_title: "TENIS DE CANCHA",
        coming_soon: "Próximamente",
        players_title: "Jugadores",
        mode_1p: "1 Jugador (Vs CPU)",
        mode_2p: "2 Jugadores (Pantalla Dividida)",
        diff_title: "Dificultad",
        diff_easy: "Fácil (10pts)", diff_med: "Medio (20pts)", diff_hard: "Difícil (30pts)", diff_ext: "EXTREMO (40pts)",
        btn_launch: "INICIAR JUEGO",
        btn_abort: "SALIR DEL JUEGO",
        game_offline: "JUEGO NO DISPONIBLE",
        goal: "¡GOL!"
    },
    de: {
        subtitle: "SPIELEN SIE NUR MIT IHRER KAMERA",
        enter_system: "SPIELEN",
        global_settings: "EINSTELLUNGEN",
        sys_config_title: "Einstellungen",
        cam_sens_title: "Kamera-Empfindlichkeit",
        cam_sens_desc: "Passt die Geschwindigkeit deiner Hand im Spiel an.",
        sens_low: "Niedrig", sens_balanced: "Normal", sens_high: "Hoch",
        btn_back: "ZURÜCK",
        select_module: "Spiel Auswählen",
        hockey_desc: "3D Air Hockey",
        tennis_title: "PLATZTENNIS",
        coming_soon: "Demnächst",
        players_title: "Spieler",
        mode_1p: "1 Spieler (Vs CPU)",
        mode_2p: "2 Spieler (Splitscreen)",
        diff_title: "Schwierigkeit",
        diff_easy: "Leicht (10 Pkt)", diff_med: "Mittel (20 Pkt)", diff_hard: "Schwer (30 Pkt)", diff_ext: "EXTREM (40 Pkt)",
        btn_launch: "SPIEL STARTEN",
        btn_abort: "SPIEL BEENDEN",
        game_offline: "SPIEL DERZEIT NICHT VERFÜGBAR",
        goal: "TOR!"
    }
};

window.currentLang = 'pt';

function setLang(lang) {
    window.currentLang = lang;
    const dict = translations[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    // Update selected visual state for lang buttons
    const parent = document.getElementById('lang-selector');
    if(parent) {
        parent.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('selected'));
        // Find the button that called this
        let btns = parent.querySelectorAll('.lang-btn');
        for(let b of btns) {
            if(b.innerText.toLowerCase() === lang.toLowerCase()) {
                b.classList.add('selected');
            }
        }
    }
}

// ==========================================
// GLOBAL SETTINGS
// ==========================================
window.sensitivity = 2.0; // Sensibilidade padrão aumentada

// PER-GAME SETTINGS
window.activeGame = null;
window.gameConfigs = {
    pong: { mode: 1, difficultyMult: 1, targetScore: 5 },
    tennis: { mode: 1, difficultyMult: 1, targetScore: 5 },
    moto: { mode: 1, difficultyMult: 1, targetScore: 5 }
};

let pendingGame = 'pong';

function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    // Controlar Animações de Fundo (só mostra no menu principal)
    let floaters = document.getElementById('bg-floaters');
    if(floaters) floaters.style.display = (screenId === 'game-ui-screen') ? 'none' : 'block';

    // Controlar Idiomas (só mostra no start-screen)
    let langSel = document.getElementById('lang-selector');
    if(langSel) langSel.style.display = (screenId === 'start-screen') ? 'flex' : 'none';
}

function restartCurrentGame() {
    document.getElementById('end-game-menu').style.display = 'none';
    document.getElementById('winner-text').style.display = 'none';
    if(window.activeGame === 'pong') initPong3D();
    if(window.activeGame === 'tennis') initTennis3D();
    if(window.activeGame === 'moto') initMoto3D();
}

// Global Sensitivity Selection
function setSensitivity(sens, btnElement) {
    window.sensitivity = sens;
    let parent = document.getElementById('sensitivity-options');
    parent.querySelectorAll('.wii-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

// Game Hub specific settings
function openGameHub(gameId) {
    pendingGame = gameId;
    let title = '';
    if (gameId === 'pong') title = 'AIR HOCKEY 3D';
    else if (gameId === 'tennis') title = 'COURT TENNIS';
    else if (gameId === 'moto') title = 'MOTO RACER';
    else if (gameId === 'bowling') title = 'BOLICHE 3D';
    else if (gameId === 'shoot') title = 'TIRO AO ALVO';
    else if (gameId === 'drums') title = 'BATERIA VIRTUAL';
    
    document.getElementById('game-hub-title').innerText = title + ' CONFIG';
    
    // Desabilitar co-op local para Singleplayer only
    let playersContainer = document.getElementById('players-config-container');
    if (playersContainer) {
        if (gameId === 'moto' || gameId === 'tennis' || gameId === 'bowling' || gameId === 'shoot' || gameId === 'drums') {
            playersContainer.style.display = 'none';
            window.gameConfigs[pendingGame].mode = 1; // Força Singleplayer
        } else {
            playersContainer.style.display = 'block';
        }
    }
    
    navTo('game-hub-screen');
}

function setGameMode(players, btnElement) {
    window.gameConfigs[pendingGame].mode = players;
    let parent = document.getElementById('player-options');
    parent.querySelectorAll('.wii-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

function setGameDifficulty(mult, score, btnElement) {
    window.gameConfigs[pendingGame].difficultyMult = mult;
    window.gameConfigs[pendingGame].targetScore = score;
    let parent = document.getElementById('difficulty-options');
    parent.querySelectorAll('.wii-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

function launchGame() {
    let conf = window.gameConfigs[pendingGame];
    window.playersMode = conf.mode;
    window.difficultyMultiplier = conf.difficultyMult;
    window.maxScore = conf.targetScore;
    window.activeGame = pendingGame;
    
    navTo('game-ui-screen');
    
    if (pendingGame === 'pong' && typeof initPong3D === 'function') {
        initPong3D();
    } else if (pendingGame === 'tennis' && typeof initTennis3D === 'function') {
        initTennis3D();
    } else if (pendingGame === 'moto' && typeof initMoto3D === 'function') {
        initMoto3D();
    } else if (pendingGame === 'bowling' && typeof initBowling3D === 'function') {
        initBowling3D();
    } else if (pendingGame === 'shoot' && typeof initShoot3D === 'function') {
        initShoot3D();
    } else if (pendingGame === 'drums') {
        initDrum();
    } else {
        document.getElementById('winner-text').style.display = 'block';
        document.getElementById('winner-text').innerText = translations[window.currentLang].game_offline;
    }
}

function backToMenu() {
    window.activeGame = null;
    document.getElementById('end-game-menu').style.display = 'none';
    document.getElementById('winner-text').style.display = 'none';
    if(typeof stopPong3D === 'function') stopPong3D();
    if(typeof stopTennis3D === 'function') stopTennis3D();
    if(typeof stopMoto3D === 'function') stopMoto3D();
    if(typeof stopBowling3D === 'function') stopBowling3D();
    if(typeof stopShoot3D === 'function') stopShoot3D();
    stopDrum();
    navTo('select-screen');
}

// ==========================================
// 🥁 BATERIA VIRTUAL LOGIC (Overlay HTML + Web Audio API)
// ==========================================
let audioCtx = null;
let drumActive = false;
let drumScore = 0;
let lastDrumHit = {}; // { id: time }

const drumPadsConfig = {
    'drum-crash': { freq: 800, type: 'sawtooth', decay: 1.5, element: null },
    'drum-hihat': { freq: 600, type: 'square', decay: 0.1, element: null },
    'drum-snare': { freq: 200, type: 'triangle', decay: 0.2, element: null },
    'drum-tom': { freq: 150, type: 'sine', decay: 0.4, element: null },
    'drum-kick': { freq: 60, type: 'sine', decay: 0.5, element: null },
    'drum-ride': { freq: 1000, type: 'sine', decay: 1.0, element: null }
};

function initDrum() {
    drumActive = true;
    drumScore = 0;
    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('p1-score-txt').innerText = '🥁 0';
    document.getElementById('p2-score-txt').innerText = 'MODO RITMO';
    document.getElementById('drum-ui').style.display = 'block';
    
    // Ocultar cenário 3D temporariamente (Fundo fica do WebGL)
    particlesMesh.visible = true;
    gridHelper.visible = false;
    
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    for (let id in drumPadsConfig) {
        drumPadsConfig[id].element = document.getElementById(id);
    }
    
    requestAnimationFrame(updateDrumLogic);
}

function stopDrum() {
    drumActive = false;
    document.getElementById('drum-ui').style.display = 'none';
    document.getElementById('score-board').style.display = 'none';
}

function playDrumSound(config) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = config.type;
    osc.frequency.setValueAtTime(config.freq, audioCtx.currentTime);
    
    // Efeito percussivo de prato/caixa adicionando ruído (noise simples com oscilador para simplificar)
    if (config.type === 'square' || config.type === 'sawtooth') {
        osc.detune.setValueAtTime(Math.random() * 1000 - 500, audioCtx.currentTime);
    }
    
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + config.decay);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + config.decay);
}

function updateDrumLogic() {
    if (!drumActive) return;
    
    let handX = window.hand1X * window.innerWidth;
    let handY = window.hand1Y * window.innerHeight;
    
    const now = Date.now();
    let hitSomething = false;
    
    for (let id in drumPadsConfig) {
        const conf = drumPadsConfig[id];
        const el = conf.element;
        if (!el) continue;
        
        const rect = el.getBoundingClientRect();
        const isInPad = (handX >= rect.left && handX <= rect.right && handY >= rect.top && handY <= rect.bottom);
        
        if (isInPad) {
            el.style.backgroundColor = 'rgba(255,255,255,0.4)';
            el.style.transform = 'scale(1.1)';
            
            if (!lastDrumHit[id] || (now - lastDrumHit[id] > 200)) {
                lastDrumHit[id] = now;
                playDrumSound(conf);
                hitSomething = true;
                
                // Modo ritmo simples
                drumScore += 10;
                document.getElementById('p1-score-txt').innerText = '🥁 ' + drumScore;
            }
        } else {
            el.style.backgroundColor = 'transparent';
            el.style.transform = 'scale(1)';
        }
    }
    
    requestAnimationFrame(updateDrumLogic);
}

// ==========================================
// VIRTUAL CURSOR (Neon Green)
// ==========================================
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth; cursorCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth; cursorCanvas.height = window.innerHeight;
});

let hoverTarget = null;
let hoverStartTime = 0;
const DWELL_TIME = 1200; // Faster dwell time for more responsive feel

function updateCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    
    if (window.isHandPresent) {
        let cx = (1 - window.hand1X) * cursorCanvas.width;
        let cy = window.hand1Y * cursorCanvas.height;

        let elements = document.elementsFromPoint(cx, cy);
        let foundBtn = elements.find(el => el.classList && (el.classList.contains('wii-btn') || el.classList.contains('lang-btn')));

        let coreRadius = 8;
        let ringRadius = window.isPinching1 ? 15 : 28;
        let accentColor = window.isPinching1 ? '#e60012' : '#0070cc'; 

        if (foundBtn) {
            if (hoverTarget !== foundBtn) {
                if(hoverTarget) hoverTarget.classList.remove('hovering');
                hoverTarget = foundBtn;
                hoverTarget.classList.add('hovering');
            }
            
            // Lógica de Clique por Pinça
            let wasPinching = window.lastPinchState || false;
            if (window.isPinching1 && !wasPinching) {
                hoverTarget.click();
            }
        } else {
            if (hoverTarget) {
                hoverTarget.classList.remove('hovering');
                hoverTarget = null;
            }
        }
        window.lastPinchState = window.isPinching1;

        // Draw Outer Translucent Ring
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, ringRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = hoverTarget ? 'rgba(230, 0, 18, 0.4)' : 'rgba(0, 112, 204, 0.4)';
        cursorCtx.fill();
        cursorCtx.strokeStyle = accentColor;
        cursorCtx.lineWidth = 2;
        cursorCtx.stroke();

        // Draw Solid Glowing Core
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, coreRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = '#FFFFFF';
        cursorCtx.fill();
        cursorCtx.shadowBlur = 0;
    }
    
    requestAnimationFrame(updateCursor);
}
updateCursor();

// Initialize language on load
setLang('pt');
