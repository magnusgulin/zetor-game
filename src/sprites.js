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
  // Top-down art for the road episodes.
  motoTop: [
    '....kk....',
    '....kk....',
    '....kk....',
    '.kkkNNkkk.',
    '.s..rr..s.',
    '.B.rrrr.B.',
    '.BBOOOOBB.',
    '.BBOOOOBB.',
    '..BBBBBB..',
    '..BBBBBB..',
    '.G.bbbb.G.',
    '.GGbbbbGG.',
    '.GGGGGGGG.',
    '..GGGGGG..',
    '...nnnn...',
    '....kk....',
    '....kk....',
    '....kk....',
  ],
  pothole: [
    '...OOOO...',
    '.OOkkkkOO.',
    'OkkkkkkkkO',
    'OkkkkkkkkO',
    '.OOkkkkOO.',
    '...OOOO...',
  ],
  puddle: [
    '....bbbbb.....',
    '..bbccccbbb...',
    '.bcctttcccbb..',
    'bccccccctccbb.',
    'bbcccccccccccb',
    '.bbbccccccccb.',
    '...bbbbbbbbb..',
  ],
  cow: [
    '.w......w.',
    '.wSSSSSSw.',
    '..SSssSS..',
    '...ssss...',
    '..SwwwwS..',
    '.SSwwwwSS.',
    '.SwwwSSwS.',
    '.wwwSSSww.',
    '.wwwwwwww.',
    '.wSSwwwww.',
    '.SSSSwwww.',
    '.wSSwwwSw.',
    '.wwwwwSSw.',
    '..wwwwww..',
    '....SS....',
    '....S.....',
  ],
  spruce: [
    '.....G.....',
    '....GGG....',
    '...GGgGG...',
    '..GGGGGGG..',
    '.GGgGGGgGG.',
    'GGGGGOGGGGG',
    '.GGgGGGgGG.',
    '..GGGGGGG..',
    '...GGgGG...',
    '....GGG....',
    '.....G.....',
  ],
  barn: [
    'wwwwwwwwwwwwwwww',
    'wRRRRRRRRRRRRRRw',
    'wrrrrrrrrrrrrrrw',
    'wRRRRRRRRRRRRRRw',
    'wrrrrrrrrrrrrrrw',
    'wRRRRRRRRRRRRRRw',
    'wwwwwwwwwwwwwwww',
    'wrrrrrrrrrrrrrrw',
    'wRRRRRRRRRRRRRRw',
    'wrrrrrrrrrrrrrrw',
    'wRRRRRRRRRRRRRRw',
    'wrrrrrrrrrrrrrrw',
    'wwwwwwwwwwwwwwww',
  ],
  churns: [
    'oooooooo',
    'oNNoNNoo',
    'oNnoNnoo',
    'oNNoNNoo',
    'oooooooo',
    'O......O',
  ],
  stone: [
    '.nnnn.',
    'nNNnnn',
    'nNnnnn',
    '.nnnn.',
  ],
  star: [
    '....y....',
    '....y....',
    '...yyy...',
    'yyyyyyyyy',
    '.yyyyyyy.',
    '..yyyyy..',
    '..yy.yy..',
    '.yy...yy.',
  ],
  starOff: [
    '....n....',
    '....n....',
    '...nnn...',
    'nnnnnnnnn',
    '.nnnnnnn.',
    '..nnnnn..',
    '..nn.nn..',
    '.nn...nn.',
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
// wheel appears to roll, a yellow rim and a darker hub.
function wheel(px, cx, cy, r, frame) {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d = Math.hypot(x + 0.5, y + 0.5);
      if (d > r) continue;
      if (d > r - 1) {
        const a = Math.atan2(y, x) + frame * 0.4;
        px(cx + x, cy + y, Math.floor((a / Math.PI) * 4 + 8) % 2 ? 'k' : 'n');
      } else if (d > r * 0.6) {
        px(cx + x, cy + y, 'k');
      } else if (d > r * 0.25) {
        px(cx + x, cy + y, 'y');
      } else {
        px(cx + x, cy + y, 'q');
      }
    }
  }
}

// The Zetor 25A seen from the side, facing right: pale green with yellow
// rims and the upright exhaust of the 25A. Two frames for driving.
function zetor(px, frame) {
  const rect = (x0, y0, w, h, ch) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(x, y, ch);
  };
  const rear = { x: 8, y: 17 };
  // Mudguard arching over the big rear wheel.
  for (let y = -11; y <= 0; y++) {
    for (let x = -11; x <= 11; x++) {
      const d = Math.hypot(x + 0.5, y + 0.5);
      if (d > 8.6 && d <= 10.6) px(rear.x + x, rear.y + y, d > 9.8 ? 'x' : 'Z');
    }
  }
  // Seat with a backrest on top of the mudguard.
  rect(4, 4, 1, 3, 'k');
  rect(4, 6, 6, 1, 'k');
  // Steering column and wheel.
  rect(14, 5, 1, 5, 'k');
  rect(11, 4, 6, 1, 'k');
  // Engine block under the hood.
  rect(17, 16, 13, 3, 'x');
  rect(17, 18, 13, 1, 'k');
  // Hood: rounded top with a highlight, darker lower edge.
  rect(15, 10, 18, 6, 'Z');
  rect(16, 9, 16, 1, 'Z');
  rect(16, 10, 16, 1, 'z');
  rect(15, 15, 18, 1, 'x');
  rect(33, 10, 1, 6, 'Z');
  // Radiator grille at the front with vertical slats.
  rect(34, 10, 1, 6, 'x');
  for (let y = 11; y < 15; y += 2) px(34, y, 'k');
  // Headlight on the side of the hood and the ZETOR badge.
  rect(31, 8, 2, 2, 'Y');
  px(31, 8, 'w');
  rect(22, 12, 6, 1, 'w');
  // Upright exhaust pipe.
  rect(27, 2 + frame, 2, 8 - frame, 'k');
  wheel(px, rear.x, rear.y, 8, frame);
  wheel(px, 29, 21, 4, frame);
}

// A 1950s car seen from the side, facing right. `heads` is how many people
// are already inside: a full car has no room for our heroes.
const CAR_SEATS = [
  [24, 4], [27, 4],
  [14, 4], [17, 4],
];

function carSide(draw, body, heads) {
  // Leave three rows at the top for luggage on the roof.
  const px = (x, y, ch) => draw(x, y + 3, ch);
  const rect = (x0, y0, w, h, ch) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(x, y, ch);
  };
  // Rounded roof and body.
  rect(12, 1, 16, 1, body);
  rect(10, 2, 20, 6, body);
  rect(3, 7, 35, 7, body);
  rect(2, 9, 37, 4, body);
  // A full car has suitcases strapped to the roof, easy to spot from afar.
  if (heads >= CAR_SEATS.length) {
    rect(12, -2, 7, 3, 'o');
    rect(20, -3, 8, 4, 'O');
    rect(15, -2, 1, 3, 'k');
    rect(23, -3, 1, 4, 'k');
  }
  // Windows.
  rect(12, 3, 7, 4, 't');
  rect(21, 3, 7, 4, 't');
  // People inside: hair and a face.
  CAR_SEATS.slice(0, heads).forEach(([x, y]) => {
    rect(x, y, 2, 1, 'O');
    rect(x, y + 1, 2, 2, 's');
  });
  // Chrome strip, bumpers, lights and door line.
  rect(4, 10, 33, 1, 'N');
  rect(1, 11, 3, 2, 'N');
  rect(37, 11, 3, 2, 'N');
  px(38, 9, 'y');
  px(2, 9, 'r');
  rect(20, 7, 1, 6, 'k');
  // Wheels.
  for (const cx of [10, 30]) {
    for (let y = -3; y <= 3; y++) {
      for (let x = -3; x <= 3; x++) {
        const d = Math.hypot(x, y);
        if (d <= 3.4) px(cx + x, 14 + y, d < 1.5 ? 'N' : 'k');
      }
    }
  }
}

export const CAR_COLORS = ['B', 'k', 'R', 'n', 'x'];

// A 1950s car seen from above, front up. X is the body colour.
const CAR_TOP = [
  '..XXXXXXXX..',
  '.XXyXXXXyXX.',
  '.XXXXXXXXXX.',
  'kXXXXXXXXXXk',
  'kXXXXXXXXXXk',
  '.XXXXXXXXXX.',
  '.XttttttttX.',
  '.XttttttttX.',
  '.XXXXXXXXXX.',
  '.XXXXXXXXXX.',
  '.XXXXXXXXXX.',
  '.XXXXXXXXXX.',
  '.XttttttttX.',
  '.XXXXXXXXXX.',
  'kXXXXXXXXXXk',
  'kXXXXXXXXXXk',
  '.XXXXXXXXXX.',
  '.XrXXXXXXrX.',
  '..XXXXXXXX..',
];
export const CAR_TOP_COLORS = ['b', 'R', 'k', 'N'];

export function createSprites(scene) {
  for (const [key, rows] of Object.entries(ART)) fromAscii(scene, key, rows);
  for (const c of CAR_TOP_COLORS) fromAscii(scene, `carTop_${c}`, CAR_TOP.map((r) => r.replaceAll('X', c)));
  for (const f of [0, 1]) fromDraw(scene, `zetor_${f}`, 36, 26, (px) => zetor(px, f));
  for (const c of CAR_COLORS) {
    fromDraw(scene, `car_${c}_free`, 41, 21, (px) => carSide(px, c, 1));
    fromDraw(scene, `car_${c}_full`, 41, 21, (px) => carSide(px, c, 4));
  }

  scene.anims.create({
    key: 'zetor-drive',
    frames: [{ key: 'zetor_0' }, { key: 'zetor_1' }],
    frameRate: 6,
    repeat: -1,
  });
}
