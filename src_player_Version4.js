import * as THREE from 'three';
import { clamp } from './utils.js';

export class Player {
  constructor(scene, camera, map) {
    this.scene = scene;
    this.camera = camera;
    this.map = map;
    this.hp = 100;
    this.dead = false;
    this.weapon = null;
    this.emoting = false;

    // Simple character model: a capsule
    this.body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1.2, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x45caff })
    );
    this.body.castShadow = true;
    this.scene.add(this.body);

    this.position = new THREE.Vector3(0, 12, 0); // will be set in spawnFromSky

    this.vel = new THREE.Vector3();
    this.grounded = false;
    this.pitch = 0;
    this.yaw = 0;
    this.setupControls();
  }

  setupControls() {
    this.move = { w:0, a:0, s:0, d:0, space:0 };
    window.addEventListener('keydown', e => {
      if (e.code === 'KeyW') this.move.w = 1;
      if (e.code === 'KeyS') this.move.s = 1;
      if (e.code === 'KeyA') this.move.a = 1;
      if (e.code === 'KeyD') this.move.d = 1;
      if (e.code === 'Space') this.move.space = 1;
      if (e.code === 'Digit1') this.doEmote();
    });
    window.addEventListener('keyup', e => {
      if (e.code === 'KeyW') this.move.w = 0;
      if (e.code === 'KeyS') this.move.s = 0;
      if (e.code === 'KeyA') this.move.a = 0;
      if (e.code === 'KeyD') this.move.d = 0;
      if (e.code === 'Space') this.move.space = 0;
    });

    // Mouse look
    window.addEventListener('mousemove', e => {
      if (document.pointerLockElement) {
        this.yaw -= e.movementX * 0.002;
        this.pitch -= e.movementY * 0.002;
        this.pitch = clamp(this.pitch, -Math.PI/2, Math.PI/2);
      }
    });
    canvas.onclick = () => canvas.requestPointerLock();
  }

  spawnFromSky() {
    this.hp = 100;
    this.dead = false;
    this.position.set(
      (Math.random()-0.5)*30,
      30 + Math.random()*10,
      (Math.random()-0.5)*30
    );
    this.vel.set(0, -1, 0);
  }

  doEmote() {
    this.emoting = true;
    this.body.material.color.set(0xfff200);
    setTimeout(() => {
      this.emoting = false;
      this.body.material.color.set(0x45caff);
    }, 1200);
  }

  update() {
    // Gravity
    if (!this.grounded) this.vel.y -= 0.03;
    // Movement
    let speed = 0.18;
    let forward = new THREE.Vector3(
      Math.sin(this.yaw), 0, Math.cos(this.yaw)
    );
    let right = new THREE.Vector3(
      Math.cos(this.yaw), 0, -Math.sin(this.yaw)
    );
    let moveVec = new THREE.Vector3();
    moveVec.addScaledVector(forward, this.move.w - this.move.s);
    moveVec.addScaledVector(right, this.move.d - this.move.a);
    moveVec.normalize().multiplyScalar(speed);
    this.position.add(moveVec);

    // Jump
    if (this.move.space && this.grounded) {
      this.vel.y = 0.4;
      this.grounded = false;
    }

    // Apply velocity
    this.position.add(this.vel);

    // Terrain collision (floor at y=map.getHeight(x,z))
    let groundY = this.map.getHeight(this.position.x, this.position.z);
    if (this.position.y <= groundY+1.1) {
      this.position.y = groundY+1.1;
      this.vel.y = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    // Set body position/orientation
    this.body.position.copy(this.position);
    this.body.rotation.y = this.yaw;

    // Camera follows
    this.camera.position.copy(this.position).add(new THREE.Vector3(0,2,5).applyAxisAngle(new THREE.Vector3(0,1,0),-this.yaw));
    this.camera.lookAt(this.position.x, this.position.y+1, this.position.z);
  }
}