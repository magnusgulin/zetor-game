import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button } from '../ui.js';
import { endPanel } from '../flow.js';

// Episode 4: a taxi from the airport to the Hankkija store. At each
// crossing a blue sign points the way; tap the matching arrow. A wrong
// turn just means the driver turns around and tries again.

const CROSSINGS = 4;
const CX = 120; // crossing centre
const CY = 148;
const ROAD = 56;
const LANE_UP = CX + 14;
const STOP_Y = 212;

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

// Where the taxi goes for each choice: [x, y, angle] waypoints.
const ROUTES = {
  L: [[LANE_UP, CY + 14, 0], [CX - 40, CY + 14, -90], [-40, CY + 14, -90]],
  U: [[LANE_UP, CY, 0], [LANE_UP, -40, 0]],
  R: [[LANE_UP, CY - 14, 0], [CX + 40, CY - 14, 90], [WIDTH + 40, CY - 14, 90]],
};
const ARROWS = { L: 'arrowL', U: 'arrowU', R: 'arrowR' };

export class Episode4 extends Phaser.Scene {
  constructor() {
    super('Episode4');
  }

  create() {
    this.bumps = 0;
    this.crossing = 0;
    this.busy = true;

    // Pick a route that never asks for the same turn twice in a row.
    this.route = [];
    for (let i = 0; i < CROSSINGS; i++) {
      const options = ['L', 'U', 'R'].filter((d) => d !== this.route[i - 1]);
      this.route.push(Phaser.Utils.Array.GetRandom(options));
    }

    this.world = this.add.container(0, 0);
    this.taxi = this.add.image(LANE_UP, HEIGHT + 20, 'taxiTop').setScale(2).setDepth(10);

    // HUD.
    this.add.rectangle(WIDTH / 2, 14, WIDTH, 28, 0x000000, 0.55).setDepth(50);
    this.counter = text(this, WIDTH / 2 + 14, 13, '', { color: PAL.y }).setDepth(51);
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.banner = text(this, WIDTH / 2, 50, t('ep4.howto'), { wrap: 220 }).setDepth(51);
    this.banner.setBackgroundColor('rgba(0,0,0,0.6)').setPadding(4, 2);

    // Direction buttons.
    this.pads = ['L', 'U', 'R'].map((dir, i) => {
      const x = 46 + i * 74;
      const r = this.add.rectangle(x, HEIGHT - 34, 66, 52, 0x000000, 0.55).setStrokeStyle(2, 0xfcfcfc).setDepth(60);
      const icon = this.add.image(x, HEIGHT - 34, ARROWS[dir]).setScale(3).setDepth(61);
      r.setInteractive({ useHandCursor: true });
      r.on('pointerdown', () => this.choose(dir));
      return [r, icon];
    });
    const keys = { LEFT: 'L', UP: 'U', RIGHT: 'R' };
    for (const [key, dir] of Object.entries(keys)) this.input.keyboard?.on(`keydown-${key}`, () => this.choose(dir));

    this.showCrossing();
  }

  setPads(on) {
    this.pads.forEach(([r, icon]) => {
      r.setAlpha(on ? 1 : 0.4);
      icon.setAlpha(on ? 1 : 0.4);
    });
  }

  // City blocks around a four-way crossing, with the sign on the corner.
  drawCrossing(dir) {
    this.world.removeAll(true);
    const g = this.add.graphics();
    this.world.add(g);
    g.fillStyle(hex('N')).fillRect(0, 28, WIDTH, HEIGHT);
    g.fillStyle(hex('n'));
    g.fillRect(CX - ROAD / 2, 28, ROAD, HEIGHT);
    g.fillRect(0, CY - ROAD / 2, WIDTH, ROAD);
    // Lane markings.
    g.fillStyle(hex('w'));
    for (let y = 30; y < HEIGHT; y += 14) if (Math.abs(y - CY) > ROAD / 2 + 4) g.fillRect(CX - 1, y, 2, 7);
    for (let x = 0; x < WIDTH; x += 14) if (Math.abs(x - CX) > ROAD / 2 + 4) g.fillRect(x, CY - 1, 7, 2);
    // Pedestrian crossing.
    for (let x = CX - ROAD / 2 + 3; x < CX + ROAD / 2; x += 6) g.fillRect(x, CY + ROAD / 2 + 2, 3, 8);

    // Stone buildings seen from above, with roofs and chimneys.
    const colors = Phaser.Utils.Array.Shuffle(['Y', 'S', 'N', 'o']);
    const blocks = [
      [4, 32, CX - ROAD / 2 - 12, CY - ROAD / 2 - 40],
      [CX + ROAD / 2 + 8, 32, WIDTH - CX - ROAD / 2 - 12, CY - ROAD / 2 - 40],
      [4, CY + ROAD / 2 + 12, CX - ROAD / 2 - 12, 150],
      [CX + ROAD / 2 + 8, CY + ROAD / 2 + 12, WIDTH - CX - ROAD / 2 - 12, 150],
    ];
    blocks.forEach(([x, y, w, h], i) => {
      g.fillStyle(hex(colors[i])).fillRect(x, y, w, h);
      g.fillStyle(hex('k')).fillRect(x, y + h - 2, w, 2);
      g.fillStyle(hex('R'));
      for (let cx = x + 6; cx < x + w - 6; cx += 18) g.fillRect(cx, y + 6, 4, 4);
    });

    // Blue street sign with the way to Hankkija.
    const sx = 192;
    const sy = CY + ROAD / 2 + 54;
    g.fillStyle(hex('k')).fillRect(sx - 1, sy + 20, 3, 34);
    g.fillStyle(hex('w')).fillRect(sx - 44, sy - 26, 88, 48);
    g.fillStyle(hex('B')).fillRect(sx - 42, sy - 24, 84, 44);
    this.world.add(text(this, sx, sy - 12, 'Hankkija'));
    this.world.add(this.add.image(sx, sy + 8, ARROWS[dir]).setScale(3));
  }

  showCrossing() {
    this.busy = true;
    this.setPads(false);
    this.drawCrossing(this.route[this.crossing]);
    this.counter.setText(t('ep4.cross', { n: this.crossing + 1, total: CROSSINGS }));
    this.taxi.setPosition(LANE_UP, HEIGHT + 20).setAngle(0);
    this.cameras.main.fadeIn(300);
    this.tweens.add({
      targets: this.taxi,
      y: STOP_Y,
      duration: 1400,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.busy = false;
        this.setPads(true);
      },
    });
  }

  choose(dir) {
    if (this.busy) return;
    this.busy = true;
    this.setPads(false);
    this.banner.setText('').setVisible(false);
    const right = dir === this.route[this.crossing];
    if (!right) this.bumps++;

    const steps = ROUTES[dir].map(([x, y, angle], i) => ({
      targets: this.taxi,
      x,
      y,
      angle,
      duration: i === 0 ? 500 : 700,
    }));
    this.tweens.chain({
      tweens: steps,
      onComplete: () => {
        if (right) this.crossing++;
        this.cameras.main.fadeOut(250);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          if (!right) {
            this.banner.setVisible(true).setText(t('ep4.wrong')).setColor(PAL.y);
            this.time.delayedCall(1200, () => this.banner.setText('').setVisible(false));
          }
          if (this.crossing >= CROSSINGS) this.arrive();
          else this.showCrossing();
        });
      },
    });
  }

  // The Hankkija store, with a new Zetor waiting outside.
  arrive() {
    this.world.removeAll(true);
    this.pads.forEach(([r, icon]) => {
      r.setVisible(false);
      icon.setVisible(false);
    });
    this.counter.setText('');
    const g = this.add.graphics();
    this.world.add(g);
    g.fillStyle(hex('N')).fillRect(0, 28, WIDTH, HEIGHT);
    g.fillStyle(hex('n')).fillRect(CX - ROAD / 2, 150, ROAD, HEIGHT);
    g.fillStyle(hex('n')).fillRect(0, 150, WIDTH, 36);
    // Shop front.
    g.fillStyle(hex('Y')).fillRect(10, 40, WIDTH - 20, 100);
    g.fillStyle(hex('x')).fillRect(30, 50, WIDTH - 60, 26);
    g.fillStyle(hex('t'));
    for (let x = 20; x < WIDTH - 30; x += 36) g.fillRect(x, 88, 24, 30);
    g.fillStyle(hex('O')).fillRect(CX - 10, 104, 20, 36);
    this.world.add(text(this, CX, 63, 'HANKKIJA', { size: 20, color: PAL.w }));
    this.world.add(this.add.image(54, 136, 'zetor_0').setScale(1.5));

    this.taxi.setPosition(LANE_UP, HEIGHT + 20).setAngle(0);
    this.cameras.main.fadeIn(300);
    this.tweens.add({
      targets: this.taxi,
      y: 200,
      duration: 1600,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.banner.setVisible(true).setText(t('ep4.arrive')).setColor(PAL.y).setY(260);
        this.world.add(this.add.image(LANE_UP + 30, 206, 'old').setScale(2));
        this.world.add(this.add.image(LANE_UP + 48, 206, 'young').setScale(2));
        this.time.delayedCall(2000, () => endPanel(this, 4, { bumps: this.bumps }));
      },
    });
  }
}
