# Battleship

Classic Battleship built with vanilla JavaScript, HTML, and CSS. It features a smart AI, crisp turn-by-turn gameplay, clean visuals, sound effects (hit/miss/sink), and an ambient underwater loop you can toggle on/off.

## Features

- Smart computer opponent that remembers hits and targets adjacent squares; extends along a line after multiple hits.
- Strict 1-to-1 turn alternation: each side makes exactly one move per turn.
- Manual ship placement with drag-and-drop, or one-click Randomize.
- Start button is enabled only after all Player One ships are placed.
- Clear feedback: centered hit/miss markers, subtle wave animation on hits, and an explosion animation on sinks.
- Remaining-ships counters and a crown indicator for the winner.
- Turn indicator to show whose move it is.
- Sound effects: hit, miss, and sink. Ambient underwater loop during gameplay.
- Sound button to toggle audio on/off (affects ambient; event sounds respect the toggle).
- Reset and Quit controls: restart the match or return to the placement screen.
- Polished UI with button icons and a footer credit ("Made by Ruth").

## Quick start

Prerequisites:

- Node.js 18+ recommended

Install dependencies:

```bash
npm install
```

Run the development server (with hot reload):

```bash
npm run dev
```

Build a production bundle to `dist/`:

```bash
npm run build
```

Optional: Deploy to GitHub Pages (requires your repo to be configured):

```bash
# Build first
npm run build
# Then publish dist/ to gh-pages
npm run deploy
```

## How to play

1. Place your ships on the Player One grid by dragging and dropping them into valid positions, or click Randomize.
2. Click Start when all ships are placed. The AI will place its ships automatically.
3. Attack by clicking a square on the opponent’s grid.
4. Turns alternate strictly: you take one shot, then the AI takes one shot.
5. The AI remembers successful hits and aims nearby; after multiple adjacent hits, it extends along the line to finish ships.
6. Sink all opposing ships to win. A crown will mark the winner.
7. Use Reset to restart a match, or Quit to return to ship placement.
8. Toggle Sound to enable/disable audio. Ambient starts during gameplay and stops on reset/quit.

Note: Some browsers restrict autoplay of audio. Because the game starts after user interaction, ambient should play; if it doesn’t, click Sound to toggle.

## Project structure

```
package.json
README.md
webpack.common.js
webpack.dev.js
webpack.prod.js
src/
	index.html
	index.js
	style.css
	assets/
		audio/
		fonts/
		images/
		styles/
			global.css
			reset.css
	modules/
		dom.js
		Game.js
		gameboard.js
		grid.js
		players.js
		ship.js
```

Key modules:

- `modules/dom.js`: Builds the UI, wires events, renders attack results and animations, manages turn flow and audio, and attaches controls.
- `modules/players.js`: Player models and AI targeting logic (queueing adjacent targets and extending along a line).
- `modules/gameboard.js`: Ship placement, attack resolution (hit/miss/sunk), and win detection.
- `modules/ship.js`: Ship state and hit tracking.
- `modules/grid.js`: Grid helpers and DOM interactions for placement/attacks.
- `index.js`: App bootstrap and wiring.

## Tech stack

- JavaScript (ES modules), HTML, CSS
- Webpack 5 and webpack-dev-server
- PostCSS + Autoprefixer

### NPM scripts

- `npm run dev` — start the dev server with hot reload
- `npm run build` — produce a production build in `dist/`
- `npm run deploy` — publish `dist/` to GitHub Pages (requires repo setup)

## Development notes

- Audio: Event sounds (hit/miss/sink) and an ambient underwater loop are bundled. Large audio files can trigger webpack performance warnings; this is expected and safe.
- Autoplay: If the ambient loop doesn’t start due to a browser policy, use the Sound button to toggle. Most interactions will count as user gestures and allow playback.
- Comments: Source files keep a single module header at the top and avoid inline/block comments to stay clean and readable.

## Known issues / tips

- If assets don’t appear during development, ensure your dev server is running and you’re visiting the correct localhost port printed by the terminal.
- If audio is too loud or quiet, adjust your system volume or replace the audio files in `src/assets/audio/` with alternatives of your choice.

## Contributing

Suggestions and bug reports are welcome. Feel free to open an issue or submit a pull request.

## License

Add a license of your choice (e.g., MIT) to clarify usage and contributions.
