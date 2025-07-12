// Custom cursor movement
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Menu toggle
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Click outside menu to close
document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('navMenu');
    const menuIcon = document.querySelector('.menu-icon');

    if (navMenu && !navMenu.contains(e.target) && menuIcon && !menuIcon.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Hover effects for interactive elements
document.querySelectorAll('.nav-dot, .social-link, .nav-arrow, .scroll-arrow').forEach(element => {
    element.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.transform = 'scale(1.5)';
        }
    });

    element.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.transform = 'scale(1)';
        }
    });
});

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    document.querySelectorAll('.floating-sphere, .floating-sphere-2, .floating-sphere-3').forEach((sphere, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;

        sphere.style.transform += ` translate(${x}px, ${y}px)`;
    });
});

// Smooth scroll
const scrollArrow = document.querySelector('.scroll-arrow');
if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// Random matrix characters
function updateMatrixChars() {
    const chars = document.querySelectorAll('.matrix-char');
    const matrixChars = ['0', '1', '01', '10', '11', '00', '101', '010', '110', '001'];

    chars.forEach(char => {
        char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    });
}

setInterval(updateMatrixChars, 2000);

// Performance optimization
const handleResize = () => {
    // Optimize for mobile
    const particles = document.querySelectorAll('.particle');
    if (window.innerWidth < 768) {
        particles.forEach(particle => {
            particle.style.display = 'none';
        });
    } else {
        particles.forEach(particle => {
            particle.style.display = 'block';
        });
    }
};

window.addEventListener('resize', handleResize);
handleResize(); // Initial call

// Intersection Observer for performance
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        } else {
            entry.target.style.animationPlayState = 'paused';
        }
    });
}, { threshold: 0.1 });

// Observe animated elements
document.querySelectorAll('.particle, .floating-sphere, .abstract-shape').forEach(el => {
    observer.observe(el);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const navMenu = document.getElementById('navMenu');
    switch (e.key) {
        case 'Escape':
            if (navMenu) navMenu.classList.remove('active');
            break;
        case 'ArrowDown':
            window.scrollBy(0, 100);
            break;
        case 'ArrowUp':
            window.scrollBy(0, -100);
            break;
    }
});

// Dynamic color theme
const colors = [
    { primary: '#ff6b35', secondary: '#7b68ee', accent: '#00ffff' },
    { primary: '#ff1744', secondary: '#3f51b5', accent: '#00e676' },
    { primary: '#ff9800', secondary: '#9c27b0', accent: '#00bcd4' },
    { primary: '#e91e63', secondary: '#673ab7', accent: '#4caf50' }
];

let currentColorIndex = 0;

function changeColorTheme() {
    const root = document.documentElement;
    const theme = colors[currentColorIndex];

    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);

    currentColorIndex = (currentColorIndex + 1) % colors.length;
}

// Change theme every 30 seconds
setInterval(changeColorTheme, 30000);

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 3000);
    }
});

// Audio context for visualizer (mock data)
function updateAudioVisualizer() {
    const bars = document.querySelectorAll('.audio-bar');
    bars.forEach(bar => {
        const height = Math.random() * 100 + 20;
        bar.style.height = height + '%';
    });
}

setInterval(updateAudioVisualizer, 200);

// Console easter egg
console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃                                                     ┃
┃    ╔═══════════════════════════════════════════╗    ┃
┃    ║          ZENTHERIUN STUDIO                ║    ┃
┃    ║      Creative Technology Studio           ║    ┃
┃    ║                                           ║    ┃
┃    ║    Welcome, fellow developer! 🚀          ║    ┃
┃    ║                                           ║    ┃
┃    ║    You found our secret console message   ║    ┃
┃    ║    Want to join our team?                 ║    ┃
┃    ║    Send us: @Zentheriun                   ║    ┃
┃    ╚═══════════════════════════════════════════╝    ┃
┃                                                     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`);