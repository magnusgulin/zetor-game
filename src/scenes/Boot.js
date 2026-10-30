import { createSprites } from '../sprites.js';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    createSprites(this);
    this.scene.start('Title');
  }
}
