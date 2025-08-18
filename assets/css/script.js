// Inisialisasi AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false
});

// Efek Scroll Header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scrolling untuk semua link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animasi untuk member card
const memberCards = document.querySelectorAll('.member-card');
memberCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
    });
});

// Preloader (opsional)
window.addEventListener('load', function() {
    const preloader = document.createElement('div');
    preloader.style.position = 'fixed';
    preloader.style.top = '0';
    preloader.style.left = '0';
    preloader.style.width = '100%';
    preloader.style.height = '100%';
    preloader.style.backgroundColor = 'var(--primary-color)';
    preloader.style.display = 'flex';
    preloader.style.justifyContent = 'center';
    preloader.style.alignItems = 'center';
    preloader.style.zIndex = '9999';
    preloader.style.transition = 'opacity 0.5s ease';
    
    const spinner = document.createElement('div');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid var(--accent-color)';
    spinner.style.borderRadius = '50%';
    spinner.style.borderTopColor = 'transparent';
    spinner.style.animation = 'spin 1s linear infinite';
    
    preloader.appendChild(spinner);
    document.body.appendChild(preloader);
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1000);
    
    // Tambahkan keyframe untuk spinner
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
