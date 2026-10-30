import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button, landscape } from '../ui.js';
import { endPanel } from '../flow.js';

// Episode 6: driving the new Zetor home through the evening and night.
// First pick up barrels and boxes by the road to build a seat for the
// second hero. Later he falls asleep and loses a glove; a lorry driver
// has seen it, so they turn around and pick it up.

const ROAD_Y = 250;
const TX = 96; // the tractor stays here; the world scrolls past
const SPEED = 45;
const ZONE = 34;
const SEAT_ITEMS = 3;

export class Episode6 extends Phaser.Scene {
  constructor() {
    super('Episode6');
  }

  create() {
    this.bumps = 0;
    this.state = 'collect';
    this.speed = SPEED;
    this.items = [];
    this.posts = [];
    this.stack = [];
    this.stackTop = ROAD_Y - 12;
    this.nextItem = 1.5;
    this.nextPost = 0;

    landscape(this, { roadY: ROAD_Y, sky: ['p', 'S'], ground: 'G' });
    this.dashes = this.add.tileSprite(WIDTH / 2, ROAD_Y + 12, WIDTH, 2, this.dashTexture()).setDepth(1);
    for (let x = 10; x < WIDTH; x += 70) this.spawnPost(x);

    // The tractor and its riders live in one container so the whole rig
    // can turn around by flipping it.
    this.rig = this.add.container(TX, 0).setDepth(45);
    this.tractor = this.add.sprite(0, ROAD_Y - 12, 'zetor_0').setScale(2).play('zetor-drive');
    this.driver = this.add.image(-20, ROAD_Y - 36, 'old').setScale(2);
    this.rider = this.add.image(-44, ROAD_Y - 22, 'young').setScale(2);
    this.beam = this.add.triangle(0, 0, 36, ROAD_Y - 10, 130, ROAD_Y - 30, 130, ROAD_Y + 14, 0xfce0a8, 0).setOrigin(0, 0);
    this.rig.add([this.beam, this.tractor, this.driver, this.rider]);

    this.night = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000020, 0).setDepth(40);

    // HUD.
    this.add.rectangle(WIDTH / 2, 14, WIDTH, 28, 0x000000, 0.55).setDepth(50);
    this.counter = text(this, WIDTH / 2 + 14, 13, '', { color: PAL.y }).setDepth(51);
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.banner = text(this, WIDTH / 2, 56, t('ep6.howto'), { wrap: 220 }).setDepth(51);
    this.banner.setBackgroundColor('rgba(0,0,0,0.5)').setPadding(4, 2);

    this.pickBtn = button(this, WIDTH / 2, HEIGHT - 42, t('ep6.pick'), () => this.pick(), { width: 170, height: 46, size: 30 }).setDepth(60);
    this.askBtn = button(this, WIDTH / 2, HEIGHT - 42, t('ep6.ask'), () => this.ask(), { width: 200, height: 46 }).setDepth(60).setVisible(false);
    this.input.keyboard?.on('keydown-SPACE', () => (this.askBtn.visible ? this.ask() : this.pick()));

    this.updateCounter();
  }

  dashTexture() {
    if (!this.textures.exists('dash')) {
      const tex = this.textures.createCanvas('dash', 24, 2);
      tex.getContext().fillStyle = PAL.w;
      tex.getContext().fillRect(0, 0, 12, 2);
      tex.refresh();
    }
    return 'dash';
  }

  spawnPost(x) {
    // White roadside posts with a black band, as on Finnish country roads.
    const post = this.add.rectangle(x, ROAD_Y - 6, 3, 12, 0xfcfcfc).setDepth(2);
    const band = this.add.rectangle(x, ROAD_Y - 9, 3, 3, 0x000000).setDepth(2);
    this.posts.push(post, band);
  }

  updateCounter() {
    this.counter.setText(this.state === 'collect' ? t('ep6.seat', { n: this.stack.length, total: SEAT_ITEMS }) : '');
  }

  update(time, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    const dx = this.speed * dt;
    this.dashes.tilePositionX += dx;
    this.rig.y = this.speed !== 0 && Math.floor(time / 180) % 2 ? -1 : 0;

    this.nextPost -= Math.abs(dx);
    if (this.nextPost <= 0) {
      this.spawnPost(this.speed > 0 ? WIDTH + 10 : -10);
      this.nextPost = 70;
    }
    this.posts = this.posts.filter((p) => {
      p.x -= dx;
      if (p.x < -20 || p.x > WIDTH + 20) p.destroy();
      return p.active;
    });

    if (this.state === 'collect') {
      this.nextItem -= dt;
      if (this.nextItem <= 0) {
        const kind = Phaser.Utils.Array.GetRandom(['barrel', 'box']);
        const item = this.add.image(WIDTH + 20, ROAD_Y + 36, kind).setScale(2).setDepth(30);
        this.items.push(item);
        this.nextItem = Phaser.Math.FloatBetween(2.4, 3.2);
      }
    }

    this.items = this.items.filter((item) => {
      if (item.taken) return item.active;
      item.x -= dx;
      const gone = item.x < -30 || item.x > WIDTH + 30;
      if (gone) {
        if (item.isGlove) this.missGlove();
        else if (this.state === 'collect') this.bumps++;
        item.destroy();
      }
      return item.active;
    });
  }

  nearItem() {
    return this.items.find((i) => !i.taken && Math.abs(i.x - TX) < ZONE);
  }

  pick() {
    if (this.state !== 'collect' && this.state !== 'back') return;
    this.tweens.add({ targets: this.rider, y: this.rider.y - 6, duration: 100, yoyo: true });
    const item = this.nearItem();
    if (!item) return;
    item.taken = true;
    if (item.isGlove) {
      this.foundGlove(item);
      return;
    }
    // Fly the item onto the stack behind the driver.
    const h = item.displayHeight;
    const localY = this.stackTop - h / 2;
    this.stackTop -= h;
    this.items = this.items.filter((i) => i !== item);
    this.rig.add(item);
    item.setPosition(item.x - TX, item.y);
    this.stack.push(item);
    this.tweens.add({ targets: item, x: -44, y: localY, duration: 350, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: this.rider, y: this.stackTop - 14, duration: 350 });
    this.rig.bringToTop(this.rider);
    this.updateCounter();
    if (this.stack.length >= SEAT_ITEMS) this.seatDone();
  }

  seatDone() {
    this.state = 'comfy';
    this.updateCounter();
    this.pickBtn.setVisible(false);
    this.banner.setText('').setVisible(false);
    this.items.forEach((i) => i.destroy());
    this.items = [];
    this.time.delayedCall(500, () => this.bubble(this.rider, t('ep6.comfy'), 1800));
    this.time.delayedCall(2600, () => this.nightFalls());
  }

  // Night: the headlight comes on, the rider dozes off and the glove falls.
  nightFalls() {
    this.state = 'night';
    this.tweens.add({ targets: this.night, fillAlpha: 0.6, duration: 2500 });
    this.tweens.add({ targets: this.beam, fillAlpha: 0.35, duration: 2500 });
    this.time.delayedCall(2600, () => {
      this.bubble(this.rider, 'Zzz...', 2200);
      this.tweens.add({ targets: this.rider, angle: 12, duration: 600 });
    });
    this.time.delayedCall(3800, () => {
      const glove = this.add.image(TX - 44, this.stackTop, 'glove').setScale(2).setDepth(46);
      this.tweens.add({
        targets: glove,
        y: ROAD_Y + 8,
        angle: 200,
        duration: 600,
        ease: 'Quad.easeIn',
        onComplete: () => this.items.push(glove),
      });
    });
    this.time.delayedCall(8000, () => {
      this.tweens.add({ targets: this.rider, angle: 0, duration: 200 });
      this.bubble(this.rider, t('ep6.where'), 2000);
    });
    this.time.delayedCall(9500, () => this.lorryArrives());
  }

  lorryArrives() {
    this.state = 'truck';
    this.lorry = this.add.image(WIDTH + 70, ROAD_Y - 8, 'lorry').setScale(2).setFlipX(true).setDepth(45);
    this.tweens.add({ targets: this, speed: 0, duration: 1500 });
    this.tweens.add({
      targets: this.lorry,
      x: TX + 100,
      duration: 2200,
      ease: 'Quad.easeOut',
      onComplete: () => this.askBtn.setVisible(true),
    });
  }

  ask() {
    if (this.state !== 'truck' || !this.askBtn.visible) return;
    this.askBtn.setVisible(false);
    this.bubble(this.lorry, t('ep6.driver'), 2600, 140);
    this.time.delayedCall(2800, () => {
      this.bubble(this.rider, t('ep6.back'), 1800);
      this.tweens.add({ targets: this.lorry, x: -80, duration: 2600, ease: 'Quad.easeIn', onComplete: () => this.lorry.destroy() });
    });
    this.time.delayedCall(4400, () => this.turnAround(-1));
  }

  // Flip the whole rig and drive the other way.
  turnAround(dir) {
    this.tweens.add({
      targets: this.rig,
      scaleX: dir,
      duration: 500,
      onComplete: () => {
        this.speed = SPEED * dir;
        if (dir < 0) {
          this.state = 'back';
          this.pickBtn.setVisible(true);
          this.sendGlove(1800);
        }
      },
    });
  }

  sendGlove(delay) {
    this.time.delayedCall(delay, () => {
      const glove = this.add.image(-20, ROAD_Y + 8, 'glove').setScale(2).setDepth(46);
      glove.isGlove = true;
      this.items.push(glove);
    });
  }

  missGlove() {
    this.bumps++;
    this.banner.setVisible(true).setText(t('ep6.missed'));
    this.time.delayedCall(1500, () => this.banner.setText('').setVisible(false));
    this.sendGlove(1500);
  }

  foundGlove(glove) {
    this.state = 'found';
    this.pickBtn.setVisible(false);
    this.tweens.add({ targets: glove, x: TX + 44, y: this.stackTop, duration: 400, onComplete: () => glove.destroy() });
    this.bubble(this.rider, t('ep6.thanks'), 1800);
    this.time.delayedCall(2000, () => this.turnAround(1));
    this.time.delayedCall(4600, () => endPanel(this, 6, { bumps: this.bumps }));
  }

  // A speech bubble above a sprite, in world coordinates.
  bubble(target, str, duration, wrap = 150) {
    const m = target.getWorldTransformMatrix();
    const x = Phaser.Math.Clamp(m.tx, wrap / 2 + 6, WIDTH - wrap / 2 - 6);
    const s = text(this, x, m.ty - 36, str, { wrap, color: PAL.k, shadow: false }).setDepth(55);
    s.setBackgroundColor('#fcfcfc').setPadding(4, 2);
    this.time.delayedCall(duration, () => s.destroy());
  }
}
