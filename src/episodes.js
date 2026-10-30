// The story, in order. `scene` is the Phaser scene that plays the episode;
// episodes without one yet fall back to the Placeholder scene.
export const EPISODES = [
  { id: 1, icon: 'moto', scene: 'Episode1' },
  { id: 2, icon: 'car' },
  { id: 3, icon: 'plane' },
  { id: 4, icon: 'taxi' },
  { id: 5, icon: 'paper', cutscene: true },
  { id: 6, icon: 'zetor_0' },
  { id: 7, icon: 'sausage' },
  { id: 8, icon: 'coffee' },
  { id: 9, icon: 'house', ending: true },
];

const STORAGE_KEY = 'zetor.progress';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(data) ? data : []);
  } catch (e) {
    return new Set();
  }
}

const done = load();

// Add ?all to the URL to unlock every episode while testing.
const unlockAll = new URLSearchParams(location.search).has('all');

// The cheat (tap 25A on the title screen five times) opens every episode
// and adds a skip button to each one.
const CHEAT_KEY = 'zetor.cheat';
let cheat = false;
try {
  cheat = localStorage.getItem(CHEAT_KEY) === '1';
} catch (e) {
  // No storage: the cheat lasts for this visit only.
}

export function cheatOn() {
  return cheat;
}

export function setCheat(on) {
  cheat = on;
  try {
    localStorage.setItem(CHEAT_KEY, on ? '1' : '0');
  } catch (e) {
    // Kept for this visit only.
  }
}

export function isUnlocked(id) {
  return unlockAll || cheat || id === 1 || done.has(id - 1);
}

export function isDone(id) {
  return done.has(id);
}

export function markDone(id) {
  done.add(id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
  } catch (e) {
    // Progress is kept for this visit only.
  }
}

export function getEpisode(id) {
  return EPISODES.find((e) => e.id === id);
}
