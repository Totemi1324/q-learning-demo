import FrozenLakeEnvironment from "./classes/frozen_lake_environment.js";

// Global constants
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = 650;
canvas.height = 650;

// Objects
const env = new FrozenLakeEnvironment(context, 0);

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
