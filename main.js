import FrozenLakeEnvironment from "./classes/frozen_lake_environment.js";
import QLearning from "./classes/q_learning.js";

// Global constants
export const CANVAS_WIDTH = 650;
export const CANVAS_HEIGHT = 650;

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_WIDTH;

// Objects
const env = new FrozenLakeEnvironment(context, {
    levelNumber: 0,
});
const qLearning = new QLearning(env, {
    gamma: 0.9,
    epsilon: 0.1,
});

// Register events
canvas.onmousedown = function (args) {
    var mousePos = getMousePosition(
        this.getBoundingClientRect(),
        args.clientX,
        args.clientY
    );
    env.onMouseClick(mousePos);
};

function getMousePosition(clientRect, clientX, clientY) {
    return {
        x: clientX - clientRect.left,
        y: clientY - clientRect.top,
    };
}

// Define rendering order (layers)
const RENDER_PRIORITY = [env, qLearning];

// --- MAIN ---
export function main() {
    //TODO: Create global update function to draw arrows
    return RENDER_PRIORITY;
}

// --- CLEAR CANVAS ---
export function clear() {
    context.fillStyle = "rgb(1, 65, 91)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
