
// grid.js
export default function grid() {
  const grid = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      row.push({ x: i, y: j, hit: false });
    }
    grid.push(row);
  }
  return grid;
}
