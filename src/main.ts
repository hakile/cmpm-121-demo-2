import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Harrison's Sketchpad";
const drawEvent = new Event("drawing-changed");

const undoButton = makeButton("Undo", () => {
  if (lines.length > 1) {
    lines.pop();
    const line = lines.pop();
    lines.push([]);
    redos.push(line!);
    curInd--;
    canvas.dispatchEvent(drawEvent);
    redoButton.disabled = false;
    if (lines.length < 2) undoButton.disabled = true;
  }
});
undoButton.disabled = true;

const clearButton = makeButton("Clear", () => clearCanvas(true));

const redoButton = makeButton("Redo", () => {
  if (redos.length > 0) {
    lines.pop();
    const line = redos.pop();
    lines.push(line!);
    lines.push([]);
    curInd++;
    canvas.dispatchEvent(drawEvent);
    undoButton.disabled = false;
    if (redos.length < 1) redoButton.disabled = true;
  }
});
redoButton.disabled = true;

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
const origin = 0;

let lines: number[][][] = [[]];
let redos: number[][][] = [];
let curInd = 0;

let mouseDown = false;
canvas.onmousedown = function () {
  mouseDown = true;
  undoButton.disabled = true;
};
canvas.onmouseup = function () {
  if (mouseDown) {
    mouseDown = false;
    curInd++;
    lines[curInd] = [[]];
    undoButton.disabled = false;
    redos = [];
    redoButton.disabled = true;
  }
};
canvas.addEventListener("drawing-changed", () => {
  clearCanvas(false);
  for (const line of lines) {
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
    lines[curInd].push(newCoords);
    canvas.dispatchEvent(drawEvent);
  }
});

app.append(document.createElement("div"));

app.append(undoButton);
app.append(clearButton);
app.append(redoButton);

clearCanvas(true);

function makeButton(name: string, callback: () => void): HTMLButtonElement {
  const newButton = document.createElement("button");
  newButton.innerHTML = name;
  newButton.addEventListener("click", () => callback());
  return newButton;
}

function clearCanvas(clearLines: boolean): void {
  ctx.clearRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  if (clearLines) {
    lines = [[]];
    undoButton.disabled = true;
    redoButton.disabled = true;
    curInd = 0;
  }
}

console.log("Step 4");
