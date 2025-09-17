import * as THREE from 'three';

export class BuildingSystem {
  constructor(scene, player, map) {
    this.scene = scene;
    this.player = player;
    this.map = map;
    this.structures = [];
    this.mode = 'wall'; // wall/ramp
    window.addEventListener('keydown', e => {
      if (e.code === 'KeyQ') this.mode = this.mode==='wall' ? 'ramp' : 'wall';
      if (e.code === 'Mouse1' || e.code === 'KeyF') this.build();
      if (e.code === 'KeyE') this.edit();
    });
  }

  build() {
    let pos = this.player.position.clone().add(new THREE.Vector3(0,0,-3).applyAxisAngle(new THREE.Vector3(0,1,0),-this.player.yaw));
    let mesh;
    if (this.mode==='wall') {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,0.3),
        new THREE.MeshStandardMaterial({ color: 0xbbbbaa })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(3,0.3,2),
        new THREE.MeshStandardMaterial({ color: 0xaaaaff })
      );
      mesh.rotation.x = -Math.PI/5;
    }
    mesh.position.copy(pos);
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.structures.push(mesh);
  }

  edit() {
    // Open a hole in nearest structure for prototype
    let nearest = null, dist = 5;
    for (let s of this.structures) {
      let d = s.position.distanceTo(this.player.position);
      if (d < dist) { dist = d; nearest = s; }
    }
    if (nearest) nearest.material.color.set(0x222222); // Mark as "hole"
  }

  update() {}
}