// Game.js
export default function Game(playerBoard, computerBoard) {
  return {
    currentPlayer: 'player',

    playTurn(coord) {
      if (this.isGameOver()) {
        console.log('Game Over!');
        return;
      }

      if (this.currentPlayer === 'player') {
  console.log(`Player attacks computer at ${coord}`);
  computerBoard.receiveAttack(coord);
        this.switchTurn();
      } else {
        const randomCoord = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];
        console.log(`Computer attacks player at ${randomCoord}`);
        playerBoard.receiveAttack(randomCoord);
        this.switchTurn();
      }
    },

    switchTurn() {
      this.currentPlayer =
        this.currentPlayer === 'player' ? 'computer' : 'player';
      console.log(`Now it’s ${this.currentPlayer}’s turn.`);
    },

    isGameOver() {
      if (playerBoard.allSunk()) {
        console.log('Computer wins!');
        return true;
      }
      if (computerBoard.allSunk()) {
        console.log('Player wins!');
        return true;
      }
      return false;
    },
  };
}
