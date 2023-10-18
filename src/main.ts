import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Harrison's Game";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.border = "6px solid #000000";
canvas.style.borderRadius = "16px";
canvas.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, .5)";
app.append(canvas);

const ctx = canvas.getContext("2d")!;
clearCanvas();

const bounds = canvas.getBoundingClientRect();
const offset = 10;
const origin = 0;

let lastX = 0;
let lastY = 0;

let mouseDown = false;
canvas.onmousedown = function (mouse) {
  mouseDown = true;
  lastX = mouse.clientX - bounds.left - offset;
  lastY = mouse.clientY - bounds.top + offset;
};
canvas.onmouseup = function () {
  mouseDown = false;
};
canvas.addEventListener("mousemove", (mouse) => {
  if (mouseDown) {
    console.log("eh");
    const curX: number = mouse.clientX - bounds.left - offset;
    const curY: number = mouse.clientY - bounds.top + offset;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    lastX = curX;
    lastY = curY;
  }
});

app.append(document.createElement("div"));

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.addEventListener("click", clearCanvas);
app.append(clearButton);

function clearCanvas() {
  ctx.clearRect(origin, origin, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "black";
}

console.log("Step 2");
