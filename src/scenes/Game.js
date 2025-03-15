import { Scene, Math as pMath } from 'phaser';

export default class Game extends Scene {
  constructor() {
    super('scene-game');
  }

  create() {
    const {width: w, height: h} = this.game.scale;

    // Create player sprite
    this.player = this.physics.add.sprite(0, 0, 'player');
    this.player.body.setSize(22, 22);
    this.player.body.setOffset(26, 32);
    this.player.play({
      key: 'Idle',
      repeat: -1
    });

    // Create infinite floor
    this.floor = this.add.tileSprite(0, 0, w, h, 'floor');
    this.floor.setOrigin(0, 0);
    this.floor.setDepth(-10);
    this.floor.setScrollFactor(0);
    this.floor.setAlpha(0.35);
    this.floor.setPipeline('Light2D');

    // Handle touch controls
    let downX = 0;
    let downY = 0;

    this.input.on('pointerdown', ({x, y}) => {
      downX = x;
      downY = y;

      this.cameras.main.zoomTo(1.25, 150);
    });

    this.input.on('pointermove', ({x, y}) => {
      this.player.body.setVelocity((x - downX) * 1.2, (y - downY) * 1.2);
    });

    this.input.on('pointerup', () => {
      this.player.body.setVelocity(0, 0);

      this.cameras.main.zoomTo(2, 150);
    });

    // Configure camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);

    // Configure global lighting
    this.lights.enable();
    this.lights.setAmbientColor(0x000099);

    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 200, 0xFFFFFF, 8);

    // Spawn interactive sprites
    this.map = [];
    const moneyCount = pMath.Between(25, 50);
    const leftLimit = -1000;
    const rightLimit = 1000;
    const topLimit = -1000;
    const bottomLimit = 1000;

    for (let i = 0; i < moneyCount; i++) {
      const x = pMath.Between(leftLimit, rightLimit);
      const y = pMath.Between(topLimit, bottomLimit);
      
      const money = this.physics.add.sprite(x, y, 'money');
      money.body.setSize(18, 14);
      money.body.setOffset(8, 14);

      money.lightSrc = this.lights.addLight(money.x, money.y, 150, 0x00FF00, 4);

      this.physics.add.overlap(money, this.player, () => {
        this.sound.play('sfx-money', { detune: pMath.Between(-150, 150) });
        this.lights.removeLight(money.lightSrc);
        money.destroy();
      });

      this.map.push(money);
    }

    // Play music
    this.music = this.sound.add('music-game', { loop: true });
    this.music.play();
  }

  update() {
    const {x: vx, y: vy} = this.player.body.velocity;
    
    // Translate infinite floor
    this.floor.tilePositionX = this.player.x;
    this.floor.tilePositionY = this.player.y;

    // Center light
    this.playerLight.x = this.player.x;
    this.playerLight.y = this.player.y;

    // Manage depths
    this.player.setDepth(this.player.y);
    this.map.forEach(m => m.setDepth(m.y));
    
    // Stop if moving under threshold
    if (this.player.body.velocity.x < 0.1 && this.player.body.velocity.x > -0.1) {
      this.player.body.setVelocityX(0);
    }

    if (this.player.body.velocity.y < 0.1 && this.player.body.velocity.y > -0.1) {
      this.player.body.setVelocityY(0);
    }

    // Handle animations
    if (vx !== 0 || vx !== 0) {
      this.player.play({
        key: 'Run',
        repeat: -1
      }, true);
    }
    else {
      this.player.play({
        key: 'Idle',
        repeat: -1
      }, true);
    }

    if (vx !== 0) this.player.setFlipX(vx < 0);

  }
}
