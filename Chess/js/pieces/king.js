export function isKingMoveLegal(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if ((rowDiff <= 1 && colDiff <= 1) && (rowDiff + colDiff !== 0)) {
        return true;
    }

    if (rowDiff === 0 && colDiff === 2) {
        return true;
    }

    return false;
}
