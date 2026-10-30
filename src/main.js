import { WIDTH, HEIGHT, FONT, LOGO_FONT } from './config.js';
import { Boot } from './scenes/Boot.js';
import { Title } from './scenes/Title.js';
import { Select } from './scenes/Select.js';
import { Intro } from './scenes/Intro.js';
import { Placeholder } from './scenes/Placeholder.js';
import { Credits } from './scenes/Credits.js';
import { Episode1 } from './scenes/Episode1.js';
import { Episode2 } from './scenes/Episode2.js';
import { Episode3 } from './scenes/Episode3.js';

async function start() {
  // Phaser draws text to canvas, so the pixel font must be ready first.
  try {
    await Promise.all([document.fonts.load(`10px "${FONT}"`), document.fonts.load(`8px "${LOGO_FONT}"`)]);
  } catch (e) {
    // Fall back to the browser's monospace font.
  }

  window.game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#000000',
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: { activePointers: 3 },
    scene: [Boot, Title, Select, Intro, Placeholder, Credits, Episode1, Episode2, Episode3],
  });
}

start();
