import "./style.css";

interface Point {
  x: number;
  y: number;
}

class MarkerLine {
  points: Point[] = [];

  addPoint(point: Point): void {
    this.points.push(point);
  }

  display(ctx: CanvasRenderingContext2D): void {
    for (let i = 1; i < this.points.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
      ctx.lineTo(this.points[i].x, this.points[i].y);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Harrison's Sketchpad";
const drawEvent = new Event("drawing-changed");

const undoButton = makeButton("Undo", () => {
  if (lines.length > 0) {
    // lines.pop();
    const line = lines.pop();
    // lines.push(new MarkerLine());
    redos.push(line!);
    curInd--;
    canvas.dispatchEvent(drawEvent);
    redoButton.disabled = false;
    if (lines.length < 1) undoButton.disabled = true;
  }
});
undoButton.disabled = true;

const clearButton = makeButton("Clear", () => clearCanvas(true));

const redoButton = makeButton("Redo", () => {
  if (redos.length > 0) {
    // lines.pop();
    const line = redos.pop();
    lines.push(line!);
    // lines.push(new MarkerLine());
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

let lines: MarkerLine[] = [];
let redos: MarkerLine[] = [];
let curInd = 0;

let mouseDown = false;
canvas.onmousedown = function () {
  if (!mouseDown) {
    lines[curInd] = new MarkerLine();
    mouseDown = true;
    undoButton.disabled = true;
  }
};
canvas.onmouseup = function () {
  if (mouseDown) {
    mouseDown = false;
    curInd++;
    undoButton.disabled = false;
    redos = [];
    redoButton.disabled = true;
  }
};
canvas.addEventListener("drawing-changed", () => {
  clearCanvas(false);
  lines.forEach((line) => {
    line.display(ctx);
  });
});
canvas.addEventListener("mousemove", (mouse) => {
  if (mouseDown) {
    const newCoords: Point = { x: mouse.offsetX, y: mouse.offsetY };
    lines[curInd].addPoint(newCoords);
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
    lines = [new MarkerLine()];
    undoButton.disabled = true;
    redoButton.disabled = true;
    curInd = 0;
  }
}

console.log("Step 5");
