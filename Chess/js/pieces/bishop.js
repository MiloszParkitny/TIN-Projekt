export function isBishopMoveLegal(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    if (rowDiff !== colDiff) return false;

    const rowStep = toRow > fromRow ? 1 : -1;
    const colStep = toCol > fromCol ? 1 : -1;

    let r = fromRow + rowStep;
    let c = fromCol + colStep;

    while (r !== toRow && c !== toCol) {
        const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        if (square.querySelector('img')) return false;
        r += rowStep;
        c += colStep;
    }

    return true;
}
