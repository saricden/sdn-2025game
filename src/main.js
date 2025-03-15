import './style.css';
import Phaser from 'phaser';

// Scenes
import Preloader from './scenes/Preloader';
import Title from './scenes/Title';
import Game from './scenes/Game';

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  },
  scene: [Preloader, Title, Game],
  pixelArt: true
};

new Phaser.Game(config);