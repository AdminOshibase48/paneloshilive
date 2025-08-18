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

// Schedule Tab Functionality
const scheduleTabs = document.querySelectorAll('.schedule-tabs .tab');
const schedulePanes = document.querySelectorAll('.schedule-content .tab-pane');

scheduleTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        scheduleTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Hide all panes
        schedulePanes.forEach(pane => pane.classList.remove('active'));
        
        // Show corresponding pane
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Set initial tab
scheduleTabs[0].click();

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

// Set current year in footer
document.querySelector('.footer-bottom').innerHTML += ' &copy; ' + new Date().getFullYear();

// Schedule Navigation
const prevWeekBtn = document.querySelector('.prev-week');
const nextWeekBtn = document.querySelector('.next-week');
const currentWeekEl = document.querySelector('.current-week');

let currentDate = new Date();

function updateWeekDisplay() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    const startDate = startOfWeek.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).replace(' ', ' ');
    const endDate = endOfWeek.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).replace(' ', ' ');
    
    currentWeekEl.textContent = `Minggu ${startDate}-${endDate} ${currentDate.getFullYear()}`;
    
    // Update day dates in schedule
    document.querySelectorAll('.day-column').forEach((column, index) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + index);
        
        const dateEl = column.querySelector('.day-date');
        dateEl.textContent = dayDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).replace(' ', ' ');
    });
}

prevWeekBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() - 7);
    updateWeekDisplay();
});

nextWeekBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() + 7);
    updateWeekDisplay();
});

// Initialize
updateWeekDisplay();

// Update event statuses based on current time
function updateEventStatuses() {
    const now = new Date();
    
    document.querySelectorAll('.event-card').forEach(card => {
        const timeStr = card.querySelector('.event-time').textContent;
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        // Create date object for today with this event's time
        const eventDate = new Date();
        eventDate.setHours(hours, minutes, 0, 0);
        
        // Compare with current time
        const timeDiff = (now - eventDate) / (1000 * 60); // Difference in minutes
        
        const statusEl = card.querySelector('.event-status');
        
        if (timeDiff >= 0 && timeDiff < 120) { // Event is live (within 2 hours)
            statusEl.textContent = 'LIVE';
            statusEl.className = 'event-status live';
            card.style.borderLeft = '3px solid #e74c3c';
        } else if (timeDiff < 0) { // Event is upcoming
            statusEl.textContent = 'UPCOMING';
            statusEl.className = 'event-status upcoming';
            card.style.borderLeft = '3px solid #1976d2';
        } else { // Event has ended
            statusEl.textContent = 'ENDED';
            statusEl.className = 'event-status ended';
            card.style.borderLeft = '3px solid #777';
        }
    });
}

// Update statuses initially and every minute
updateEventStatuses();
setInterval(updateEventStatuses, 60000);

// Reminder Button Functionality
document.querySelectorAll('.btn-reminder').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const eventCard = this.closest('.event-card');
        const eventTitle = eventCard.querySelector('.event-title').textContent;
        const eventTime = eventCard.querySelector('.event-time').textContent;
        
        // Toggle reminder state
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            this.innerHTML = '<i class="fas fa-bell"></i>';
            alert(`Reminder untuk "${eventTitle}" pada ${eventTime} dibatalkan`);
        } else {
            this.classList.add('active');
            this.innerHTML = '<i class="fas fa-bell-slash"></i>';
            alert(`Reminder untuk "${eventTitle}" pada ${eventTime} diaktifkan`);
        }
    });
});
