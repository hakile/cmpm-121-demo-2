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
canvas.style.borderRadius = "16px";
canvas.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, .5)";
app.append(canvas);

console.log("Step 1");
