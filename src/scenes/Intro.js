import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text } from '../ui.js';
import { getEpisode } from '../episodes.js';

// Story card shown before each episode. Tap to page through the text.
export class Intro extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  create({ id }) {
    const ep = getEpisode(id);
    this.ep = ep;
    this.pages = id === 1 ? [t('prologue'), t('ep1.intro')] : [t(`ep${id}.intro`)];
    this.page = 0;

    this.cameras.main.setBackgroundColor(PAL.k);
    text(this, WIDTH / 2, 60, `${t('common.episode')} ${id}`, { color: PAL.n });
    text(this, WIDTH / 2, 82, t(`ep${id}.title`), { color: PAL.y, wrap: 220 });
    this.add.image(WIDTH / 2, 130, ep.icon).setScale(ep.icon.startsWith('zetor') ? 1.5 : 3);

    this.body = text(this, WIDTH / 2, 180, '', { wrap: 208, align: 'left', origin: 0.5, originY: 0, lineSpacing: 0 });
    this.hint = text(this, WIDTH / 2, HEIGHT - 40, t('common.tap'), { color: PAL.n });
    this.tweens.add({ targets: this.hint, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

    this.showPage();
    this.input.on('pointerup', () => this.advance());
    this.input.keyboard?.on('keydown-SPACE', () => this.advance());
    this.input.keyboard?.on('keydown-ENTER', () => this.advance());
  }

  // Typewriter effect. A tap while typing shows the whole page at once.
  showPage() {
    const full = this.pages[this.page];
    this.typing?.remove();
    let n = 0;
    this.body.setText('');
    this.typing = this.time.addEvent({
      delay: 30,
      repeat: full.length - 1,
      callback: () => this.body.setText(full.slice(0, ++n)),
    });
  }

  advance() {
    const full = this.pages[this.page];
    if (this.body.text.length < full.length) {
      this.typing.remove();
      this.body.setText(full);
      return;
    }
    this.page++;
    if (this.page < this.pages.length) {
      this.showPage();
      return;
    }
    this.scene.start(this.ep.scene || 'Placeholder', { id: this.ep.id });
  }
}
