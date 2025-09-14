// Toggle mobile menu
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}));

// Fade in elements on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
            element.style.opacity = '1';
        }
    });
};

// Initial check on page load
window.addEventListener('load', fadeInOnScroll);
// Check on scroll
window.addEventListener('scroll', fadeInOnScroll);

// Simulasi data dari admin (dalam implementasi nyata, ini akan berasal dari backend)
const membershipData = [
    {
        title: "Basic",
        price: "Rp 50.000",
        period: "/bulan",
        image: "https://via.placeholder.com/300x200/ff6699/ffffff?text=Basic",
        features: [
            "Streaming kualitas standar",
            "Akses ke archive 30 hari terakhir",
            "1 device aktif"
        ]
    },
    {
        title: "Premium",
        price: "Rp 100.000",
        period: "/bulan",
        image: "https://via.placeholder.com/300x200/6633ff/ffffff?text=Premium",
        features: [
            "Streaming kualitas HD",
            "Akses ke seluruh archive",
            "3 device aktif",
            "Early booking ticket"
        ]
    },
    {
        title: "VIP",
        price: "Rp 200.000",
        period: "/bulan",
        image: "https://via.placeholder.com/300x200/33cc33/ffffff?text=VIP",
        features: [
            "Streaming kualitas 4K",
            "Akses ke seluruh archive + behind the scenes",
            "5 device aktif",
            "Priority booking ticket",
            "Exclusive merchandise discount"
        ]
    }
];

// Fungsi untuk memperbarui tampilan membership dari data admin
function updateMembershipDisplay() {
    const membershipContainer = document.getElementById('membership-container');
    membershipContainer.innerHTML = '';
    
    membershipData.forEach((plan, index) => {
        const featuresList = plan.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
        
        const membershipCard = `
            <div class="membership-card fade-in delay-${index}">
                <div class="membership-image">
                    <img src="${plan.image}" alt="Membership ${plan.title}">
                </div>
                <div class="membership-details">
                    <h3>${plan.title}</h3>
                    <p class="price">${plan.price}<span>${plan.period}</span></p>
                    <ul>${featuresList}</ul>
                    <a href="#" class="btn btn-membership">Pilih Paket</a>
                </div>
            </div>
        `;
        
        membershipContainer.innerHTML += membershipCard;
    });
    
    // Trigger fade-in animation after updating
    setTimeout(fadeInOnScroll, 100);
}

// Panggil fungsi untuk pertama kali
updateMembershipDisplay();

// Simulasi: dalam implementasi nyata, ini akan dipanggil ketika admin mengupdate data
// setInterval(updateMembershipDisplay, 5000); // Contoh: update setiap 5 detik
