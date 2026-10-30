import { WIDTH, HEIGHT, FONT, PAL } from './config.js';

export function text(scene, x, y, str, opts = {}) {
  const { size = 20, color = PAL.w, align = 'center', wrap, origin = 0.5, lineSpacing = -2, font = FONT } = opts;
  const style = { fontFamily: `"${font}", monospace`, fontSize: `${size}px`, color, align, lineSpacing };
  if (wrap) style.wordWrap = { width: wrap };
  const obj = scene.add.text(x, y, str, style);
  obj.setOrigin(origin, typeof opts.originY === 'number' ? opts.originY : origin);
  if (opts.shadow !== false) obj.setShadow(1, 1, PAL.k, 0, false, true);
  return obj;
}

// A chunky 8-bit button. Big hit area so it is easy to tap on a phone.
export function button(scene, x, y, label, onTap, opts = {}) {
  const { width = 140, height = 28, fill = PAL.r, edge = PAL.R, size = 20 } = opts;
  const c = scene.add.container(x, y);
  const shadow = scene.add.rectangle(2, 2, width, height, Phaser.Display.Color.HexStringToColor(PAL.k).color);
  const body = scene.add.rectangle(0, 0, width, height, Phaser.Display.Color.HexStringToColor(fill).color);
  body.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(edge).color);
  const label_ = text(scene, 0, 0, label, { size });
  c.add([shadow, body, label_]);
  c.setSize(width, height);
  c.setInteractive({ useHandCursor: true });
  c.on('pointerdown', () => c.setPosition(x + 1, y + 1));
  c.on('pointerout', () => c.setPosition(x, y));
  c.on('pointerup', () => {
    c.setPosition(x, y);
    onTap();
  });
  c.label = label_;
  return c;
}

const hex = (ch) => Phaser.Display.Color.HexStringToColor(PAL[ch]).color;

// Sky, forest and field in flat 8-bit bands. Returns the y of the road.
export function landscape(scene, opts = {}) {
  const { sky = ['c', 't'], ground = 'g', roadY = HEIGHT - 120 } = opts;
  const g = scene.add.graphics();
  // Sky: two colours with a dithered seam.
  g.fillStyle(hex(sky[0])).fillRect(0, 0, WIDTH, roadY - 60);
  g.fillStyle(hex(sky[1])).fillRect(0, roadY - 60, WIDTH, 40);
  g.fillStyle(hex(sky[1]));
  for (let x = 0; x < WIDTH; x += 2) {
    for (let y = roadY - 66; y < roadY - 60; y += 2) g.fillRect(x + ((y / 2) % 2), y, 1, 1);
  }
  // A row of spruce trees on the horizon.
  const forestTop = roadY - 40;
  g.fillStyle(hex('G')).fillRect(0, forestTop + 14, WIDTH, 16);
  for (let x = -4; x < WIDTH + 8; x += 7) {
    const h = 14 + ((x * 37) % 9);
    for (let i = 0; i < h; i++) {
      const half = Math.floor(i / 3) + 1;
      g.fillRect(x - half, forestTop + 16 - h + i, half * 2 + 1, 1);
    }
  }
  // Field and road.
  g.fillStyle(hex(ground)).fillRect(0, forestTop + 30, WIDTH, HEIGHT);
  g.fillStyle(hex('n')).fillRect(0, roadY, WIDTH, 24);
  g.fillStyle(hex('N')).fillRect(0, roadY, WIDTH, 2);
  g.fillStyle(hex('N')).fillRect(0, roadY + 22, WIDTH, 2);
  return { g, roadY };
}

// Simple controls shared by all episodes: hold left/right (or up/down with
// `vertical`), tap action. On a phone these are big on-screen buttons; on
// desktop the arrow keys and space bar do the same.
export class Controls {
  constructor(scene, opts = {}) {
    const { action = true, vertical = false, y = HEIGHT - 34 } = opts;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.actionPressed = false;
    this.keys = scene.input.keyboard?.addKeys('LEFT,RIGHT,SPACE,UP,DOWN');

    const pad = (x, w, icon, onDown, onUp) => {
      const r = scene.add.rectangle(x, y, w, 52, 0x000000, 0.35).setStrokeStyle(2, 0xfcfcfc, 0.6);
      r.setInteractive();
      r.on('pointerdown', () => { r.setFillStyle(0xfcfcfc, 0.35); onDown(); });
      const up = () => { r.setFillStyle(0x000000, 0.35); onUp?.(); };
      r.on('pointerup', up);
      r.on('pointerout', up);
      r.setDepth(100);
      scene.add.image(x, y, icon).setScale(2).setDepth(101);
      return r;
    };

    if (vertical) {
      pad(36, 64, 'arrowU', () => (this.up = true), () => (this.up = false));
      pad(106, 64, 'arrowD', () => (this.down = true), () => (this.down = false));
    } else {
      pad(36, 64, 'arrowL', () => (this.left = true), () => (this.left = false));
      pad(106, 64, 'arrowR', () => (this.right = true), () => (this.right = false));
    }
    if (action) {
      pad(198, 76, 'actionBtn', () => (this.actionPressed = true));
    }
  }

  get leftDown() {
    return this.left || this.keys?.LEFT.isDown;
  }

  get rightDown() {
    return this.right || this.keys?.RIGHT.isDown;
  }

  get upDown() {
    return this.up || this.keys?.UP.isDown;
  }

  get downDown() {
    return this.down || this.keys?.DOWN.isDown;
  }

  // True once per tap.
  consumeAction() {
    const key = this.keys && (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) || Phaser.Input.Keyboard.JustDown(this.keys.UP));
    const hit = this.actionPressed || key;
    this.actionPressed = false;
    return hit;
  }
}
