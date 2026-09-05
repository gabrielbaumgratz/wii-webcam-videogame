// ==========================================
// MOTOR 3D PRINCIPAL (Three.js) - CONSOLE MIX
// ==========================================
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f1115, 0.025); // Deep Console Black/Grey

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0f1115, 1); // Fundo escuro (PlayStation/Xbox base)
container.appendChild(renderer.domElement);

// Setup de Iluminação Global Básica
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Muito mais claro
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
scene.add(hemiLight);

// ==========================================
// AMBIENTE DO MENU (Partículas PS Blue & Grid Xbox)
// ==========================================
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 100; // REDUZIDO DRASTICAMENTE PARA MÁXIMA PERFORMANCE
const posArray = new Float32Array(particlesCount * 3);
for(let i=0; i < particlesCount*3; i++){
    posArray[i] = (Math.random() - 0.5) * 120;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.8,
    color: 0x0070cc, // PlayStation Blue
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// Grade estilo Xbox
const gridHelper = new THREE.GridHelper(300, 80, 0x107c10, 0x0f1115); // Xbox Green
gridHelper.position.y = -15;
gridHelper.material.opacity = 0.5;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Removido o segundo grid giratório para salvar processamento de GPU.

// ==========================================
// AMBIENTE DO PONG 3D (STANDARD COLORS)
// ==========================================
const pongGroup = new THREE.Group();
pongGroup.visible = false;
scene.add(pongGroup);

// Mesa (Campo)
const tableGeo = new THREE.BoxGeometry(40, 1, 20);
const tableMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.95 }); // Chão Escuro
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -2;
pongGroup.add(table);

// Bordas brilhantes (Campo esportivo neutro)
const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(tableGeo),
    new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
);
table.add(edges);

// Linha central
const centerLineGeo = new THREE.BoxGeometry(0.5, 1.2, 20);
const centerLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
centerLine.position.y = -2;
pongGroup.add(centerLine);

// Raquetes (Time Vermelho e Time Azul)
const paddleGeo = new THREE.BoxGeometry(1.5, 2.5, 4.5);
// P1 (Esquerda / Máquina ou Player 1) -> TIME VERMELHO
const p1Mat = new THREE.MeshPhongMaterial({ color: 0xFF3333, emissive: 0xFF3333, emissiveIntensity: 0.6 }); 
// P2 (Direita / Usuário ou Player 2) -> TIME AZUL
const p2Mat = new THREE.MeshPhongMaterial({ color: 0x3366FF, emissive: 0x3366FF, emissiveIntensity: 0.6 }); 

const paddle1 = new THREE.Mesh(paddleGeo, p1Mat);
paddle1.position.set(-18, -1, 0);
pongGroup.add(paddle1);

const paddle2 = new THREE.Mesh(paddleGeo, p2Mat);
paddle2.position.set(18, -1, 0);
pongGroup.add(paddle2);

// Bola (Luz Pontual + Esfera Brilhante)
const ballGeo = new THREE.SphereGeometry(1, 16, 16);
const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeo, ballMat);
const ballLight = new THREE.PointLight(0xffffff, 3, 30);
ball.add(ballLight);
pongGroup.add(ball);

// Variáveis de Física do Pong 3D
let bX = 0, bZ = 0;
let bSpeedX = 0, bSpeedZ = 0;
let p1Score = 0, p2Score = 0;
let pongActive = false;
let pongShowingWin = false;

let confettis = [];
function spawnConfetti(isPlayer2) {
    let baseColor = isPlayer2 ? 0x3366FF : 0xFF3333; // Azul ou Vermelho
    for(let i = 0; i < 60; i++) {
        let mat = new THREE.MeshBasicMaterial({ color: baseColor });
        let hsl = {}; mat.color.getHSL(hsl);
        mat.color.setHSL(hsl.h, hsl.s, hsl.l + (Math.random() * 0.4 - 0.2)); // Vários tons da mesma skin
        
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat);
        mesh.position.set((Math.random() - 0.5) * 30, 15, (Math.random() - 0.5) * 20);
        mesh.velocity = new THREE.Vector3((Math.random() - 0.5), -(Math.random() * 0.5 + 0.5), (Math.random() - 0.5));
        mesh.rotSpeed = new THREE.Vector3(Math.random()*0.2, Math.random()*0.2, Math.random()*0.2);
        pongGroup.add(mesh);
        confettis.push(mesh);
    }
}

function updateConfetti() {
    for(let i = confettis.length - 1; i >= 0; i--) {
        let c = confettis[i];
        c.position.add(c.velocity);
        c.rotation.x += c.rotSpeed.x;
        c.rotation.y += c.rotSpeed.y;
        if(c.position.y < -5) {
            pongGroup.remove(c);
            confettis.splice(i, 1);
        }
    }
}

let isGoalPause = false;

function triggerGoal(scorer) {
    if (scorer === 1) p1Score++;
    else p2Score++;
    
    document.getElementById('p1-score-txt').innerText = p1Score;
    document.getElementById('p2-score-txt').innerText = p2Score;

    if (p1Score >= window.maxScore || p2Score >= window.maxScore) {
        resetPongBall3D(scorer, true);
        return;
    }

    isGoalPause = true;
    let color = scorer === 2 ? '#3366FF' : '#FF3333';
    
    let el = document.getElementById('goal-alert');
    if(!el) {
        el = document.createElement('div');
        el.id = 'goal-alert';
        el.style.position = 'absolute';
        el.style.top = '45%';
        el.style.left = '50%';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.fontSize = '8em';
        el.style.fontWeight = '800';
        el.style.textShadow = '0 0 40px currentColor';
        el.style.zIndex = '2000';
        el.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        document.getElementById('game-ui-screen').appendChild(el);
    }
    
    el.innerText = translations[window.currentLang].goal;
    el.style.color = color;
    el.style.display = 'block';
    
    spawnConfetti(scorer === 2);
    
    setTimeout(() => {
        el.style.display = 'none';
        resetPongBall3D(scorer, false);
        isGoalPause = false;
    }, 1500);
}

function resetPongBall3D(lastScorer, showWin = false) {
    bX = 0; bZ = 0;
    // Bola vai para quem tomou o gol
    bSpeedX = lastScorer === 1 ? -Math.abs(bSpeedX) : Math.abs(bSpeedX);

    if (showWin) {
        pongShowingWin = true;
        let winnerText = document.getElementById('winner-text');
        winnerText.style.display = 'block';
        document.getElementById('end-game-menu').style.display = 'flex';
        if (window.playersMode === 2) {
            winnerText.innerText = (p1Score >= window.maxScore) ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
        } else {
            winnerText.innerText = (p1Score >= window.maxScore) ? "SYSTEM OVERRIDE" : "USER WINS!";
        }
    }
}

function initPong3D() {
    pongGroup.visible = true;
    particlesMesh.visible = false;
    gridHelper.visible = false;
    
    // Vista Superior (2D) - como pedido
    camera.position.set(0, 35, 0);
    camera.lookAt(0, -2, 0);
    
    p1Score = 0; p2Score = 0;
    document.getElementById('p1-score-txt').innerText = 0;
    document.getElementById('p2-score-txt').innerText = 0;
    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('winner-text').style.display = 'none';
    
    bX = 0; bZ = 0;
    
    let baseSpeed = window.difficultyMultiplier >= 3 ? 0.8 : 0.5;
    
    bSpeedX = (Math.random() > 0.5 ? baseSpeed : -baseSpeed) * (window.difficultyMultiplier > 1 ? 1.5 : 1);
    bSpeedZ = (Math.random() > 0.5 ? 0.3 : -0.3) * window.difficultyMultiplier;
    
    pongActive = true;
    pongShowingWin = false;
}

function stopPong3D() {
    pongActive = false;
    pongGroup.visible = false;
    particlesMesh.visible = true;
    gridHelper.visible = true;
    
    document.getElementById('score-board').style.display = 'none';
    document.getElementById('winner-text').style.display = 'none';
    
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

function updatePong3D() {
    if(!pongActive || pongShowingWin || isGoalPause || window.isPaused) return;

    let targetZ2 = (window.hand1Y - 0.5) * 20; 
    paddle2.position.z += (targetZ2 - paddle2.position.z) * 0.4; 
    if(paddle2.position.z < -8.5) paddle2.position.z = -8.5;
    if(paddle2.position.z > 8.5) paddle2.position.z = 8.5;

    if (window.playersMode === 2) {
        let targetZ1 = (window.hand2Y - 0.5) * 20;
        paddle1.position.z += (targetZ1 - paddle1.position.z) * 0.4;
    } else {
        // IA Muito Mais Esperta
        let speedIA = 0.4 * window.difficultyMultiplier;
        let predictionZ = bZ;
        
        // Se a bola está vindo na direção da IA, ela prevê onde vai bater
        if (bSpeedX < 0) {
            let timeToImpact = Math.abs((paddle1.position.x - bX) / bSpeedX);
            predictionZ = bZ + (bSpeedZ * timeToImpact);
            
            // Simula rebotes na parede na predição
            if (predictionZ < -9.5) predictionZ = -9.5 + Math.abs(predictionZ + 9.5);
            if (predictionZ > 9.5) predictionZ = 9.5 - Math.abs(predictionZ - 9.5);
        } else {
            // Volta pro meio
            predictionZ = 0;
            speedIA = 0.2;
        }

        if (window.difficultyMultiplier >= 3) speedIA = 1.2; // Extremamente Rápido
        
        if(paddle1.position.z < predictionZ - 0.5) paddle1.position.z += speedIA;
        if(paddle1.position.z > predictionZ + 0.5) paddle1.position.z -= speedIA;
    }
    
    if(paddle1.position.z < -8.5) paddle1.position.z = -8.5;
    if(paddle1.position.z > 8.5) paddle1.position.z = 8.5;

    bX += bSpeedX;
    bZ += bSpeedZ;
    
    ball.position.set(bX, -1, bZ);

    if (bZ < -9.5 || bZ > 9.5) bSpeedZ = -bSpeedZ;

    // Colisões melhoradas com as raquetes
    if (bX < -16.5 && bX > -19 && bSpeedX < 0) {
        if (Math.abs(bZ - paddle1.position.z) < 3.0) {
            bSpeedX = Math.abs(bSpeedX) + 0.05; // Acelera um pouco
            bSpeedZ += (bZ - paddle1.position.z) * 0.2; 
        }
    } else if (bX < -20) {
        triggerGoal(2);
    }

    if (bX > 16.5 && bX < 19 && bSpeedX > 0) {
        if (Math.abs(bZ - paddle2.position.z) < 3.0) {
            bSpeedX = -Math.abs(bSpeedX) - 0.05; 
            bSpeedZ += (bZ - paddle2.position.z) * 0.2;
        }
    } else if (bX > 20) {
        triggerGoal(1);
    }
}

// ==========================================
// TENNIS 3D LOGIC
// ==========================================
let tennisActive = false;
let tennisShowingWin = false;
let tennisGroup = new THREE.Group();
scene.add(tennisGroup);
tennisGroup.visible = false;

// Assets: Quadra e Bola
// Área de fora da Quadra (Azul)
const outerPlaneGeo = new THREE.PlaneGeometry(50, 70);
const outerPlaneMat = new THREE.MeshStandardMaterial({ color: 0x1155cc, roughness: 0.8 });
const outerPlane = new THREE.Mesh(outerPlaneGeo, outerPlaneMat);
outerPlane.rotation.x = -Math.PI / 2;
outerPlane.position.y = -5.0;
tennisGroup.add(outerPlane);

// Quadra Interna (Verde)
const tPlaneGeo = new THREE.PlaneGeometry(30, 60);
const tPlaneMat = new THREE.MeshStandardMaterial({ color: 0x11aa33, roughness: 0.8 });
const tPlane = new THREE.Mesh(tPlaneGeo, tPlaneMat);
tPlane.rotation.x = -Math.PI / 2;
tPlane.position.y = -4.95;
tennisGroup.add(tPlane);

// Linhas da quadra
const tLinesGeo = new THREE.EdgesGeometry(tPlaneGeo);
const tLinesMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
const tLines = new THREE.LineSegments(tLinesGeo, tLinesMat);
tLines.rotation.x = -Math.PI / 2;
tLines.position.y = -4.9;

// Rede
const netGeo = new THREE.PlaneGeometry(30, 4);
const netMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 });
const net = new THREE.Mesh(netGeo, netMat);
net.position.y = -2.9;
tLines.add(net);
tennisGroup.add(tLines);

// Textura da Raquete (Asset PNG do Usuário)
const textureLoader = new THREE.TextureLoader();
const racketTex = textureLoader.load('assets/user_racket.png');
const rMat = new THREE.MeshBasicMaterial({ map: racketTex, transparent: true, side: THREE.DoubleSide });
const p1Racket = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), rMat);
p1Racket.position.set(0, 0, 20); // Jogador perto da câmera
tennisGroup.add(p1Racket);

const p2Racket = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), rMat);
p2Racket.position.set(0, 0, -20); // Inimigo no fundo
tennisGroup.add(p2Racket);

// Plateia (Audience)
const audienceGroup = new THREE.Group();
const audGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
for(let i = -20; i <= 20; i += 2) {
    // Esquerda
    let aud1 = new THREE.Mesh(audGeo, new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)] }));
    aud1.position.set(-18, -3 + Math.random(), i + (Math.random() - 0.5));
    audienceGroup.add(aud1);
    // Direita
    let aud2 = new THREE.Mesh(audGeo, new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)] }));
    aud2.position.set(18, -3 + Math.random(), i + (Math.random() - 0.5));
    audienceGroup.add(aud2);
}
tennisGroup.add(audienceGroup);

// Bola (Asset PNG)
const ballTex = textureLoader.load('assets/user_ball.png');
const tBallMat = new THREE.MeshBasicMaterial({ map: ballTex, transparent: true });
const tBall = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), tBallMat);
tennisGroup.add(tBall);

let tBX = 0, tBZ = 0, tBY = -4, tSpeedX = 0, tSpeedZ = 0, tSpeedY = 0;
let tP1Score = 0, tP2Score = 0;

const tennisScores = ["0", "15", "30", "40", "ADV", "WIN"];

function initTennis3D() {
    tennisActive = true;
    tennisShowingWin = false;
    tennisGroup.visible = true;
    particlesMesh.visible = false;
    gridHelper.visible = false;
    
    // Visão isométrica MAIS BAIXA nas costas do jogador
    camera.position.set(0, 3, 35);
    camera.lookAt(0, 0, 0);
    
    tP1Score = 0; tP2Score = 0;
    updateTennisScoreHUD();
    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('winner-text').style.display = 'none';
    
    resetTennisBall(1);
}

function updateTennisScoreHUD() {
    document.getElementById('p1-score-txt').innerText = tennisScores[tP1Score] || "WIN";
    document.getElementById('p2-score-txt').innerText = tennisScores[tP2Score] || "WIN";
}

function stopTennis3D() {
    tennisActive = false;
    tennisGroup.visible = false;
    particlesMesh.visible = true;
    gridHelper.visible = true;
    
    document.getElementById('score-board').style.display = 'none';
    document.getElementById('winner-text').style.display = 'none';
    
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

function resetTennisBall(scorer) {
    tBX = 0; tBZ = 0; tBY = -4;
    tSpeedX = (Math.random() - 0.5) * 0.4;
    tSpeedY = 0;
    tSpeedZ = (scorer === 1 ? -0.4 : 0.4) * (window.difficultyMultiplier * 0.8 + 0.2);
}

function updateTennis3D() {
    if(!tennisActive || tennisShowingWin || isGoalPause || window.isPaused) return;

    // Plateia pulando (Animação)
    audienceGroup.children.forEach(c => {
        if (Math.random() > 0.95) c.position.y = -3 + Math.random() * 2;
        else if (c.position.y > -3) c.position.y -= 0.1;
    });

    // Jogador 1 (Controlado pela mão - Movimentação Invertida Corrigida)
    let targetX = -(window.hand1X - 0.5) * 30; // Inverteu o X
    let targetY = -(window.hand1Y - 0.5) * 15 - 3; // Inverteu o Y
    p1Racket.position.x += (targetX - p1Racket.position.x) * 0.3;
    p1Racket.position.y += (targetY - p1Racket.position.y) * 0.3;

    // Inimigo (IA)
    let speedIA = 0.2 * window.difficultyMultiplier;
    let predictionX = tBX;
    if (tSpeedZ < 0) { // Bola indo para IA
        predictionX = tBX + (tSpeedX * (Math.abs(p2Racket.position.z - tBZ) / Math.abs(tSpeedZ)));
    } else {
        predictionX = 0; // Volta pro centro
    }
    if (p2Racket.position.x < predictionX - 1) p2Racket.position.x += speedIA;
    if (p2Racket.position.x > predictionX + 1) p2Racket.position.x -= speedIA;
    p2Racket.position.y = -3; // IA fica numa altura fixa

    // Física da Bola
    tBX += tSpeedX;
    tBZ += tSpeedZ;
    tBY += tSpeedY;
    tSpeedY -= 0.01; // Gravidade
    
    if (tBY < -4.5) { // Quique no chão
        tBY = -4.5;
        tSpeedY = Math.abs(tSpeedY) * 0.8; 
    }
    
    tBall.position.set(tBX, tBY, tBZ);

    // Colisão P1 (Jogador)
    if (tBZ > 19 && tBZ < 21 && tSpeedZ > 0) {
        let dist = Math.hypot(tBX - p1Racket.position.x, tBY - p1Racket.position.y);
        if (dist < 4.0) {
            tSpeedZ = -Math.abs(tSpeedZ) - 0.05;
            tSpeedX = (tBX - p1Racket.position.x) * 0.15;
            tSpeedY = 0.3 + Math.random() * 0.2; // Hit para cima
        }
    } else if (tBZ > 25) { // Passou do jogador
        triggerTennisGoal(2);
    }

    // Colisão P2 (Inimigo)
    if (tBZ < -19 && tBZ > -21 && tSpeedZ < 0) {
        let dist = Math.hypot(tBX - p2Racket.position.x, tBY - p2Racket.position.y);
        if (dist < 4.0) {
            tSpeedZ = Math.abs(tSpeedZ) + 0.05;
            tSpeedX = (tBX - p2Racket.position.x) * 0.15;
            tSpeedY = 0.3 + Math.random() * 0.2;
        }
    } else if (tBZ < -25) { // Passou do inimigo
        triggerTennisGoal(1);
    }
}

function triggerTennisGoal(scorer) {
    if (scorer === 1) {
        if(tP1Score === 3 && tP2Score === 3) tP1Score = 4; // ADV
        else if (tP1Score === 4 && tP2Score === 3) tP1Score = 5; // WIN from ADV
        else if (tP2Score === 4) tP2Score = 3; // Lose ADV
        else tP1Score++;
    } else {
        if(tP2Score === 3 && tP1Score === 3) tP2Score = 4; // ADV
        else if (tP2Score === 4 && tP1Score === 3) tP2Score = 5; // WIN from ADV
        else if (tP1Score === 4) tP1Score = 3; // Lose ADV
        else tP2Score++;
    }

    updateTennisScoreHUD();

    if (tP1Score >= 4 && tP1Score - tP2Score >= 2) return winTennis(1);
    if (tP2Score >= 4 && tP2Score - tP1Score >= 2) return winTennis(2);

    isGoalPause = true;
    let el = document.getElementById('goal-alert');
    if(!el) {
        el = document.createElement('div');
        el.id = 'goal-alert';
        el.style.position = 'absolute';
        el.style.top = '45%'; el.style.left = '50%';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.fontSize = '8em'; el.style.fontWeight = '800';
        el.style.textShadow = '0 0 40px currentColor';
        el.style.zIndex = '2000';
        el.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        document.getElementById('game-ui-screen').appendChild(el);
    }
    el.innerText = "POINT!";
    el.style.color = scorer === 2 ? '#3366FF' : '#FF3333';
    el.style.display = 'block';
    
    spawnConfetti(scorer === 2);
    
    setTimeout(() => {
        el.style.display = 'none';
        resetTennisBall(scorer);
        isGoalPause = false;
    }, 1500);
}

function winTennis(winner) {
    tennisShowingWin = true;
    let winnerText = document.getElementById('winner-text');
    winnerText.style.display = 'block';
    document.getElementById('end-game-menu').style.display = 'flex';
    winnerText.innerText = (winner === 1) ? "USER WINS GAME!" : "SYSTEM WINS GAME!";
}


// ==========================================
// MOTO RACER LOGIC
// ==========================================
let motoActive = false;
let motoShowingWin = false;
let motoGroup = new THREE.Group();
scene.add(motoGroup);
motoGroup.visible = false;

// Jogador (Moto 3D Real)
const playerMoto = new THREE.Group();
playerMoto.position.set(0, -4.9, 10);
motoGroup.add(playerMoto);

// Carrega o modelo da Moto
new THREE.MTLLoader().setPath('assets/moto_model/').load('moto_simple_1.mtl', function (materials) {
    materials.preload();
    new THREE.OBJLoader()
        .setMaterials(materials)
        .setPath('assets/moto_model/')
        .load('moto_simple_1.obj', function (object) {
            object.scale.set(0.015, 0.015, 0.015); // A moto é gigante
            playerMoto.add(object);
        });
});

let carModelTemplate = null;
let obstacles = [];
// Carrega o modelo do Carro FBX
new THREE.FBXLoader().load('assets/car_model/Low Poly Cars (Free)_fbx/Models/car_1.fbx', function (object) {
    const carTex = new THREE.TextureLoader().load('assets/car_model/Low Poly Cars (Free)_fbx/Textures/Car Texture 1.png');
    object.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ map: carTex });
        }
    });
    object.scale.set(0.01, 0.01, 0.01);
    object.rotation.y = Math.PI; // Carros vindo na contramão
    carModelTemplate = object;
    
    // Substitui os obstáculos pelos carros carregados
    obstacles.forEach(o => motoGroup.remove(o));
    obstacles = [];
    
    for(let i=0; i<10; i++) {
        let obs;
        if (carModelTemplate) {
            obs = carModelTemplate.clone();
            obs.position.set((Math.random() - 0.5) * 30, -5, -100 - (Math.random() * 200));
        } else {
            obs = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), new THREE.MeshStandardMaterial({ color: 0xff0055 }));
            obs.position.set((Math.random() - 0.5) * 30, -4, -100 - (Math.random() * 200));
        }
        motoGroup.add(obs);
        obstacles.push(obs);
    }
});

// Pista Cyberpunk (Infinito)
const roadGeom = new THREE.PlaneGeometry(40, 200);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0 });
const road = new THREE.Mesh(roadGeom, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.y = -5;
motoGroup.add(road);

// Obstáculos Fallback (Caixas Vermelhas)
const obsGeom = new THREE.BoxGeometry(4, 2, 4);
const obsMat = new THREE.MeshStandardMaterial({ color: 0xff0055 });
for(let i=0; i<10; i++) {
    let obs = new THREE.Mesh(obsGeom, obsMat);
    obs.position.set((Math.random() - 0.5) * 30, -4, -100 - (Math.random() * 200));
    motoGroup.add(obs);
    obstacles.push(obs);
}

let mScore = 0;
let motoStarted = false; // "como que faz para a moto ficar no canto parada sem ficar mexendo"

function initMoto3D() {
    motoActive = true;
    motoShowingWin = false;
    motoStarted = false;
    motoGroup.visible = true;
    particlesMesh.visible = false;
    gridHelper.visible = true; // Mantém a grid para efeito de velocidade synthwave!
    gridHelper.material.color.setHex(0xff00ff); // Neon pink grid para a corrida
    
    // Câmera perseguição top-down 3D
    camera.position.set(0, 15, 30);
    camera.lookAt(0, -5, 0);
    
    playerMoto.position.set(0, -4.9, 15); // LARGADA FIxa no fundo
    
    mScore = 0;
    document.getElementById('p1-score-txt').innerText = "0";
    document.getElementById('p2-score-txt').innerText = "";
    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('winner-text').style.display = 'none';
    document.getElementById('end-game-menu').style.display = 'none';

    // Respawn dos obstáculos ao iniciar o jogo
    obstacles.forEach(o => motoGroup.remove(o));
    obstacles = [];
    for(let i=0; i<10; i++) {
        let obs;
        if (carModelTemplate) {
            obs = carModelTemplate.clone();
            obs.position.set((Math.random() - 0.5) * 30, -5, -100 - (Math.random() * 200));
        } else {
            obs = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), new THREE.MeshStandardMaterial({ color: 0xff0055 }));
            obs.position.set((Math.random() - 0.5) * 30, -4, -100 - (Math.random() * 200));
        }
        motoGroup.add(obs);
        obstacles.push(obs);
    }
}

function stopMoto3D() {
    motoActive = false;
    motoGroup.visible = false;
    particlesMesh.visible = true;
    gridHelper.visible = true;
    gridHelper.material.color.setHex(0x107c10); // Voltar green
    document.getElementById('score-board').style.display = 'none';
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

function updateMoto3D() {
    if(!motoActive || motoShowingWin || window.isPaused) return;

    // Jogador (Controlado pela mão com altíssima sensibilidade)
    let targetX = -(window.hand1X - 0.5) * 60 * window.sensitivity; // Aplica sensibilidade global
    // Limita a moto na pista para não sair voando
    targetX = Math.max(-25, Math.min(25, targetX));

    if (!motoStarted) {
        if (Math.abs(targetX) > 5.0) {
            motoStarted = true; 
        } else {
            return; // Permanece no canto/centro parada até largada!
        }
    }

    // Moto persegue a mão em X, cria inclinação
    let oldX = playerMoto.position.x;
    playerMoto.position.x += (targetX - playerMoto.position.x) * 0.15;
    let tilt = (playerMoto.position.x - oldX);
    playerMoto.rotation.y = -tilt * 0.1; // Inclina para os lados

    // Movimento de Obstáculos e Pista (Ilusão de movimento)
    let speed = 1.0 + (window.difficultyMultiplier * 0.5);
    gridHelper.position.z = (gridHelper.position.z + speed) % 10; // Grid veloz
    
    obstacles.forEach(obs => {
        obs.position.z += speed;
        // Colisão
        if (Math.abs(obs.position.z - playerMoto.position.z) < 4 && Math.abs(obs.position.x - playerMoto.position.x) < 4) {
            // BATIDA! Perdeu!
            motoShowingWin = true;
            let winnerText = document.getElementById('winner-text');
            winnerText.style.display = 'block';
            document.getElementById('end-game-menu').style.display = 'flex';
            winnerText.innerText = "CRASHED! SCORE: " + Math.floor(mScore);
            winnerText.style.color = '#ff0055';
        }
        // Loop de obstáculo
        if (obs.position.z > 20) {
            obs.position.z = -100 - (Math.random() * 50);
            obs.position.x = (Math.random() - 0.5) * 30;
            mScore += 10; // Ganha pontos
            document.getElementById('p1-score-txt').innerText = Math.floor(mScore);
        }
    });
}


// ==========================================
// RENDER LOOP
// ==========================================
camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    
    if (particlesMesh.visible) {
        particlesMesh.rotation.y += 0.001; 
        particlesMesh.rotation.x += 0.0005;
        if (!motoActive) gridHelper.position.z = (gridHelper.position.z + 0.1) % 10;
    }

    if (pongActive) updatePong3D();
    if (tennisActive) updateTennis3D();
    if (motoActive) updateMoto3D();
    if (bowlingActive) updateBowling3D();
    if (shootActive) updateShoot3D();
    
    updateConfetti();
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 🎳 BOLICHE 3D (Física Leve)
// ==========================================
let bowlingActive = false;
let bowlingShowingWin = false;
const bowlingGroup = new THREE.Group();
scene.add(bowlingGroup);
bowlingGroup.visible = false;

// Pista de Boliche
const blaneGeo = new THREE.PlaneGeometry(10, 60);
const blaneMat = new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.6 });
const blane = new THREE.Mesh(blaneGeo, blaneMat);
blane.rotation.x = -Math.PI / 2;
blane.position.y = -5;
bowlingGroup.add(blane);

// Calhas laterais
const bgutterMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
const bgutterL = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 60), bgutterMat);
bgutterL.position.set(-6, -5, 0);
const bgutterR = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 60), bgutterMat);
bgutterR.position.set(6, -5, 0);
bowlingGroup.add(bgutterL, bgutterR);

// Bola de Boliche
const bowlBallGeo = new THREE.SphereGeometry(0.8, 16, 16);
const bowlBallMat = new THREE.MeshStandardMaterial({ color: 0x111188, roughness: 0.2, metalness: 0.5 });
const bowlBall = new THREE.Mesh(bowlBallGeo, bowlBallMat);
bowlBall.position.set(0, -4.2, 22);
bowlingGroup.add(bowlBall);

// Pinos (10 pinos em triângulo)
const bpinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
const bpinGeo = new THREE.CylinderGeometry(0.25, 0.4, 2, 8);
const bpinPositions = [
    [-3,-2.0,-20],[-1,-2.0,-20],[1,-2.0,-20],[3,-2.0,-20],
    [-2,-2.0,-17],[0,-2.0,-17],[2,-2.0,-17],
    [-1,-2.0,-14],[1,-2.0,-14],
    [0,-2.0,-11]
];
let bpins = [];
let bpinFalling = [];
let bpinFallDir = [];
for (let i = 0; i < 10; i++) {
    const pin = new THREE.Mesh(bpinGeo, bpinMat);
    pin.position.set(...bpinPositions[i]);
    bowlingGroup.add(pin);
    bpins.push(pin);
    bpinFalling.push(false);
    bpinFallDir.push((Math.random() - 0.5) * 2);
}

let bowlBallMoving = false;
let bowlBallVelZ = 0;
let bowlBallTargetX = 0;
let bowlScore = 0;
let bowlThrows = 0;
let bowlPinsDown = 0;
let bowlWaitingReset = false;
let bowlResetTimer = 0;
const BOWL_MAX_THROWS = 3;

function initBowling3D() {
    bowlingActive = true;
    bowlingShowingWin = false;
    bowlingGroup.visible = true;
    particlesMesh.visible = false;
    gridHelper.visible = false;

    camera.position.set(0, 2, 30);
    camera.lookAt(0, -2, -10);

    bowlScore = 0; bowlThrows = 0; bowlPinsDown = 0;
    bowlBallMoving = false; bowlWaitingReset = false;
    bowlBall.position.set(0, -4.2, 22);
    bowlBall.rotation.set(0,0,0);

    // Reset pinos
    for (let i = 0; i < 10; i++) {
        bpins[i].position.set(...bpinPositions[i]);
        bpins[i].rotation.set(0, 0, 0);
        bpinFalling[i] = false;
    }

    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('p1-score-txt').innerText = '0';
    document.getElementById('p2-score-txt').innerText = '⚪'.repeat(10);
    document.getElementById('winner-text').style.display = 'none';
    document.getElementById('end-game-menu').style.display = 'none';
}

function stopBowling3D() {
    bowlingActive = false;
    bowlingGroup.visible = false;
    document.getElementById('score-board').style.display = 'none';
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

function updateBowling3D() {
    if (!bowlingActive || bowlingShowingWin || window.isPaused) return;

    // Mira: mão controla X da bola quando não está se movendo
    if (!bowlBallMoving && !bowlWaitingReset) {
        bowlBallTargetX = -(window.hand1X - 0.5) * 8;
        bowlBall.position.x += (bowlBallTargetX - bowlBall.position.x) * 0.15;

        // Pinça = lançar
        if (window.isPinching1) {
            bowlBallMoving = true;
            bowlBallVelZ = -0.6;
            bowlThrows++;
        }
    }

    // Bola em movimento
    if (bowlBallMoving) {
        bowlBall.position.z += bowlBallVelZ;
        bowlBall.rotation.x -= 0.1;

        // Detecção de colisão com pinos
        for (let i = 0; i < 10; i++) {
            if (!bpinFalling[i]) {
                const dx = bowlBall.position.x - bpins[i].position.x;
                const dz = bowlBall.position.z - bpins[i].position.z;
                if (Math.sqrt(dx * dx + dz * dz) < 1.5) {
                    bpinFalling[i] = true;
                    bpinFallDir[i] = dx > 0 ? 1 : -1;
                    bowlPinsDown++;
                    // Efeito de cascata: pinos vizinhos caem também (simplificado)
                    if (i > 0 && !bpinFalling[i-1] && Math.random() > 0.3) { bpinFalling[i-1] = true; bowlPinsDown++; }
                    if (i < 9 && !bpinFalling[i+1] && Math.random() > 0.3) { bpinFalling[i+1] = true; bowlPinsDown++; }
                }
            }
        }

        // Bola saiu da pista
        if (bowlBall.position.z < -28) {
            bowlBallMoving = false;
            const pinsDown = bpinFalling.filter(Boolean).length;
            bowlScore += pinsDown * 10;
            document.getElementById('p1-score-txt').innerText = bowlScore;

            if (bowlThrows >= BOWL_MAX_THROWS || pinsDown === 10) {
                bowlWaitingReset = true;
                bowlResetTimer = 80;
                setTimeout(() => {
                    bowlingShowingWin = true;
                    const winnerText = document.getElementById('winner-text');
                    winnerText.style.display = 'block';
                    winnerText.innerText = pinsDown === 10 ? '🎳 STRIKE!' : `SCORE: ${bowlScore}`;
                    document.getElementById('end-game-menu').style.display = 'flex';
                }, 2000);
            } else {
                bowlWaitingReset = true;
                bowlResetTimer = 90;
            }
        }
    }

    // Animação de pinos caindo
    for (let i = 0; i < 10; i++) {
        if (bpinFalling[i] && bpins[i].rotation.z < Math.PI / 2) {
            bpins[i].rotation.z += 0.05 * bpinFallDir[i];
            bpins[i].position.y -= 0.02;
        }
    }

    // Reset da bola
    if (bowlWaitingReset) {
        bowlResetTimer--;
        if (bowlResetTimer <= 0) {
            bowlWaitingReset = false;
            bowlBall.position.set(0, -4.2, 22);
            bowlBall.rotation.set(0, 0, 0);
        }
    }
}

// ==========================================
// 🎯 TIRO AO ALVO 3D
// ==========================================
let shootActive = false;
let shootShowingWin = false;
const shootGroup = new THREE.Group();
scene.add(shootGroup);
shootGroup.visible = false;

// Fundo da galeria
const shootBgGeo = new THREE.PlaneGeometry(60, 30);
const shootBgMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 1 });
const shootBg = new THREE.Mesh(shootBgGeo, shootBgMat);
shootBg.position.z = -20;
shootGroup.add(shootBg);

// Trilho dos alvos
const shootRailMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
const shootRail = new THREE.Mesh(new THREE.BoxGeometry(40, 0.3, 0.3), shootRailMat);
shootRail.position.set(0, 2, -10);
shootGroup.add(shootRail);

// Alvos (círculos coloridos)
const shootTargets = [];
const shootTargetMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
const shootTargetRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
for (let i = 0; i < 5; i++) {
    const tGroup = new THREE.Group();
    const outer = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), shootTargetRingMat);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.6, 16), shootTargetMat);
    inner.position.z = 0.01;
    tGroup.add(outer, inner);
    tGroup.position.set(-20 + i * 10, 2, -10);
    tGroup.userData = { speed: (0.05 + i * 0.02) * (Math.random() > 0.5 ? 1 : -1), hit: false };
    shootGroup.add(tGroup);
    shootTargets.push(tGroup);
}

// Mira (crosshair)
const crossMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), crossMat);
const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.1), crossMat);
const crossCenter = new THREE.Mesh(new THREE.CircleGeometry(0.15, 8), crossMat);
crossCenter.position.z = 0.05;
const crosshair = new THREE.Group();
crosshair.add(crossH, crossV, crossCenter);
crosshair.position.set(0, 0, -9);
shootGroup.add(crosshair);

let shootAmmo = 10;
let shootScore = 0;
let shootCooldown = 0;
let lastPinch = false;

function initShoot3D() {
    shootActive = true;
    shootShowingWin = false;
    shootGroup.visible = true;
    particlesMesh.visible = false;
    gridHelper.visible = false;

    camera.position.set(0, 2, 15);
    camera.lookAt(0, 2, 0);

    shootAmmo = 10; shootScore = 0; shootCooldown = 0; lastPinch = false;
    shootTargets.forEach((t, i) => {
        t.position.x = -20 + i * 10;
        t.userData.hit = false;
        t.userData.speed = (0.05 + i * 0.02) * (Math.random() > 0.5 ? 1 : -1);
        t.scale.set(1, 1, 1);
        t.children.forEach(c => c.visible = true);
    });

    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('p1-score-txt').innerText = '🎯 0';
    document.getElementById('p2-score-txt').innerText = '🔫 10';
    document.getElementById('winner-text').style.display = 'none';
    document.getElementById('end-game-menu').style.display = 'none';
}

function stopShoot3D() {
    shootActive = false;
    shootGroup.visible = false;
    document.getElementById('score-board').style.display = 'none';
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

function updateShoot3D() {
    if (!shootActive || shootShowingWin || window.isPaused) return;

    // Mira segue a mão
    crosshair.position.x = -(window.hand1X - 0.5) * 28;
    crosshair.position.y = -(window.hand1Y - 0.5) * 16 + 2;

    // Alvos se movem
    shootTargets.forEach(t => {
        if (!t.userData.hit) {
            t.position.x += t.userData.speed;
            if (t.position.x > 21 || t.position.x < -21) t.userData.speed *= -1;
        }
    });

    // Tiro com pinça
    if (shootCooldown > 0) shootCooldown--;
    const pinching = window.isPinching1;
    if (pinching && !lastPinch && shootCooldown === 0 && shootAmmo > 0) {
        shootAmmo--;
        shootCooldown = 20;
        document.getElementById('p2-score-txt').innerText = '🔫 ' + shootAmmo;

        // Detecção de acerto
        let hit = false;
        shootTargets.forEach(t => {
            if (!t.userData.hit) {
                const dx = crosshair.position.x - t.position.x;
                const dy = crosshair.position.y - t.position.y;
                if (Math.sqrt(dx*dx + dy*dy) < 1.4) {
                    t.userData.hit = true;
                    shootScore += 100;
                    t.scale.set(0.01, 0.01, 0.01);
                    document.getElementById('p1-score-txt').innerText = '🎯 ' + shootScore;
                    hit = true;
                }
            }
        });

        if (shootAmmo <= 0) {
            setTimeout(() => {
                shootShowingWin = true;
                const winnerText = document.getElementById('winner-text');
                winnerText.style.display = 'block';
                const allHit = shootTargets.every(t => t.userData.hit);
                winnerText.innerText = allHit ? '🎯 PERFECT SHOT!' : `SCORE: ${shootScore}`;
                document.getElementById('end-game-menu').style.display = 'flex';
            }, 500);
        }
    }
    lastPinch = pinching;
}

// ==========================================
// 🥁 BATERIA VIRTUAL (Modo Livre + Guitar Hero)
// ==========================================
// A bateria é uma sobreposição HTML pura, sem Three.js
// Gerenciada por drumInit/stopDrum em app.js

