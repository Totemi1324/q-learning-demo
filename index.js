// Entry-point for HTML5 canvas application
// (c) Tamas Nemes, 2022
// DO NOT TOUCH THIS FILE!

import { main, post, clear } from "./main.js";

const defaultFrameRate = 15;
var fpsInterval, now, then, elapsed;

// Set framerate
export function setFramesPerSecond(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
}

// Update instances
function update() {
    let instances = main();
    instances.forEach((instance) => {
        if (typeof instance.update == "function") {
            instance.update();
        }
    });
    post();
}

// App structure
function myApp() {
    setup();
    loop();
}

// One-time setup functions
function setup() {
    setFramesPerSecond(defaultFrameRate);
}

// Main loop
function loop() {
    now = window.performance.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        clear();

        try {
            update();
        } catch (e) {
            throw e;
        }
    }

    requestAnimationFrame(loop);
}

// Run app
myApp();
