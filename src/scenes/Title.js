import { WIDTH, HEIGHT, PAL, LOGO_FONT } from '../config.js';
import { t, nextLang } from '../i18n.js';
import { text, button, landscape } from '../ui.js';

export class Title extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { roadY } = landscape(this, { roadY: 262 });

    // Sun.
    this.add.circle(206, 26, 12, Phaser.Display.Color.HexStringToColor(PAL.y).color);

    // Logo.
    text(this, WIDTH / 2, 62, 'ZETOR', { size: 32, color: PAL.r, font: LOGO_FONT }).setShadow(3, 3, PAL.k, 0, false, true);
    text(this, WIDTH / 2, 100, '25A', { size: 24, color: PAL.w, font: LOGO_FONT }).setShadow(3, 3, PAL.k, 0, false, true);
    text(this, WIDTH / 2, 134, t('title.sub'), { color: PAL.y });
    text(this, WIDTH / 2, 154, t('title.year'), {});

    // The tractor rolls along the road, puffing smoke.
    const zetor = this.add.sprite(-40, roadY - 14, 'zetor_0').setScale(2).play('zetor-drive');
    this.tweens.add({ targets: zetor, x: WIDTH + 40, duration: 9000, repeat: -1 });
    this.time.addEvent({
      delay: 350,
      loop: true,
      callback: () => {
        const puff = this.add.image(zetor.x + 26, zetor.y - 30, 'puff').setScale(2);
        this.tweens.add({ targets: puff, y: puff.y - 24, x: puff.x - 10, alpha: 0, scale: 3, duration: 1100, onComplete: () => puff.destroy() });
      },
    });

    // Our heroes, waiting by the road.
    this.add.image(WIDTH / 2 - 10, roadY + 40, 'old').setScale(2);
    this.add.image(WIDTH / 2 + 10, roadY + 40, 'young').setScale(2);

    button(this, WIDTH / 2, 190, t('title.play'), () => this.scene.start('Select'), { width: 150, height: 34, size: 30 });
    button(this, WIDTH / 2, 226, `${t('title.lang')}: ${t('lang.name')}`, () => {
      nextLang();
      this.scene.restart();
    }, { width: 180, height: 22, fill: PAL.B, edge: PAL.b });

    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('Select'));
  }
}
