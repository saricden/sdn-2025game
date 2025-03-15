import { Scene } from 'phaser';

export default class Preloader extends Scene {
  constructor() {
    super('scene-preloader');
  }

  preload() {
    this.load.aseprite('player', '/player.png', '/player.json');
    this.load.image('floor', ['/floor.jpg', '/floor-normal.jpg']);
    this.load.image('money', '/money.png');
    this.load.audio('sfx-money', '/money.mp3');
    this.load.audio('music-game', '/song18.mp3');
  }

  create() {
    this.anims.createFromAseprite('player');

    this.scene.start('scene-title');
  }
}
