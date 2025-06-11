document.getElementById('exportBtn').addEventListener('click', () => {
    const moves = [...document.querySelectorAll('#historyList li')].map(li => li.textContent.trim());

    const txt = `Historia ruchów:\n\n` + moves.join('\n');

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'partia.txt';
    a.click();

    URL.revokeObjectURL(url);
});
