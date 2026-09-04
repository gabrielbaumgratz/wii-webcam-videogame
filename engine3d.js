// ==========================================
// MOTOR 3D PRINCIPAL (Three.js) - GREEN EDITION
// ==========================================
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a2e12, 0.025); // Deep Green Fog

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a2e12, 1); // Fundo verde escuro
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// ==========================================
// AMBIENTE DO MENU (Partículas Cyber Green)
// ==========================================
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 400; // Mais partículas
const posArray = new Float32Array(particlesCount * 3);
for(let i=0; i < particlesCount*3; i++){
    posArray[i] = (Math.random() - 0.5) * 120;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.6,
    color: 0x37b24d, // Neon Green
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// Grade estilo Ciberespaço animada
const gridHelper = new THREE.GridHelper(300, 80, 0x37b24d, 0x0a2e12);
gridHelper.position.y = -15;
gridHelper.material.opacity = 0.4;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Segundo grid giratório pra dar sensação de profundidade e complexidade
const gridHelper2 = new THREE.GridHelper(200, 40, 0xAFED91, 0x37b24d);
gridHelper2.position.set(0, 40, -50);
gridHelper2.rotation.x = Math.PI / 2;
gridHelper2.material.opacity = 0.15;
gridHelper2.material.transparent = true;
scene.add(gridHelper2);

// ==========================================
// AMBIENTE DO PONG 3D
// ==========================================
const pongGroup = new THREE.Group();
pongGroup.visible = false;
scene.add(pongGroup);

// Mesa
const tableGeo = new THREE.BoxGeometry(40, 1, 20);
const tableMat = new THREE.MeshPhongMaterial({ color: 0x0a2e12, transparent: true, opacity: 0.9 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -2;
pongGroup.add(table);

// Bordas brilhantes
const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(tableGeo),
    new THREE.LineBasicMaterial({ color: 0xAFED91, linewidth: 3 })
);
table.add(edges);

// Raquetes
const paddleGeo = new THREE.BoxGeometry(1.5, 2.5, 4.5); // Raquetes um pouco maiores
const p1Mat = new THREE.MeshPhongMaterial({ color: 0xAFED91, emissive: 0xAFED91, emissiveIntensity: 0.8 }); // Green
const p2Mat = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, emissive: 0xAAAAAA, emissiveIntensity: 0.5 }); // White

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
    gridHelper2.visible = false;
    
    camera.position.set(0, 18, 28);
    camera.lookAt(0, -2, 0);
    
    p1Score = 0; p2Score = 0;
    document.getElementById('p1-score-txt').innerText = 0;
    document.getElementById('p2-score-txt').innerText = 0;
    document.getElementById('score-board').style.display = 'flex';
    document.getElementById('winner-text').style.display = 'none';
    
    bX = 0; bZ = 0;
    
    // Extremo é muito rápido!
    let baseSpeed = window.difficultyMultiplier >= 3 ? 0.6 : 0.4;
    
    bSpeedX = (Math.random() > 0.5 ? baseSpeed : -baseSpeed) * (window.difficultyMultiplier > 1 ? 1.5 : 1);
    bSpeedZ = (Math.random() > 0.5 ? 0.2 : -0.2) * window.difficultyMultiplier;
    
    pongActive = true;
    pongShowingWin = false;
}

function stopPong3D() {
    pongActive = false;
    pongGroup.visible = false;
    particlesMesh.visible = true;
    gridHelper.visible = true;
    gridHelper2.visible = true;
    
    document.getElementById('score-board').style.display = 'none';
    document.getElementById('winner-text').style.display = 'none';
    
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
}

function updatePong3D() {
    if(!pongActive || pongShowingWin) return;

    let targetZ2 = (window.hand1Y - 0.5) * 20; 
    paddle2.position.z += (targetZ2 - paddle2.position.z) * 0.3; // Resposta mais rápida
    if(paddle2.position.z < -8.5) paddle2.position.z = -8.5;
    if(paddle2.position.z > 8.5) paddle2.position.z = 8.5;

    if (window.playersMode === 2) {
        let targetZ1 = (window.hand2Y - 0.5) * 20;
        paddle1.position.z += (targetZ1 - paddle1.position.z) * 0.3;
    } else {
        // Velocidade da IA escala com a dificuldade
        let speedIA = 0.25 * window.difficultyMultiplier;
        if (window.difficultyMultiplier >= 3) speedIA = 0.8; // Bot hardcore
        
        if(paddle1.position.z < bZ - 1) paddle1.position.z += speedIA;
        if(paddle1.position.z > bZ + 1) paddle1.position.z -= speedIA;
    }
    if(paddle1.position.z < -8.5) paddle1.position.z = -8.5;
    if(paddle1.position.z > 8.5) paddle1.position.z = 8.5;

    bX += bSpeedX;
    bZ += bSpeedZ;
    
    ball.position.set(bX, -1, bZ);

    if (bZ < -9.5 || bZ > 9.5) bSpeedZ = -bSpeedZ;

    if (bX < -16.5 && bX > -19) {
        if (Math.abs(bZ - paddle1.position.z) < 3.0) {
            bSpeedX = Math.abs(bSpeedX); 
            bSpeedZ += (bZ - paddle1.position.z) * 0.15; 
        }
    } else if (bX < -20) {
        p2Score++; resetPongBall3D();
    }

    if (bX > 16.5 && bX < 19) {
        if (Math.abs(bZ - paddle2.position.z) < 3.0) {
            bSpeedX = -Math.abs(bSpeedX); 
            bSpeedZ += (bZ - paddle2.position.z) * 0.15;
        }
    } else if (bX > 20) {
        p1Score++; resetPongBall3D();
    }
}

// ==========================================
// RENDER LOOP
// ==========================================
camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    
    if (particlesMesh.visible) {
        particlesMesh.rotation.y += 0.002; // Um pouco mais rápido
        particlesMesh.rotation.x += 0.001;
        
        // Mover as grids para efeito de velocidade
        gridHelper.position.z = (gridHelper.position.z + 0.1) % 10;
        gridHelper2.rotation.z += 0.001;
    }

    if (pongActive) updatePong3D();
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
