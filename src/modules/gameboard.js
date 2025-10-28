// gameboard.js
export default function gameboard(ships, length) {
  return {
    ships: [],
    misses: [],
    placeShip(ship, coords) {
      if (this.isValidPlacement(coords)) {
        ship.coords = coords;
        this.ships.push(ship);
        console.log(`${ship.name} placed at`, coords);
      } else {
        console.log('Invalid placement for', ship.name);
      }
    },
    isValidPlacement(coords) {
      for (let ship of this.ships) {
        for (let coord of coords) {
          if (
            ship.coords.some(
              (existingCoord) =>
                existingCoord[0] === coord[0] && existingCoord[1] === coord[1]
            )
          ) {
            return false;
          }
        }
      }
      return true;
    },
    receiveAttack(coord) {
      const [x, y] = coord;
      if (this.misses.some(c => c[0] === x && c[1] === y)) {
        return { alreadyAttacked: true };
      }
      
      for (let ship of this.ships) {
        if (ship.hitCoords && ship.hitCoords.some(c => c[0] === x && c[1] === y)) {
          return { alreadyAttacked: true };
        }
      }
      
      for (let ship of this.ships) {
        for (let i = 0; i < ship.coords.length; i++) {
          if (ship.coords[i][0] === x && ship.coords[i][1] === y) {
            if (typeof ship.hit === 'function') ship.hit([x, y]);
            console.log(`Hit on ${ship.name} at ${coord}`);
            return { hit: true, shipName: ship.name, sunk: !!ship.sunk };
          }
        }
      }
      
      this.misses.push([x, y]);
      console.log(`Miss at ${coord}`);
      return { hit: false };
    },
    allSunk() {
      return this.ships.every((ship) => ship.sunk);
    },
  };
}
