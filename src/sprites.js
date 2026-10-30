import { PAL } from './config.js';

// All art is generated at start-up from these pixel maps, so the game
// has no image files to load. One character is one pixel; '.' is clear.

const ART = {
  old: [
    '..OOOO..',
    '.OOOOOOO',
    '..sssS..',
    '..sssk..',
    'N.ssss..',
    'N..sNN..',
    '..ssss..',
    '.BBBBBB.',
    'BBBBBBBB',
    'sBBBBBBs',
    '.BBBBBB.',
    '.nnnnnn.',
    '.nn..nn.',
    '.kk..kk.',
  ],
  young: [
    '..bbbb..',
    '.bbbbbbb',
    '.yssss..',
    '.ysssk..',
    '.yssss..',
    '..ssss..',
    '...ss...',
    '.GGGGGG.',
    'GGGGGGGG',
    'sGGGGGGs',
    '.GGGGGG.',
    '.oooooo.',
    '.oo..oo.',
    '.kk..kk.',
  ],
  moto: [
    '.......kk.......',
    '........k...nn..',
    '...kk...k..nnn..',
    '..rrrrrrrrrk....',
    '..rRRrrrrr.k....',
    '.kkk.nnnn..kkk..',
    'k...k.NN..k...k.',
    'k.N.kkkkkkk.N.k.',
    'k...k.....k...k.',
    '.kkk.......kkk..',
  ],
  car: [
    '....BBBBBBB.....',
    '...BttBBttBB....',
    '..BttBBBttBBB...',
    '.BBBBBBBBBBBBBB.',
    'BBBBBBBBBBBBBBBy',
    'BBkkkBBBBBBkkkBB',
    '.kNNNk....kNNNk.',
    '..kkk......kkk..',
  ],
  taxi: [
    '......kyk.......',
    '....yyyyyyy.....',
    '...yttyyttyy....',
    '..yttyyyttyyy...',
    '.yyyyyyyyyyyyyy.',
    'ykykykykykykykyw',
    'yykkkyyyyyykkkyy',
    '.kNNNk....kNNNk.',
    '..kkk......kkk..',
  ],
  plane: [
    '..............N.',
    '.............NN.',
    '..NNNNNNNNNNNNN.',
    '.NbNtNtNtNtNNNN.',
    'NNNNNNNNNNNNNNn.',
    '.nnnnnnnnnnnnn..',
    '....kkkkkkkk....',
    '......kkkk......',
  ],
  paper: [
    '.wwwwwwww...',
    '.wnnnnnnw...',
    '.wwwwwwww...',
    '.wnnnnnww..y',
    '.wwwwwwww.yy',
    '.wnnnnnnwyy.',
    '.wwwwwwwyy..',
    '.wnnnnnyyw..',
    '.wwwwwOwww..',
    '.wnnnnnnw...',
    '.wwwwwwww...',
  ],
  sausage: [
    '.......SS.......',
    '.....SSSSS......',
    '...SSSSSSS......',
    '..SSSSSS........',
    '.SSSSS..YYYYYY..',
    '.SSS...YyyyyyyY.',
    '.SS...YyyyyyyyyY',
    '......YyyyyyyyyY',
    '......YYYYYYYYYY',
  ],
  coffee: [
    '...w..w...',
    '..w..w....',
    '...w..w...',
    '..........',
    'wwwwwwww..',
    'wOOOOOOwww',
    'wwwwwwww.w',
    'wwwwwwwwww',
    'wwwwwwww..',
    '.wwwwww...',
    'NNNNNNNNNN',
  ],
  house: [
    '.......RR.......',
    '.....RRRRRR.....',
    '...RRRRRRRRRR...',
    '.RRRRRRRRRRRRRR.',
    'wrrrrrrrrrrrrrrw',
    'wrrwwwrrrrwwwrrw',
    'wrrwtwrrrrwtwrrw',
    'wrrwwwrOOrwwwrrw',
    'wrrrrrrOOrrrrrrw',
    'wrrrrrrOOrrrrrrw',
  ],
  lock: [
    '..nnnn..',
    '.n....n.',
    '.n....n.',
    'yyyyyyyy',
    'yyyyyyyy',
    'yyykkyyy',
    'yyykkyyy',
    'yyyyyyyy',
  ],
  check: [
    '.......h',
    '......hh',
    'h....hh.',
    'hh..hh..',
    '.hhhh...',
    '..hh....',
  ],
  puff: [
    '.NN.',
    'NNNN',
    'NNNN',
    '.NN.',
  ],
  actionBtn: [
    '...yyyy...',
    '.yyyyyyyy.',
    '.yyyyyyyy.',
    'yyyyyyyyyy',
    'yyyyyyyyyy',
    'yyyyyyyyyy',
    'yyyyyyyyyy',
    '.yyyyyyyy.',
    '.yyyyyyyy.',
    '...yyyy...',
  ],
  arrowL: [
    '...w',
    '..ww',
    '.www',
    'wwww',
    '.www',
    '..ww',
    '...w',
  ],
  arrowR: [
    'w...',
    'ww..',
    'www.',
    'wwww',
    'www.',
    'ww..',
    'w...',
  ],
};

function fromAscii(scene, key, rows) {
  const h = rows.length;
  const w = rows[0].length;
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex.getContext();
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = PAL[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });
  tex.refresh();
}

function fromDraw(scene, key, w, h, draw) {
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex.getContext();
  const px = (x, y, ch) => {
    ctx.fillStyle = PAL[ch];
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  };
  draw(px);
  tex.refresh();
}

// A tractor wheel: black tyre with tread lugs that shift each frame so the
// wheel appears to roll, a red rim and a dark hub.
function wheel(px, cx, cy, r, frame) {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d = Math.hypot(x + 0.5, y + 0.5);
      if (d > r) continue;
      if (d > r - 1) {
        const a = Math.atan2(y, x) + frame * 0.4;
        px(cx + x, cy + y, Math.floor((a / Math.PI) * 4 + 8) % 2 ? 'k' : 'O');
      } else if (d > r * 0.55) {
        px(cx + x, cy + y, 'k');
      } else if (d > r * 0.25) {
        px(cx + x, cy + y, 'r');
      } else {
        px(cx + x, cy + y, 'n');
      }
    }
  }
}

// The Zetor 25A seen from the side, facing right. Two frames for driving.
function zetor(px, frame) {
  const rect = (x0, y0, w, h, ch) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(x, y, ch);
  };
  const rear = { x: 8, y: 17 };
  // Mudguard arching over the big rear wheel.
  for (let y = -11; y <= 0; y++) {
    for (let x = -11; x <= 11; x++) {
      const d = Math.hypot(x + 0.5, y + 0.5);
      if (d > 8.6 && d <= 10.6) px(rear.x + x, rear.y + y, d > 9.8 ? 'R' : 'r');
    }
  }
  // Seat with a backrest on top of the mudguard.
  rect(4, 4, 1, 3, 'k');
  rect(4, 6, 6, 1, 'k');
  // Steering column and wheel.
  rect(14, 5, 1, 5, 'k');
  rect(11, 4, 6, 1, 'k');
  // Engine block under the hood.
  rect(17, 16, 13, 3, 'n');
  rect(17, 18, 13, 1, 'O');
  // Hood with rounded front and a dark stripe.
  rect(15, 10, 18, 6, 'r');
  rect(16, 9, 16, 1, 'r');
  rect(16, 9, 16, 1, 'R');
  rect(15, 15, 18, 1, 'R');
  rect(33, 11, 1, 4, 'r');
  // Grille and badge.
  rect(34, 11, 1, 5, 'N');
  rect(29, 12, 2, 1, 'w');
  // Exhaust pipe.
  rect(27, 2 + frame, 2, 8 - frame, 'k');
  wheel(px, rear.x, rear.y, 8, frame);
  wheel(px, 29, 21, 4, frame);
}

export function createSprites(scene) {
  for (const [key, rows] of Object.entries(ART)) fromAscii(scene, key, rows);
  for (const f of [0, 1]) fromDraw(scene, `zetor_${f}`, 36, 26, (px) => zetor(px, f));

  scene.anims.create({
    key: 'zetor-drive',
    frames: [{ key: 'zetor_0' }, { key: 'zetor_1' }],
    frameRate: 6,
    repeat: -1,
  });
}
