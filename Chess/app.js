import { createChessboard } from './js/board.js';
import { setupGame } from './js/game.js';

const boardElement = document.getElementById('chessboard');

createChessboard(boardElement);
setupGame(boardElement);

document.getElementById('restartBtn').addEventListener('click', () => {
    if (!confirm("Czy na pewno chcesz rozpocząć nową grę?")) return;

    location.reload();
});
