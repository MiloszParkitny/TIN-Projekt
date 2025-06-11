export function isPawnMoveLegal(fromRow, fromCol, toRow, toCol, color, isEnemy) {
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    if (colDiff === 0 && rowDiff === direction && !isEnemy) {
        return true;
    }

    if (colDiff === 0 && rowDiff === 2 * direction && fromRow === startRow && !isEnemy) {
        return true;
    }

    if (colDiff === 1 && rowDiff === direction && isEnemy) {
        return true;
    }

    return false;
}
