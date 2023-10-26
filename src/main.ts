import "./style.css";

const sizeFactor = 0.15;
let randColor = hsv2rgb(Math.random() * 360, 1, 0.875);
console.log(randColor);
let randRotate = 2 * Math.random() - 1;

interface Point {
  x: number;
  y: number;
}

class MarkerLine {
  points: Point[] = [];
  size = 1;
  color = randColor;
  rotation = 0;

  addPoint(point: Point): void {
    this.points.push(point);
  }

  display(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.color;
    for (let i = 1; i < this.points.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";
      ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
      ctx.lineTo(this.points[i].x, this.points[i].y);
      ctx.stroke();
    }
  }
}

class Sticker {
  coord: Point = { x: 0, y: 0 };
  stickerText = "";
  size = 30;
  color = "";
  rotation = randRotate;

  addPoint(): void {
    return;
  }

  display(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#000";
    const trueSize = Math.min(
      30,
      (30 * Math.pow(3, sizeFactor)) /
        Math.pow(this.stickerText.length, sizeFactor)
    );
    ctx.font = `${trueSize}px Arial`;
    ctx.translate(this.coord.x, this.coord.y);
    ctx.rotate(this.rotation);
    ctx.fillText(this.stickerText, 0, 0);
    ctx.rotate(-this.rotation);
    ctx.translate(-this.coord.x, -this.coord.y);
  }
}

type CType = "marker" | "emoji";

class CustomCursor {
  coords: Point = { x: 0, y: 0 };
  cursorType: CType = "marker";
  cursorEmote = " ";

  draw(ctx: CanvasRenderingContext2D): void {
    canvas.dispatchEvent(drawEvent);
    if (this.cursorType == "marker") {
      ctx.fillRect(this.coords.x, this.coords.y, curWidth + 3, curWidth + 3);
    } else {
      ctx.fillStyle = "#000";
      const size = Math.min(
        30,
        (30 * Math.pow(3, sizeFactor)) /
          Math.pow(this.cursorEmote.length, sizeFactor)
      );
      ctx.font = `${size}px Arial`;
      ctx.translate(this.coords.x, this.coords.y);
      ctx.rotate(randRotate);
      ctx.fillText(this.cursorEmote, 0, 0);
      ctx.rotate(-randRotate);
      ctx.translate(-this.coords.x, -this.coords.y);
    }
  }
}

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Harrison's Sketchpad";
const drawEvent = new Event("drawing-changed");
const toolMovedEvent = new Event("tool-moved");
const buttons: HTMLButtonElement[] = [];
const toolButtons: HTMLButtonElement[] = [];
const cCursor = new CustomCursor();

const undoButton = makeButton("Undo", () => {
  if (actions.length > 0) {
    const line = actions.pop();
    redos.push(line!);
    curInd--;
    canvas.dispatchEvent(drawEvent);
    redoButton.disabled = false;
    if (actions.length < 1) undoButton.disabled = true;
  }
});
undoButton.disabled = true;

const clearButton = makeButton("Clear", () => clearCanvas(true));

const redoButton = makeButton("Redo", () => {
  if (redos.length > 0) {
    const line = redos.pop();
    actions.push(line!);
    curInd++;
    canvas.dispatchEvent(drawEvent);
    undoButton.disabled = false;
    if (redos.length < 1) redoButton.disabled = true;
  }
});
redoButton.disabled = true;

const exportButton = makeButton("Save", () => {
  const bigCanvas = document.createElement("canvas");
  bigCanvas.width = 1024;
  bigCanvas.height = 1024;

  const newCtx = bigCanvas.getContext("2d")!;
  newCtx.scale(4, 4);

  clearCanvas(false, newCtx);
  actions.forEach((action) => {
    action.display(newCtx);
  });

  const anchor = document.createElement("a");
  anchor.href = bigCanvas.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
});

const thinButton = makeButton(
  "1px",
  () => {
    curWidth = 1;
    cCursor.cursorType = "marker";
    randColor = hsv2rgb(Math.random() * 360, 1, 0.875);
    toolButtons.forEach((button) => {
      button.style.borderColor = "";
    });
    thinButton.style.borderColor = "#80FF80";
  },
  true
);
thinButton.style.borderColor = "#80FF80";

const thickButton = makeButton(
  "5px",
  () => {
    curWidth = 5;
    cCursor.cursorType = "marker";
    randColor = hsv2rgb(Math.random() * 360, 1, 0.875);
    toolButtons.forEach((button) => {
      button.style.borderColor = "";
    });
    thickButton.style.borderColor = "#80FF80";
  },
  true
);

const sticker1 = makeStickerButton("😀");
const sticker2 = makeStickerButton("😐");
const sticker3 = makeStickerButton("🙁");

const customStickerButton = makeButton("Make Custom Sticker", () => {
  const stickerText = prompt("Custom sticker text:", "");
  if (stickerText != null && stickerText != "") {
    const newSticker = makeStickerButton(stickerText);
    app.append(newSticker);
  }
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
ctx.font = "30px Arial";

let actions: (MarkerLine | Sticker)[] = [];
let redos: (MarkerLine | Sticker)[] = [];
let curInd = 0;
let curWidth = 1;
let mouseDown = false;

canvas.onmousedown = function (mouse) {
  if (!mouseDown) {
    if (cCursor.cursorType == "marker") {
      actions[curInd] = new MarkerLine();
      actions[curInd].size = curWidth;
    } else {
      const newS = new Sticker();
      newS.coord = { x: mouse.offsetX, y: mouse.offsetY };
      newS.stickerText = cCursor.cursorEmote;
      actions[curInd] = newS;
    }
    mouseDown = true;
    buttons.forEach((b) => {
      b.disabled = true;
    });
  }
};

canvas.onmouseup = function () {
  if (mouseDown) {
    if (cCursor.cursorType == "marker") {
      randColor = hsv2rgb(Math.random() * 360, 1, 0.875);
    } else {
      randRotate = 2 * Math.random() - 1;
    }
    mouseDown = false;
    curInd++;
    buttons.forEach((b) => {
      if (b != redoButton) {
        b.disabled = false;
      }
    });
    redos = [];
  }
};

canvas.addEventListener("drawing-changed", () => {
  clearCanvas();
  actions.forEach((action) => {
    action.display(ctx);
  });
});

canvas.addEventListener("tool-moved", () => {
  cCursor.draw(ctx);
});

canvas.addEventListener("mousemove", (mouse) => {
  const coords: Point = { x: mouse.offsetX, y: mouse.offsetY };
  cCursor.coords = coords;
  if (mouseDown) {
    if (cCursor.cursorType == "marker") {
      actions[curInd].addPoint(coords);
    }
    canvas.dispatchEvent(drawEvent);
  } else {
    canvas.dispatchEvent(toolMovedEvent);
  }
});

canvas.addEventListener("mouseout", () => {
  canvas.dispatchEvent(drawEvent);
});

app.append(document.createElement("div"));

app.append(undoButton);
app.append(redoButton);
app.append(clearButton);
app.append(exportButton);

app.append(document.createElement("div"));

app.append(thinButton);
app.append(thickButton);

app.append(document.createElement("div"));

app.append(customStickerButton);

app.append(document.createElement("div"));

app.append(sticker1);
app.append(sticker2);
app.append(sticker3);

app.append(document.createElement("div"));

clearCanvas(true);

function makeButton(
  name: string,
  callback: () => void,
  tool?: boolean
): HTMLButtonElement {
  const newButton = document.createElement("button");
  newButton.innerHTML = name;
  newButton.addEventListener("click", () => callback());
  buttons.push(newButton);
  if (tool) {
    toolButtons.push(newButton);
  }
  return newButton;
}

function makeStickerButton(sticker: string) {
  const newSticker = makeButton(
    sticker,
    () => {
      randRotate = 2 * Math.random() - 1;
      cCursor.cursorEmote = sticker;
      cCursor.cursorType = "emoji";
      toolButtons.forEach((button) => {
        button.style.borderColor = "";
      });
      newSticker.style.borderColor = "#80FF80";
    },
    true
  );
  return newSticker;
}

function clearCanvas(
  fullClear?: boolean,
  context?: CanvasRenderingContext2D
): void {
  if (context == null) context = ctx;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = randColor;
  context.strokeStyle = randColor;
  if (fullClear) {
    actions = [];
    undoButton.disabled = true;
    redoButton.disabled = true;
    curInd = 0;
  }
}

function hsv2rgb(h: number, s: number, v: number) {
  // Original code by Kamil Kiełczewski
  const f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return `rgb(${f(5) * 255}, ${f(3) * 255}, ${f(1) * 255})`;
}

console.log("Step 12");
