import FrozenLakeEnvironment from "./classes/frozen_lake_environment.js";
import QLearning from "./classes/q_learning.js";
import { setFramesPerSecond } from "./index.js";

import { ASSETS } from "./assets.js";
import { positionOfMaximum } from "./shared/position_of_maximum.js";

// Global constants
export const CANVAS_WIDTH = 720;
export const CANVAS_HEIGHT = 720;
export const CELL_SIZE = 64;

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_WIDTH;

// Global settings
export let level = 0;
export let paused = false;
export let stepsField = document.getElementById("steps-field");
export let epochsField = document.getElementById("epochs-field");

// Objects
const env = new FrozenLakeEnvironment(context, {
    levelNumber: level,
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
document.getElementById("reset-button").onclick = resetQLearning;
document.getElementById("turbo-button").onclick = make500Steps;
document.getElementById("remove-button").onclick = removeAllStars;
document.getElementById("next-level-button").onclick = incrementLevel;
document.getElementById("previous-level-button").onclick = decrementLevel;
const gammaSelector = document.getElementById("gamma-selector");
gammaSelector.onchange = selectGamma;
const epsilonSelector = document.getElementById("epsilon-selector");
epsilonSelector.onchange = selectEpsilon;
const fpsSelector = document.getElementById("fps-selector");
fpsSelector.onchange = setFramerate;

function togglePause() {
    paused = !paused;
}
function resetQLearning() {
    stepsField.value = "0";
    qLearning.resetMemory();
    env.resetAgent();
    env.epochs = 0;
}
function make500Steps() {
    for (var i = 0; i < 500; i++) {
        qLearning.update(false);
    }
}
function removeAllStars() {
    env.resetTilesToDefault();
}
function incrementLevel() {
    level = (level + 1) % 4;
    env.initialize(level);
    qLearning.resetMemory();
}
function decrementLevel() {
    level -= 1;
    if (level < 0) {
        level = 3;
    }
    env.initialize(level);
    qLearning.resetMemory();
}

function selectGamma() {
    var newGamma = parseFloat(gammaSelector.value);
    qLearning.setConstants(newGamma, qLearning.epsilon);
}
function selectEpsilon() {
    var newEpsilon = parseFloat(epsilonSelector.value);
    qLearning.setConstants(qLearning.gamma, newEpsilon);
}
function setFramerate() {
    var newFramerate = parseInt(fpsSelector.value);
    setFramesPerSecond(newFramerate);
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
