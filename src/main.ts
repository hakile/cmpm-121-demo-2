import "./style.css";

interface Point {
  x: number;
  y: number;
}

class MarkerLine {
  points: Point[] = [];
  width = 1;

  addPoint(point: Point): void {
    this.points.push(point);
  }

  display(ctx: CanvasRenderingContext2D): void {
    for (let i = 1; i < this.points.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = this.width;
      ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
      ctx.lineTo(this.points[i].x, this.points[i].y);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

class CustomCursor {
  coords: Point = { x: 0, y: 0 };

  draw(ctx: CanvasRenderingContext2D): void {
    canvas.dispatchEvent(drawEvent);
    ctx.fillRect(this.coords.x, this.coords.y, curWidth + 3, curWidth + 3);
  }
}

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Harrison's Sketchpad";
const drawEvent = new Event("drawing-changed");
const toolMovedEvent = new Event("tool-moved");
const buttons: HTMLButtonElement[] = [];
const cCursor = new CustomCursor();
let selectedMarker: HTMLButtonElement;

const undoButton = makeButton("Undo", () => {
  if (lines.length > 0) {
    const line = lines.pop();
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
    const line = redos.pop();
    lines.push(line!);
    curInd++;
    canvas.dispatchEvent(drawEvent);
    undoButton.disabled = false;
    if (redos.length < 1) redoButton.disabled = true;
  }
});
redoButton.disabled = true;

const thinButton = makeButton("Thin", () => {
  curWidth = 1;
  selectedMarker = thinButton;
  thinButton.style.color = "#80FF80";
  thickButton.style.color = "#FFFFFF";
});
thinButton.style.color = "#80FF80";
selectedMarker = thinButton;

const thickButton = makeButton("Thick", () => {
  curWidth = 5;
  selectedMarker = thickButton;
  thickButton.style.color = "#80FF80";
  thinButton.style.color = "#FFFFFF";
});

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
canvas.style.cursor = "none";
app.append(canvas);

const ctx = canvas.getContext("2d")!;
const origin = 0;

let lines: MarkerLine[] = [];
let redos: MarkerLine[] = [];
let curInd = 0;
let curWidth = 1;
let mouseDown = false;

canvas.onmousedown = function () {
  if (!mouseDown) {
    lines[curInd] = new MarkerLine();
    lines[curInd].width = curWidth;
    mouseDown = true;
    buttons.forEach((b) => {
      b.disabled = true;
    });
    thinButton.style.color = "#808080";
    thickButton.style.color = "#808080";
    selectedMarker.style.color = "#408040";
  }
};

canvas.onmouseup = function () {
  if (mouseDown) {
    mouseDown = false;
    curInd++;
    buttons.forEach((b) => {
      if (b != redoButton) {
        b.disabled = false;
      }
    });
    thinButton.style.color = "#FFF";
    thickButton.style.color = "#FFF";
    selectedMarker.style.color = "#80FF80";
    redos = [];
  }
};

canvas.addEventListener("drawing-changed", () => {
  clearCanvas(false);
  lines.forEach((line) => {
    line.display(ctx);
  });
});

canvas.addEventListener("tool-moved", () => {
  cCursor.draw(ctx);
});

canvas.addEventListener("mousemove", (mouse) => {
  const coords: Point = { x: mouse.offsetX, y: mouse.offsetY };
  cCursor.coords = coords;
  if (mouseDown) {
    lines[curInd].addPoint(coords);
    canvas.dispatchEvent(drawEvent);
  } else {
    canvas.dispatchEvent(toolMovedEvent);
  }
});

app.append(document.createElement("div"));

app.append(undoButton);
app.append(clearButton);
app.append(redoButton);

app.append(document.createElement("div"));

app.append(thinButton);
app.append(thickButton);

clearCanvas(true);

function makeButton(name: string, callback: () => void): HTMLButtonElement {
  const newButton = document.createElement("button");
  newButton.innerHTML = name;
  newButton.addEventListener("click", () => callback());
  buttons.push(newButton);
  return newButton;
}

function clearCanvas(clearLines: boolean): void {
  ctx.clearRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(origin, origin, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  if (clearLines) {
    lines = [];
    undoButton.disabled = true;
    redoButton.disabled = true;
    curInd = 0;
  }
}

console.log("Step 7");
