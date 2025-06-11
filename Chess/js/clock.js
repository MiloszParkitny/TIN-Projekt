let initialMinutes = parseInt(localStorage.getItem('selectedTime')) || 5;
let whiteTime = initialMinutes * 60;
let blackTime = initialMinutes * 60;

let activeTimer = null;

export function startClock(currentTurnGetter) {
    updateDisplay();

    if (activeTimer) clearInterval(activeTimer);

    activeTimer = setInterval(() => {
        const currentTurn = currentTurnGetter();
        if (currentTurn === 'white') {
            whiteTime--;
            if (whiteTime <= 0) timeout('white');
        } else {
            blackTime--;
            if (blackTime <= 0) timeout('black');
        }
        updateDisplay();
    }, 1000);
}

export function resetClock() {
    clearInterval(activeTimer);
    whiteTime = 5 * 60;
    blackTime = 5 * 60;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('whiteTimer').textContent = formatTime(whiteTime);
    document.getElementById('blackTimer').textContent = formatTime(blackTime);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function timeout(color) {
    alert(`Czas ${color === 'white' ? 'białych' : 'czarnych'} minął!`);
    clearInterval(activeTimer);
}
