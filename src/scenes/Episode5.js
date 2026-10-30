import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button } from '../ui.js';
import { endPanel } from '../flow.js';

// Episode 5: closing time at Hankkija. A short cutscene where the clerk is
// already leaving but turns back, then the player stamps the papers.

const GROUND = 300;

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

export class Episode5 extends Phaser.Scene {
  constructor() {
    super('Episode5');
  }

  create() {
    this.stamped = 0;
    this.busy = false;
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.outside();
  }

  // Evening outside the shop. The clerk heads home, our heroes come running.
  outside() {
    this.cameras.main.setBackgroundColor(PAL.B);
    const g = this.add.graphics();
    g.fillStyle(hex('y')).fillCircle(200, 50, 10);
    g.fillStyle(hex('B')).fillCircle(205, 46, 9);
    g.fillStyle(hex('Y')).fillRect(10, 130, WIDTH - 20, GROUND - 130);
    g.fillStyle(hex('x')).fillRect(30, 142, WIDTH - 60, 26);
    g.fillStyle(hex('y'));
    for (let x = 22; x < WIDTH - 30; x += 40) g.fillRect(x, 190, 26, 40);
    g.fillStyle(hex('O')).fillRect(108, 250, 26, GROUND - 250);
    g.fillStyle(hex('N')).fillRect(0, GROUND, WIDTH, 16);
    g.fillStyle(hex('n')).fillRect(0, GROUND + 16, WIDTH, HEIGHT);
    text(this, WIDTH / 2, 155, 'HANKKIJA', { size: 20 });

    const clerk = this.add.image(121, GROUND - 14, 'clerk').setScale(2).setFlipX(true);
    const bag = this.add.image(109, GROUND - 12, 'briefcase').setScale(2);
    const old = this.add.image(WIDTH + 20, GROUND - 14, 'old').setScale(2).setFlipX(true);
    const young = this.add.image(WIDTH + 44, GROUND - 14, 'young').setScale(2).setFlipX(true);

    const walk = (targets, x, duration, delay = 0) =>
      this.tweens.add({ targets, x, duration, delay, onUpdate: () => (targets.y = GROUND - 14 - (Math.floor(targets.x / 6) % 2)) });

    walk(clerk, 50, 2600);
    this.tweens.add({ targets: bag, x: 38, duration: 2600 });
    walk(old, 170, 1600, 1200);
    walk(young, 196, 1600, 1200);

    this.time.delayedCall(2600, () => this.bubble(170, 230, t('ep5.wait')));
    this.time.delayedCall(4200, () => {
      clerk.setFlipX(false);
      this.bubble(70, 230, t('ep5.sigh'));
    });
    this.time.delayedCall(5600, () => {
      clerk.setFlipX(true);
      walk(clerk, 121, 1400);
      this.tweens.add({ targets: bag, x: 132, duration: 1400 });
      walk(old, 128, 1800, 300);
      walk(young, 140, 1800, 400);
      this.tweens.add({ targets: [clerk, bag, old, young], alpha: 0, duration: 400, delay: 1900 });
    });
    this.time.delayedCall(8200, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.children.list.filter((c) => c.depth < 52).forEach((c) => c.destroy());
        this.inside();
      });
    });
  }

  bubble(x, y, str) {
    const s = text(this, Phaser.Math.Clamp(x, 70, WIDTH - 70), y, str, { wrap: 130, color: PAL.k, shadow: false });
    s.setBackgroundColor('#fcfcfc').setPadding(4, 2);
    this.time.delayedCall(1800, () => s.destroy());
  }

  // At the counter: stamp each paper.
  inside() {
    this.cameras.main.fadeIn(300);
    this.cameras.main.setBackgroundColor(PAL.Y);
    const g = this.add.graphics();
    g.fillStyle(hex('o')).fillRect(0, 150, WIDTH, HEIGHT);
    g.fillStyle(hex('O')).fillRect(0, 150, WIDTH, 4);
    // A lamp and a calendar for April 1955 on the wall.
    g.fillStyle(hex('k')).fillRect(40, 30, 2, 40);
    g.fillStyle(hex('x')).fillTriangle(26, 82, 56, 82, 41, 66);
    g.fillStyle(hex('y')).fillRect(36, 82, 10, 3);
    g.fillStyle(hex('w')).fillRect(170, 40, 46, 56);
    g.fillStyle(hex('r')).fillRect(170, 40, 46, 12);
    text(this, 193, 46, 'IV', { size: 10, shadow: false });
    text(this, 193, 72, '1955', { size: 10, color: PAL.k, shadow: false });
    this.add.image(WIDTH - 40, 132, 'clerk').setScale(3);
    this.add.image(30, 132, 'old').setScale(3);
    this.add.image(62, 132, 'young').setScale(3);

    this.docs = t('ep5.docs');
    this.counter = text(this, WIDTH / 2, 13, '', { color: PAL.k, shadow: false });
    this.banner = text(this, WIDTH / 2, 110, t('ep5.howto'), { color: PAL.k, shadow: false });
    this.stampImg = this.add.image(WIDTH / 2, 150, 'stamp').setScale(4).setDepth(20);
    this.stampBtn = button(this, WIDTH / 2, HEIGHT - 36, t('ep5.stamp'), () => this.stamp(), { width: 170, height: 44, size: 30 });
    this.input.keyboard?.on('keydown-SPACE', () => this.stamp());
    this.nextPaper();
  }

  nextPaper() {
    const n = this.stamped;
    this.counter.setText(t('ep5.paper', { n: n + 1, total: this.docs.length }));
    const paper = this.add.container(-80, 250);
    const sheet = this.add.rectangle(0, 0, 110, 130, 0xfcfcfc).setStrokeStyle(1, 0x7c7c7c);
    paper.add(sheet);
    paper.add(text(this, 0, -50, this.docs[n], { color: PAL.k, shadow: false }));
    const lines = this.add.graphics();
    lines.fillStyle(hex('N'));
    for (let y = -30; y < 40; y += 10) lines.fillRect(-44, y, Phaser.Math.Between(50, 88), 2);
    paper.add(lines);
    this.paper = paper;
    this.busy = true;
    this.tweens.add({ targets: paper, x: WIDTH / 2, angle: Phaser.Math.Between(-4, 4), duration: 500, ease: 'Back.easeOut', onComplete: () => (this.busy = false) });
  }

  stamp() {
    if (this.busy || !this.paper) return;
    this.busy = true;
    this.banner.setText('');
    this.tweens.add({
      targets: this.stampImg,
      y: 262,
      duration: 160,
      yoyo: true,
      hold: 80,
      onYoyo: () => {
        this.cameras.main.shake(120, 0.01);
        const mark = text(this, 0, 30, 'OK', { size: 30, color: PAL.r, shadow: false }).setAngle(-12);
        this.paper.add(mark);
      },
      onComplete: () => {
        this.stamped++;
        const done = this.paper;
        this.paper = null;
        this.tweens.add({ targets: done, x: WIDTH + 90, angle: 10, duration: 450, delay: 150, onComplete: () => done.destroy() });
        if (this.stamped < this.docs.length) this.time.delayedCall(450, () => this.nextPaper());
        else this.finish();
      },
    });
  }

  finish() {
    this.stampBtn.setVisible(false);
    this.counter.setText('');
    this.time.delayedCall(600, () => {
      this.banner.setText(t('ep5.done')).setY(250);
      this.time.delayedCall(1800, () => endPanel(this, 5));
    });
  }
}
