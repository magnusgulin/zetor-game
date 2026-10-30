import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button, Controls } from '../ui.js';
import { endPanel } from '../flow.js';
import { CAR_TOP_COLORS } from '../sprites.js';

// Episode 1: both heroes on one motorcycle, heading for Vaasa on a gravel
// road. Steer around potholes, puddles, cows and other cars. Near Vaasa
// the back tyre starts smoking and finally gives up.

const ROAD_L = 64;
const ROAD_R = 176;
const SPEED = 70; // road scroll, logical px per second
const STEER = 75;
const START_KM = 40;
const SMOKE_KM = 8; // the tyre starts smoking here
const DRIVE_TIME = 50; // seconds of normal driving before the smoke
const KM_PER_PX = (START_KM - SMOKE_KM) / (SPEED * DRIVE_TIME);

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

export class Episode1 extends Phaser.Scene {
  constructor() {
    super('Episode1');
  }

  create() {
    this.speed = SPEED;
    this.travelled = 0;
    this.bumps = 0;
    this.state = 'drive';
    this.hurtUntil = 0;
    this.obstacles = [];
    this.decor = [];
    this.nextObstacle = 1.5;
    this.nextDecor = 0;

    this.makeRoadTexture();
    this.road = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'ep1road');

    // Fill the roadside before the start so it does not look empty.
    for (let y = -20; y < HEIGHT; y += 40) this.spawnDecor(y);

    this.bike = this.add.image(WIDTH / 2, HEIGHT - 120, 'motoTop').setScale(2).setDepth(10);

    // HUD.
    this.add.rectangle(WIDTH / 2, 14, WIDTH, 28, 0x000000, 0.55).setDepth(50);
    this.kmText = text(this, WIDTH / 2, 13, '', { color: PAL.y }).setDepth(51);
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.banner = text(this, WIDTH / 2, 70, t('ep1.howto'), { wrap: 200 }).setDepth(51);
    this.time.delayedCall(3500, () => this.state === 'drive' && this.banner.setText(''));

    this.controls = new Controls(this, { action: false });
    this.updateKm();
  }

  // A gravel road on grass, drawn once and scrolled.
  makeRoadTexture() {
    if (this.textures.exists('ep1road')) return;
    const tex = this.textures.createCanvas('ep1road', WIDTH, 64);
    const ctx = tex.getContext();
    const fill = (c, x, y, w, h) => {
      ctx.fillStyle = PAL[c];
      ctx.fillRect(x, y, w, h);
    };
    fill('g', 0, 0, WIDTH, 64);
    fill('G', ROAD_L - 6, 0, 3, 64);
    fill('G', ROAD_R + 3, 0, 3, 64);
    fill('Y', ROAD_L, 0, ROAD_R - ROAD_L, 64);
    // Gravel speckles and wheel ruts.
    const rand = new Phaser.Math.RandomDataGenerator(['gravel']);
    for (let i = 0; i < 140; i++) fill(rand.pick(['o', 'N', 'o']), rand.between(ROAD_L, ROAD_R - 1), rand.between(0, 63), 1, 1);
    for (const x of [ROAD_L + 30, ROAD_L + 36, ROAD_R - 36, ROAD_R - 30]) {
      for (let y = 0; y < 64; y += 2) fill('o', x, y, 1, 1);
    }
    for (let i = 0; i < 60; i++) {
      const x = rand.pick([rand.between(0, ROAD_L - 8), rand.between(ROAD_R + 8, WIDTH - 1)]);
      fill('h', x, rand.between(0, 63), 1, 2);
    }
    tex.refresh();
  }

  spawnDecor(y) {
    const left = Math.random() < 0.5;
    const key = Phaser.Utils.Array.GetRandom(['spruce', 'spruce', 'spruce', 'barn', 'churns', 'stone']);
    // Milk churn stands sit right by the road; the rest further out.
    const margin = key === 'churns' ? 12 : Phaser.Math.Between(16, 40);
    const x = left ? ROAD_L - margin : ROAD_R + margin;
    const img = this.add.image(x, y, key).setScale(2).setDepth(key === 'spruce' ? 20 : 1);
    this.decor.push(img);
  }

  spawnObstacle() {
    const type = Phaser.Utils.Array.GetRandom(['pothole', 'pothole', 'puddle', 'puddle', 'cow', 'car', 'car']);
    const x = Phaser.Math.Between(ROAD_L + 14, ROAD_R - 14);
    const key = type === 'car' ? `carTop_${Phaser.Utils.Array.GetRandom(CAR_TOP_COLORS)}` : type;
    const o = this.add.image(x, -30, key).setScale(2).setDepth(5);
    o.kind = type;
    o.vx = 0;
    o.vyFactor = 1;
    if (type === 'cow') {
      // The cow wanders slowly across the road.
      o.x = Math.random() < 0.5 ? ROAD_L - 10 : ROAD_R + 10;
      o.vx = o.x < WIDTH / 2 ? 14 : -14;
      o.setAngle(o.vx > 0 ? 90 : -90);
    }
    if (type === 'car') {
      // Traffic keeps to the right: cars we catch up with in the right lane,
      // oncoming cars in the left lane. Both drive calmly.
      const oncoming = Math.random() < 0.5;
      o.x = oncoming ? ROAD_L + 26 : ROAD_R - 26;
      o.vyFactor = oncoming ? 1.5 : 0.45;
      o.setAngle(oncoming ? 180 : 0);
    }
    this.obstacles.push(o);
  }

  update(time, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    if (this.state === 'done') return;

    // Steering.
    let dir = 0;
    if (this.controls.leftDown) dir -= 1;
    if (this.controls.rightDown) dir += 1;
    if (this.state !== 'stopped') {
      this.bike.x = Phaser.Math.Clamp(this.bike.x + dir * STEER * dt, ROAD_L + 10, ROAD_R - 10);
      this.bike.setAngle(dir * 8);
    }

    // Scrolling world.
    const dy = this.speed * dt;
    this.travelled += dy;
    this.road.tilePositionY -= dy;

    this.nextDecor -= dy;
    if (this.nextDecor <= 0) {
      this.spawnDecor(-30);
      this.nextDecor = Phaser.Math.Between(26, 60);
    }
    this.decor = this.decor.filter((d) => {
      d.y += dy;
      if (d.y > HEIGHT + 40) d.destroy();
      return d.active;
    });

    if (this.state === 'drive') {
      this.nextObstacle -= dt;
      if (this.nextObstacle <= 0) {
        this.spawnObstacle();
        this.nextObstacle = Phaser.Math.FloatBetween(1.6, 2.4);
      }
    }

    const bikeBox = new Phaser.Geom.Rectangle(this.bike.x - 7, this.bike.y - 14, 14, 28);
    this.obstacles = this.obstacles.filter((o) => {
      o.y += dy * o.vyFactor;
      o.x += o.vx * dt;
      if (!o.hit && time > this.hurtUntil) {
        const b = o.getBounds();
        Phaser.Geom.Rectangle.Inflate(b, -5, -5);
        if (Phaser.Geom.Rectangle.Overlaps(bikeBox, b)) this.bump(o, time);
      }
      if (o.y > HEIGHT + 40 || o.x < -30 || o.x > WIDTH + 30) o.destroy();
      return o.active;
    });

    this.updateKm();
    if (this.state === 'drive' && this.km() <= SMOKE_KM) this.startSmoke();
    if (this.state === 'smoke') this.updateSmoke(dt);
  }

  km() {
    return Math.max(0, START_KM - this.travelled * KM_PER_PX);
  }

  updateKm() {
    this.kmText.setText(t('ep1.km', { km: Math.ceil(this.km()) }));
  }

  bump(o, time) {
    o.hit = true;
    this.bumps++;
    this.hurtUntil = time + 1000;
    this.cameras.main.shake(200, 0.01);
    this.tweens.add({ targets: this.bike, alpha: 0.3, duration: 100, yoyo: true, repeat: 3 });
    if (o.kind === 'puddle') {
      for (let i = 0; i < 6; i++) this.splash(o.x, o.y, 'c');
    }
    if (o.kind === 'cow') this.say(o.x, o.y - 24, 'MUU!');
  }

  splash(x, y, color) {
    const p = this.add.rectangle(x, y, 3, 3, hex(color)).setDepth(15);
    this.tweens.add({
      targets: p,
      x: x + Phaser.Math.Between(-24, 24),
      y: y + Phaser.Math.Between(-24, 8),
      alpha: 0,
      duration: 500,
      onComplete: () => p.destroy(),
    });
  }

  say(x, y, str) {
    const s = text(this, x, y, str, { color: PAL.w }).setDepth(30);
    this.tweens.add({ targets: s, y: y - 20, alpha: 0, duration: 1200, onComplete: () => s.destroy() });
  }

  startSmoke() {
    this.state = 'smoke';
    this.banner.setText(t('ep1.smoke')).setColor(PAL.y);
    this.tweens.add({ targets: this.banner, scale: 1.15, duration: 300, yoyo: true, repeat: 3 });
    this.smokeTimer = 0;
    this.smokeTime = 0;
  }

  // The bike slows down while the back tyre smokes more and more.
  updateSmoke(dt) {
    this.smokeTime += dt;
    this.speed = Math.max(0, SPEED * (1 - this.smokeTime / 9));
    this.smokeTimer -= dt;
    if (this.smokeTimer <= 0) {
      this.smokeTimer = Math.max(0.06, 0.25 - this.smokeTime * 0.025);
      const puff = this.add.image(this.bike.x + Phaser.Math.Between(-3, 3), this.bike.y + 18, 'puff').setScale(2).setDepth(12);
      this.tweens.add({
        targets: puff,
        y: puff.y + 30 + Phaser.Math.Between(0, 20),
        x: puff.x + Phaser.Math.Between(-12, 12),
        scale: 5,
        alpha: 0,
        duration: 1400,
        onComplete: () => puff.destroy(),
      });
    }
    if (this.speed === 0) this.bang();
  }

  bang() {
    this.state = 'stopped';
    this.cameras.main.shake(300, 0.02);
    this.cameras.main.flash(200, 255, 255, 255);
    for (let i = 0; i < 12; i++) this.splash(this.bike.x, this.bike.y + 16, 'k');
    this.bike.setAngle(-6);
    this.banner.setText(t('ep1.bang'));
    this.time.delayedCall(2200, () => {
      this.state = 'done';
      endPanel(this, 1, { bumps: this.bumps });
    });
  }
}
