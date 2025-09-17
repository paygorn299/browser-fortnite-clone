import * as THREE from 'three';
import { Player } from './player.js';
import { Bot } from './bot.js';
import { Map } from './map.js';
import { BuildingSystem } from './building.js';
import { WeaponSystem } from './weapons.js';
import { EmoteSystem } from './emotes.js';
import { lerp, clamp } from './utils.js';

const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x202844);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

let gameMode = 100;
let bots = [];
let lootItems = [];
let chests = [];
let started = false;
let night = false;

window.setMode = (mode) => {
  gameMode = mode;
  resetGame();
};
window.doEmote = () => player && player.doEmote();

function resetGame() {
  started = false;
  bots = [];
  lootItems = [];
  chests = [];
  scene.clear();
  map.generate();
  player.spawnFromSky();
  for (let i = 0; i < (gameMode === 'free' ? 0 : gameMode); ++i) {
    bots.push(new Bot(scene, map));
  }
  weaponSystem.reset();
  emoteSystem.reset();
  started = true;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
renderer.setSize(window.innerWidth, window.innerHeight);

const map = new Map(scene);
const player = new Player(scene, camera, map);
const buildingSystem = new BuildingSystem(scene, player, map);
const weaponSystem = new WeaponSystem(scene, player, bots, lootItems, chests);
const emoteSystem = new EmoteSystem(scene, player);

map.generate();
player.spawnFromSky();
for (let i = 0; i < gameMode; ++i) bots.push(new Bot(scene, map));

// Simple day/night cycle
let dayTime = 0;
function updateDayNight() {
  dayTime += 0.01;
  night = Math.sin(dayTime) < 0;
  renderer.setClearColor(night ? 0x17172c : 0x87ceeb);
}

function animate() {
  requestAnimationFrame(animate);
  updateDayNight();

  player.update();
  bots.forEach(bot => bot.update(player));
  buildingSystem.update();
  weaponSystem.update();
  emoteSystem.update();

  renderer.render(scene, camera);

  document.getElementById('info').textContent =
    `Bots left: ${bots.filter(b=>!b.dead).length}, Health: ${player.hp}, Weapon: ${player.weapon ? player.weapon.name+' ('+player.weapon.rarity+')' : 'None'}`;
}

animate();