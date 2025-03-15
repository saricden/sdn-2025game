import { Scene } from 'phaser';

export default class Title extends Scene {
  constructor() {
    super('scene-title');
  }

  create() {
    const { width: w, height: h } = this.game.scale;

    this.title = this.add.text(w / 2, h / 2, 'Into the Cave', {
      fontFamily: 'Arial',
      fontSize: 48,
      color: '#fff',
      align: 'center',
    }).setOrigin(0.5);
    this.subtitle = this.add.text(w / 2, h / 2 + 50, 'Tap to start', {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#fff',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0.85);

    this.input.on('pointerdown', () => {
      this.scene.start('scene-game');
    });
  }
}
