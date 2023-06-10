import Rectangle from "./classes/rectangle.js";

// Global constants
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = 650;
canvas.height = 650;

// Objects
const rect = new Rectangle(context);

// Define rendering order (layers)
const RENDER_PRORITY = [rect];

// --- MAIN ---
export function main() {
    return RENDER_PRORITY;
}

// --- CLEAR CANVAS ---
export function clear() {
    context.fillStyle = "rgb(1, 65, 91)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
