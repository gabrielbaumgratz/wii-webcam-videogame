// ==========================================
// MOTOR 3D PRINCIPAL (Three.js)
// ==========================================
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x051a42, 0.02); // Deep Navy Fog

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x051a42, 1); // Fundo azul marinho sólido da estética
container.appendChild(renderer.domElement);

// Luzes globais
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// ==========================================
// AMBIENTE DO MENU (Partículas Y2K Glass)
// ==========================================
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 300;
const posArray = new Float32Array(particlesCount * 3);
for(let i=0; i < particlesCount*3; i++){
    posArray[i] = (Math.random() - 0.5) * 100;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.5,
    color: 0x486496, // Atmos blue
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// Grade estilo Ciberespaço
const gridHelper = new THREE.GridHelper(200, 50, 0x486496, 0x486496);
gridHelper.position.y = -10;
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// ==========================================
// AMBIENTE DO PONG 3D
// ==========================================
const pongGroup = new THREE.Group();
pongGroup.visible = false;
scene.add(pongGroup);

// Mesa
const tableGeo = new THREE.BoxGeometry(40, 1, 20);
const tableMat = new THREE.MeshPhongMaterial({ color: 0x051a42, transparent: true, opacity: 0.8 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -2;
pongGroup.add(table);

// Bordas brilhantes
const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(tableGeo),
    new THREE.LineBasicMaterial({ color: 0x486496, linewidth: 2 })
);
table.add(edges);

// Raquetes
const paddleGeo = new THREE.BoxGeometry(1, 2, 4);
const p1Mat = new THREE.MeshPhongMaterial({ color: 0x486496, emissive: 0x486496, emissiveIntensity: 0.5 }); // Atmos Blue (Left/PC)
const p2Mat = new THREE.MeshPhongMaterial({ color: 0xAFED91, emissive: 0xAFED91, emissiveIntensity: 0.5 }); // Accent Green (Right/Player)

const paddle1 = new THREE.Mesh(paddleGeo, p1Mat);
paddle1.position.set(-18, -1, 0);
pongGroup.add(paddle1);

const paddle2 = new THREE.Mesh(paddleGeo, p2Mat);
paddle2.position.set(18, -1, 0);
pongGroup.add(paddle2);

// Bola (Luz Pontual + Esfera)
const ballGeo = new THREE.SphereGeometry(0.8, 16, 16);
const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeo, ballMat);
const ballLight = new THREE.PointLight(0xffffff, 2, 20);
ball.add(ballLight);
pongGroup.add(ball);

// Variáveis de Física do Pong 3D
let bX = 0, bZ = 0;
let bSpeedX = 0, bSpeedZ = 0;
let p1Score = 0, p2Score = 0;
let pongActive = false;
let pongShowingWin = false;

function resetPongBall3D() {
    bX = 0; bZ = 0;
    bSpeedX = -bSpeedX;
    
    document.getElementById('p1-score-txt').innerText = p1Score;
    document.getElementById('p2-score-txt').innerText = p2Score;

    if (p1Score >= window.maxScore || p2Score >= window.maxScore) {
        pongShowingWin = true;
        let winnerText = document.getElementById('winner-text');
        winnerText.style.display = 'block';
        if (window.playersMode === 2) {
            winnerText.innerText = (p1Score >= window.maxScore) ? "Player 1 Wins!" : "Player 2 Wins!";
        } else {
            winnerText.innerText = (p1Score >= window.maxScore) ? "System Wins!" : "You Win!";
        }
    }
}

function initPong3D() {
    pongGroup.visible = true;
    particlesMesh.visible = false; // Esconde partículas do menu
    gridHelper.visible = false;
    
    // Posiciona a câmera inclinada sobre a mesa
    camera.position.set(0, 15, 25);
    camera.lookAt(0, -2, 0);
    
    p1Score = 0; p2Score = 0;
    document.getElementById('p1-score-txt').innerText = 0;
    document.getElementById('p2-score-txt').innerText = 0;
    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('winner-text').style.display = 'none';
    
    bX = 0; bZ = 0;
    bSpeedX = (Math.random() > 0.5 ? 0.3 : -0.3) * window.difficultyMultiplier;
    bSpeedZ = 0.2 * window.difficultyMultiplier;
    
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
    
    // Câmera volta para o menu
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

// Loop de Física do Pong
function updatePong3D() {
    if(!pongActive || pongShowingWin) return;

    // Mapeamento da mão (0 a 1) para o espaço 3D (Z vai de -9 a +9)
    // mão Y = 0 (topo) -> Z = -9. mão Y = 1 (fundo) -> Z = 9
    
    // Player 2 (Direita)
    let targetZ2 = (window.hand1Y - 0.5) * 20; 
    paddle2.position.z += (targetZ2 - paddle2.position.z) * 0.2;
    if(paddle2.position.z < -8) paddle2.position.z = -8;
    if(paddle2.position.z > 8) paddle2.position.z = 8;

    // Player 1 (Esquerda ou Máquina)
    if (window.playersMode === 2) {
        let targetZ1 = (window.hand2Y - 0.5) * 20;
        paddle1.position.z += (targetZ1 - paddle1.position.z) * 0.2;
    } else {
        // IA
        let speedIA = 0.3 * window.difficultyMultiplier;
        if(paddle1.position.z < bZ - 1) paddle1.position.z += speedIA;
        if(paddle1.position.z > bZ + 1) paddle1.position.z -= speedIA;
    }
    if(paddle1.position.z < -8) paddle1.position.z = -8;
    if(paddle1.position.z > 8) paddle1.position.z = 8;

    // Move Ball
    bX += bSpeedX;
    bZ += bSpeedZ;
    
    ball.position.set(bX, -1, bZ);

    // Colisão com as paredes de cima/baixo
    if (bZ < -9.5 || bZ > 9.5) {
        bSpeedZ = -bSpeedZ;
    }

    // Colisão Raquete 1 (Esquerda)
    if (bX < -17 && bX > -19) {
        if (Math.abs(bZ - paddle1.position.z) < 2.5) {
            bSpeedX = Math.abs(bSpeedX); // Rebate pra direita
            bSpeedZ += (bZ - paddle1.position.z) * 0.1; 
        }
    } else if (bX < -20) {
        p2Score++; resetPongBall3D();
    }

    // Colisão Raquete 2 (Direita)
    if (bX > 17 && bX < 19) {
        if (Math.abs(bZ - paddle2.position.z) < 2.5) {
            bSpeedX = -Math.abs(bSpeedX); // Rebate pra esquerda
            bSpeedZ += (bZ - paddle2.position.z) * 0.1;
        }
    } else if (bX > 20) {
        p1Score++; resetPongBall3D();
    }
}

// ==========================================
// RENDER LOOP PRINCIPAL
// ==========================================
camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    
    if (particlesMesh.visible) {
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
    }

    if (pongActive) {
        updatePong3D();
    }
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
