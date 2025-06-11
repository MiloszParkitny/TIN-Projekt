export function isRookMoveLegal(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false;

    const rowStep = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
    const colStep = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);

    let r = fromRow + rowStep;
    let c = fromCol + colStep;

    while (r !== toRow || c !== toCol) {
        const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        if (square.querySelector('img')) return false;
        r += rowStep;
        c += colStep;
    }

    return true;
}
