import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button } from '../ui.js';

// End credits: the lines scroll up while the Zetor drives home.
export class Credits extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    this.cameras.main.setBackgroundColor(PAL.k);
    const lines = t('credits.lines');

    const roll = this.add.container(0, HEIGHT);
    let y = 0;
    lines.forEach((line, i) => {
      const big = i === 0 || line.includes('26');
      const obj = text(this, WIDTH / 2, y, line, { size: big ? 30 : 20, color: big ? PAL.y : PAL.w });
      roll.add(obj);
      y += big ? 32 : line ? 20 : 10;
    });

    // Stop with the text centred in the space above the road.
    this.tweens.add({
      targets: roll,
      y: Math.max(20, (HEIGHT - 70 - y) / 2 + 16),
      duration: 9000,
      ease: 'Sine.easeOut',
      onComplete: () => {
        button(this, WIDTH / 2, HEIGHT - 26, t('common.menu'), () => this.scene.start('Title'), { width: 140, height: 26 });
      },
    });

    // Ground strip with the tractor heading home.
    this.add.rectangle(WIDTH / 2, HEIGHT - 60, WIDTH, 4, Phaser.Display.Color.HexStringToColor(PAL.n).color);
    const zetor = this.add.sprite(-40, HEIGHT - 82, 'zetor_0').setScale(1.5).play('zetor-drive');
    this.tweens.add({ targets: zetor, x: WIDTH + 40, duration: 10000, repeat: -1 });
  }
}
