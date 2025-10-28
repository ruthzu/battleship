// ship.js
export default function createShip(name, length) {
  return {
    name: name,
    length: length,
    hits: 0,
    sunk: false,
    coords: [],
    hitCoords: [],
    hit(coord) {
      const [x, y] = coord;
      if (this.hitCoords.some(c => c[0] === x && c[1] === y)) return;
      this.hitCoords.push([x, y]);
      this.hits = this.hitCoords.length;
      if (this.hits >= this.length) {
        this.sunk = true;
      }
    },
  };
}
