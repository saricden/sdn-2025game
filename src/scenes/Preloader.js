import { Scene } from 'phaser';

export default class Preloader extends Scene {
  constructor() {
    super('scene-preloader');
  }

  preload() {
    this.load.aseprite('player', '/player.png', '/player.json');
    this.load.image('floor', ['/floor.jpg', '/floor-normal.jpg']);
  }

  create() {
    this.anims.createFromAseprite('player');

    this.scene.start('scene-title');
  }
}
