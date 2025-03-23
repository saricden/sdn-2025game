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
    this.lights.setAmbientColor(0x009900);

    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 200, 0xFFFFFF, 4);

    // Launch UI
    this.scene.launch('scene-ui', { parentScene: this });
    this.ui = this.scene.get('scene-ui');

    // Spawn interactive sprites
    this.map = [];
    this.gemsCollected = 0;
    const gemCount = 20;
    const leftLimit = -1000;
    const rightLimit = 1000;
    const topLimit = -1000;
    const bottomLimit = 1000;

    for (let i = 0; i < gemCount; i++) {
      const x = pMath.Between(leftLimit, rightLimit);
      const y = pMath.Between(topLimit, bottomLimit);
      
      const gem = this.physics.add.sprite(x, y, 'gem');
      gem.body.setSize(14, 14);
      gem.body.setOffset(3, 7);
      gem.play({
        key: 'Spin',
        repeat: -1
      });

      gem.lightSrc = this.lights.addLight(gem.x, gem.y, 1200, 0x0000FF, 1);

      this.physics.add.overlap(gem, this.player, () => {
        this.sound.play('sfx-gem', { detune: pMath.Between(-150, 150) });
        this.gemsCollected++;
        this.ui.score.text = `${this.gemsCollected} / ${gemCount}`;
        this.lights.removeLight(gem.lightSrc);
        gem.destroy();
      });

      this.map.push(gem);
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
    if (vx !== 0 || vy !== 0) {
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
