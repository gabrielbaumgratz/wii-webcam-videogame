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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

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
// RENDER LOOP
// ==========================================
camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    
    if (particlesMesh.visible) {
        particlesMesh.rotation.y += 0.001; 
        particlesMesh.rotation.x += 0.0005;
        
        // Mover as grids para efeito de velocidade
        gridHelper.position.z = (gridHelper.position.z + 0.1) % 10;
    }

    if (pongActive) updatePong3D();
    
    updateConfetti();
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
