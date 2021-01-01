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
  const possibleClicks = [];
  for (const [key, value] of Object.entries(hexagons)) {
    if (
      value.x + offsetX < x &&
      value.y + offsetY < y &&
      value.x + offsetX + hexagonWidth - scale / 2 > x &&
      value.y + offsetY + hexagonHeight > y
    ) {
      possibleClicks.push(key);
    }
  }
  if (possibleClicks.length === 1) {
    console.log(possibleClicks[0]);
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

const hexagons = {};
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
      hexagons[`${key}${i + 1}`] = {
        x: keyIndex * hexagonWidth,
        y: (4.5 + value * 0.5 - i) * hexagonHeight,
        color: colors[(i + value) % 3],
      };
    }
    keyIndex++;
  }

  for (const [key, value] of Object.entries(hexagons)) {
    drawHexagon(value.x, value.y, value.color);
  }
};

drawBoard();

const gameState = {
  white: {
    pawn: ["b1", "c2", "d3", "e4", "f5", "g4", "h3", "i2", "k1"],
    bishop: ["f1", "f2", "f3"],
    rook: ["c1", "i1"],
    knight: ["d1", "h1"],
    queen: ["e1"],
    king: ["g1"],
  },
  black: {
    pawn: ["b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7", "k7"],
    bishop: ["f11", "f10", "f9"],
    rook: ["c8", "i8"],
    knight: ["d9", "h9"],
    queen: ["e10"],
    king: ["g10"],
  },
};

for (const [key, value] of Object.entries(gameState.white)) {
  value.forEach((field) => {
    const img = new Image();
    img.src = `./assets/${key}-white.svg`;
    img.onload = () => {
      ctx.drawImage(
        img,
        hexagons[field].x + hexagonWidth * 0.45,
        hexagons[field].y + hexagonHeight * 0.65,
        hexagonWidth * 0.75,
        hexagonHeight * 0.75
      );
    };
  });
}

for (const [key, value] of Object.entries(gameState.black)) {
  value.forEach((field) => {
    const img = new Image();
    img.src = `./assets/${key}-black.svg`;
    img.onload = () => {
      ctx.drawImage(
        img,
        hexagons[field].x + hexagonWidth * 0.45,
        hexagons[field].y + hexagonHeight * 0.65,
        hexagonWidth * 0.75,
        hexagonHeight * 0.75
      );
    };
  });
}
