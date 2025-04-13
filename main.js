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
  speedBonus: 0, // Mahmut hız bonusu
  characterType: 'normal' // Varsayılan karakter tipi (normal, pikachu, female)
};

// Karakter seçim ekranı
function createCharacterSelectionScreen() {
  // Karakter seçim ekranını oluştur
  const selectionScreen = document.createElement('div');
  selectionScreen.id = 'character-selection';
  selectionScreen.style.position = 'absolute';
  selectionScreen.style.top = '0';
  selectionScreen.style.left = '0';
  selectionScreen.style.width = '100%';
  selectionScreen.style.height = '100%';
  selectionScreen.style.backgroundColor = 'rgba(0,0,0,0.8)';
  selectionScreen.style.display = 'flex';
  selectionScreen.style.flexDirection = 'column';
  selectionScreen.style.justifyContent = 'center';
  selectionScreen.style.alignItems = 'center';
  selectionScreen.style.color = 'white';
  selectionScreen.style.zIndex = '1000';
  selectionScreen.style.fontFamily = 'Arial, sans-serif';
  
  // Başlık ekle
  const title = document.createElement('h1');
  title.textContent = 'diren.io - Karakter Seç';
  title.style.fontSize = '36px';
  title.style.marginBottom = '40px';
  title.style.color = '#ff3333';
  selectionScreen.appendChild(title);
  
  // Karakter seçenekleri konteyneri
  const charactersContainer = document.createElement('div');
  charactersContainer.style.display = 'flex';
  charactersContainer.style.gap = '40px';
  charactersContainer.style.justifyContent = 'center';
  charactersContainer.style.marginBottom = '40px';
  
  // Karakter seçeneği oluşturma fonksiyonu
  const createCharacterOption = (name, image, charType, description) => {
    const charDiv = document.createElement('div');
    charDiv.style.display = 'flex';
    charDiv.style.flexDirection = 'column';
    charDiv.style.alignItems = 'center';
    charDiv.style.width = '200px';
    charDiv.style.cursor = 'pointer';
    charDiv.style.padding = '15px';
    charDiv.style.border = '2px solid #444';
    charDiv.style.borderRadius = '10px';
    charDiv.style.transition = 'all 0.3s ease';
    
    // Karakterin resmi
    const charImg = document.createElement('div');
    charImg.style.width = '150px';
    charImg.style.height = '150px';
    charImg.style.backgroundColor = '#333';
    charImg.style.borderRadius = '10px';
    charImg.style.marginBottom = '15px';
    charImg.style.display = 'flex';
    charImg.style.justifyContent = 'center';
    charImg.style.alignItems = 'center';
    charImg.style.fontSize = '80px';
    charImg.innerHTML = image; // Emoji ya da HTML
    charDiv.appendChild(charImg);
    
    // Karakter ismi
    const charName = document.createElement('h3');
    charName.textContent = name;
    charName.style.margin = '0 0 5px 0';
    charDiv.appendChild(charName);
    
    // Karakter açıklaması
    const charDesc = document.createElement('p');
    charDesc.textContent = description;
    charDesc.style.fontSize = '14px';
    charDesc.style.color = '#aaa';
    charDesc.style.textAlign = 'center';
    charDesc.style.margin = '0';
    charDiv.appendChild(charDesc);
    
    // Tıklama olayı
    charDiv.addEventListener('click', () => {
      // Tüm seçeneklerin vurgusunu kaldır
      document.querySelectorAll('#character-selection > div > div').forEach(el => {
        el.style.border = '2px solid #444';
        el.style.backgroundColor = 'transparent';
      });
      
      // Seçilen karakteri vurgula
      charDiv.style.border = '2px solid #ff3333';
      charDiv.style.backgroundColor = 'rgba(255,50,50,0.2)';
      
      // Karakter tipini kaydet
      gameState.characterType = charType;
    });
    
    // Hover efekti
    charDiv.addEventListener('mouseover', () => {
      if (gameState.characterType !== charType) {
        charDiv.style.backgroundColor = 'rgba(255,255,255,0.1)';
      }
    });
    
    charDiv.addEventListener('mouseout', () => {
      if (gameState.characterType !== charType) {
        charDiv.style.backgroundColor = 'transparent';
      }
    });
    
    return charDiv;
  };
  
  // Karakter seçenekleri
  const normalChar = createCharacterOption(
    'Normal Protestocu', 
    '👤', 
    'normal',
    'Standart karakter. Dengeli hız ve dayanıklılık.'
  );
  
  const pikachuChar = createCharacterOption(
    'Pikachu', 
    '⚡', 
    'pikachu',
    'Daha hızlı ve büyük, ama polisler tarafından daha kolay fark edilir.'
  );
  
  const femaleChar = createCharacterOption(
    'Kadın Protestocu', 
    '👩', 
    'female',
    'Daha çevik ve küçük, daha zor yakalanır.'
  );
  
  // Karakterleri konteynere ekle
  charactersContainer.appendChild(normalChar);
  charactersContainer.appendChild(pikachuChar);
  charactersContainer.appendChild(femaleChar);
  selectionScreen.appendChild(charactersContainer);
  
  // Başlat butonu
  const startButton = document.createElement('button');
  startButton.textContent = 'Direnişe Başla!';
  startButton.style.padding = '15px 30px';
  startButton.style.fontSize = '18px';
  startButton.style.backgroundColor = '#ff3333';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '5px';
  startButton.style.cursor = 'pointer';
  startButton.style.marginTop = '20px';
  
  startButton.addEventListener('mouseover', () => {
    startButton.style.backgroundColor = '#ff5555';
  });
  
  startButton.addEventListener('mouseout', () => {
    startButton.style.backgroundColor = '#ff3333';
  });
  
  startButton.addEventListener('click', () => {
    // Karakter seçim ekranını kaldır
    selectionScreen.style.display = 'none';
    
    // Oyunu başlat
    initGame();
  });
  
  selectionScreen.appendChild(startButton);
  
  // Sayfaya ekle
  document.body.appendChild(selectionScreen);
}

// Sahne, kamera ve render ayarları
let scene, camera, renderer, controls;
let ground;
const obstacles = []; // Engeller (barikatlar, binalar vs.)
const policeOfficers = []; // Polis karakterleri
const tomaVehicles = []; // TOMA araçları

// Oyunu başlat
function initGame() {
  // Sahne oluştur
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Açık mavi gökyüzü
  
  // Kamera oluştur
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 0); // Göz seviyesi
  
  // Renderer oluştur
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  
  // Işıklandırma
  setupLighting();
  
  // Oyun elemanlarını oluştur
  createEnvironment();
  
  // Kontrolleri oluştur
  setupControls();
  
  // UI oluştur
  createUI();
  
  // Seçilen karaktere göre kamera ayarlarını güncelle
  updateCharacterSettings();
  
  // Oyun döngüsü
  animate();
}

// Karaktere göre ayarları güncelle
function updateCharacterSettings() {
  switch(gameState.characterType) {
    case 'pikachu':
      camera.position.y = 3; // Daha yüksek göz seviyesi
      gameState.speedBonus = 10; // Hız bonusu
      // Polislerin algılama mesafesini artır
      policeOfficers.forEach(police => {
        police.detectionRange = 3.5; // Daha uzak mesafeden yakalanır
      });
      break;
    
    case 'female':
      camera.position.y = 1.7; // Daha alçak göz seviyesi
      // Polislerin algılama mesafesini azalt
      policeOfficers.forEach(police => {
        police.detectionRange = 2.0; // Daha zor yakalanır
      });
      break;
      
    case 'normal':
    default:
      camera.position.y = 2; // Standart göz seviyesi
      break;
  }
}

// Işıklandırma sistemi
function setupLighting() {
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
}

// Çevre elemanlarını oluştur
function createEnvironment() {
  // Zemin oluşturma
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xa0a0a0,
    roughness: 0.8 
  });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Harita sınırındaki ağaçları oluştur
  createBorderTrees();
  
  // Binaları oluştur
  createBuildings();
  
  // Barikatları oluştur
  createBarricades();
  
  // Poisleri oluştur
  createPoliceOfficers();
  
  // TOMA araçları oluştur
  createTomaVehicles();
}

// Harita sınırındaki ağaçları oluştur
function createBorderTrees() {
  // Harita kenarlarına ağaçlar diz
  const mapSize = 490; // Harita kenarı boyutu
  const treeSpacing = 15; // Ağaçlar arası mesafe
  
  // Ağaç oluşturma fonksiyonu
  function createBorderTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.7, 1, 6, 6);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 3, z);
    trunk.castShadow = true;
    scene.add(trunk);
    
    const leavesGeometry = new THREE.SphereGeometry(4, 8, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2e8b57 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(x, 8, z);
    leaves.castShadow = true;
    scene.add(leaves);
    
    // Çarpışma kontrolü için
    const treeCollider = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 10, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    treeCollider.position.set(x, 5, z);
    scene.add(treeCollider);
    obstacles.push(treeCollider);
  }
  
  // Üst kenar
  for (let x = -mapSize; x <= mapSize; x += treeSpacing) {
    createBorderTree(x, -mapSize);
  }
  
  // Alt kenar
  for (let x = -mapSize; x <= mapSize; x += treeSpacing) {
    createBorderTree(x, mapSize);
  }
  
  // Sol kenar
  for (let z = -mapSize + treeSpacing; z < mapSize; z += treeSpacing) {
    createBorderTree(-mapSize, z);
  }
  
  // Sağ kenar
  for (let z = -mapSize + treeSpacing; z < mapSize; z += treeSpacing) {
    createBorderTree(mapSize, z);
  }
}

// Binaları oluştur
function createBuildings() {
  // Bina dokuları
  const buildingTextures = [
    'https://uploads.ibb.istanbul/uploads/sarachane_belediye_bina_a3009f318f.jpg',
    'https://uploads.ibb.istanbul/uploads/tarihi_bina.jpg',
    'https://uploads.ibb.istanbul/uploads/modern_bina.jpg',
    'https://uploads.ibb.istanbul/uploads/ofis_binasi.jpg'
  ];
  
  // Bina oluşturma fonksiyonu
  function createBuilding(width, height, depth, x, y, z, textureUrl) {
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    
    // Dokuyu yükle
    const texture = new THREE.TextureLoader().load(textureUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    // Bina materyali
    const buildingMaterial = new THREE.MeshStandardMaterial({ 
      map: texture,
      roughness: 0.7
    });
    
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y, z);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);
    
    // Çarpışma kutusu
    obstacles.push(building);
    
    return building;
  }
  
  // İstanbul Belediye Sarayı (Saraçhane)
  const belediyeBinasi = createBuilding(
    40, 30, 20, 
    -50, 15, -50, 
    buildingTextures[0]
  );
  
  // Tarihi bina
  const tarihibina = createBuilding(
    30, 25, 25, 
    50, 12.5, -40, 
    buildingTextures[1]
  );
  
  // Küçük binalar
  createBuilding(15, 10, 15, -30, 5, 30, buildingTextures[2]);
  createBuilding(20, 15, 20, 70, 7.5, 20, buildingTextures[3]);
  
  // Her binanın önüne çevik kuvvet ve TOMA yerleştir
  placeRiotPoliceAroundBuilding(belediyeBinasi);
  placeRiotPoliceAroundBuilding(tarihibina);
}

// Çevik kuvvet polislerini bina etrafına yerleştir
function placeRiotPoliceAroundBuilding(building) {
  const position = building.position.clone();
  const width = building.geometry.parameters.width;
  const depth = building.geometry.parameters.depth;
  
  // Binanın önüne çevik kuvvet dizisi yerleştir
  const riotCount = 30; // Bina başına 30 çevik kuvvet
  const spacing = 1.5; // Aralarındaki mesafe
  
  // Binanın önüne tek sıra halinde dizilim
  const startX = position.x - width / 2;
  const endX = position.x + width / 2;
  const z = position.z + depth / 2 + 3; // Binanın önünden 3 birim ileri
  
  const step = (endX - startX) / (riotCount / 3);
  
  // İlk sıra
  for (let i = 0; i < riotCount / 3; i++) {
    const x = startX + i * step;
    createRiotPolice(x, z);
  }
  
  // İkinci sıra
  for (let i = 0; i < riotCount / 3; i++) {
    const x = startX + i * step;
    createRiotPolice(x, z + spacing);
  }
  
  // Üçüncü sıra
  for (let i = 0; i < riotCount / 3; i++) {
    const x = startX + i * step;
    createRiotPolice(x, z + spacing * 2);
  }
  
  // Bina önüne 2 TOMA yerleştir
  createToma(position.x - width / 3, position.z + depth / 2 + 8);
  createToma(position.x + width / 3, position.z + depth / 2 + 8);
}

// Çevik kuvvet polisi oluştur
function createRiotPolice(x, z) {
  const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 8);
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
  
  // Kalkan (daha büyük ve daha şeffaf)
  const shieldGeometry = new THREE.BoxGeometry(1.2, 2, 0.1);
  const shieldMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    transparent: true,
    opacity: 0.3
  });
  const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
  shield.position.set(x, 1.6, z - 0.5); // Önünde tutuyor
  shield.castShadow = true;
  scene.add(shield);
  
  // Çevik kuvvet nesnesi
  const riotPolice = {
    body,
    head,
    helmet,
    shield,
    position: new THREE.Vector3(x, 0, z),
    pushbackRadius: 3, // İtme mesafesi
    pushbackStrength: 0.2, // İtme gücü
    
    update: function(deltaTime) {
      // Oyuncu ile arasındaki mesafeyi hesapla
      const playerPos = controls.getObject().position;
      const distance = Math.sqrt(
        Math.pow(this.position.x - playerPos.x, 2) +
        Math.pow(this.position.z - playerPos.z, 2)
      );
      
      // Oyuncu yakınsa geri it
      if (distance < this.pushbackRadius) {
        // İtme yönü
        const pushDir = new THREE.Vector3(
          playerPos.x - this.position.x,
          0,
          playerPos.z - this.position.z
        ).normalize();
        
        // İtme gücü (mesafe azaldıkça artar)
        const strength = this.pushbackStrength * (1 - distance / this.pushbackRadius);
        
        // Oyuncuya itme uygula
        velocity.x += pushDir.x * strength * deltaTime * 50;
        velocity.z += pushDir.z * strength * deltaTime * 50;
        
        // İtme mesajı göster (çok sık olmasın)
        if (Math.random() < 0.05) {
          gameState.messages.push({
            text: "Çevik kuvvet seni geri itiyor!",
            time: 50,
            color: '#ffaa00'
          });
        }
        
        return true; // İtme uygulandığını bildir
      }
      
      return false;
    }
  };
  
  policeOfficers.push(riotPolice);
  return riotPolice;
}

// Barikat oluştur
function createBarricades() {
  // Daha fazla barikat ekle
  const barricadePositions = [
    { x: -10, z: 15, rotation: Math.PI / 4 },
    { x: 15, z: -10, rotation: -Math.PI / 6 },
    { x: -25, z: -20, rotation: Math.PI / 3 },
    { x: 25, z: 25, rotation: -Math.PI / 2 },
    // Yeni barikatlar
    { x: 0, z: 0, rotation: 0 },
    { x: -30, z: -40, rotation: Math.PI / 5 },
    { x: 40, z: 30, rotation: -Math.PI / 3 },
    { x: -50, z: 20, rotation: Math.PI / 2 },
    { x: 60, z: -25, rotation: 0 },
    { x: -20, z: 50, rotation: -Math.PI / 4 }
  ];
  
  barricadePositions.forEach(pos => {
    createBarricade(pos.x, pos.z, pos.rotation);
  });
}

// Barikat oluşturma fonksiyonu
function createBarricade(x, z, rotation = 0) {
  const barricadeGeometry = new THREE.BoxGeometry(5, 1.5, 1);
  const barricadeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const barricade = new THREE.Mesh(barricadeGeometry, barricadeMaterial);
  barricade.position.set(x, 0.75, z);
  barricade.rotation.y = rotation;
  barricade.castShadow = true;
  barricade.receiveShadow = true;
  scene.add(barricade);
  
  // Çarpışma kontrolü için barikatı engeller listesine ekle
  obstacles.push(barricade);
  
  // Küçük taşlar ekleme
  for (let i = 0; i < 5; i++) {
    const stoneGeometry = new THREE.DodecahedronGeometry(0.5);
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    const offsetX = (Math.random() - 0.5) * 4;
    const offsetZ = (Math.random() - 0.5) * 2;
    stone.position.set(x + offsetX, 0.5, z + offsetZ);
    stone.castShadow = true;
    stone.receiveShadow = true;
    scene.add(stone);
    
    // Küçük taşları da engellere ekle
    obstacles.push(stone);
  }
  
  return barricade;
}

// Ağaç oluşturma
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
  
  // Ağaç gövdesi için çarpışma silindir ekle
  const treeCollider = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 4, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  treeCollider.position.set(x, 2, z);
  scene.add(treeCollider);
  obstacles.push(treeCollider);
}

// Normal polis memurları oluştur
function createPoliceOfficers() {
  // Devriye gezen polisler
  createPoliceOfficer(-20, -20);
  createPoliceOfficer(20, -30);
  createPoliceOfficer(30, 40);
  createPoliceOfficer(-30, 30, 8); // Devriye gezen
  createPoliceOfficer(10, 10, 12); // Devriye gezen
  createPoliceOfficer(-10, -10, 15); // Devriye gezen
  
  // Daha fazla polis
  createPoliceOfficer(-40, 15, 10);
  createPoliceOfficer(40, -15, 10);
}

// Normal polis oluşturma
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
  
  // Kalkan
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
    detectionRange: 2.5, // Yakalama mesafesi
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

// TOMA araçları oluştur
function createTomaVehicles() {
  // Ana TOMA'yı haritanın merkezine yakın bir yere yerleştir
  createToma(40, 40);
}

// TOMA aracı oluştur
function createToma(x, z) {
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

  // TOMA'nın tekerleklerini oluştur
  const wheels = [
    createWheel(tomaGroup, -2, -3),
    createWheel(tomaGroup, 2, -3),
    createWheel(tomaGroup, -2, 3),
    createWheel(tomaGroup, 2, 3)
  ];
  
  // TOMA'yı engeller listesine ekle
  const tomaCollider = new THREE.Mesh(
    new THREE.BoxGeometry(5, 3, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  tomaCollider.position.set(x, 1.5, z);
  scene.add(tomaCollider);
  obstacles.push(tomaCollider);

  // TOMA nesnesi
  const toma = {
    group: tomaGroup,
    collider: tomaCollider,
    position: new THREE.Vector3(x, 0, z),
    direction: new THREE.Vector3(1, 0, 0),
    speed: 0.003,
    rotationSpeed: 0.0005,
    spraying: false,
    sprayTimeout: null,
    waterParticles: [],
    detectionRadius: 15, // Oyuncuyu algılama mesafesi
    
    update: function(deltaTime) {
      // Oyuncuya mesafe hesapla
      const playerPos = controls.getObject().position;
      const distanceToPlayer = Math.sqrt(
        Math.pow(this.position.x - playerPos.x, 2) +
        Math.pow(this.position.z - playerPos.z, 2)
      );
      
      // Oyuncu yakınsa ve su püskürtmüyorsa, su püskürtmeye başla
      if (distanceToPlayer < this.detectionRadius && !this.spraying) {
        // TOMA'yı oyuncuya doğru yönlendir
        const targetDirection = new THREE.Vector3(
          playerPos.x - this.position.x,
          0,
          playerPos.z - this.position.z
        ).normalize();
        
        this.direction.lerp(targetDirection, 0.05);
        this.startSpraying();
      }
      
      // Hareketi güncelle (sabit TOMA'lar sadece dönebilir)
      // Yönü hareket yönüne çevir
      const targetAngle = Math.atan2(this.direction.x, this.direction.z);
      let currentAngle = this.group.rotation.y;
      
      // Daha yumuşak dönüş için yumuşatma uygula
      const angleDiff = (targetAngle - currentAngle + Math.PI) % (Math.PI * 2) - Math.PI;
      currentAngle += angleDiff * this.rotationSpeed * deltaTime;
      this.group.rotation.y = currentAngle;
      
      // Grup pozisyonunu güncelle
      this.group.position.set(this.position.x, 0, this.position.z);
      this.collider.position.set(this.position.x, 1.5, this.position.z);
      this.collider.rotation.y = currentAngle;
      
      // Su parçacıklarını güncelle
      if (this.spraying) {
        this.updateWaterSpray(deltaTime);
      }
    },
    
    startSpraying: function() {
      if (this.spraying) return;
      
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
      if (Math.random() < 0.7) { // Daha sık su parçacıkları
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
        
        // Su parçacığına hız ver (TOMA'nın bakış yönünde)
        const velocity = new THREE.Vector3(
          Math.sin(this.group.rotation.y),
          0.1,
          Math.cos(this.group.rotation.y)
        );
        velocity.normalize().multiplyScalar(0.5); // Daha hızlı su
        
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
        const playerPos = controls.getObject().position;
        const distance = Math.sqrt(
          Math.pow(particle.position.x - playerPos.x, 2) +
          Math.pow(particle.position.y - playerPos.y, 2) +
          Math.pow(particle.position.z - playerPos.z, 2)
        );
        
        if (distance < 1.5) {
          // Şemsiye aktifse su etki etmez
          if (!gameState.umbrellaActive) {
            // Su çarptı - oyuncuya güç uygula
            const pushDir = new THREE.Vector3(
              playerPos.x - this.position.x,
              0,
              playerPos.z - this.position.z
            ).normalize();
            
            // Oyuncuyu TOMA'dan uzaklaştır
            velocity.x += pushDir.x * 2;
            velocity.z += pushDir.z * 2;
            
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
        
        // Engellerle çarpışma kontrolü
        for (const obstacle of obstacles) {
          if (obstacle.geometry && isPointInsideBox(particle.position, obstacle)) {
            scene.remove(particle);
            this.waterParticles.splice(i, 1);
            continue;
          }
        }
        
        // Ömrü biten parçacıkları temizle
        if (particle.lifetime <= 0 || particle.position.y < 0) {
          scene.remove(particle);
          this.waterParticles.splice(i, 1);
        }
      }
    }
  };
  
  tomaVehicles.push(toma);
  return toma;
}

// TOMA tekerleği oluştur
function createWheel(tomaGroup, x, z) {
  const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.position.set(x, 0.8, z);
  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  tomaGroup.add(wheel);
  return wheel;
}

// Oyuncu kontrolleri
let velocity, direction;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isRunning = false;

function setupControls() {
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());
  
  // Oyuncu hareketi için
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  
  // Tıklama ile kontrolleri etkinleştir
  let controlsEnabled = false;
  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  // Başlangıçta blocker'ı göster
  if (blocker) blocker.style.display = 'flex';
  
  // Tüm belgeye tıklama olayı ekle
  document.addEventListener('click', function() {
    if (!controlsEnabled && controls) {
      controls.lock();
    }
  });

  controls.addEventListener('lock', function() {
    if (instructions) instructions.style.display = 'none';
    if (blocker) blocker.style.display = 'none';
    controlsEnabled = true;
    console.log("Kontroller etkinleştirildi");
  });

  controls.addEventListener('unlock', function() {
    if (blocker) blocker.style.display = 'flex';
    if (instructions) instructions.style.display = '';
    controlsEnabled = false;
    console.log("Kontroller devre dışı");
  });
  
  // Klavye olayları
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
          gameState.sloganCooldown = 200;
        }
        break;
      case 'Digit1':
      case 'Numpad1':
        // Şemsiye kısa yolu
        if (gameState.umbrellaCooldown <= 0) {
          const umbrellaButton = document.getElementById('umbrella-button');
          if (umbrellaButton) umbrellaButton.click();
        }
        break;
      case 'Digit2':  
      case 'Numpad2':
        // Maske kısa yolu
        if (gameState.maskCooldown <= 0) {
          const maskButton = document.getElementById('mask-button');
          if (maskButton) maskButton.click();
        }
        break;
      case 'Digit3':
      case 'Numpad3':
        // Tweet kısa yolu
        if (gameState.tweetCooldown <= 0) {
          const tweetButton = document.getElementById('tweet-button');
          if (tweetButton) tweetButton.click();
        }
        break;
      case 'Escape':
        // Escape tuşu ile PointerLock'u kaldır
        if (controlsEnabled) {
          controls.unlock();
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
}

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
    
    // Level 10'da Mahmut karakteri
    if (gameState.level >= 10 && !gameState.mahmutUnlocked) {
      gameState.mahmutUnlocked = true;
      gameState.speedBonus += 20;
      
      gameState.messages.push({
        text: "Halkın umudu Mahmut karakteri açıldı! Artık daha güçlüsün!",
        time: 300,
        color: '#ff9900'
      });
    }
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
  
  // Karakter bilgisi ekle
  const charElement = document.createElement('div');
  charElement.id = 'character-display';
  charElement.textContent = `Karakter: ${getCharacterName()}`;
  uiContainer.appendChild(charElement);
  
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
  };
  
  const umbrella = createToolButton('☂️', 'Şemsiye', '1', 'umbrella-button');
  const mask = createToolButton('😷', 'Maske', '2', 'mask-button');
  const tweet = createToolButton('🐦', 'Tweet', '3', 'tweet-button');
  
  toolsContainer.appendChild(umbrella);
  toolsContainer.appendChild(mask);
  toolsContainer.appendChild(tweet);
  
  document.body.appendChild(toolsContainer);
  
  // Şemsiye korunma özelliği
  umbrella.addEventListener('click', function() {
    if (!gameState.umbrellaActive && gameState.umbrellaCooldown === 0) {
      gameState.umbrellaActive = true;
      gameState.umbrellaCooldown = 1500; // 15 saniye cooldown
      
      gameState.messages.push({
        text: "Şemsiye aktif! TOMA suyundan 10 saniye boyunca korunacaksın.",
        time: 300,
        color: '#00ffff'
      });
      
      // Görsel ipucu olarak şemsiye butonunu belirginleştir
      this.style.backgroundColor = '#007bff';
      this.style.borderColor = '#0056b3';
      this.classList.add('active');
      
      // 10 saniye sonra etkiyi kaldır
      setTimeout(() => {
        gameState.umbrellaActive = false;
        this.style.backgroundColor = '#333';
        this.style.borderColor = '#555';
        this.classList.remove('active');
        
        gameState.messages.push({
          text: "Şemsiye koruması sona erdi!",
          time: 200,
          color: '#aaaaaa'
        });
      }, 10000);
    }
  });
  
  // Maske özelliği - Polisler tarafından yakalanmayı azaltır
  mask.addEventListener('click', function() {
    if (gameState.maskCooldown === 0) {
      gameState.maskCooldown = 2000; // 20 saniye cooldown
      
      gameState.messages.push({
        text: "Maske takıldı! Polisler seni 15 saniye daha zor tanıyacak.",
        time: 300,
        color: '#aaffaa'
      });
      
      // Görsel ipucu
      this.style.backgroundColor = '#28a745';
      this.style.borderColor = '#1e7e34';
      this.classList.add('active');
      
      // Polis yakalama mesafesini azalt
      const originalDetectionRange = 2.5;
      policeOfficers.forEach(police => {
        if (police.detectionRange) {
          police.originalDetectionRange = police.detectionRange;
          police.detectionRange = police.detectionRange * 0.5; // Yarıya indir
        }
      });
      
      // 15 saniye sonra etkiyi kaldır
      setTimeout(() => {
        policeOfficers.forEach(police => {
          if (police.originalDetectionRange) {
            police.detectionRange = police.originalDetectionRange;
          }
        });
        
        this.style.backgroundColor = '#333';
        this.style.borderColor = '#555';
        this.classList.remove('active');
        
        gameState.messages.push({
          text: "Maske etkisi sona erdi!",
          time: 200,
          color: '#aaaaaa'
        });
      }, 15000);
    }
  });

  // Tweet özelliği - Daha fazla XP kazandırır
  tweet.addEventListener('click', function() {
    if (gameState.tweetCooldown === 0) {
      gameState.tweetCooldown = 1000; // 10 saniye cooldown
      
      // Tweet XP bonus
      const xpBonus = 50;
      gameState.xp += xpBonus;
      checkLevelUp();
      
      gameState.messages.push({
        text: `Tweet atıldı! +${xpBonus} XP kazandın.`,
        time: 300,
        color: '#aaccff'
      });
      
      // Görsel efekt
      this.style.backgroundColor = '#1da1f2';
      this.style.borderColor = '#0c85d0';
      this.classList.add('active');
      
      setTimeout(() => {
        this.style.backgroundColor = '#333';
        this.style.borderColor = '#555';
        this.classList.remove('active');
      }, 1000);
    }
  });
  // UI Container'a bir "Kilit Sıfırla" butonu ekle
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Kamera Kontrolünü Düzelt';
  resetButton.style.position = 'absolute';
  resetButton.style.top = '10px';
  resetButton.style.right = '10px';
  resetButton.style.padding = '8px 12px';
  resetButton.style.backgroundColor = '#ff3333';
  resetButton.style.color = 'white';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '4px';
  resetButton.style.zIndex = '1000';
  resetButton.style.cursor = 'pointer';

  resetButton.addEventListener('click', function() {
    // Kontrolleri yeniden başlat
    controls.unlock();
    setTimeout(() => {
      controls.lock();
    }, 100);
  });

  document.body.appendChild(resetButton);
}

// Seçilen karakterin adını döndür
function getCharacterName() {
  switch(gameState.characterType) {
    case 'pikachu':
      return 'Pikachu ⚡';
    case 'female':
      return 'Kadın Protestocu 👩';
    case 'normal':
    default:
      return 'Normal Protestocu 👤';
  }
}

// UI'ı güncelleme
function updateUI() {
  // XP, Level ve süre bilgilerini güncelle
  document.getElementById('xp-display').textContent = `XP: ${gameState.xp}`;
  document.getElementById('level-display').textContent = `Seviye: ${gameState.level}`;
  document.getElementById('time-display').textContent = `Süre: ${Math.floor(gameState.gameTime / 100)} sn`;
  document.getElementById('character-display').textContent = `Karakter: ${getCharacterName()}`;
  
  // Mesajları güncelle
  const messagesElement = document.getElementById('messages');
  messagesElement.innerHTML = '';
  
  for (let i = 0; i < gameState.messages.length; i++) {
    const msg = gameState.messages[i];
    
    const messageElement = document.createElement('div');
    messageElement.textContent = msg.text;
    messageElement.style.color = msg.color;
    messageElement.style.marginBottom = '10px';
    
    messagesElement.appendChild(messageElement);
    
    // Mesaj süresini azalt
    msg.time -= 1;
  }
  
  // Süresi dolan mesajları kaldır
  gameState.messages = gameState.messages.filter(msg => msg.time > 0);
  
  // Cooldown yönetimi
  if (gameState.sloganCooldown > 0) {
    gameState.sloganCooldown -= 1;
  }
  
  if (gameState.umbrellaCooldown > 0) {
    gameState.umbrellaCooldown--;
    document.getElementById('umbrella-button').style.opacity = 0.5;
  } else {
    document.getElementById('umbrella-button').style.opacity = 1;
  }
  
  if (gameState.maskCooldown > 0) {
    gameState.maskCooldown--;
    document.getElementById('mask-button').style.opacity = 0.5;
  } else {
    document.getElementById('mask-button').style.opacity = 1;
  }
  
  if (gameState.tweetCooldown > 0) {
    gameState.tweetCooldown--;
    document.getElementById('tweet-button').style.opacity = 0.5;
  } else {
    document.getElementById('tweet-button').style.opacity = 1;
  }
}

// Çarpışma kontrol fonksiyonları
function isPointInsideBox(point, box) {
  // Box'un dünya koordinatlarını al
  const boxPosition = new THREE.Vector3();
  const boxSize = new THREE.Vector3();
  
  // Box'un dünya koordinatlarındaki boundingBox'ını hesapla
  if (box.geometry) {
    box.geometry.computeBoundingBox();
    box.updateMatrixWorld();
    
    boxPosition.setFromMatrixPosition(box.matrixWorld);
    boxSize.copy(box.geometry.boundingBox.max).sub(box.geometry.boundingBox.min);
    boxSize.multiply(box.scale);
    
    // Nokta box içinde mi kontrol et
    const halfSize = boxSize.clone().multiplyScalar(0.5);
    const min = boxPosition.clone().sub(halfSize);
    const max = boxPosition.clone().add(halfSize);
    
    return (
      point.x >= min.x && point.x <= max.x &&
      point.y >= min.y && point.y <= max.y &&
      point.z >= min.z && point.z <= max.z
    );
  }
  
  return false;
}

function checkCollisions(newPosition) {
  // Tüm engellere karşı çarpışma kontrolü
  for (const obstacle of obstacles) {
    if (isPointInsideBox(newPosition, obstacle)) {
      return true; // Çarpışma var
    }
  }
  
  return false; // Çarpışma yok
}

// Oyun döngüsü
let previousTime = performance.now();
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const currentTime = performance.now();
  const deltaTime = Math.min(200, currentTime - previousTime);
  previousTime = currentTime;
  
  if (controls && gameState.playerAlive) {
    // Karakter hareketi
    const delta = clock.getDelta();
    
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    
    // Karakter tipi ve mahmut bonus hızını ekle
    let baseSpeed = 40.0;
    switch(gameState.characterType) {
      case 'pikachu':
        baseSpeed = 50.0; // Pikachu daha hızlı
        break;
      case 'female':
        baseSpeed = 45.0; // Kadın karakter biraz daha hızlı
        break;
    }
    
    const speedMultiplier = isRunning ? 
      (baseSpeed * 1.5 + (gameState.speedBonus || 0)) : 
      (baseSpeed + (gameState.speedBonus || 0) / 2);
    
    if (moveForward || moveBackward) velocity.z -= direction.z * speedMultiplier * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speedMultiplier * delta;
    
    // Önerilen yeni pozisyon
    const oldPosition = controls.getObject().position.clone();
    const newPosition = oldPosition.clone();
    newPosition.x += -velocity.x * delta;
    newPosition.z += -velocity.z * delta;
    
    // Engeller ile çarpışma kontrolü
    if (!checkCollisions(newPosition)) {
      // Çarpışma yoksa hareket et
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
    } else {
      // Çarpışma varsa, sadece çarpmayan eksenlerde hareket et
      const newPositionX = oldPosition.clone();
      newPositionX.x += -velocity.x * delta;
      
      const newPositionZ = oldPosition.clone();
      newPositionZ.z += -velocity.z * delta;
      
      if (!checkCollisions(newPositionX)) {
        controls.moveRight(-velocity.x * delta);
      }
      
      if (!checkCollisions(newPositionZ)) {
        controls.moveForward(-velocity.z * delta);
      }
    }
    
    // Sınırlar içinde tutma
    const playerPos = controls.getObject().position;
    if (Math.abs(playerPos.x) > 490) {
      playerPos.x = Math.sign(playerPos.x) * 490;
    }
    if (Math.abs(playerPos.z) > 490) {
      playerPos.z = Math.sign(playerPos.z) * 490;
    }
    
    // XP ve oyun süresi güncelleme
    gameState.gameTime += 1;
    if (gameState.gameTime % 100 === 0) { // Her saniye
      gameState.xp += 1;
      checkLevelUp();
    }
  }
  
  // Polisleri güncelle
  for (const police of policeOfficers) {
    if (police.update && police.update(deltaTime) && gameState.playerAlive) {
      playerCaught();
    }
  }
  
  // TOMA'ları güncelle
  for (const toma of tomaVehicles) {
    toma.update(deltaTime);
  }
  
  // UI güncelleme
  updateUI();
  
  // Render
  renderer.render(scene, camera);
}

// Karakteri seçtikten sonra oyunu başlat
function initializeGame() {
  // Karakter seçim ekranını göster
  createCharacterSelectionScreen();
}

// Sayfanın yüklenmesi tamamlandığında oyunu başlat
window.addEventListener('load', initializeGame);

// Ekran yeniden boyutlandırma
window.addEventListener('resize', function() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
