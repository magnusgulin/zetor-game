// The story, in order. `scene` is the Phaser scene that plays the episode;
// episodes without one yet fall back to the Placeholder scene.
export const EPISODES = [
  { id: 1, icon: 'moto', scene: 'Episode1' },
  { id: 2, icon: 'car', scene: 'Episode2' },
  { id: 3, icon: 'plane', scene: 'Episode3' },
  { id: 4, icon: 'taxi', scene: 'Episode4' },
  { id: 5, icon: 'paper', scene: 'Episode5' },
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

export function isUnlocked(id) {
  return unlockAll || id === 1 || done.has(id - 1);
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
