import { Scene } from 'phaser';

export default class Preloader extends Scene {
  constructor() {
    super('scene-preloader');
  }

  preload() {
    this.load.aseprite('player', '/player.png', '/player.json');
    this.load.image('floor', ['/floor.jpg', '/floor-normal.jpg']);
    this.load.aseprite('gem', '/gem.png', '/gem.json');
    this.load.audio('sfx-gem', '/gem.mp3');
    this.load.audio('music-game', '/song18.mp3');
  }

  create() {
    this.anims.createFromAseprite('player');
    this.anims.createFromAseprite('gem');

    this.scene.start('scene-title');
  }
}
