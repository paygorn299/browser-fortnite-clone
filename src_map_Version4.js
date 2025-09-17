import * as THREE from 'three';

export class Map {
  constructor(scene) {
    this.scene = scene;
    this.terrain = null;
  }

  generate() {
    if (this.terrain) this.scene.remove(this.terrain);
    // Heightmap-based terrain (noise)
    const size = 96, segments = 64;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    for (let i = 0; i < geometry.attributes.position.count; ++i) {
      let x = geometry.attributes.position.getX(i);
      let y = geometry.attributes.position.getY(i);
      let z = geometry.attributes.position.getZ(i);
      let h = Math.sin(x*0.12)*3 + Math.cos(z*0.15)*3 + Math.random()*0.8;
      geometry.attributes.position.setZ(i, h);
    }
    geometry.computeVertexNormals();
    const material = new THREE.MeshLambertMaterial({ color: 0x6acb3a });
    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.receiveShadow = true;
    this.terrain.rotation.x = -Math.PI/2;
    this.scene.add(this.terrain);

    // Sky light and sun
    if (!this.sun) {
      this.sun = new THREE.DirectionalLight(0xffffff, 1.2);
      this.sun.position.set(20, 40, 15);
      this.sun.castShadow = true;
      this.scene.add(this.sun);

      this.ambi = new THREE.AmbientLight(0xccccff, 0.6);
      this.scene.add(this.ambi);
    }
  }

  getHeight(x, z) {
    // Approximate: flat(ish) for now for simplicity
    // You can use raycasting for true terrain, but this is fast for prototype
    return Math.sin(x*0.12)*3 + Math.cos(z*0.15)*3;
  }
}