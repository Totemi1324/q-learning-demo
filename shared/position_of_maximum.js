export function positionOfMaximum(array, allowDuplicates = true) {
    const maximum = Math.max(...array);
    let maximumValues = array.filter((value) => value == maximum);
    if (allowDuplicates || maximumValues.length == 1) {
        return array.indexOf(maximum);
    }
}