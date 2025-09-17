export class WeaponSystem {
  constructor(scene, player, bots, lootItems, chests) {
    this.scene = scene;
    this.player = player;
    this.bots = bots;
    this.lootItems = lootItems;
    this.chests = chests;
    this.weaponList = [
      { name: 'Pistol', rarity: 'common', damage: 12 },
      { name: 'Shotgun', rarity: 'rare', damage: 30 },
      { name: 'Shotgun', rarity: 'epic', damage: 50 },
      { name: 'SMG', rarity: 'uncommon', damage: 16 },
      { name: 'Assault Rifle', rarity: 'common', damage: 15 },
      { name: 'Minigun', rarity: 'legendary', damage: 45 },
      { name: 'Sniper', rarity: 'rare', damage: 65 }
    ];
  }

  reset() {
    // Spawn loot and chests (placeholder)
    this.lootItems.length = 0;
    this.chests.length = 0;
    for (let i=0; i<20; ++i) {
      let item = this.weaponList[Math.floor(Math.random()*this.weaponList.length)];
      this.lootItems.push({
        weapon: item,
        pos: {
          x: (Math.random()-0.5)*40,
          y: 6+Math.random()*8,
          z: (Math.random()-0.5)*40
        }
      });
    }
    for (let i=0; i<10; ++i) {
      this.chests.push({
        pos: {
          x: (Math.random()-0.5)*40,
          y: 6+Math.random()*8,
          z: (Math.random()-0.5)*40
        }
      });
    }
  }

  update() {
    // Pickup loot
    for (let i = this.lootItems.length-1; i >=0; --i) {
      let item = this.lootItems[i];
      let dist = Math.sqrt(
        Math.pow(this.player.position.x-item.pos.x,2)+
        Math.pow(this.player.position.y-item.pos.y,2)+
        Math.pow(this.player.position.z-item.pos.z,2)
      );
      if (dist < 2) {
        this.player.weapon = item.weapon;
        this.lootItems.splice(i,1);
      }
    }
    // Use weapon on click
    window.onmousedown = () => {
      if (this.player.weapon) {
        for (let bot of this.bots) {
          if (!bot.dead && bot.position.distanceTo(this.player.position)<8) {
            bot.hp -= this.player.weapon.damage;
            if (bot.hp <= 0) bot.dead = true;
          }
        }
      }
    }
  }
}