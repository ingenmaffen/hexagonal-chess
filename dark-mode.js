// dark/light mode
let dark = localStorage.getItem("darkMode");
dark = dark && dark === "true";
if (dark) {
  document.body.style.backgroundColor = "black";
}

const appendDarkLightButton = () => {
  const button = document.createElement("BUTTON");
  button.innerHTML = `<img width="32" height="32" src="assets/${
    dark ? "sun" : "moon"
  }.svg" />`;
  button.style.marginRight = 10;
  button.style.marginTop = 10;
  button.style.backgroundColor = "transparent";
  button.style.border = "none";
  button.onclick = () => {
    switchDarkLightMode();
    document.getElementById("button-container").removeChild(button);
    appendDarkLightButton();
  };
  document.getElementById("button-container").append(button);
};

const switchDarkLightMode = () => {
  dark = !dark;
  if (dark) {
    document.body.style.backgroundColor = "black";
  } else {
    document.body.style.backgroundColor = "white";
  }
  localStorage.setItem("darkMode", dark);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGameState();
  drawBoard();
  if (selectedField) {
    drawSelectedField();
  }
};
