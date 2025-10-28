// players.js
export default function createPlayer(type = 'human') {
  const player = {
    type,
    attacks: [],
    targetQueue: [],
    currentTargetHits: [],

    attack(enemyBoard, coord) {
      if (this.attacks.some((a) => a[0] === coord[0] && a[1] === coord[1])) {
        return { alreadyAttacked: true };
      }

      this.attacks.push(coord);
      const result = enemyBoard.receiveAttack(coord);

      if (this.type === 'computer' && result && !result.alreadyAttacked) {
        this._handleComputerAttackOutcome(coord, result);
      }

      return result;
    },

    randomAttack(enemyBoard) {
      if (this.type !== 'computer') {
        const coord = this._randomCoord();
        const result = this.attack(enemyBoard, coord);
        return { coord, result };
      }

      let attempts = 0;
      let coord = null;
      let result = null;

      while (attempts < 100) {
        attempts += 1;
        coord = this._nextTargetCoord();
        result = this.attack(enemyBoard, coord);
        if (!result || !result.alreadyAttacked) break;
      }

      if (attempts >= 100) {
        coord = this._randomCoord();
        result = this.attack(enemyBoard, coord);
      }

      return { coord, result };
    },

    resetTracking() {
      this.attacks = [];
      this.targetQueue = [];
      this.currentTargetHits = [];
    },

    _randomCoord() {
      return [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];
    },

    _nextTargetCoord() {
      while (this.targetQueue.length) {
        const coord = this.targetQueue.shift();
        if (!this.attacks.some((a) => a[0] === coord[0] && a[1] === coord[1])) {
          return coord;
        }
      }
      return this._randomCoord();
    },

    _handleComputerAttackOutcome(coord, result) {
      if (!result.hit) {
        return;
      }

      if (result.sunk) {
        this.currentTargetHits = [];
        this.targetQueue = [];
        return;
      }

      this.currentTargetHits.push(coord);

      this.currentTargetHits = this.currentTargetHits.reduce((unique, hit) => {
        if (!unique.some((c) => c[0] === hit[0] && c[1] === hit[1])) {
          unique.push(hit);
        }
        return unique;
      }, []);

      let candidates = [];

      if (this.currentTargetHits.length >= 2) {
        const hits = [...this.currentTargetHits];
        const sameRow = hits.every((h) => h[0] === hits[0][0]);
        const sameCol = hits.every((h) => h[1] === hits[0][1]);

        if (sameRow) {
          const row = hits[0][0];
          const ys = hits.map((h) => h[1]);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          candidates = [
            [row, minY - 1],
            [row, maxY + 1],
          ];
        } else if (sameCol) {
          const col = hits[0][1];
          const xs = hits.map((h) => h[0]);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          candidates = [
            [minX - 1, col],
            [maxX + 1, col],
          ];
        } else {
          candidates = this._adjacentCoords(coord);
        }
      } else {
        candidates = this._adjacentCoords(coord);
      }

      this._enqueueTargets(candidates);
    },

    _enqueueTargets(coords) {
      coords
        .filter(([x, y]) => this._isValidCoord(x, y))
        .forEach(([x, y]) => {
          const alreadyQueued = this.targetQueue.some((c) => c[0] === x && c[1] === y);
          const alreadyAttacked = this.attacks.some((c) => c[0] === x && c[1] === y);
          if (!alreadyQueued && !alreadyAttacked) {
            this.targetQueue.push([x, y]);
          }
        });
    },

    _adjacentCoords([x, y]) {
      return [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];
    },

    _isValidCoord(x, y) {
      return x >= 0 && x < 10 && y >= 0 && y < 10;
    },
  };

  return player;
}
