import { WIDTH, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button, landscape, Controls } from '../ui.js';
import { getEpisode, markDone } from '../episodes.js';

// Stand-in for episodes that are not built yet. It lets you try the
// shared controls and skip ahead so the whole story can be walked through.
export class Placeholder extends Phaser.Scene {
  constructor() {
    super('Placeholder');
  }

  create({ id }) {
    this.id = id;
    const ep = getEpisode(id);
    const { roadY } = landscape(this, { roadY: 250 });

    text(this, WIDTH / 2, 40, t(`ep${id}.title`), { color: PAL.y, wrap: 220 });
    text(this, WIDTH / 2, 64, t('placeholder.soon'), { size: 30 });
    text(this, WIDTH / 2, 96, t('placeholder.try'), {});

    this.vehicle = this.add.sprite(WIDTH / 2, roadY - 12, ep.icon).setScale(ep.icon.startsWith('zetor') ? 2 : 3);
    this.controls = new Controls(this);

    button(this, WIDTH / 2, 130, t('placeholder.skip'), () => this.finish(), { width: 130, height: 24 });
    button(this, 34, 14, t('common.menu'), () => this.scene.start('Select'), { width: 60, height: 18, fill: PAL.B, edge: PAL.b });
  }

  update(_, dt) {
    const speed = 0.08 * dt;
    if (this.controls.leftDown) this.vehicle.x -= speed;
    if (this.controls.rightDown) this.vehicle.x += speed;
    this.vehicle.x = Phaser.Math.Clamp(this.vehicle.x, 24, WIDTH - 24);
    this.vehicle.setFlipX(this.controls.leftDown && !this.controls.rightDown);

    if (this.controls.consumeAction()) {
      const puff = this.add.image(this.vehicle.x, this.vehicle.y - 20, 'puff').setScale(2);
      this.tweens.add({ targets: puff, y: puff.y - 30, alpha: 0, scale: 4, duration: 800, onComplete: () => puff.destroy() });
    }
  }

  finish() {
    markDone(this.id);
    const next = getEpisode(this.id + 1);
    if (getEpisode(this.id).ending) this.scene.start('Credits');
    else if (next) this.scene.start('Intro', { id: next.id });
    else this.scene.start('Select');
  }
}
