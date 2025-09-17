import * as THREE from 'three';
import { lerp } from './utils.js';

export class Bot {
  constructor(scene, map) {
    this.scene = scene;
    this.map = map;
    this.hp = 100;
    this.dead = false;
    this.target = null;
    this.weapon = { name: "AR", rarity: "common", damage: 15 };

    this.body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1.2, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0xff5050 })
    );
    this.body.castShadow = true;
    this.scene.add(this.body);

    this.position = new THREE.Vector3(
      (Math.random()-0.5)*30,
      map.getHeight((Math.random()-0.5)*30, (Math.random()-0.5)*30)+1.1,
      (Math.random()-0.5)*30
    );
    this.vel = new THREE.Vector3();
    this.grounded = true;
    this.yaw = 0;
  }

  update(player) {
    if (this.dead) {
      this.body.visible = false;
      return;
    }
    this.body.visible = true;

    // Chase player if close
    let dist = this.position.distanceTo(player.position);
    if (dist < 30) {
      let dir = player.position.clone().sub(this.position).setY(0).normalize();
      this.position.addScaledVector(dir, 0.09);
      this.yaw = Math.atan2(dir.x, dir.z);

      // Shoot if close
      if (dist < 7 && Math.random()<0.03) {
        player.hp -= this.weapon.damage;
        if (player.hp <= 0) player.dead = true;
      }
    }

    // Gravity
    if (!this.grounded) this.vel.y -= 0.03;
    this.position.add(this.vel);

    // Floor collision
    let groundY = this.map.getHeight(this.position.x, this.position.z);
    if (this.position.y <= groundY+1.1) {
      this.position.y = groundY+1.1;
      this.vel.y = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    this.body.position.copy(this.position);
    this.body.rotation.y = this.yaw;
  }
}