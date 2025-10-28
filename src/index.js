// index.js
import dom from './modules/dom.js';
import gameboard from './modules/gameboard.js';
import createPlayer from './modules/players.js';
import "./style.css";
import {attachAttackHandler,makeShipsDraggable,makeGridDroppable, wireRandomize, wireReset, wireStart, wireQuit, wireSoundControls} from './modules/dom.js';

dom();

const shipUrl = new URL('./assets/images/ship.png', import.meta.url);
const titleImg = document.querySelector('.title img');
if (titleImg) titleImg.src = shipUrl.href;
let faviconLink = document.querySelector('link[rel="icon"]');
if (!faviconLink) {
	faviconLink = document.createElement('link');
	faviconLink.rel = 'icon';
	faviconLink.type = 'image/png';
	document.head.appendChild(faviconLink);
}
faviconLink.href = shipUrl.href;

const playerOneBoard = gameboard();
const aiBoard = gameboard();
const human = createPlayer('human');
const computer = createPlayer('computer');

const gameFlowControls = attachAttackHandler({
	enemyGridSelector: '.playertwo-grid-container',
	playerGridSelector: '.playerone-grid-container',
	enemyBoard: aiBoard,
	playerBoard: playerOneBoard,
	humanPlayer: human,
	computerPlayer: computer,
});
makeShipsDraggable();
makeGridDroppable(playerOneBoard);
wireRandomize(playerOneBoard, aiBoard);
wireReset(playerOneBoard, aiBoard, gameFlowControls);
wireStart(playerOneBoard, aiBoard, gameFlowControls);
wireQuit(playerOneBoard, aiBoard, gameFlowControls);
wireSoundControls();