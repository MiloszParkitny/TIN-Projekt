let moves = [];

export function addMove(fromRow, fromCol, toRow, toCol) {
    const move = `${toChess(fromRow, fromCol)} → ${toChess(toRow, toCol)}`;
    moves.push(move);
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;

    list.innerHTML = '';

    moves.forEach((move, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${move}`;
        list.appendChild(li);
    });
}

function toChess(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return files[col] + (8 - row);
}

