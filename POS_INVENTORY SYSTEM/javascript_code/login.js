// Role selection
document.getElementById('employeeBtn').addEventListener('click', function() {
    document.getElementById('employeeForm').classList.remove('hidden');
    document.getElementById('adminForm').classList.add('hidden');
});
document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminForm').classList.remove('hidden');
    document.getElementById('employeeForm').classList.add('hidden');
});

// Theme switching
const themes = {
    blue: {
        '--primary': '#3498DB',
        '--accent': '#2C3E50',
        '--admin': '#E67E22',
        '--background': 'rgba(12, 160, 233, 1)',
        '--text': '#2C3E50'
    },
    teal: {
        '--primary': '#1ABC9C',
        '--accent': '#34495E',
        '--admin': '#D35400',
        '--background': 'rgba(108, 57, 186, 0.68)',
        '--text': '#2C3E50'
    },
    orange: {
        '--primary': '#0a0711ff',
        '--accent': 'rgba(8, 240, 120, 1)',
        '--admin': '#C0392B',
        '--background': 'hsla(42, 80%, 53%, 1.00)',
        '--text': '#2C3E50'
    },
    White: {
        '--primary': '#E67E22',
        '--accent': '#2C3E50',
        '--admin': '#C0392B',
        '--background': 'rgba(241, 248, 248, 1)',
        '--text': '#2C3E50'
    }
};

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedTheme = themes[btn.dataset.theme];
        for (let key in selectedTheme) {
            document.documentElement.style.setProperty(key, selectedTheme[key]);
        }
    });
});
