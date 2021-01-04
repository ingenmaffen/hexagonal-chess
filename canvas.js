// initiate canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let gameScale = window.innerHeight / 1080;

canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;

window.addEventListener("resize", (_event) => {
  canvas.style.width = window.innerHeight;
  canvas.style.height = window.innerHeight;
  gameScale = window.innerHeight / 1080;
});
