import { WIDTH, HEIGHT, PAL } from './config.js';
import { t } from './i18n.js';
import { text, button } from './ui.js';
import { getEpisode, markDone, cheatOn } from './episodes.js';

// Mark an episode done and move on to the next part of the story.
export function nextEpisode(scene, id) {
  markDone(id);
  const next = getEpisode(id + 1);
  if (getEpisode(id).ending) scene.scene.start('Credits');
  else if (next) scene.scene.start('Intro', { id: next.id });
  else scene.scene.start('Select');
}

// Stars for a calm ride: few bumps is three stars, but everyone gets one.
export function starsFor(bumps) {
  if (bumps <= 1) return 3;
  if (bumps <= 4) return 2;
  return 1;
}

// The "episode complete" card shown at the end of each mini-game.
export function endPanel(scene, id, { bumps } = {}) {
  const depth = 200;
  scene.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000, 0.6).setDepth(depth).setInteractive();
  const box = scene.add.rectangle(WIDTH / 2, 180, 200, 190, 0x0000bc).setStrokeStyle(2, 0xfcfcfc).setDepth(depth);
  text(scene, WIDTH / 2, 110, t('end.done'), { size: 30, color: PAL.y }).setDepth(depth);

  if (typeof bumps === 'number') {
    const stars = starsFor(bumps);
    for (let i = 0; i < 3; i++) {
      const star = scene.add.image(WIDTH / 2 + (i - 1) * 30, 150, i < stars ? 'star' : 'starOff').setScale(3).setDepth(depth);
      star.setScale(0);
      scene.tweens.add({ targets: star, scale: 3, duration: 300, delay: 200 + i * 250, ease: 'Back.easeOut' });
    }
    text(scene, WIDTH / 2, 182, t('end.bumps', { n: bumps })).setDepth(depth);
  }

  button(scene, WIDTH / 2, 218, t('end.next'), () => nextEpisode(scene, id), { width: 150, height: 28 }).setDepth(depth);
  button(scene, WIDTH / 2, 252, t('end.again'), () => scene.scene.restart(), { width: 150, height: 24, fill: PAL.B, edge: PAL.b }).setDepth(depth);
  return box;
}

// With the cheat on, every episode gets a skip button in the top corner.
export function addSkip(scene, id) {
  if (!cheatOn()) return;
  button(scene, WIDTH - 22, 13, '>>', () => nextEpisode(scene, id), { width: 32, height: 20, fill: PAL.r, edge: PAL.R }).setDepth(210);
}
