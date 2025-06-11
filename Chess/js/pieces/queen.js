import { isRookMoveLegal } from './rook.js';
import { isBishopMoveLegal } from './bishop.js';

export function isQueenMoveLegal(fromRow, fromCol, toRow, toCol) {
    return isRookMoveLegal(fromRow, fromCol, toRow, toCol) ||
        isBishopMoveLegal(fromRow, fromCol, toRow, toCol);
}
