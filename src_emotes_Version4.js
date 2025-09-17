export class EmoteSystem {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
  }

  reset() {}

  update() {
    // Animate emotes if needed (already handled in Player.doEmote())
  }
}