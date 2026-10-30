import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button, landscape } from '../ui.js';
import { nextEpisode } from '../flow.js';

// Episode 9: home at last. The Zetor rolls into the farmyard in front of
// a red Ostrobothnian house, the dog comes running, then the credits.

const ROAD_Y = 270;

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

export class Episode9 extends Phaser.Scene {
  constructor() {
    super('Episode9');
  }

  create() {
    landscape(this, { roadY: ROAD_Y });
    this.drawFarm();
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);

    const later = text(this, WIDTH / 2, 60, t('ep9.later'), { wrap: 220 }).setDepth(51);
    later.setBackgroundColor('rgba(0,0,0,0.5)').setPadding(4, 2);

    // The tractor with both heroes aboard.
    const rig = this.add.container(-60, 0).setDepth(10);
    rig.add(this.add.sprite(0, ROAD_Y - 12, 'zetor_0').setScale(2).play('zetor-drive'));
    const driver = this.add.image(-20, ROAD_Y - 36, 'old').setScale(2);
    const rider = this.add.image(-44, ROAD_Y - 30, 'young').setScale(2);
    rig.add(this.add.image(-44, ROAD_Y - 6, 'barrel').setScale(2));
    rig.add([driver, rider]);
    this.tweens.add({ targets: rig, x: 96, duration: 3500, ease: 'Sine.easeOut' });

    const dog = this.add.image(196, ROAD_Y + 8, 'dog').setScale(2).setFlipX(true).setDepth(11).setAlpha(0);
    this.time.delayedCall(2600, () => {
      dog.setAlpha(1);
      this.tweens.add({ targets: dog, x: 150, duration: 900, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: dog, y: dog.y - 4, duration: 120, yoyo: true, repeat: 6 });
      this.bubble(160, ROAD_Y - 24, t('ep9.woof'));
    });

    // Both climb down and cheer.
    this.time.delayedCall(4000, () => {
      this.tweens.add({ targets: driver, x: 4, y: ROAD_Y + 10, duration: 500 });
      this.tweens.add({ targets: rider, x: 22, y: ROAD_Y + 10, duration: 500, delay: 150 });
      this.tweens.add({ targets: [driver, rider], y: ROAD_Y + 2, duration: 180, yoyo: true, repeat: 3, delay: 800 });
      later.destroy();
      const home = text(this, WIDTH / 2, 90, t('ep9.home'), { size: 30, color: PAL.y }).setDepth(51);
      home.setScale(0);
      this.tweens.add({ targets: home, scale: 1, duration: 500, ease: 'Back.easeOut', delay: 300 });
    });

    this.time.delayedCall(5600, () => {
      const hint = text(this, WIDTH / 2, HEIGHT - 30, t('common.tap')).setDepth(51);
      this.tweens.add({ targets: hint, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
      this.input.once('pointerup', () => nextEpisode(this, 9));
      this.input.keyboard?.once('keydown-SPACE', () => nextEpisode(this, 9));
    });
  }

  // A two-storey red farmhouse with white corners, a birch and a barn.
  drawFarm() {
    const g = this.add.graphics();
    // Barn in the distance.
    g.fillStyle(hex('R')).fillRect(10, ROAD_Y - 70, 50, 40);
    g.fillStyle(hex('n')).fillTriangle(6, ROAD_Y - 70, 64, ROAD_Y - 70, 35, ROAD_Y - 90);
    // House.
    const x = 140;
    const y = ROAD_Y - 120;
    g.fillStyle(hex('r')).fillRect(x, y, 90, 110);
    g.fillStyle(hex('k')).fillTriangle(x - 6, y, x + 96, y, x + 45, y - 30);
    g.fillStyle(hex('w')).fillRect(x, y, 4, 110).fillRect(x + 86, y, 4, 110);
    for (const wy of [y + 14, y + 60]) {
      for (const wx of [x + 12, x + 38, x + 64]) {
        g.fillStyle(hex('w')).fillRect(wx - 2, wy - 2, 18, 26);
        g.fillStyle(hex('t')).fillRect(wx, wy, 14, 22);
        g.fillStyle(hex('w')).fillRect(wx + 6, wy, 2, 22);
      }
    }
    g.fillStyle(hex('w')).fillRect(x + 36, y + 84, 20, 26);
    g.fillStyle(hex('x')).fillRect(x + 38, y + 86, 16, 24);
    g.fillStyle(hex('n')).fillRect(x + 60, y - 22, 8, 16);
    // Birch tree.
    g.fillStyle(hex('w')).fillRect(108, ROAD_Y - 70, 5, 70);
    g.fillStyle(hex('k')).fillRect(108, ROAD_Y - 50, 3, 2).fillRect(110, ROAD_Y - 30, 3, 2);
    g.fillStyle(hex('h')).fillCircle(110, ROAD_Y - 82, 18);
    g.fillStyle(hex('g')).fillCircle(102, ROAD_Y - 76, 10);
  }

  bubble(x, y, str) {
    const s = text(this, x, y, str, { color: PAL.k, shadow: false }).setDepth(55);
    s.setBackgroundColor('#fcfcfc').setPadding(4, 2);
    this.time.delayedCall(1400, () => s.destroy());
  }
}
