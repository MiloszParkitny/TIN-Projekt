const toggleBtn = document.getElementById('themeToggle');
const themeLink = document.getElementById('themeStylesheet');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
    const newTheme = themeLink.getAttribute('href').includes('dark') ? 'light' : 'dark';
    setTheme(newTheme);
});

function setTheme(theme) {
    themeLink.setAttribute('href', `css/style-${theme}.css`);
    themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', theme);

    //Learn.html zmiana kolorow figur
    const pieces = document.querySelectorAll('.piece-icon');
    pieces.forEach(img => {
        const newSrc = img.dataset[theme];
        if (newSrc) img.src = newSrc;
    });

}

