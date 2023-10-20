import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Harrison's Sketchpad";
const event = new Event("drawing-changed");

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.border = "6px solid #000000";
canvas.style.border = "6px solid #000000";
canvas.style.borderRadius = "16px";
canvas.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, .5)";
app.append(canvas);

const ctx = canvas.getContext("2d")!;
const origin = 0;

let points: number[][][] = [[[]]];
let curInd = 0;

clearCanvas();

let mouseDown = false;
canvas.onmousedown = function () {
  mouseDown = true;
};
canvas.onmouseup = function () {
  if (mouseDown) {
    mouseDown = false;
    curInd++;
    points[curInd] = [[]];
  }
};
canvas.addEventListener("drawing-changed", () => {
  for (const line of points) {
    for (let i = 1; i < line.length; i++) {
      ctx.beginPath();
      ctx.moveTo(line[i - 1][0], line[i - 1][1]);
      ctx.lineTo(line[i][0], line[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
  }
});
canvas.addEventListener("mousemove", (mouse) => {
  if (mouseDown) {
    const newCoords: number[] = [mouse.offsetX, mouse.offsetY];
    points[curInd].push(newCoords);
    canvas.dispatchEvent(event);
  }
});

app.append(document.createElement("div"));

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.addEventListener("click", () => clearCanvas());
app.append(clearButton);

function clearCanvas() {
  ctx.clearRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  points = [[[]]];
  curInd = 0;
}

console.log("Step 3");
