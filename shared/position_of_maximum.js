import { randomInt } from "./random_int.js";

export function positionOfMaximum(array, randomDuplicate = true) {
    const maximum = Math.max(...array);
    let maximumValues = array.filter((value) => value == maximum);
    if (!randomDuplicate || maximumValues.length == 1) {
        return array.indexOf(maximum);
    }
    else {
        let indices = getAllIndices(array, maximum);
        return indices[randomInt(indices.length)]
    }
}

function getAllIndices(arr, val) {
    var indices = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indices.push(i);
    return indices;
}