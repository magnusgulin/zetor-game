import { WIDTH, HEIGHT, PAL } from '../config.js';
import { t } from '../i18n.js';
import { text, button, landscape } from '../ui.js';
import { CAR_COLORS } from '../sprites.js';
import { endPanel } from '../flow.js';

// Episode 2: the motorcycle is broken, so our heroes stand by the road and
// wave for a lift to Vaasa airport. Cars drive past slowly. Full cars
// cannot stop; wave at one with free seats when it reaches you.

const ROAD_Y = 230;
const HERO_X = 150;
const CAR_SPEED = 50;
const ZONE = 50; // how close a car must be for a wave to count
const CAR_Y = ROAD_Y - 18;
const FULL_FIRST = 3; // full cars that pass before the first one with room

export class Episode2 extends Phaser.Scene {
  constructor() {
    super('Episode2');
  }

  create() {
    this.bumps = 0;
    this.state = 'wait';
    this.car = null;
    this.carsSinceFree = 0;
    this.carsSeen = 0;

    landscape(this, { roadY: ROAD_Y });

    // The broken motorcycle, still smoking a little.
    this.add.image(96, ROAD_Y + 54, 'moto').setScale(2).setAngle(-8);
    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => {
        const puff = this.add.image(92, ROAD_Y + 50, 'puff').setScale(1.5).setAlpha(0.8);
        this.tweens.add({ targets: puff, y: puff.y - 20, alpha: 0, scale: 3, duration: 1500, onComplete: () => puff.destroy() });
      },
    });

    // Road sign towards the airport.
    this.add.rectangle(210, ROAD_Y + 46, 3, 30, 0x503000);
    this.add.rectangle(210, ROAD_Y + 34, 56, 16, 0xfcfcfc).setStrokeStyle(1, 0x000000);
    text(this, 210, ROAD_Y + 33, t('ep2.sign'), { size: 10, color: PAL.k, shadow: false });

    this.old = this.add.image(HERO_X - 10, ROAD_Y + 52, 'old').setScale(2);
    this.young = this.add.image(HERO_X + 10, ROAD_Y + 52, 'young').setScale(2);

    // HUD.
    button(this, 26, 13, '◀', () => this.scene.start('Select'), { width: 36, height: 20, fill: PAL.B, edge: PAL.b }).setDepth(52);
    this.banner = text(this, WIDTH / 2, 56, t('ep2.howto'), { wrap: 210 }).setDepth(51);

    this.waveBtn = button(this, WIDTH / 2, HEIGHT - 42, t('ep2.wave'), () => this.wave(), { width: 170, height: 46, size: 30 });
    this.input.keyboard?.on('keydown-SPACE', () => this.wave());

    this.time.delayedCall(1200, () => this.spawnCar());
  }

  spawnCar() {
    if (this.state !== 'wait') return;
    // The first cars are always full, so the player learns what a full car
    // looks like. After that every few cars one is sure to have room.
    const free = this.carsSeen >= FULL_FIRST && (this.carsSinceFree >= 3 || Math.random() < 0.4);
    this.carsSeen++;
    this.carsSinceFree = free ? 0 : this.carsSinceFree + 1;
    const color = Phaser.Utils.Array.GetRandom(CAR_COLORS);
    this.car = this.add.image(-70, CAR_Y, `car_${color}_${free ? 'free' : 'full'}`).setScale(3);
    this.car.free = free;
    this.car.color = color;
    this.car.speed = CAR_SPEED;
    this.car.waved = false;
  }

  update(_, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    const car = this.car;
    if (!car || this.state !== 'wait') return;
    car.x += car.speed * dt;
    // A gentle bounce so the old cars look like they are moving.
    car.y = CAR_Y + (Math.floor(car.x / 12) % 2 ? 0 : -1);
    if (car.x > WIDTH + 70) {
      car.destroy();
      this.car = null;
      this.time.delayedCall(Phaser.Math.Between(600, 1600), () => this.spawnCar());
    }
  }

  wave() {
    if (this.state !== 'wait') return;
    this.tweens.add({ targets: this.young, y: this.young.y - 8, duration: 120, yoyo: true, repeat: 1 });
    this.tweens.add({ targets: this.old, y: this.old.y - 5, duration: 140, yoyo: true, delay: 60 });

    const car = this.car;
    if (!car || car.waved) return;
    const dist = car.x - HERO_X;
    if (dist < -ZONE) {
      this.say(HERO_X, ROAD_Y + 24, t('ep2.early'), PAL.w);
      return;
    }
    if (dist > ZONE) return;

    car.waved = true;
    if (!car.free) {
      this.bumps++;
      this.say(car.x, car.y - 40, t('ep2.full'), PAL.y);
      this.tweens.add({ targets: car, speed: CAR_SPEED * 1.6, duration: 400 });
      return;
    }
    this.pickUp(car);
  }

  // The car pulls over, our heroes climb in and off they go.
  pickUp(car) {
    this.state = 'lift';
    this.waveBtn.setVisible(false);
    this.banner.setText('');
    this.tweens.add({
      targets: car,
      x: HERO_X + 14,
      duration: 700,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.say(car.x, car.y - 40, t('ep2.stop'), PAL.y);
        this.tweens.add({ targets: [this.old, this.young], x: car.x, y: car.y + 10, alpha: 0, duration: 900, delay: 400 });
        this.time.delayedCall(1500, () => {
          car.setTexture(`car_${car.color}_full`);
          this.tweens.add({ targets: car, x: WIDTH + 80, duration: 1600, ease: 'Quad.easeIn' });
        });
        this.time.delayedCall(3400, () => endPanel(this, 2, { bumps: this.bumps }));
      },
    });
  }

  say(x, y, str, color) {
    const s = text(this, Phaser.Math.Clamp(x, 60, WIDTH - 60), y, str, { color }).setDepth(30);
    this.tweens.add({ targets: s, y: y - 18, alpha: 0, duration: 1400, delay: 300, onComplete: () => s.destroy() });
  }
}
