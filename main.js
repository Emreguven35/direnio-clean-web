import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xadd8e6);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.set(0, 3, 10);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Işıklar
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Zemin
const groundGeo = new THREE.PlaneGeometry(500, 500);
const groundMat = new THREE.MeshPhongMaterial({ color: 0x777777 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Küçük bina örneği
const buildingGeo = new THREE.BoxGeometry(10, 10, 10);
const buildingMat = new THREE.MeshPhongMaterial({ color: 0x333366 });
const building = new THREE.Mesh(buildingGeo, buildingMat);
building.position.set(0, 5, -20);
scene.add(building);

// Kontroller
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());
scene.add(controls.getObject());

// Hareket
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// Yeniden boyutlandırma
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animasyon
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  
  direction.z = Number(keys['KeyW']) - Number(keys['KeyS']);
  direction.x = Number(keys['KeyD']) - Number(keys['KeyA']);
  direction.normalize();
  
  if (keys['KeyW'] || keys['KeyS']) velocity.z -= direction.z * 20.0 * delta;
  if (keys['KeyA'] || keys['KeyD']) velocity.x -= direction.x * 20.0 * delta;
  
  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  
  renderer.render(scene, camera);
}

animate();
