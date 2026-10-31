# Zetor 25A – The long road home

> **Note:** This is a vibe-coded experiment: an attempt to see how far you can
> get by describing a game in plain words and letting an AI (Claude) write the
> code. I gave the story, ideas and feedback; the AI wrote nearly all of the
> code and drew the pixel art in code.

An 8-bit style browser game based on a true story. In April 1955 two men from
Ostrobothnia travelled to Helsinki to fetch a new Zetor 25A tractor. The trains
were on strike, so they got there by motorcycle, hitchhiking, plane and taxi,
and drove the tractor all the way home. The trip took 26 hours.

The game is a series of short, easy mini-game episodes that follow the journey.
It is made for phones first, runs in the browser with nothing to install, and
can be played in Swedish or English.

## Running it locally

There is no build step. Serve the folder with any static web server, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `?all` to the address to unlock every
episode while testing.

## How it is put together

- `index.html` loads Phaser (vendored in `lib/`) and the game code in `src/`.
- `src/episodes.js` lists the episodes in story order and saves progress.
- `src/i18n.js` holds every piece of text in Swedish and English.
- `src/sprites.js` draws all the pixel art from small text maps at start-up.
- `src/scenes/` has one file per screen. Episodes that are not built yet use
  `Placeholder.js`.

## Publishing

Every push to `main` is published to GitHub Pages by
`.github/workflows/pages.yml`. In the repository settings, under Pages, the
source must be set to "GitHub Actions".

## Credits

- [Phaser](https://phaser.io) game framework (MIT).
- Fonts: [Jersey 10](https://fonts.google.com/specimen/Jersey+10) and
  [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P), both SIL Open Font License.
