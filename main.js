import FrozenLakeEnvironment from "./classes/frozen_lake_environment.js";
import QLearning from "./classes/q_learning.js";

import { ASSETS } from "./assets.js";
import { positionOfMaximum } from "./shared/position_of_maximum.js";

// Global constants
export const CANVAS_WIDTH = 650;
export const CANVAS_HEIGHT = 650;
export const CELL_SIZE = 64;

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_WIDTH;

// Global settings
export let paused = false;

// Objects
const env = new FrozenLakeEnvironment(context, {
    levelNumber: 0,
});
const qLearning = new QLearning(env, {
    gamma: 0.9,
    epsilon: 0.1,
});
const arrowSprites = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image(),
}

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

document.getElementById("pause-button").onclick = togglePause;

function togglePause() {
    paused = !paused;
}

// Define rendering order (layers)
const RENDER_PRIORITY = [env, qLearning];

// --- MAIN ---
export function main() {
    arrowSprites.up.src = ASSETS.arrowUp;
    arrowSprites.down.src = ASSETS.arrowDown;
    arrowSprites.left.src = ASSETS.arrowLeft;
    arrowSprites.right.src = ASSETS.arrowRight; 

    return RENDER_PRIORITY;
}

// --- POST-MAIN ---
export function post() {
    for (var i = 0; i < env.rows; i++) {
        for (var j = 0; j < env.columns; j++) {
            if (env.isHoleTile(j, i)) {
                continue;
            }
            const x = env.position.x + j * CELL_SIZE;
            const y = env.position.y + i * CELL_SIZE;
            const qValues = qLearning.getQForState(env.coordinateToStateNumber(j, i));
            const indexOfMaximum = positionOfMaximum(qValues, false);
            if (!indexOfMaximum || qValues[indexOfMaximum] == 0) {
                continue;
            }

            var sprite;
            switch (indexOfMaximum) {
                case 0:
                    sprite = arrowSprites.up;
                    break;
                case 1:
                    sprite = arrowSprites.down;
                    break;
                case 2:
                    sprite = arrowSprites.left;
                    break;
                case 3:
                    sprite = arrowSprites.right;
                    break;
            }

            context.drawImage(sprite, x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}

// --- CLEAR CANVAS ---
export function clear() {
    context.fillStyle = "rgb(1, 65, 91)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
