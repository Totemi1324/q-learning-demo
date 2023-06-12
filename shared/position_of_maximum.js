import { randomInt } from "./random_int.js";

export function positionOfMaximum(array, randomDuplicate = true) {
    const maximum = Math.max(...array);
    let maximumValues = array.filter((value) => value == maximum);
    if (maximumValues.length == 1) {
        return array.indexOf(maximum);
    }
    else {
        let indices = getAllIndices(array, maximum);
        if (randomDuplicate) {
            return indices[randomInt(indices.length)];
        }
        else {
            return undefined;
        }
    }
}

function getAllIndices(arr, val) {
    var indices = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indices.push(i);
    return indices;
}