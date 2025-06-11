import { isPawnMoveLegal } from './pieces/pawn.js';
import { isRookMoveLegal } from './pieces/rook.js';
import { isKnightMoveLegal } from './pieces/knight.js';
import { isBishopMoveLegal } from './pieces/bishop.js';
import { isQueenMoveLegal } from './pieces/queen.js';
import { isKingMoveLegal } from './pieces/king.js';

let gameOver = false;

export function checkGameState(currentColor) {
    const kingSquare = findKing(currentColor);
    if (!kingSquare) return;

    const row = parseInt(kingSquare.dataset.row);
    const col = parseInt(kingSquare.dataset.col);

    const isInCheck = isSquareAttacked(row, col, oppositeColor(currentColor));
    const canMove = hasAnyLegalMove(currentColor);

    if (isInCheck && !canMove) {
        alert(`Szach-mat! Wygrały ${oppositeColor(currentColor) === 'white' ? 'białe' : 'czarne'}!`);
        gameOver = true;
    } else if (!isInCheck && !canMove) {
        alert(`Pat! Remis.`);
    } else if (isInCheck) {
        alert(`Szach!`);
    }
}

function oppositeColor(color) {
    return color === 'white' ? 'black' : 'white';
}

function findKing(color) {
    const pieces = document.querySelectorAll('.piece');
    for (const piece of pieces) {
        const src = piece.src.split('/').pop();
        if (src.startsWith(`king_${color}`)) {
            return piece.parentElement;
        }
    }
    return null;
}

export function isSquareAttacked(targetRow, targetCol, attackerColor) {
    const squares = document.querySelectorAll('.square');
    for (const square of squares) {
        const piece = square.querySelector('img');
        if (!piece) continue;

        const [type, color] = piece.src.split('/').pop().replace('.svg', '').split('_');
        if (color !== attackerColor) continue;

        const fromRow = parseInt(square.dataset.row);
        const fromCol = parseInt(square.dataset.col);

        if (
            (type === 'pawn' && isPawnMoveLegal(fromRow, fromCol, targetRow, targetCol, color, true)) ||
            (type === 'rook' && isRookMoveLegal(fromRow, fromCol, targetRow, targetCol)) ||
            (type === 'knight' && isKnightMoveLegal(fromRow, fromCol, targetRow, targetCol)) ||
            (type === 'bishop' && isBishopMoveLegal(fromRow, fromCol, targetRow, targetCol)) ||
            (type === 'queen' && isQueenMoveLegal(fromRow, fromCol, targetRow, targetCol)) ||
            (type === 'king' && isKingMoveLegal(fromRow, fromCol, targetRow, targetCol))
        ) {
            return true;
        }
    }
    return false;
}

function hasAnyLegalMove(color) {
    const squares = document.querySelectorAll('.square');

    for (const fromSquare of squares) {
        const piece = fromSquare.querySelector('img');
        if (!piece) continue;

        const [type, pieceColor] = piece.src.split('/').pop().replace('.svg', '').split('_');
        if (pieceColor !== color) continue;

        const fromRow = parseInt(fromSquare.dataset.row);
        const fromCol = parseInt(fromSquare.dataset.col);

        for (const toSquare of squares) {
            const toRow = parseInt(toSquare.dataset.row);
            const toCol = parseInt(toSquare.dataset.col);

            const targetPiece = toSquare.querySelector('img');
            if (targetPiece && targetPiece.src.includes(`${color}`)) continue;

            let legal = false;
            const isEnemy = !!targetPiece && !targetPiece.src.includes(`${color}`);

            if (type === 'pawn') {
                legal = isPawnMoveLegal(fromRow, fromCol, toRow, toCol, color, isEnemy);
            } else if (type === 'rook') {
                legal = isRookMoveLegal(fromRow, fromCol, toRow, toCol);
            } else if (type === 'knight') {
                legal = isKnightMoveLegal(fromRow, fromCol, toRow, toCol);
            } else if (type === 'bishop') {
                legal = isBishopMoveLegal(fromRow, fromCol, toRow, toCol);
            } else if (type === 'queen') {
                legal = isQueenMoveLegal(fromRow, fromCol, toRow, toCol);
            } else if (type === 'king') {
                legal = isKingMoveLegal(fromRow, fromCol, toRow, toCol);
                if (legal) {
                    const underAttack = isSquareAttacked(toRow, toCol, oppositeColor(color));
                    if (underAttack) {
                        legal = false;
                    }
                }
            }

            if (legal) {
                const originalFrom = fromSquare.innerHTML;
                const originalTo = toSquare.innerHTML;

                toSquare.innerHTML = '';
                toSquare.appendChild(piece);

                const king = findKing(color);
                const kingRow = parseInt(king.dataset.row);
                const kingCol = parseInt(king.dataset.col);
                const check = isSquareAttacked(kingRow, kingCol, oppositeColor(color));

                fromSquare.innerHTML = originalFrom;
                toSquare.innerHTML = originalTo;

                if (!check) return true;
            }
        }
    }
    return false;
}

export function canCastle(fromRow, fromCol, toCol, color, boardElement, flags) {
    const isKingside = toCol > fromCol;
    const rookCol = isKingside ? 7 : 0;
    const pathCols = isKingside ? [5, 6] : [1, 2, 3];

    const rookSquare = boardElement.querySelector(`.square[data-row="${fromRow}"][data-col="${rookCol}"]`);
    const rook = rookSquare?.querySelector('img');
    const rookName = rook?.src.split('/').pop().replace('.svg', '');
    const rookValid = rook && rookName.startsWith(`rook_${color}`);

    const {
        whiteKingMoved,
        blackKingMoved,
        whiteRookLeftMoved,
        whiteRookRightMoved,
        blackRookLeftMoved,
        blackRookRightMoved
    } = flags;

    const correctFlags =
        color === 'white'
            ? (!whiteKingMoved && (isKingside ? !whiteRookRightMoved : !whiteRookLeftMoved))
            : (!blackKingMoved && (isKingside ? !blackRookRightMoved : !blackRookLeftMoved));

    const pathClear = pathCols.every(c => {
        const square = boardElement.querySelector(`.square[data-row="${fromRow}"][data-col="${c}"]`);
        return square && !square.querySelector('img');
    });

    const safePath = pathCols.every(c =>
        !isSquareAttacked(fromRow, c, color === 'white' ? 'black' : 'white')
    );

    const kingSafe = !isSquareAttacked(fromRow, fromCol, color === 'white' ? 'black' : 'white');

    return rookValid && correctFlags && pathClear && kingSafe && safePath;
}
