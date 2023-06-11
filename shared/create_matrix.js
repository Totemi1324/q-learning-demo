export function createMatrix(rows, columns, valueGetter) {
    let matrix = [];

    for (let i = 0; i < rows; i++) {
        if (typeof valueGetter != "function") {
            matrix[i] = new Array(columns).fill(valueGetter);
        } else {
            matrix[i] = new Array(columns).fill();
            for (const idx in matrix[i]) {
                matrix[i][idx] = valueGetter.call();
            }
        }
    }
    
    return matrix;
}
