import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

// Oyun durumu
const gameState = {
  playerAlive: true,
  xp: 0,
  level: 1,
  gameTime: 0,
  messages: [],
  sloganCooldown: 0,
  umbrellaActive: false,
  umbrellaCooldown: 0,
  maskCooldown: 0,
  tweetCooldown: 0,
  mahmutUnlocked: false, // Mahmut karakteri için
  speedBonus: 0 // Mahmut hız bonusu
};

// Sahne, kamera ve render ayarları
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Açık mavi gökyüzü
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 0); // Göz seviyesi

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Işıklandırma
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(50, 100, 50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
sunLight.shadow.camera.left = -100;
sunLight.shadow.camera.right = 100;
sunLight.shadow.camera.top = 100;
sunLight.shadow.camera.bottom = -100;
scene.add(sunLight);

// Zemin oluşturma
const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xa0a0a0,
  roughness: 0.8 
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Saraçhane Meydanı objeleri
// Binalar
function createBuilding(width, height, depth, x, y, z, color, textureUrl = null) {
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  let buildingMaterial;
  
  if (textureUrl) {
    const texture = new THREE.TextureLoader().load(textureUrl);
    buildingMaterial = new THREE.MeshStandardMaterial({ 
      map: texture, 
      color: 0xffffff // Beyaz renk, doku rengini korur
    });
  } else {
    buildingMaterial = new THREE.MeshStandardMaterial({ color });
  }
  
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(x, y, z);
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);
  return building;
}
// İstanbul Belediye Sarayı/Saraçhane için özel bina oluştur
function createBelediyeBinasi() {
  const width = 40;
  const height = 30;
  const depth = 20;
  const x = -50;
  const y = 15;
  const z = -50;
  
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  
  // Ön yüze belediye binası dokusunu ekle
  const frontTexture = new THREE.TextureLoader().load('https://uploads.ibb.istanbul/uploads/sarachane_belediye_bina_a3009f318f.jpg');
  
  // Diğer yüzler için temel renk kullan
  const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xd3b17d });
  
  // Her yüz için malzeme dizisi oluştur [sağ, sol, üst, alt, ön, arka]
  const materials = [
    sideMaterial, // sağ
    sideMaterial, // sol
    sideMaterial, // üst
    sideMaterial, // alt
    new THREE.MeshStandardMaterial({ map: frontTexture }), // ön
    sideMaterial  // arka
  ];
  
  const building = new THREE.Mesh(buildingGeometry, materials);
  building.position.set(x, y, z);
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);
  
  return building;
}

// Belediye binasını oluştur
createBelediyeBinasi();

// Büyük tarihi bina
createBuilding(30, 25, 25, 50, 12.5, -40, 0x8b7d6b);
// Daha küçük binalar
createBuilding(15, 10, 15, -30, 5, 30, 0xc19a6b);
createBuilding(20, 15, 20, 70, 7.5, 20, 0xa0a0a0);

// Ağaçlar
function createTree(x, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 6);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 2, z);
  trunk.castShadow = true;
  scene.add(trunk);
  
  const leavesGeometry = new THREE.ConeGeometry(3, 6, 8);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2e8b57 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(x, 6, z);
  leaves.castShadow = true;
  scene.add(leaves);
}

// Ağaçları oluştur
createTree(-20, 10);
createTree(20, -15);
createTree(-15, -35);
createTree(35, 30);
createTree(0, 40);

// Barikatlar
function createBarricade(x, z, rotation = 0) {
  const barricadeGeometry = new THREE.BoxGeometry(5, 1.5, 1);
  const barricadeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const barricade = new THREE.Mesh(barricadeGeometry, barricadeMaterial);
  barricade.position.set(x, 0.75, z);
  barricade.rotation.y = rotation;
  barricade.castShadow = true;
  barricade.receiveShadow = true;
  scene.add(barricade);
  
  // Küçük taşlar ekleme
  for (let i = 0; i < 3; i++) {
    const stoneGeometry = new THREE.DodecahedronGeometry(0.5);
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    const offsetX = (Math.random() - 0.5) * 4;
    const offsetZ = (Math.random() - 0.5) * 2;
    stone.position.set(x + offsetX, 0.5, z + offsetZ);
    stone.castShadow = true;
    stone.receiveShadow = true;
    scene.add(stone);
  }
  
  return barricade;
}

// Barikatları oluştur
createBarricade(-10, 15, Math.PI / 4);
createBarricade(15, -10, -Math.PI / 6);
createBarricade(-25, -20, Math.PI / 3);
createBarricade(25, 25, -Math.PI / 2);

// Polis oluştur
const policeOfficers = [];

function createPoliceOfficer(x, z, patrolRadius = 0) {
  const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x000080 }); // Koyu mavi üniforma
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(x, 1, z);
  body.castShadow = true;
  scene.add(body);
  
  const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Ten rengi
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(x, 2.5, z);
  head.castShadow = true;
  scene.add(head);
  
  const helmetGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 8);
  const helmetMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Siyah kask
  const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
  helmet.position.set(x, 2.7, z);
  helmet.castShadow = true;
  scene.add(helmet);
  
  // Kalkan (opsiyonel)
  const shieldGeometry = new THREE.BoxGeometry(0.2, 1.5, 1);
  const shieldMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    transparent: true,
    opacity: 0.6
  });
  const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
  shield.position.set(x + 0.6, 1.5, z);
  shield.castShadow = true;
  scene.add(shield);
  
  // Polis nesnesini objeler grubu olarak dön
  const police = {
    body,
    head,
    helmet,
    shield,
    startPosition: { x, z },
    patrolRadius,
    patrolAngle: Math.random() * Math.PI * 2,
    patrolSpeed: 0.0005,
    detectionRange: 2.5, // Yakalama mesafesi eklendi
    update: function(deltaTime) {
      if (this.patrolRadius > 0) {
        this.patrolAngle += this.patrolSpeed * deltaTime;
        
        const newX = this.startPosition.x + Math.sin(this.patrolAngle) * this.patrolRadius;
        const newZ = this.startPosition.z + Math.cos(this.patrolAngle) * this.patrolRadius;
        
        // Gövdenin yönünü hareket yönüne çevir
        const angle = Math.atan2(
          newX - this.body.position.x,
          newZ - this.body.position.z
        );
        this.body.rotation.y = angle;
        this.head.rotation.y = angle;
        this.helmet.rotation.y = angle;
        this.shield.rotation.y = angle;
        
        // Pozisyonu güncelle
        this.body.position.x = newX;
        this.body.position.z = newZ;
        this.head.position.x = newX;
        this.head.position.z = newZ;
        this.helmet.position.x = newX;
        this.helmet.position.z = newZ;
        this.shield.position.x = newX + 0.6 * Math.sin(angle);
        this.shield.position.z = newZ + 0.6 * Math.cos(angle);
      }
      
      // Oyuncu ile çarpışma kontrolü
      const distance = Math.sqrt(
        Math.pow(this.body.position.x - controls.getObject().position.x, 2) +
        Math.pow(this.body.position.z - controls.getObject().position.z, 2)
      );
      
      if (distance < this.detectionRange) {
        // Oyuncu yakalandı
        return true;
      }
      return false;
    }
  };
  
  policeOfficers.push(police);
  return police;
}

// Polisleri oluştur - bazıları sabit, bazıları devriye geziyor
createPoliceOfficer(-20, -20);
createPoliceOfficer(20, -30);
createPoliceOfficer(30, 40);
createPoliceOfficer(-30, 30, 8); // Devriye gezen
createPoliceOfficer(10, 10, 12); // Devriye gezen
createPoliceOfficer(-10, -10, 15); // Devriye gezen

// TOMA aracı
const tomaGroup = new THREE.Group();
scene.add(tomaGroup);

const chassisGeometry = new THREE.BoxGeometry(5, 3, 8);
const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
chassis.position.y = 1.5;
chassis.castShadow = true;
tomaGroup.add(chassis);

const cabinGeometry = new THREE.BoxGeometry(4, 2.5, 3);
const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
cabin.position.set(0, 3.5, -2);
cabin.castShadow = true;
tomaGroup.add(cabin);

const cannonGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 8);
const cannonMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
cannon.position.set(0, 3, 2);
cannon.rotation.x = Math.PI / 2;
cannon.castShadow = true;
tomaGroup.add(cannon);

// TOMA'nın tekerlek fonksiyonu
function createWheel(x, z) {
  const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.position.set(x, 0.8, z);
  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  tomaGroup.add(wheel);
  return wheel;
}

// TOMA'nın tekerleklerini oluştur
const wheels = [
  createWheel(-2, -3),
  createWheel(2, -3),
  createWheel(-2, 3),
  createWheel(2, 3)
];

// TOMA'nın hareketi ve su püskürtme özellikleri
const toma = {
  group: tomaGroup,
  position: new THREE.Vector3(40, 0, 40),
  direction: new THREE.Vector3(1, 0, 0),
  speed: 0.003, // 1/10 oranında yavaşlatıldı
  rotationSpeed: 0.0005, // Dönüş hızı da yavaşlatıldı
  spraying: false,
  sprayTimeout: null,
  waterParticles: [],
  
  update: function(deltaTime) {
    // TOMA'nın rastgele hareketi
    if (Math.random() < 0.005) {
      this.direction.x = Math.random() - 0.5;
      this.direction.z = Math.random() - 0.5;
      this.direction.normalize();
    }
    
    // Rastgele su püskürtme (daha sık püskürtecek)
    if (!this.spraying && Math.random() < 0.02) {
      this.startSpraying();
    }
    
    // Pozisyonu güncelle
    this.position.x += this.direction.x * this.speed * deltaTime;
    this.position.z += this.direction.z * this.speed * deltaTime;
    
    // Sınırlar içinde tut
    if (Math.abs(this.position.x) > 480) {
      this.direction.x *= -1;
      this.position.x = Math.sign(this.position.x) * 480;
    }
    if (Math.abs(this.position.z) > 480) {
      this.direction.z *= -1;
      this.position.z = Math.sign(this.position.z) * 480;
    }
    
    // TOMA'nın yönünü hareket yönüne çevir
    const targetAngle = Math.atan2(this.direction.x, this.direction.z);
    let currentAngle = this.group.rotation.y;
    
    // Daha yumuşak dönüş için yumuşatma uygula
    const angleDiff = (targetAngle - currentAngle + Math.PI) % (Math.PI * 2) - Math.PI;
    currentAngle += angleDiff * this.rotationSpeed * deltaTime;
    this.group.rotation.y = currentAngle;
    
    // Grup pozisyonunu güncelle
    this.group.position.set(this.position.x, 0, this.position.z);
    
    // Su parçacıklarını güncelle
    if (this.spraying) {
      this.updateWaterSpray(deltaTime);
    }
  },
  
  startSpraying: function() {
    this.spraying = true;
    
    // 3 saniye sonra su püskürtmeyi durdur
    this.sprayTimeout = setTimeout(() => {
      this.spraying = false;
      // Su parçacıklarını temizle
      for (const particle of this.waterParticles) {
        scene.remove(particle);
      }
      this.waterParticles = [];
    }, 3000);
  },
  
  updateWaterSpray: function(deltaTime) {
    // Yeni su parçacıkları oluştur
    if (Math.random() < 1) {
      // Su parçacık geometrisi
      const waterGeometry = new THREE.SphereGeometry(0.6, 8, 8);
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7
      });
      const water = new THREE.Mesh(waterGeometry, waterMaterial);
      
      // Su parçacığının başlangıç pozisyonu (TOMA'nın topundan)
      const sprayStart = new THREE.Vector3(
        this.position.x + Math.sin(this.group.rotation.y) * 4,
        3,
        this.position.z + Math.cos(this.group.rotation.y) * 4
      );
      water.position.copy(sprayStart);
      
      // Su parçacığına rastgele hız ver (TOMA'nın bakış yönünde)
      const velocity = new THREE.Vector3(
        Math.sin(this.group.rotation.y) + (Math.random() - 0.5) * 0.5,
        0.1,
        Math.cos(this.group.rotation.y) + (Math.random() - 0.5) * 0.5
      );
      velocity.normalize().multiplyScalar(0.3);
      
      water.velocity = velocity;
      water.lifetime = 100; // Parçacık ömrü
      
      scene.add(water);
      this.waterParticles.push(water);
    }
    
    // Mevcut su parçacıklarını güncelle
    for (let i = this.waterParticles.length - 1; i >= 0; i--) {
      const particle = this.waterParticles[i];
      
      // Parçacık pozisyonunu güncelle
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
      
      // Parçacık ömrünü azalt
      particle.lifetime -= deltaTime;
      
      // Oyuncu ile çarpışma kontrolü
      const distance = particle.position.distanceTo(controls.getObject().position);
      if (distance < 1.5) {
        // Şemsiye aktifse su etki etmez
        if (!gameState.umbrellaActive) {
          // Su çarptı - oyuncuya güç uygula
          velocity.x = particle.velocity.x * 5;
          velocity.z = particle.velocity.z * 5;
          
          gameState.messages.push({
            text: "TOMA suyu sana çarptı!",
            time: 100,
            color: '#00ffff'
          });
        } else {
          // Şemsiye aktifse mesaj göster
          if (Math.random() < 0.1) { // Çok fazla mesaj göstermesin
            gameState.messages.push({
              text: "Şemsiye seni TOMA suyundan korudu!",
              time: 50,
              color: '#00ffff'
            });
          }
        }
        
        // Parçacığı temizle
        scene.remove(particle);
        this.waterParticles.splice(i, 1);
        continue;
      }
      
      // Ömrü biten parçacıkları temizle
      if (particle.lifetime <= 0 || particle.position.y < 0) {
        scene.remove(particle);
        this.waterParticles.splice(i, 1);
      }
    }
  }
};

// Oyuncu kontrolleri
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Tıklama ile kontrolleri etkinleştir
let controlsEnabled = false;
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function() {
  controls.lock();
});

controls.addEventListener('lock', function() {
  instructions.style.display = 'none';
  blocker.style.display = 'none';
  controlsEnabled = true;
});

controls.addEventListener('unlock', function() {
  blocker.style.display = 'block';
  instructions.style.display = '';
  controlsEnabled = false;
});

// Hareket kontrolü
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isRunning = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

document.addEventListener('keydown', function(event) {
  switch (event.code) {
    case 'KeyW':
      moveForward = true;
      break;
    case 'KeyA':
      moveLeft = true;
      break;
    case 'KeyS':
      moveBackward = true;
      break;
    case 'KeyD':
      moveRight = true;
      break;
    case 'ShiftLeft':
      isRunning = true;
      break;
    case 'KeyQ':
      // Slogan atma
      if (gameState.sloganCooldown <= 0) {
        showSlogan();
        gameState.sloganCooldown = 200; // 2 saniyelik cooldown
      }
      break;
    case 'Digit1':
    case 'Numpad1':
      // Şemsiye kısa yolu
      if (!gameState.umbrellaCooldown) {
        document.getElementById('umbrella-button').click();
      }
      break;
    case 'Digit2':  
    case 'Numpad2':
      // Maske kısa yolu
      if (!gameState.maskCooldown) {
        document.getElementById('mask-button').click();
      }
      break;
    case 'Digit3':
    case 'Numpad3':
      // Tweet kısa yolu
      if (!gameState.tweetCooldown) {
        document.getElementById('tweet-button').click();
      }
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.code) {
    case 'KeyW':
      moveForward = false;
      break;
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyS':
      moveBackward = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
    case 'ShiftLeft':
      isRunning = false;
      break;
  }
});

// Slogan gösterme
function showSlogan() {
  const slogans = [
    "Söz hakkı bizde!",
    "Direniş kazanacak!",
    "Her yer direniş her yer umut!",
    "Özgürlük istiyoruz!",
    "Dayanışma yaşatır!"
  ];
  
  const slogan = slogans[Math.floor(Math.random() * slogans.length)];
  
  // Slogan mesajını ekle
  gameState.messages.push({
    text: slogan,
    time: 200, // 2 saniye göster
    color: '#ffffff'
  });
  
  // XP kazanma
  gameState.xp += 5;
  checkLevelUp();
}

// Yakalanma durumu
function playerCaught() {
  gameState.messages.push({
    text: "Yakalandın! 1 günlüğüne gözaltındasın.",
    time: 1000,
    color: '#ff0000'
  });
  
  gameState.playerAlive = false;
  
  // 3 saniye sonra oyunu yeniden başlat
  setTimeout(() => {
    resetGame();
  }, 3000);
}

// Oyunu resetleme
function resetGame() {
  // Oyuncuyu merkeze geri getir
  controls.getObject().position.set(0, 2, 0);
  
  // Hızı sıfırla
  velocity.set(0, 0, 0);
  
  // Oyun durumunu sıfırla (XP ve level korunur)
  gameState.playerAlive = true;
  gameState.messages = [];
}

// Level sistemi
function checkLevelUp() {
  const nextLevel = Math.floor(gameState.xp / 100) + 1;
  
  if (nextLevel > gameState.level) {
    gameState.level = nextLevel;
    gameState.messages.push({
      text: `Seviye ${gameState.level}'e yükseldin!`,
      time: 300,
      color: '#ffff00'
    });
  }
}

// UI öğelerini oluştur
function createUI() {
  const uiContainer = document.createElement('div');
  uiContainer.style.position = 'absolute';
  uiContainer.style.bottom = '20px';
  uiContainer.style.left = '20px';
  uiContainer.style.color = 'white';
  uiContainer.style.fontFamily = 'Arial, sans-serif';
  uiContainer.style.fontSize = '16px';
  uiContainer.style.textShadow = '1px 1px 2px black';
  uiContainer.id = 'game-ui';
  
  const xpElement = document.createElement('div');
  xpElement.id = 'xp-display';
  uiContainer.appendChild(xpElement);
  
  const levelElement = document.createElement('div');
  levelElement.id = 'level-display';
  uiContainer.appendChild(levelElement);
  
  const timeElement = document.createElement('div');
  timeElement.id = 'time-display';
  uiContainer.appendChild(timeElement);
  
  document.body.appendChild(uiContainer);
  
  // Mesaj gösterimi için element
  const messagesContainer = document.createElement('div');
  messagesContainer.style.position = 'absolute';
  messagesContainer.style.top = '50%';
  messagesContainer.style.left = '50%';
  messagesContainer.style.transform = 'translate(-50%, -50%)';
  messagesContainer.style.textAlign = 'center';
  messagesContainer.style.fontSize = '24px';
  messagesContainer.style.fontWeight = 'bold';
  messagesContainer.style.fontFamily = 'Arial, sans-serif';
  messagesContainer.style.textShadow = '0 0 3px black';
  messagesContainer.id = 'messages';
  
  document.body.appendChild(messagesContainer);
  
  // Araçlar için butonlar
  const toolsContainer = document.createElement('div');
  toolsContainer.style.position = 'absolute';
  toolsContainer.style.bottom = '20px';
  toolsContainer.style.right = '20px';
  toolsContainer.style.display = 'flex';
  toolsContainer.style.gap = '10px';
  toolsContainer.id = 'tools';
  
  const createToolButton = (emoji, name, shortcut, id) => {
    const button = document.createElement('button');
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.fontSize = '24px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#333';
    button.style.color = 'white';
    button.style.border = '2px solid #555';
    button.style.cursor = 'pointer';
    button.style.position = 'relative';
    button.id = id;
    
    // Emoji ve kısa yol tuşu gösterimi
    const emojiSpan = document.createElement('span');
    emojiSpan.innerHTML = emoji;
    button.appendChild(emojiSpan);
    
    // Kısa yol tuşu etiketi
    const shortcutLabel = document.createElement('div');
    shortcutLabel.style.position = 'absolute';
    shortcutLabel.style.bottom = '2px';
    shortcutLabel.style.right = '2px';
    shortcutLabel.style.fontSize = '11px';
    shortcutLabel.style.backgroundColor = '#555';
    shortcutLabel.style.padding = '1px 4px';
    shortcutLabel.style.borderRadius = '3px';
    shortcutLabel.textContent = shortcut;
    button.appendChild(shortcutLabel);
    
    button.title = name;
    button.disabled = false;
    
    button.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#555';
    });
    
    button.addEventListener('mouseout', function() {
      if (!this.classList.contains('active')) {
        this.style.backgroundColor = '#333';
      }
    });
    
    return button;
