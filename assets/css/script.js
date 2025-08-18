// Loading Screen
window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
});

// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    this.querySelector('i').classList.toggle('fa-bars');
    this.querySelector('i').classList.toggle('fa-times');
    document.querySelector('.navbar').classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.navbar ul li a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.navbar').classList.remove('active');
        document.querySelector('.mobile-menu-btn i').classList.remove('fa-times');
        document.querySelector('.mobile-menu-btn i').classList.add('fa-bars');
    });
});

// Sticky Header on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (window.scrollY > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

// Smooth Scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Back to Top Button
document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Tab Functionality
const tabHeaders = document.querySelectorAll('.tab-header div');
const tabIndicator = document.querySelector('.tab-indicator');
const tabBodies = document.querySelectorAll('.tab-body > div');

function setTab(index) {
    // Update tab headers
    tabHeaders.forEach(header => header.classList.remove('active'));
    tabHeaders[index].classList.add('active');
    
    // Update tab indicator
    const activeTab = tabHeaders[index];
    tabIndicator.style.width = activeTab.offsetWidth + 'px';
    tabIndicator.style.left = activeTab.offsetLeft + 'px';
    
    // Update tab bodies
    tabBodies.forEach(body => body.classList.remove('active'));
    tabBodies[index].classList.add('active');
}

tabHeaders.forEach((header, index) => {
    header.addEventListener('click', () => setTab(index));
});

// Set initial tab
setTab(0);

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        faqItem.classList.toggle('active');
        
        // Close other open FAQs
        faqQuestions.forEach(q => {
            if (q !== this && q.parentElement.classList.contains('active')) {
                q.parentElement.classList.remove('active');
            }
        });
    });
});

// Initialize Swiper for Payment Methods
const paymentSwiper = new Swiper('.payment-slider', {
    slidesPerView: 3,
    spaceBetween: 20,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 15
        },
        576: {
            slidesPerView: 3,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 4,
            spaceBetween: 20
        },
        992: {
            slidesPerView: 5,
            spaceBetween: 20
        }
    }
});

// Initialize Swiper for Testimonials
const testimonialSwiper = new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 30
        }
    }
});

// Floating animation delay for elements
const floatingElements = document.querySelectorAll('.floating');
floatingElements.forEach(el => {
    el.style.animationDelay = Math.random() * 2 + 's';
});

// Set current year in footer
document.querySelector('.footer-bottom').innerHTML += ' &copy; ' + new Date().getFullYear();
