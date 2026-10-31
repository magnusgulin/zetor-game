import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button } from '../ui.js';
import { endPanel } from '../flow.js';

// Episode 7: morning in Björneborg. Our heroes are hungry, but everyone
// rushing to work is too busy to help. Ask a few people, find the shop,
// then pick the sausage and the bread from the shelves.

const GROUND = 290;
const HERO_X = 80;
const ASKS_NEEDED = 3;
const SCROLL = 30;
const ZONE = 30;

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

const GOODS = ['korv', 'rye', 'milk', 'fish', 'cheese', 'apples'];
const WANTED = ['korv', 'rye'];

export class Episode7 extends Phaser.Scene {
  constructor() {
    super('Episode7');
  }

  create() {
    this.bumps = 0;
    this.asks = 0;
    this.state = 'street';
    this.scroll = SCROLL;
    this.people = [];
    this.nextPerson = 1;
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.street();
  }

  // Wooden town houses in soft colours, drawn once and scrolled.
  streetTexture() {
    if (this.textures.exists('ep7street')) return 'ep7street';
    const tex = this.textures.createCanvas('ep7street', 240, 150);
    const ctx = tex.getContext();
    const fill = (c, x, y, w, h) => {
      ctx.fillStyle = PAL[c];
      ctx.fillRect(x, y, w, h);
    };
    const colors = ['Y', 't', 'S', 'z', 'N'];
    for (let i = 0, x = 0; x < 240; i++) {
      const w = [56, 48, 64, 44, 28][i % 5];
      const top = [30, 46, 22, 40, 50][i % 5];
      fill(colors[i % colors.length], x, top, w - 2, 150 - top);
      fill('R', x - 2, top - 6, w + 2, 6);
      for (let wx = x + 6; wx < x + w - 12; wx += 16) {
        for (let wy = top + 12; wy < 120; wy += 30) {
          fill('w', wx - 1, wy - 1, 10, 14);
          fill('B', wx, wy, 8, 12);
          fill('w', wx + 3, wy, 1, 12);
        }
      }
      x += w;
    }
    tex.refresh();
    return 'ep7street';
  }

  street() {
    this.cameras.main.setBackgroundColor(PAL.t);
    this.add.circle(40, 60, 12, hex('y'));
    this.houses = this.add.tileSprite(WIDTH / 2, GROUND - 75, WIDTH, 150, this.streetTexture());
    this.add.rectangle(WIDTH / 2, GROUND + 8, WIDTH, 16, hex('N'));
    this.add.rectangle(WIDTH / 2, GROUND + 60, WIDTH, 88, hex('n'));

    this.old = this.add.image(HERO_X - 9, GROUND - 14, 'old').setScale(2).setDepth(10);
    this.young = this.add.image(HERO_X + 9, GROUND - 14, 'young').setScale(2).setDepth(10);

    this.banner = text(this, WIDTH / 2, 50, t('ep7.howto'), { wrap: 220 }).setDepth(51);
    this.banner.setBackgroundColor('rgba(0,0,0,0.55)').setPadding(4, 2);
    this.askBtn = button(this, WIDTH / 2, HEIGHT - 42, t('ep7.ask'), () => this.ask(), { width: 170, height: 46, size: 30 }).setDepth(60);
    this.input.keyboard?.on('keydown-SPACE', () => this.ask());
  }

  update(time, dtMs) {
    if (this.state !== 'street' && this.state !== 'arriving') return;
    const dt = Math.min(dtMs, 50) / 1000;
    const dx = this.scroll * dt;
    this.houses.tilePositionX += dx;
    const step = this.scroll > 0 && Math.floor(time / 200) % 2;
    this.old.y = GROUND - 14 - (step ? 1 : 0);
    this.young.y = GROUND - 14 - (step ? 0 : 1);

    if (this.state === 'street') {
      this.nextPerson -= dt;
      if (this.nextPerson <= 0) {
        // Commuters in a hurry, each in a slightly different coat.
        const p = this.add.image(WIDTH + 20, GROUND - 14, Math.random() < 0.7 ? 'clerk' : 'grocer').setScale(2).setFlipX(true).setDepth(9);
        p.setTint(Phaser.Utils.Array.GetRandom([0xffffff, 0xc8d8ff, 0xffd8b0, 0xd8ffd0]));
        p.speed = Phaser.Math.Between(55, 70);
        this.people.push(p);
        this.nextPerson = Phaser.Math.FloatBetween(1.6, 2.4);
      }
    }
    this.people = this.people.filter((p) => {
      p.x -= dx + p.speed * dt;
      p.y = GROUND - 14 - (Math.floor(p.x / 5) % 2);
      if (p.x < -20) p.destroy();
      return p.active;
    });

    if (this.shop) {
      this.shop.x -= dx;
      if (this.state === 'arriving' && this.shop.x <= 150) this.reachShop();
    }
  }

  ask() {
    if (this.state !== 'street') return;
    const p = this.people.find((q) => !q.asked && Math.abs(q.x - HERO_X) < ZONE);
    if (!p) {
      this.bubble(this.young, t('ep7.hungry'));
      return;
    }
    p.asked = true;
    p.speed += 30;
    this.bubble(p, Phaser.Utils.Array.GetRandom(t('ep7.busy')));
    this.asks++;
    if (this.asks >= ASKS_NEEDED) this.time.delayedCall(1200, () => this.showShop());
  }

  showShop() {
    this.state = 'arriving';
    this.askBtn.setVisible(false);
    this.banner.setVisible(false);
    const c = this.add.container(WIDTH + 70, 0).setDepth(5);
    const g = this.add.graphics();
    g.fillStyle(hex('S')).fillRect(-60, GROUND - 130, 120, 130);
    g.fillStyle(hex('R')).fillRect(-64, GROUND - 136, 128, 8);
    g.fillStyle(hex('w')).fillRect(-50, GROUND - 120, 100, 18);
    g.fillStyle(hex('t')).fillRect(-50, GROUND - 90, 50, 50);
    g.fillStyle(hex('O')).fillRect(12, GROUND - 70, 26, 70);
    g.fillStyle(hex('y')).fillCircle(32, GROUND - 36, 2);
    c.add(g);
    c.add(text(this, 0, GROUND - 112, 'KAUPPA BUTIK', { color: PAL.k, shadow: false }));
    c.add(this.add.image(-36, GROUND - 70, 'korv').setScale(1.5));
    c.add(this.add.image(-16, GROUND - 56, 'rye').setScale(1.5));
    this.shop = c;
  }

  reachShop() {
    this.state = 'shop-door';
    this.bubble(this.young, t('ep7.found'));
    this.tweens.add({ targets: [this.old, this.young], x: this.shop.x + 25, alpha: 0, duration: 1200, delay: 1200 });
    this.time.delayedCall(2600, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.children.list.filter((o) => o.depth < 52).forEach((o) => o.destroy());
        this.inside();
      });
    });
  }

  // Inside the shop: tap the sausage and the bread.
  inside() {
    this.state = 'shop';
    this.got = new Set();
    this.cameras.main.fadeIn(300);
    this.cameras.main.setBackgroundColor(PAL.Y);
    const g = this.add.graphics();
    for (const y of [168, 238]) {
      g.fillStyle(hex('o')).fillRect(16, y, WIDTH - 32, 6);
      g.fillStyle(hex('O')).fillRect(16, y + 6, WIDTH - 32, 2);
    }
    g.fillStyle(hex('o')).fillRect(0, 300, WIDTH, HEIGHT);
    g.fillStyle(hex('O')).fillRect(0, 300, WIDTH, 4);
    this.add.image(WIDTH - 36, 284, 'grocer').setScale(2);
    this.add.image(26, 284, 'old').setScale(2);
    this.add.image(46, 284, 'young').setScale(2);

    this.banner = text(this, WIDTH / 2, 56, t('ep7.shop'), { wrap: 220, color: PAL.k, shadow: false });
    const spots = Phaser.Utils.Array.Shuffle([...GOODS]);
    spots.forEach((key, i) => {
      const x = 52 + (i % 3) * 68;
      const y = i < 3 ? 146 : 216;
      const item = this.add.image(x, y, key).setScale(3).setInteractive({ useHandCursor: true });
      item.on('pointerdown', () => this.choose(item, key));
    });
  }

  choose(item, key) {
    if (this.state !== 'shop' || this.got.has(key)) return;
    if (!WANTED.includes(key)) {
      this.bumps++;
      this.tweens.add({ targets: item, angle: 10, duration: 60, yoyo: true, repeat: 2 });
      this.banner.setText(t('ep7.wrong')).setColor(PAL.r);
      return;
    }
    this.got.add(key);
    this.tweens.add({ targets: item, x: 100 + this.got.size * 30, y: 318, scale: 2, duration: 400, ease: 'Quad.easeOut' });
    if (this.got.size === WANTED.length) {
      this.state = 'paid';
      this.banner.setText('');
      this.time.delayedCall(700, () => this.bubble({ x: WIDTH - 50, y: 280 }, t('ep7.pay'), 2200));
      this.time.delayedCall(3000, () => endPanel(this, 7, { bumps: this.bumps }));
    }
  }

  bubble(target, str, duration = 1500) {
    const x = Phaser.Math.Clamp(target.x, 76, WIDTH - 76);
    const s = text(this, x, target.y - 38, str, { wrap: 140, color: PAL.k, shadow: false }).setDepth(55);
    s.setBackgroundColor('#fcfcfc').setPadding(4, 2);
    this.time.delayedCall(duration, () => s.destroy());
  }
}
