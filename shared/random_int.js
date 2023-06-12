export function randomInt(maximum) {
    const r = Math.floor(Math.random() * maximum);
    if (r == maximum) {
        return maximum - 1;
    } else {
        return r;
    }
}