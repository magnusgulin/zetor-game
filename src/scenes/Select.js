import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button } from '../ui.js';
import { EPISODES, isUnlocked, isDone } from '../episodes.js';

const ROW_H = 34;

export class Select extends Phaser.Scene {
  constructor() {
    super('Select');
  }

  create() {
    this.cameras.main.setBackgroundColor(PAL.B);
    text(this, WIDTH / 2, 20, t('select.heading'), { size: 30, color: PAL.y });

    EPISODES.forEach((ep, i) => {
      const y = 54 + i * ROW_H;
      const open = isUnlocked(ep.id);
      const row = this.add.rectangle(WIDTH / 2, y, 224, ROW_H - 4, open ? 0x000000 : 0x000000, open ? 0.45 : 0.2);
      row.setStrokeStyle(1, open ? 0xfcfcfc : 0x7c7c7c);

      const icon = this.add.image(26, y, ep.icon);
      icon.setScale(ep.icon.startsWith('zetor') ? 0.6 : 1.2);
      if (!open) icon.setTint(0x7c7c7c);

      text(this, 44, y, `${ep.id}. ${t(`ep${ep.id}.title`)}`, {
        color: open ? PAL.w : PAL.n,
        origin: 0,
        originY: 0.5,
        align: 'left',
        wrap: 170,
        lineSpacing: -6,
      });

      if (!open) this.add.image(220, y, 'lock');
      else if (isDone(ep.id)) this.add.image(220, y, 'check').setScale(1.5);

      row.setInteractive({ useHandCursor: open });
      row.on('pointerup', () => {
        if (open) this.scene.start('Intro', { id: ep.id });
        else this.toast(t('select.locked'));
      });
    });

    button(this, WIDTH / 2, HEIGHT - 26, t('common.back'), () => this.scene.start('Title'), { width: 120, height: 24 });
  }

  toast(msg) {
    this.toastObj?.destroy();
    this.toastObj = text(this, WIDTH / 2, HEIGHT - 58, msg, { color: PAL.y, wrap: 220 });
    this.time.delayedCall(1800, () => this.toastObj?.destroy());
  }
}
