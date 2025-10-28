// dom.js
import carrierShip from '../assets/images/carrier.png';
import battleshipShip from '../assets/images/battleship.png';
import cruiserShip from '../assets/images/cruiser.png';
import submarineShip from '../assets/images/submarine.png';
import destroyerShip from '../assets/images/destroyer.png';

import carrierRotated from '../assets/images/rotated-carrier.png';
import battleshipRotated from '../assets/images/rotated-battleship.png';
import cruiserRotated from '../assets/images/rotated-cruiser.png';
import submarineRotated from '../assets/images/rotated-submarine.png';
import destroyerRotated from '../assets/images/rotated-destroyer.png';
import createShip from './ship.js';
import hitSfxUrl from '../assets/audio/hit.mp3';
import sinkSfxUrl from '../assets/audio/explosion.mp3';
import missSfxUrl from '../assets/audio/sonar-ping.mp3';
import ambientSfxUrl from '../assets/audio/underwater-ambience.mp3';

const horizontalShips = [
  carrierShip,
  battleshipShip,
  cruiserShip,
  submarineShip,
  destroyerShip,
];
const verticalShips = [
  carrierRotated,
  battleshipRotated,
  cruiserRotated,
  submarineRotated,
  destroyerRotated,
];
const shipsName = [
  'carrier-ship',
  'battleship-ship',
  'cruiser-ship',
  'submarine-ship',
  'destroyer-ship',
];

const EXPLOSION_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="m12 16.648l1.378-1.378h1.892v-1.892L16.648 12l-1.378-1.378V8.73h-1.892L12 7.352L10.622 8.73H8.73v1.892L7.352 12l1.378 1.378v1.892h1.892zm0 5.268L9.069 19H5v-4.069L2.085 12L5 9.069V5h4.069L12 2.085L14.931 5H19v4.069L21.916 12L19 14.931V19h-4.069z" />
  </svg>
`;

const ALL_SHIP_NAMES = ['carrier-ship','battleship-ship','cruiser-ship','submarine-ship','destroyer-ship'];

let aiTurnTimeout = null;
let soundEnabled = true;
let ambientAudio = null;
const sfx = {
  hit: null,
  sink: null,
  miss: null,
};

function ensureAudio() {
  if (!sfx.hit) sfx.hit = new Audio(hitSfxUrl);
  if (!sfx.sink) sfx.sink = new Audio(sinkSfxUrl);
  if (!sfx.miss) sfx.miss = new Audio(missSfxUrl);
  if (!ambientAudio) {
    ambientAudio = new Audio(ambientSfxUrl);
    ambientAudio.loop = true;
    ambientAudio.volume = 0.35;
  }
}

function playSfx(audio) {
  if (!soundEnabled || !audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {
    try { audio.cloneNode().play().catch(() => {}); } catch (_) {}
  }
}

function startAmbient() {
  ensureAudio();
  if (!soundEnabled || !ambientAudio) return;
  try { ambientAudio.play().catch(() => {}); } catch (_) {}
}

function stopAmbient() {
  if (!ambientAudio) return;
  try { ambientAudio.pause(); ambientAudio.currentTime = 0; } catch (_) {}
}

const CROWN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="none" stroke="#FFCC00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 18h14M5 14h14l1-9l-4 3l-4-5l-4 5l-4-3z" />
  </svg>
`;

export default function dom() {
  function setUpGrid() {
    const gridContainer = document.querySelector('.grid-container');
    if (!gridContainer) return;

    const grid = document.createElement('div');
    grid.classList.add('grid');

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.x = i;
      square.dataset.y = j; 
        grid.append(square);
      }
    }
    gridContainer.append(grid);
  }

  function renderShips() {
    const shipsfield = document.querySelector('.horizontal-ships');
    if (!shipsfield) return;
    const Rshipsfield = document.querySelector(`.vertical-ships`);
    horizontalShips.forEach((ship, i) => {
      const img = document.createElement('img');
      img.src = ship;
      img.alt = shipsName[i];
      img.classList.add(shipsName[i]);
      img.classList.add('ship-height');
      img.id = `ship-${shipsName[i]}-h`;
      img.dataset.shipName = shipsName[i];
      img.setAttribute('draggable', 'true');
      img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', img.alt);
        e.dataTransfer.setData('orientation', img.classList.contains('R-ship-width') ? 'vertical' : 'horizontal');
        e.dataTransfer.setData('shipId', img.id);
      });
      shipsfield.append(img);
    });
    verticalShips.forEach((ship, i) => {
      const img = document.createElement('img');
      img.src = ship;
      img.alt = shipsName[i];
      img.classList.add(`R-${shipsName[i]}`);
      img.classList.add('R-ship-width');
      img.id = `ship-${shipsName[i]}-v`;
      img.dataset.shipName = shipsName[i];
      img.setAttribute('draggable', 'true');
      img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', img.alt);
        e.dataTransfer.setData('orientation', img.classList.contains('R-ship-width') ? 'vertical' : 'horizontal');
        e.dataTransfer.setData('shipId', img.id);
      });
      Rshipsfield.append(img);
    });
  }
  function playerOneGrid(){
const gridContainer = document.querySelector('.playerone-grid-container');
    if (!gridContainer) return;

    const grid = document.createElement('div');
    grid.classList.add('grid');

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const square = document.createElement('div');
        square.classList.add('square');
         square.dataset.x = i;
      square.dataset.y = j; 
        grid.append(square);
      }
    }
    gridContainer.append(grid);
  }

   function playerTwoGrid(){
const gridContainer = document.querySelector('.playertwo-grid-container');
    if (!gridContainer) return;

    const grid = document.createElement('div');
    grid.classList.add('grid');

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const square = document.createElement('div');
        square.classList.add('square');
         square.dataset.x = i;
      square.dataset.y = j; 
        grid.append(square);
      }
    }
    gridContainer.append(grid);
  }

document.querySelector(".rotate-btn").addEventListener('click',()=>{
  document.querySelector(".vertical-ships").classList.toggle("hidden")
  document.querySelector(".horizontal-ships").classList.toggle("h-hidden")
})

  setUpGrid();
  renderShips();
  playerOneGrid();
  playerTwoGrid();
  initializeRemainingShipDisplays();
  const soundBtn = document.querySelector('.sound-btn');
  if (soundBtn) soundBtn.textContent = 'Sound: On';
}
export function attachAttackHandler({
  enemyGridSelector,
  playerGridSelector,
  enemyBoard,
  playerBoard,
  humanPlayer,
  computerPlayer,
}) {
  const enemyGridContainer = document.querySelector(enemyGridSelector);
  const playerGridContainer = document.querySelector(playerGridSelector);

  if (!enemyGridContainer || !playerGridContainer) {
    return {
      setGameActive: () => {},
      resetGameFlow: () => {},
    };
  }

  const enemyGrid = enemyGridContainer.querySelector('.grid') || enemyGridContainer;
  const playerGrid = playerGridContainer.querySelector('.grid') || playerGridContainer;
  const enemyBox = enemyGridContainer.closest('.player-two-box');
  const playerBox = playerGridContainer.closest('.player-one-box');

  let currentTurn = 'player';
  let gameActive = false;
  let processing = false;

  function setGameActive(active) {
    gameActive = active;
    processing = false;
    currentTurn = 'player';
    if (aiTurnTimeout) {
      clearTimeout(aiTurnTimeout);
      aiTurnTimeout = null;
    }

    if (humanPlayer?.resetTracking) humanPlayer.resetTracking();
    else if (humanPlayer) humanPlayer.attacks = [];

    if (computerPlayer?.resetTracking) computerPlayer.resetTracking();
    else if (computerPlayer) computerPlayer.attacks = [];

    updateTurnIndicator(active ? 'player' : null);
  }

  function resetGameFlow() {
    gameActive = false;
    processing = false;
    currentTurn = 'player';
    if (aiTurnTimeout) {
      clearTimeout(aiTurnTimeout);
      aiTurnTimeout = null;
    }
    updateTurnIndicator(null);
    if (humanPlayer?.resetTracking) humanPlayer.resetTracking();
    else if (humanPlayer) humanPlayer.attacks = [];
    if (computerPlayer?.resetTracking) computerPlayer.resetTracking();
    else if (computerPlayer) computerPlayer.attacks = [];
  }

  function endGame(winnerLabel) {
    gameActive = false;
    processing = false;
    if (aiTurnTimeout) {
      clearTimeout(aiTurnTimeout);
      aiTurnTimeout = null;
    }
    updateTurnIndicator(null);
    if (winnerLabel === 'You') {
      displayWinner('player');
    } else if (winnerLabel === 'AI') {
      displayWinner('computer');
    }
  }

  function boardIsDefeated(board) {
    return typeof board?.allSunk === 'function' && board.allSunk();
  }

  function renderAttackResult(square, result, { gridContainer, board, box }) {
    if (!square || !result) return;

    if (result.hit) {
      if (!square.querySelector('.mark-hit')) {
        const marker = document.createElement('div');
        marker.classList.add('mark', 'mark-hit', 'hit-wave');
        marker.addEventListener('animationend', () => marker.classList.remove('hit-wave'), { once: true });
        square.appendChild(marker);
      }
      
      ensureAudio();
      if (!result.sunk) playSfx(sfx.hit);
      if (result.sunk) {
        triggerShipSunkAnimation(gridContainer, board, result.shipName);
        decrementRemainingShips(box);
      }
    } else if (!square.querySelector('.mark-miss')) {
      const marker = document.createElement('div');
      marker.classList.add('mark', 'mark-miss');
      square.appendChild(marker);
      
      ensureAudio();
      playSfx(sfx.miss);
    }

    square.style.pointerEvents = 'none';
  }

  function handlePlayerClick(e) {
    if (!gameActive || processing || currentTurn !== 'player') return;
    const square = e.target.closest('.square');
    if (!square) return;

    const x = Number(square.dataset.x);
    const y = Number(square.dataset.y);
    if (Number.isNaN(x) || Number.isNaN(y)) return;

    const coord = [x, y];
    const result = humanPlayer ? humanPlayer.attack(enemyBoard, coord) : enemyBoard.receiveAttack(coord);
    if (!result || result.alreadyAttacked) {
      return;
    }

    processing = true;

    renderAttackResult(square, result, {
      gridContainer: enemyGridContainer,
      board: enemyBoard,
      box: enemyBox,
    });

    if (boardIsDefeated(enemyBoard)) {
      endGame('You');
      return;
    }
    
    currentTurn = 'computer';
    updateTurnIndicator(currentTurn);
    scheduleComputerTurn();
  }

  function scheduleComputerTurn(delay = 700) {
    if (aiTurnTimeout) {
      clearTimeout(aiTurnTimeout);
    }
    aiTurnTimeout = setTimeout(() => {
      aiTurnTimeout = null;
      handleComputerTurn();
    }, delay);
  }

  function handleComputerTurn() {
    if (!gameActive) {
      processing = false;
      return;
    }

    const attackData = computerPlayer ? computerPlayer.randomAttack(playerBoard) : null;
    if (!attackData || !attackData.coord || !attackData.result || attackData.result.alreadyAttacked) {
      processing = false;
      currentTurn = 'player';
      updateTurnIndicator(currentTurn);
      return;
    }

    const { coord, result } = attackData;
    const [x, y] = coord;
    const square = playerGrid.querySelector(`.square[data-x="${x}"][data-y="${y}"]`);

    renderAttackResult(square, result, {
      gridContainer: playerGridContainer,
      board: playerBoard,
      box: playerBox,
    });

    if (boardIsDefeated(playerBoard)) {
      endGame('AI');
      return;
    }

    
    currentTurn = 'player';
    updateTurnIndicator(currentTurn);
    processing = false;
  }

  enemyGridContainer.addEventListener('click', handlePlayerClick);

  return {
    setGameActive,
    resetGameFlow,
  };
}
 export function makeShipsDraggable(){
  const ships = document.querySelectorAll('.horizontal-ships img, .vertical-ships img');
  ships.forEach(ship => {
    ship.setAttribute('draggable', true);

    ship.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', ship.alt); 
      e.dataTransfer.setData('orientation', ship.classList.contains('R-ship-width') ? 'vertical' : 'horizontal');
    });
  });
}


function getShipLengthByName(name) {
  switch(name) {
    case 'carrier-ship': return 5;
    case 'battleship-ship': return 4;
    case 'cruiser-ship': return 3;
    case 'submarine-ship': return 3;
    case 'destroyer-ship': return 2;
  }
}
export function makeGridDroppable(playerBoard) {
  const gridSquares = document.querySelectorAll('.playerone-grid-container .square, .grid-container .square');

  gridSquares.forEach(square => {
    square.addEventListener('dragover', (e) => {
  e.preventDefault();
    });

    square.addEventListener('drop', (e) => {
      e.preventDefault();

      const shipName = e.dataTransfer.getData('text/plain');
      const orientation = e.dataTransfer.getData('orientation');

      const startX = Number(square.dataset.x);
      const startY = Number(square.dataset.y);

  const shipLength = getShipLengthByName(shipName);

      
      const coords = [];
      for (let i = 0; i < shipLength; i++) {
        if (orientation === 'horizontal') {
          coords.push([startX, startY + i]);
        } else {
          coords.push([startX + i, startY]);
        }
      }

      
      const inBounds = coords.every(([x, y]) => x >= 0 && x <= 9 && y >= 0 && y <= 9);
      if (!inBounds) {
        return;
      }

      
      if (!playerBoard.isValidPlacement(coords) || hasNeighboringShips(playerBoard, coords)) {
        alert('Invalid placement!');
        return;
      }

      
      const ship = createShip(shipName, shipLength);
      playerBoard.placeShip(ship, coords);

    
  const shipId = e.dataTransfer.getData('shipId');
      let shipElement = null;
      if (shipId) shipElement = document.getElementById(shipId);
      if (!shipElement) shipElement = document.querySelector(`img[alt="${shipName}"]`);

      shipElement.style.position = 'absolute';
      shipElement.style.transformOrigin = 'top left';

  const gridElement = square.closest('.grid');
  
  positionElementAt(shipElement, gridElement, startX, startY);

      gridElement.appendChild(shipElement);

      
      shipElement.setAttribute('draggable', 'false');

      
      const candidates = document.querySelectorAll(`img[alt="${shipName}"]`);
      candidates.forEach(img => {
        const inGrid = img.closest('.grid');
        if (!inGrid) {
          img.parentElement && img.parentElement.removeChild(img);
        }
      });
    });
  });
}

function getShipIndexByName(name){
  return shipsName.indexOf(name);
}

function createPlacedShipElement(name, orientation){
  const idx = getShipIndexByName(name);
  const img = document.createElement('img');
  if (orientation === 'vertical'){
    img.src = verticalShips[idx];
    img.alt = shipsName[idx];
    img.classList.add(`R-${shipsName[idx]}`);
    img.classList.add('R-ship-width');
  } else {
    img.src = horizontalShips[idx];
    img.alt = shipsName[idx];
    img.classList.add(shipsName[idx]);
    img.classList.add('ship-height');
  }
  img.style.position = 'absolute';
  img.style.transformOrigin = 'top left';
  return img;
}

 
function getBoxSizes(grid){
  const styles = getComputedStyle(grid);
  const bw = parseFloat(styles.getPropertyValue('--box-width')) || 35;
  const bh = parseFloat(styles.getPropertyValue('--box-height')) || 35;
  return { bw, bh };
}

function positionElementAt(el, grid, x, y){
  const { bw, bh } = getBoxSizes(grid);
  el.style.left = `${y * bw}px`;
  el.style.top = `${x * bh}px`;
}

function clearPlayerGridVisuals(){
  const grids = document.querySelectorAll('.playerone-grid-container .grid, .grid-container .grid');
  grids.forEach(grid => grid.querySelectorAll('img').forEach(img => img.remove()));
}

function getVisiblePlayerGrid(){
  const gameContainer = document.querySelector('.game-container');
  const isGameHidden = gameContainer && gameContainer.classList.contains('hidden-game');
  if (isGameHidden) {
    return document.querySelector('.grid-container .grid');
  }
  return document.querySelector('.playerone-grid-container .grid');
}

function clearShipPanels(){
  const h = document.querySelector('.horizontal-ships');
  const v = document.querySelector('.vertical-ships');
  if (h) h.innerHTML = '';
  if (v) v.innerHTML = '';
}

function randomInt(max){
  return Math.floor(Math.random()*max);
}

function tryPlace(board, name){
  const length = getShipLengthByName(name);
  for (let attempts = 0; attempts < 500; attempts++){
    const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const startX = randomInt(10);
    const startY = randomInt(10);
    const coords = [];
    for (let i=0;i<length;i++){
      if (orientation==='horizontal') coords.push([startX, startY+i]);
      else coords.push([startX+i, startY]);
    }
    const inBounds = coords.every(([x,y])=>x>=0&&x<=9&&y>=0&&y<=9);
    if (!inBounds) continue;
    if (!board.isValidPlacement(coords)) continue;
    if (hasNeighboringShips(board, coords)) continue;
    const ship = createShip(name, length);
    board.placeShip(ship, coords);
    return {orientation, startX, startY, coords};
  }
  return null;
}

export function wireRandomize(playerBoard, aiBoard){
  const btn = document.querySelector('.randomize-btn');
  if (!btn) return;
  btn.addEventListener('click', ()=>{
    playerBoard.ships = [];
    playerBoard.misses = [];
    clearPlayerGridVisuals();
    resetRemainingShipDisplays();

  const grid = getVisiblePlayerGrid();
    const toPlace = [...ALL_SHIP_NAMES];

    toPlace.forEach(name=>{
      const placed = tryPlace(playerBoard, name);
      if (placed){
        const el = createPlacedShipElement(name, placed.orientation);
        const startSquare = grid.querySelector(`.square[data-x="${placed.startX}"][data-y="${placed.startY}"]`);
        if (!startSquare) return;
        
        positionElementAt(el, grid, placed.startX, placed.startY);
        grid.appendChild(el);
      }
    });

    clearShipPanels();

    if (aiBoard){
      aiBoard.ships = [];
      aiBoard.misses = [];
      ALL_SHIP_NAMES.forEach(name=>{
        tryPlace(aiBoard, name);
      });
    }

    updateRemainingShipsDisplay('.player-one-point-box', playerBoard);
    if (aiBoard) updateRemainingShipsDisplay('.player-two-point-box', aiBoard);
    updateTurnIndicator(null);
  });
}

function resetGridMarks() {
  const squares = document.querySelectorAll('.playerone-grid-container .square, .playertwo-grid-container .square');
  squares.forEach(sq => {
    sq.style.pointerEvents = '';
    sq.querySelectorAll('.mark').forEach(marker => marker.remove());
  });
  resetRemainingShipDisplays();
}

function repopulateShipPanels() {
  const shipsfield = document.querySelector('.horizontal-ships');
  const Rshipsfield = document.querySelector('.vertical-ships');
  if (!shipsfield || !Rshipsfield) return;

  shipsfield.innerHTML = '';
  Rshipsfield.innerHTML = '';

  horizontalShips.forEach((ship, i) => {
    const img = document.createElement('img');
    img.src = ship;
    img.alt = shipsName[i];
    img.classList.add(shipsName[i]);
    img.classList.add('ship-height');
    img.id = `ship-${shipsName[i]}-h`;
    img.dataset.shipName = shipsName[i];
    img.setAttribute('draggable', 'true');
    img.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', img.alt);
      e.dataTransfer.setData('orientation', img.classList.contains('R-ship-width') ? 'vertical' : 'horizontal');
      e.dataTransfer.setData('shipId', img.id);
    });
    shipsfield.append(img);
  });

  verticalShips.forEach((ship, i) => {
    const img = document.createElement('img');
    img.src = ship;
    img.alt = shipsName[i];
    img.classList.add(`R-${shipsName[i]}`);
    img.classList.add('R-ship-width');
    img.id = `ship-${shipsName[i]}-v`;
    img.dataset.shipName = shipsName[i];
    img.setAttribute('draggable', 'true');
    img.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', img.alt);
      e.dataTransfer.setData('orientation', img.classList.contains('R-ship-width') ? 'vertical' : 'horizontal');
      e.dataTransfer.setData('shipId', img.id);
    });
    Rshipsfield.append(img);
  });

  
  Rshipsfield.classList.add('hidden');
  document.querySelector('.horizontal-ships')?.classList.remove('h-hidden');
}

export function wireReset(playerBoard, aiBoard, gameFlowControls){
  const btn = document.querySelector('.reset-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    gameFlowControls?.resetGameFlow?.();
    
    if (playerBoard) { playerBoard.ships = []; playerBoard.misses = []; }
    if (aiBoard) { aiBoard.ships = []; aiBoard.misses = []; }

    
    document.querySelectorAll('.grid-container .grid img, .playerone-grid-container .grid img').forEach(img => img.remove());

    
    resetGridMarks();

    
    repopulateShipPanels();

    makeShipsDraggable();

    stopAmbient();
  });
}

export function wireSoundControls(){
  const btn = document.querySelector('.sound-btn');
  if (!btn) return;
  btn.addEventListener('click', ()=>{
    soundEnabled = !soundEnabled;
    btn.textContent = soundEnabled ? 'Sound: On' : 'Sound: Off';
    if (soundEnabled) startAmbient(); else stopAmbient();
  });
}

export function wireQuit(playerBoard, aiBoard, gameFlowControls){
  const btn = document.querySelector('.quit-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    gameFlowControls?.resetGameFlow?.();

    if (playerBoard) { playerBoard.ships = []; playerBoard.misses = []; }
    if (aiBoard) { aiBoard.ships = []; aiBoard.misses = []; }

    document.querySelectorAll('.grid-container .grid img, .playerone-grid-container .grid img').forEach(img => img.remove());
    resetGridMarks();

    repopulateShipPanels();
    makeShipsDraggable();

    const front = document.querySelector('.front-container');
    if (front) front.style.display = '';
    const game = document.querySelector('.game-container');
    if (game) game.classList.add('hidden-game');
    
    stopAmbient();
  });
}

function getOrientationAndHead(coords){
  if (!coords || coords.length === 0) return { orientation: 'horizontal', head: [0,0] };
  const sameRow = coords.every(c => c[0] === coords[0][0]);
  if (sameRow){
    const x = coords[0][0];
    const minY = Math.min(...coords.map(c => c[1]));
    return { orientation: 'horizontal', head: [x, minY] };
  }
  const y = coords[0][1];
  const minX = Math.min(...coords.map(c => c[0]));
  return { orientation: 'vertical', head: [minX, y] };
}

function renderBoardShipsToGrid(board, grid){
  if (!grid) return;
  grid.querySelectorAll('img').forEach(img=>img.remove());
  board.ships.forEach(ship=>{
    if (!ship.coords || ship.coords.length === 0) return;
    const { orientation, head } = getOrientationAndHead(ship.coords);
    const el = createPlacedShipElement(ship.name, orientation);
    const startSquare = grid.querySelector(`.square[data-x="${head[0]}"][data-y="${head[1]}"]`);
    if (!startSquare) return;
    positionElementAt(el, grid, head[0], head[1]);
    grid.appendChild(el);
  });
}

export function wireStart(playerBoard, aiBoard, gameFlowControls){
  const btn = document.querySelector('.start-btn');
  if (!btn) return;
  btn.addEventListener('click', ()=>{
    const required = ALL_SHIP_NAMES.length;
    const complete = Array.isArray(playerBoard?.ships) && playerBoard.ships.length === required && playerBoard.ships.every(s => Array.isArray(s.coords) && s.coords.length === s.length);
    if (!complete) {
      alert('Place all your ships before starting (you can drag them or click Randomize).');
      return;
    }
    const targetGrid = document.querySelector('.playerone-grid-container .grid');
    renderBoardShipsToGrid(playerBoard, targetGrid);
    if (aiBoard && aiBoard.ships.length === 0) {
      aiBoard.ships = [];
      aiBoard.misses = [];
      ALL_SHIP_NAMES.forEach(name => {
        tryPlace(aiBoard, name);
      });
    }
    if (aiBoard) updateRemainingShipsDisplay('.player-two-point-box', aiBoard);
    updateRemainingShipsDisplay('.player-one-point-box', playerBoard);
    clearWinnerDisplay();
    const front = document.querySelector('.front-container');
    if (front) front.style.display = 'none';
    const game = document.querySelector('.game-container');
    if (game) game.classList.remove('hidden-game');
    gameFlowControls?.setGameActive?.(true);
    startAmbient();
  });
}

function initializeRemainingShipDisplays(){
  document.querySelectorAll('.remaining-ships').forEach(el => {
    const provided = parseInt(el.dataset.initial ?? el.textContent.trim(), 10);
    const initial = Number.isNaN(provided) ? 0 : provided;
    el.dataset.initial = initial;
    el.dataset.remaining = initial;
    el.textContent = `${initial}`;
  });
  clearWinnerDisplay();
  updateTurnIndicator(null);
}

function decrementRemainingShips(container){
  if (!container) return null;
  const display = container.querySelector('.remaining-ships');
  if (!display) return null;
  const currentRaw = display.dataset.remaining ?? display.textContent;
  const current = parseInt(currentRaw, 10);
  if (Number.isNaN(current)) return null;
  const next = Math.max(0, current - 1);
  display.dataset.remaining = next;
  display.textContent = `${next}`;
  return next;
}

function updateRemainingShipsDisplay(containerOrSelector, board){
  const container = typeof containerOrSelector === 'string'
    ? document.querySelector(containerOrSelector)
    : containerOrSelector;
  if (!container) return;
  const display = container.querySelector('.remaining-ships');
  if (!display) return;
  const total = Array.isArray(board?.ships) ? board.ships.length : parseInt(display.dataset.initial ?? display.textContent, 10) || 0;
  display.dataset.initial = total;
  display.dataset.remaining = total;
  display.textContent = `${total}`;
}

function resetRemainingShipDisplays(){
  document.querySelectorAll('.remaining-ships').forEach(el => {
    const initialRaw = el.dataset.initial ?? el.textContent;
    const initial = parseInt(initialRaw, 10);
    if (Number.isNaN(initial)) return;
    el.dataset.remaining = initial;
    el.textContent = `${initial}`;
  });
  clearWinnerDisplay();
}

function triggerShipSunkAnimation(gridContainer, enemyBoard, shipName){
  if (!gridContainer || !enemyBoard) return;
  const ship = enemyBoard.ships?.find(s => s.name === shipName);
  if (!ship || !Array.isArray(ship.coords)) return;
  const grid = gridContainer.querySelector('.grid') || gridContainer;
  ship.coords.forEach(([x, y]) => {
    const square = grid.querySelector(`.square[data-x="${x}"][data-y="${y}"]`);
    if (!square) return;

    if (!square.querySelector('.mark-hit')) {
      const hitMarker = document.createElement('div');
      hitMarker.classList.add('mark', 'mark-hit');
      square.appendChild(hitMarker);
    }

    if (!square.querySelector('.explosion')) {
      const boom = document.createElement('div');
      boom.classList.add('mark', 'explosion');
      boom.innerHTML = EXPLOSION_SVG;
      square.appendChild(boom);
    }
  });
  ensureAudio();
  playSfx(sfx.sink);
}

function displayWinner(winner){
  clearWinnerDisplay();
  const target = winner === 'player'
    ? document.querySelector('.player-one-point-box')
    : document.querySelector('.player-two-point-box');
  if (!target) return;
  target.classList.add('turn');
  if (!target.querySelector('.crown')) {
    const crown = document.createElement('div');
    crown.classList.add('crown');
    crown.innerHTML = CROWN_SVG;
    const label = target.querySelector('div');
    if (label && label.parentElement === target) {
      label.insertAdjacentElement('afterend', crown);
    } else {
      target.appendChild(crown);
    }
  }
}

function clearWinnerDisplay(){
  document.querySelectorAll('.point-box').forEach(box => {
    box.classList.remove('turn');
    box.querySelectorAll('.crown').forEach(existing => existing.remove());
  });
}

function updateTurnIndicator(turn){
  const playerBox = document.querySelector('.player-one-box');
  const aiBox = document.querySelector('.player-two-box');
  if (playerBox) playerBox.classList.remove('turn');
  if (aiBox) aiBox.classList.remove('turn');
  if (turn === 'player') playerBox?.classList.add('turn');
  if (turn === 'computer') aiBox?.classList.add('turn');
}
function hasNeighboringShips(board, coords) {
  for (let [x, y] of coords) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx > 9 || ny > 9) continue;
        if (board.ships.some(ship =>
          ship.coords.some(c => c[0] === nx && c[1] === ny))) {
          return true;
        }
      }
    }
  }
  return false;
}

