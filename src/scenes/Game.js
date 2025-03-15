import { Scene } from 'phaser';

export default class Game extends Scene {
  constructor() {
    super('scene-game');
  }

  create() {
    const {width: w, height: h} = this.game.scale;

    // Create player sprite
    this.player = this.physics.add.sprite(0, 0, 'player');
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

    // Configure lighting
    this.lights.enable();
    this.lights.setAmbientColor(0x000000);

    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 200, 0xFFFFFF, 8);

    // Spawn interactive sprites
    this.physics.add.sprite(-40, -40, 'coin');


  }

  update() {
    const {x: vx, y: vy} = this.player.body.velocity;
    
    // Translate infinite floor
    this.floor.tilePositionX = this.player.x;
    this.floor.tilePositionY = this.player.y;

    // Center light
    this.playerLight.x = this.player.x;
    this.playerLight.y = this.player.y;
    
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
