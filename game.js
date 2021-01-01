const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;
const gameScale = window.innerHeight / 1080;
canvas.addEventListener("click", (event) => {
  const x = event.layerX / gameScale;
  const y = event.layerY / gameScale;
  const offsetX = hexagonWidth / 2;
  const offsetY = hexagonHeight / 2;
  const possibleClicks = hexagons.filter(
    (hexagon) =>
      hexagon.x + offsetX < x &&
      hexagon.y + offsetY < y &&
      hexagon.x + offsetX + hexagonWidth - scale / 2 > x &&
      hexagon.y + offsetY + hexagonHeight > y
  );
  if (possibleClicks.length === 1) {
    console.log(possibleClicks[0].notation);
    // TODO: select
  }
});

window.addEventListener("resize", (_event) => {
  canvas.style.width = window.innerHeight;
  canvas.style.height = window.innerHeight;
  gameScale = window.innerHeight / 1080;
});

const scale = 50;
const hexagonHeight = scale * Math.cos(Math.PI / 6) * 2;
const hexagonWidth = 1.5 * scale;

const drawHexagon = (relativeX = 0, relativeY = 0, color = "#ff0000") => {
  ctx.fillStyle = color;
  relativeX += hexagonWidth / 2;
  relativeY += hexagonHeight / 2;
  ctx.beginPath();
  ctx.moveTo(relativeX + 0, relativeY + 0);
  ctx.lineTo(relativeX + 1 * scale, relativeY + 0);
  ctx.lineTo(relativeX + 1.5 * scale, relativeY + hexagonHeight / 2);
  ctx.lineTo(relativeX + 1 * scale, relativeY + hexagonHeight);
  ctx.lineTo(relativeX + 0, relativeY + hexagonHeight);
  ctx.lineTo(relativeX - 0.5 * scale, relativeY + hexagonHeight / 2);
  ctx.closePath();
  ctx.fill();
};

const hexagons = [];
const drawBoard = () => {
  const colors = ["#D28C45", "#E9AD70", "#FFCF9F"];
  const fieldDefinition = {
    a: 6,
    b: 7,
    c: 8,
    d: 9,
    e: 10,
    f: 11,
    g: 10,
    h: 9,
    i: 8,
    k: 7,
    l: 6,
  };
  let keyIndex = 0;
  for (const [key, value] of Object.entries(fieldDefinition)) {
    for (let i = 0; i < value; i++) {
      hexagons.push({
        notation: `${key}${i + 1}`,
        x: keyIndex * hexagonWidth,
        y: (4.5 + value * 0.5 - i) * hexagonHeight,
        color: colors[(i + value) % 3],
      });
    }
    keyIndex++;
  }

  hexagons.forEach((hexagon) => {
    drawHexagon(hexagon.x, hexagon.y, hexagon.color);
  });
};

drawBoard();
