import { Scene } from 'phaser';

export default class UI extends Scene {
  constructor() {
    super('scene-ui');
  }

  init({ parentScene }) {
    this.parentScene = parentScene;
  }
  
  create() {
    const { width: w, height: h } = this.game.scale;
    
    this.score = this.add.text(w / 2, 20, '0 / 20', {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#fff',
      align: 'center',
    }).setOrigin(0.5);
  }
}