import { isPawnMoveLegal } from './pieces/pawn.js';
import { isRookMoveLegal } from './pieces/rook.js';
import { isKnightMoveLegal } from './pieces/knight.js';
import { isBishopMoveLegal } from './pieces/bishop.js';
import { isQueenMoveLegal } from './pieces/queen.js';
import { isKingMoveLegal } from './pieces/king.js';
import { addMove } from './moveHistory.js';
import { startClock } from './clock.js';
import { checkGameState } from './gameRules.js';
import { isSquareAttacked } from './gameRules.js';
import { canCastle } from './gameRules.js';



let selectedPiece = null;
let selectedSquare = null;
let currentTurn = 'white';

let whiteKingMoved = false;
let blackKingMoved = false;
let whiteRookLeftMoved = false;
let whiteRookRightMoved = false;
let blackRookLeftMoved = false;
let blackRookRightMoved = false;


export function setupGame(boardElement) {
    boardElement.addEventListener('click', function(event) {
        const square = event.target.closest('.square');
        if (!square) return;

        const figureOnSquare = square.querySelector('img');
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (!selectedPiece) {
            if (!figureOnSquare) return;

            const pieceName = figureOnSquare.src.split('/').pop().replace('.svg', '');
            const [type, color] = pieceName.split('_');

            if (color !== currentTurn) return;

            selectedPiece = figureOnSquare;

            if (selectedSquare) selectedSquare.classList.remove('selected');
            selectedSquare = square;
            selectedSquare.classList.add('selected');

            clearHighlights();

            const allSquares = boardElement.querySelectorAll('.square');
            allSquares.forEach(targetSquare => {
                const targetRow = parseInt(targetSquare.dataset.row);
                const targetCol = parseInt(targetSquare.dataset.col);

                const targetImg = targetSquare.querySelector('img');
                let targetColor = null;
                if (targetImg) {
                    const targetPieceName = targetImg.src.split('/').pop().replace('.svg', '');
                    targetColor = targetPieceName.split('_')[1];
                }
                if (targetColor === color) return;

                let canMove = false;
                const fromRow = parseInt(selectedSquare.dataset.row);
                const fromCol = parseInt(selectedSquare.dataset.col);

                if (type === 'pawn') {
                    const isEnemy = targetColor && targetColor !== color;
                    canMove = isPawnMoveLegal(fromRow, fromCol, targetRow, targetCol, color, isEnemy);
                } else if (type === 'rook') {
                    canMove = isRookMoveLegal(fromRow, fromCol, targetRow, targetCol);
                } else if (type === 'knight') {
                    canMove = isKnightMoveLegal(fromRow, fromCol, targetRow, targetCol);
                } else if (type === 'bishop') {
                    canMove = isBishopMoveLegal(fromRow, fromCol, targetRow, targetCol);
                } else if (type === 'queen') {
                    canMove = isQueenMoveLegal(fromRow, fromCol, targetRow, targetCol);
                }else if (type === 'king') {
                    canMove = isKingMoveLegal(fromRow, fromCol, targetRow, targetCol);

                    if (canMove && Math.abs(targetCol - fromCol) === 2) {
                        canMove = canCastle(fromRow, fromCol, targetCol, color, boardElement, {
                            whiteKingMoved,
                            blackKingMoved,
                            whiteRookLeftMoved,
                            whiteRookRightMoved,
                            blackRookLeftMoved,
                            blackRookRightMoved
                        });
                    }
                }

                if (canMove) {
                    targetSquare.classList.add(targetImg ? 'highlight-attack' : 'highlight');

                }
            });

        } else {

            clearHighlights();

            const fromSquare = selectedPiece.parentElement;
            const fromRow = parseInt(fromSquare.dataset.row);
            const fromCol = parseInt(fromSquare.dataset.col);

            const pieceName = selectedPiece.src.split('/').pop().replace('.svg', '');
            const [type, color] = pieceName.split('_');

            const targetPiece = square.querySelector('img');
            let targetColor = null;
            if (targetPiece) {
                const targetPieceName = targetPiece.src.split('/').pop().replace('.svg', '');
                targetColor = targetPieceName.split('_')[1];
            }

            let canMove = false;

            if (type === 'pawn') {
                const isEnemy = targetColor && targetColor !== color;
                canMove = isPawnMoveLegal(fromRow, fromCol, row, col, color, isEnemy);
            } else if (type === 'rook') {
                canMove = isRookMoveLegal(fromRow, fromCol, row, col);
            } else if (type === 'knight') {
                canMove = isKnightMoveLegal(fromRow, fromCol, row, col);
            } else if (type === 'bishop') {
                canMove = isBishopMoveLegal(fromRow, fromCol, row, col);
            } else if (type === 'queen') {
                canMove = isQueenMoveLegal(fromRow, fromCol, row, col);
            } else if (type === 'king') {
                canMove = isKingMoveLegal(fromRow, fromCol, row, col);
            }

            if (canMove) {
                if (targetColor === currentTurn) {
                    if (selectedSquare) selectedSquare.classList.remove('selected');
                    selectedPiece = null;
                    selectedSquare = null;
                    return;
                }

                if (type === 'king' && Math.abs(col - fromCol) === 2) {
                    const can = canCastle(fromRow, fromCol, col, color, boardElement, {
                        whiteKingMoved,
                        blackKingMoved,
                        whiteRookLeftMoved,
                        whiteRookRightMoved,
                        blackRookLeftMoved,
                        blackRookRightMoved
                    });

                    if (!can) return;

                    const rookCol = col > fromCol ? 7 : 0;
                    const rookToCol = col > fromCol ? 5 : 3;

                    const rookSquare = boardElement.querySelector(`.square[data-row="${row}"][data-col="${rookCol}"]`);
                    const rook = rookSquare.querySelector('img');
                    const rookToSquare = boardElement.querySelector(`.square[data-row="${row}"][data-col="${rookToCol}"]`);
                    if (rook) rookToSquare.appendChild(rook);
                }

                if (targetPiece && targetColor !== currentTurn) {
                    const capturedName = targetPiece.src.split('/').pop();
                    const img = document.createElement('img');
                    img.src = `pieces/${capturedName}`;

                    const container = targetColor === 'white'
                        ? document.getElementById('capturedWhite')
                        : document.getElementById('capturedBlack');

                    container.appendChild(img);

                    // Usuń z planszy
                    targetPiece.remove();
                }



                square.appendChild(selectedPiece);

                if (type === 'pawn') {
                    const promotionRow = color === 'white' ? 0 : 7;
                    if (row === promotionRow) {
                        showPromotionOptions(square, color);
                    }
                }

                if (type === 'king') {
                    if (color === 'white') whiteKingMoved = true;
                    else blackKingMoved = true;
                }

                if (type === 'rook') {
                    if (color === 'white') {
                        if (fromCol === 0 && fromRow === 7) whiteRookLeftMoved = true;
                        if (fromCol === 7 && fromRow === 7) whiteRookRightMoved = true;
                    } else {
                        if (fromCol === 0 && fromRow === 0) blackRookLeftMoved = true;
                        if (fromCol === 7 && fromRow === 0) blackRookRightMoved = true;
                    }
                }
                addMove(fromRow, fromCol, row, col);
                currentTurn = currentTurn === 'white' ? 'black' : 'white';
                checkGameState(currentTurn);
                startClock(() => currentTurn);
            }

            if (selectedSquare) selectedSquare.classList.remove('selected');
            selectedPiece = null;
            selectedSquare = null;
        }
    });
}

startClock(() => currentTurn);

function clearHighlights() {
    const highlighted = document.querySelectorAll('.highlight, .highlight-attack');
    highlighted.forEach(square => square.classList.remove('highlight', 'highlight-attack'));
}

function showPromotionOptions(square, color) {
    const overlay = document.createElement('div');
    overlay.classList.add('promotion-overlay');

    ['queen', 'rook', 'bishop', 'knight'].forEach(pieceType => {
        const img = document.createElement('img');
        img.src = `pieces/${pieceType}_${color}.svg`;
        img.classList.add('promotion-choice');
        img.addEventListener('click', () => {
            square.innerHTML = '';
            const newPiece = document.createElement('img');
            newPiece.src = `pieces/${pieceType}_${color}.svg`;
            newPiece.classList.add('piece');
            square.appendChild(newPiece);
            document.body.removeChild(overlay);

            currentTurn = color === 'white' ? 'black' : 'white';
            checkGameState(currentTurn);
        });
        overlay.appendChild(img);
    });

    document.body.appendChild(overlay);
}




