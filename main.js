import FrozenLakeEnvironment from "./classes/frozen_lake_environment.js";

// Global constants
export const CANVAS_WIDTH = 650;
export const CANVAS_HEIGHT = 650;

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_WIDTH;

// Objects
const env = new FrozenLakeEnvironment(context, {
    x: 50,
    y: 50,
    levelNumber: 0,
});

// Define rendering order (layers)
const RENDER_PRORITY = [env];

// --- MAIN ---
export function main() {
    return RENDER_PRORITY;
}

// --- CLEAR CANVAS ---
export function clear() {
    context.fillStyle = "rgb(1, 65, 91)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
