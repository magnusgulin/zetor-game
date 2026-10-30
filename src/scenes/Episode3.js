import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button, Controls } from '../ui.js';
import { endPanel } from '../flow.js';

// Episode 3: the flight south from Vaasa to Helsinki. Fly up and down
// around thunderclouds and flocks of gulls. At the end the plane comes
// in to land with Helsinki Cathedral on the skyline.

const TOP = 46;
const BOTTOM = 270;
const PLANE_X = 64;
const SPEED = 70; // obstacles scroll left, px per second
const CLIMB = 80;
const START_KM = 380;
const FLY_TIME = 45; // seconds

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

export class Episode3 extends Phaser.Scene {
  constructor() {
    super('Episode3');
  }

  create() {
    this.bumps = 0;
    this.flown = 0;
    this.state = 'fly';
    this.hurtUntil = 0;
    this.obstacles = [];
    this.clouds = [];
    this.nextObstacle = 2;
    this.nextCloud = 0;

    this.cameras.main.setBackgroundColor(PAL.c);
    this.makeGroundTexture();
    this.ground = this.add.tileSprite(WIDTH / 2, 316, WIDTH, 48, 'ep3ground').setDepth(2);

    for (let x = 20; x < WIDTH; x += 70) this.spawnCloud(x);

    this.plane = this.add.sprite(PLANE_X, 150, 'plane_0').setScale(2).setDepth(10).play('plane-fly');

    // HUD.
    this.add.rectangle(WIDTH / 2, 14, WIDTH, 28, 0x000000, 0.55).setDepth(50);
    this.kmText = text(this, WIDTH / 2, 13, '', { color: PAL.y }).setDepth(51);
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.banner = text(this, WIDTH / 2, 60, t('ep3.howto'), { wrap: 210 }).setDepth(51);
    this.time.delayedCall(3500, () => this.state === 'fly' && this.banner.setText(''));

    this.controls = new Controls(this, { action: false, vertical: true });
    this.updateKm();
  }

  // Finnish countryside from above: forest, fields and lakes.
  makeGroundTexture() {
    if (this.textures.exists('ep3ground')) return;
    const tex = this.textures.createCanvas('ep3ground', WIDTH, 48);
    const ctx = tex.getContext();
    const rand = new Phaser.Math.RandomDataGenerator(['finland']);
    ctx.fillStyle = PAL.G;
    ctx.fillRect(0, 0, WIDTH, 48);
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = rand.pick([PAL.g, PAL.g, PAL.h, PAL.Y]);
      ctx.fillRect(rand.between(0, WIDTH - 20), rand.between(4, 40), rand.between(8, 22), rand.between(3, 8));
    }
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = PAL.b;
      const x = rand.between(0, WIDTH - 30);
      const y = rand.between(6, 38);
      ctx.fillRect(x, y, rand.between(12, 30), rand.between(3, 6));
      ctx.fillRect(x + 3, y - 2, rand.between(6, 14), 2);
    }
    ctx.fillStyle = PAL.t;
    ctx.fillRect(0, 0, WIDTH, 2);
    tex.refresh();
  }

  spawnCloud(x) {
    const c = this.add.image(x, Phaser.Math.Between(TOP, 250), 'cloud').setScale(Phaser.Math.FloatBetween(1.5, 2.5)).setAlpha(0.85).setDepth(1);
    this.clouds.push(c);
  }

  spawnObstacle() {
    const y = Phaser.Math.Between(TOP + 10, BOTTOM - 10);
    if (Math.random() < 0.5) {
      const o = this.add.image(WIDTH + 50, y, 'storm').setScale(3).setDepth(5);
      o.wobble = 0;
      this.obstacles.push(o);
    } else {
      const n = Phaser.Math.Between(1, 3);
      for (let i = 0; i < n; i++) {
        const o = this.add.sprite(WIDTH + 30 + i * 18, y + (i % 2) * 14 - 7, 'gull').setScale(2).setDepth(6).play('gull-flap');
        o.wobble = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.obstacles.push(o);
      }
    }
  }

  update(time, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    if (this.state === 'done' || this.state === 'landing') return;

    // Climb and dive, with a little tilt.
    let dir = 0;
    if (this.controls.upDown) dir -= 1;
    if (this.controls.downDown) dir += 1;
    this.plane.y = Phaser.Math.Clamp(this.plane.y + dir * CLIMB * dt, TOP + 10, BOTTOM);
    this.plane.setAngle(dir * 6);

    const dx = SPEED * dt;
    this.flown += dt;
    this.ground.tilePositionX += dx * 0.3;

    this.nextCloud -= dx * 0.4;
    if (this.nextCloud <= 0) {
      this.spawnCloud(WIDTH + 40);
      this.nextCloud = Phaser.Math.Between(50, 90);
    }
    this.clouds = this.clouds.filter((c) => {
      c.x -= dx * 0.4;
      if (c.x < -60) c.destroy();
      return c.active;
    });

    if (this.state === 'fly') {
      this.nextObstacle -= dt;
      if (this.nextObstacle <= 0) {
        this.spawnObstacle();
        this.nextObstacle = Phaser.Math.FloatBetween(1.8, 2.6);
      }
    }

    const planeBox = new Phaser.Geom.Rectangle(this.plane.x - 40, this.plane.y - 8, 84, 18);
    this.obstacles = this.obstacles.filter((o) => {
      o.x -= dx;
      o.wobble += dt * 3;
      o.y += Math.sin(o.wobble) * 0.3;
      if (!o.hit && time > this.hurtUntil) {
        const b = o.getBounds();
        Phaser.Geom.Rectangle.Inflate(b, -6, -6);
        if (Phaser.Geom.Rectangle.Overlaps(planeBox, b)) this.bump(o, time);
      }
      if (o.x < -80) o.destroy();
      return o.active;
    });

    this.updateKm();
    if (this.state === 'fly' && this.flown >= FLY_TIME) this.state = 'clearing';
    if (this.state === 'clearing' && this.obstacles.length === 0) this.land();
  }

  km() {
    return Math.max(0, START_KM * (1 - this.flown / FLY_TIME));
  }

  updateKm() {
    this.kmText.setText(t('ep3.km', { km: Math.ceil(this.km()) }));
  }

  bump(o, time) {
    o.hit = true;
    this.bumps++;
    this.hurtUntil = time + 1000;
    this.cameras.main.shake(250, 0.012);
    this.tweens.add({ targets: this.plane, alpha: 0.3, duration: 100, yoyo: true, repeat: 3 });
    const s = text(this, this.plane.x + 10, this.plane.y - 24, t('ep3.bump'), { color: PAL.y }).setDepth(30);
    this.tweens.add({ targets: s, y: s.y - 20, alpha: 0, duration: 1000, onComplete: () => s.destroy() });
  }

  // Helsinki slides in and the plane comes down to land.
  land() {
    this.state = 'landing';
    this.plane.setAngle(4);
    this.banner.setText(t('ep3.land')).setColor(PAL.y);

    const city = this.add.container(WIDTH + 100, 292).setDepth(3);
    const g = this.add.graphics();
    const block = (x, w, h, c) => g.fillStyle(hex(c)).fillRect(x, -h, w, h);
    block(-90, 30, 20, 'N');
    block(-56, 22, 28, 'Y');
    block(-30, 16, 18, 'N');
    // The cathedral: white with green domes.
    block(-10, 50, 30, 'w');
    block(-2, 8, 40, 'w');
    block(30, 8, 40, 'w');
    block(10, 14, 46, 'w');
    g.fillStyle(hex('Z')).fillCircle(17, -48, 8);
    g.fillCircle(2, -41, 4).fillCircle(34, -41, 4);
    g.fillStyle(hex('y')).fillRect(16, -60, 2, 5);
    block(44, 28, 22, 'Y');
    block(76, 20, 14, 'N');
    // Runway.
    g.fillStyle(hex('n')).fillRect(-100, 0, 200, 8);
    for (let x = -96; x < 100; x += 14) g.fillStyle(hex('w')).fillRect(x, 3, 7, 2);
    city.add(g);

    this.tweens.add({ targets: city, x: 140, duration: 3500, ease: 'Sine.easeOut' });
    this.tweens.add({
      targets: this.plane,
      x: 120,
      y: 280,
      duration: 3800,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.plane.setAngle(0);
        this.time.delayedCall(800, () => {
          this.state = 'done';
          endPanel(this, 3, { bumps: this.bumps });
        });
      },
    });
  }
}
