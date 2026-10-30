import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button } from '../ui.js';
import { endPanel } from '../flow.js';

// Episode 8: a café north of Björneborg. Half a pot of coffee each keeps
// our heroes awake for the last stretch. Hold POUR and let go once the
// coffee reaches the line; pouring too long spills over.

const CUPS = 6; // three cups each, half a pot per hero
const FILL_TIME = 2.4; // seconds to fill a cup from empty to the brim
const LINE = 0.75; // the cup counts as full from here
const CUP_X = WIDTH / 2;
const CUP_Y = 236; // bottom of the cup
const CUP_W = 52;
const CUP_H = 50;

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

export class Episode8 extends Phaser.Scene {
  constructor() {
    super('Episode8');
  }

  create() {
    this.bumps = 0;
    this.drunk = 0;
    this.level = 0;
    this.pouring = false;
    this.state = 'pour';

    this.cameras.main.setBackgroundColor(PAL.S);
    const g = this.add.graphics();
    // Wallpaper stripes and a window with the morning outside.
    g.fillStyle(hex('R'));
    for (let x = 0; x < WIDTH; x += 16) g.fillRect(x, 28, 6, 230);
    g.fillStyle(hex('w')).fillRect(150, 50, 70, 60);
    g.fillStyle(hex('t')).fillRect(154, 54, 62, 52);
    g.fillStyle(hex('G')).fillRect(154, 90, 62, 16);
    g.fillStyle(hex('w')).fillRect(184, 54, 2, 52);
    // Checked tablecloth.
    for (let y = 250; y < HEIGHT; y += 10) {
      for (let x = 0; x < WIDTH; x += 10) {
        g.fillStyle(hex((x + y) % 20 === 0 ? 'r' : 'w')).fillRect(x, y, 10, 10);
      }
    }

    this.old = this.add.image(34, 214, 'old').setScale(4);
    this.young = this.add.image(WIDTH - 34, 214, 'young').setScale(4);
    this.sleepy = [this.zzz(this.old), this.zzz(this.young)];

    this.cupGfx = this.add.graphics().setDepth(5);
    this.pot = this.add.container(CUP_X + 30, 130).setDepth(6);
    const pg = this.add.graphics();
    pg.fillStyle(hex('n')).fillRect(-14, -18, 28, 30);
    pg.fillStyle(hex('N')).fillRect(-12, -16, 6, 26);
    pg.fillStyle(hex('k')).fillRect(-10, -24, 20, 6);
    pg.fillStyle(hex('n')).fillTriangle(-14, -12, -26, -16, -14, -4);
    pg.fillStyle(hex('k')).fillRect(14, -12, 6, 3).fillRect(18, -12, 3, 16).fillRect(14, 1, 6, 3);
    this.pot.add(pg);
    this.stream = this.add.rectangle(CUP_X - 4, 150, 4, 10, hex('O')).setOrigin(0.5, 0).setDepth(4).setVisible(false);

    // HUD: how awake our heroes are.
    this.add.rectangle(WIDTH / 2, 14, WIDTH, 28, 0x000000, 0.55).setDepth(50);
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    text(this, 76, 13, t('ep8.meter'), { color: PAL.y }).setDepth(51);
    this.add.rectangle(170, 14, 120, 12, 0x000000).setStrokeStyle(1, 0xfcfcfc).setDepth(51);
    this.meter = this.add.rectangle(111, 14, 0, 10, hex('h')).setOrigin(0, 0.5).setDepth(52);

    this.banner = text(this, WIDTH / 2, 290, t('ep8.howto'), { wrap: 220, color: PAL.k, shadow: false }).setDepth(51);
    this.banner.setBackgroundColor('#fcfcfc').setPadding(4, 2);

    // A button you hold down rather than tap.
    const btn = button(this, WIDTH / 2, HEIGHT - 42, t('ep8.pour'), () => this.stopPour(), { width: 170, height: 46, size: 30 });
    btn.on('pointerdown', () => this.startPour());
    btn.on('pointerout', () => this.stopPour());
    this.input.keyboard?.on('keydown-SPACE', () => this.startPour());
    this.input.keyboard?.on('keyup-SPACE', () => this.stopPour());

    this.drawCup();
  }

  zzz(hero) {
    const z = text(this, hero.x + 10, hero.y - 40, 'Zzz', { color: PAL.w });
    this.tweens.add({ targets: z, y: z.y - 6, alpha: 0.4, duration: 900, yoyo: true, repeat: -1 });
    return z;
  }

  drawCup() {
    const g = this.cupGfx;
    g.clear();
    const left = CUP_X - CUP_W / 2;
    const top = CUP_Y - CUP_H;
    // Saucer, cup and handle.
    g.fillStyle(hex('N')).fillRect(left - 10, CUP_Y, CUP_W + 20, 5);
    g.fillStyle(hex('w')).fillRect(left, top, CUP_W, CUP_H);
    g.fillStyle(hex('w')).fillRect(left + CUP_W, top + 10, 10, 4).fillRect(left + CUP_W + 6, top + 10, 4, 22).fillRect(left + CUP_W, top + 28, 10, 4);
    // Coffee, from the bottom up.
    const h = Math.min(1, this.level) * (CUP_H - 4);
    g.fillStyle(hex('O')).fillRect(left + 3, CUP_Y - 2 - h, CUP_W - 6, h);
    // The line to aim for.
    const lineY = CUP_Y - 2 - LINE * (CUP_H - 4);
    g.fillStyle(hex('y')).fillRect(left - 6, lineY - 1, 6, 3).fillRect(left + CUP_W, lineY - 1, 6, 3);
  }

  startPour() {
    if (this.state !== 'pour' || this.pouring) return;
    this.pouring = true;
    this.banner.setVisible(false);
    this.tweens.add({ targets: this.pot, angle: -40, duration: 200 });
    this.time.delayedCall(180, () => this.pouring && this.stream.setVisible(true));
  }

  stopPour() {
    if (!this.pouring) return;
    this.pouring = false;
    this.stream.setVisible(false);
    this.tweens.add({ targets: this.pot, angle: 0, duration: 200 });
    if (this.state !== 'pour') return;
    if (this.level >= LINE) this.drink();
    else if (this.level > 0) this.say(t('ep8.more'));
  }

  update(_, dtMs) {
    if (!this.pouring || this.state !== 'pour' || !this.stream.visible) return;
    this.level += Math.min(dtMs, 50) / 1000 / FILL_TIME;
    this.stream.height = CUP_Y - 2 - Math.min(1, this.level) * (CUP_H - 4) - 150;
    if (this.level > 1.04) this.spill();
    this.drawCup();
  }

  spill() {
    this.state = 'spill';
    this.pouring = false;
    this.stream.setVisible(false);
    this.tweens.add({ targets: this.pot, angle: 0, duration: 200 });
    this.bumps++;
    this.say(t('ep8.spill'));
    const puddle = this.add.ellipse(CUP_X, CUP_Y + 6, 90, 10, hex('O')).setDepth(4);
    this.tweens.add({ targets: puddle, alpha: 0, duration: 900, delay: 900, onComplete: () => puddle.destroy() });
    this.time.delayedCall(1300, () => {
      this.level = 0;
      this.drawCup();
      this.state = 'pour';
    });
  }

  // The cup goes to whoever's turn it is; they drink and wake up a bit.
  drink() {
    this.state = 'drink';
    const hero = this.drunk % 2 === 0 ? this.old : this.young;
    this.tweens.add({ targets: hero, y: hero.y - 8, duration: 200, yoyo: true, repeat: 1 });
    this.say('Mmm!');
    this.drunk++;
    this.tweens.add({ targets: this.meter, width: (118 * this.drunk) / CUPS, duration: 400 });
    if (this.drunk === CUPS / 2) this.sleepy.forEach((z) => z.destroy());
    this.time.delayedCall(900, () => {
      this.level = 0;
      this.drawCup();
      if (this.drunk >= CUPS) this.finish();
      else this.state = 'pour';
    });
  }

  finish() {
    this.state = 'done';
    this.tweens.add({ targets: [this.old, this.young], y: 200, duration: 200, yoyo: true, repeat: 2 });
    this.say(t('ep8.awake'), 2000);
    this.time.delayedCall(2400, () => endPanel(this, 8, { bumps: this.bumps }));
  }

  say(str, duration = 1100) {
    this.msg?.destroy();
    this.msg = text(this, WIDTH / 2, 290, str, { wrap: 200, color: PAL.k, shadow: false }).setDepth(55);
    this.msg.setBackgroundColor('#fcfcfc').setPadding(4, 2);
    const m = this.msg;
    this.time.delayedCall(duration, () => m.destroy());
  }
}
