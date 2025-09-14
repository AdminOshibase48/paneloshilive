// Fungsi untuk update status event berdasarkan waktu
function updateEventStatuses() {
    const now = new Date();
    const today = now.getDay(); // 0 = Minggu, 1 = Senin, dst
    
    document.querySelectorAll('.event-card').forEach(card => {
        const dayCol = card.closest('.day-col');
        const dayIndex = Array.from(dayCol.parentElement.children).indexOf(dayCol) - 1; // -1 karena kolom pertama waktu
        
        const timeStr = card.closest('.schedule-row').querySelector('.time-col').textContent;
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        // Buat tanggal event (hari dalam minggu ini + waktu)
        const eventDate = new Date();
        const dayDiff = dayIndex - today;
        eventDate.setDate(now.getDate() + dayDiff);
        eventDate.setHours(hours, minutes, 0, 0);
        
        // Hitung perbedaan waktu dalam menit
        const timeDiff = (now - eventDate) / (1000 * 60);
        
        const statusEl = card.querySelector('.event-status');
        
        if (timeDiff >= 0 && timeDiff < 120) { // Sedang berlangsung (2 jam)
            statusEl.textContent = 'LIVE NOW';
            statusEl.className = 'event-status live';
            card.style.boxShadow = '0 0 0 2px #e74c3c';
        } else if (timeDiff < 0) { // Akan datang
            statusEl.textContent = 'UPCOMING';
            statusEl.className = 'event-status upcoming';
            card.style.boxShadow = 'none';
        } else { // Sudah selesai
            statusEl.textContent = 'ENDED';
            statusEl.className = 'event-status ended';
            card.style.boxShadow = 'none';
        }
    });
}

// Navigasi mingguan
let currentWeekOffset = 0; // 0 = minggu ini, -1 = minggu lalu, 1 = minggu depan

function updateWeekDisplay() {
    const now = new Date();
    const startDate = new Date(now);
    
    // Hitung Senin minggu ini
    startDate.setDate(now.getDate() - now.getDay() + 1 + (currentWeekOffset * 7));
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    // Format tanggal untuk display
    const options = { day: 'numeric', month: 'long' };
    const startDateStr = startDate.toLocaleDateString('id-ID', options);
    const endDateStr = endDate.toLocaleDateString('id-ID', options);
    
    // Update tampilan
    document.querySelector('.week-range').textContent = `${startDate.getDate()} - ${endDateStr}`;
    document.querySelector('.week-dates').textContent = `(${startDate.toLocaleDateString('id-ID', { weekday: 'long' })} - ${endDate.toLocaleDateString('id-ID', { weekday: 'long' })})`;
    
    // Update tanggal di header kolom
    document.querySelectorAll('.day-col').forEach((col, index) => {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + index);
        
        const dayName = dayDate.toLocaleDateString('id-ID', { weekday: 'short' });
        const dayNum = dayDate.getDate();
        const month = dayDate.toLocaleDateString('id-ID', { month: 'short' });
        
        col.innerHTML = `${dayName}<br>${dayNum} ${month}`;
    });
    
    // Update status event
    updateEventStatuses();
}

// Event listeners
document.querySelector('.prev-week').addEventListener('click', function() {
    currentWeekOffset--;
    updateWeekDisplay();
});

document.querySelector('.next-week').addEventListener('click', function() {
    currentWeekOffset++;
    updateWeekDisplay();
});

document.querySelector('.btn-refresh').addEventListener('click', function() {
    this.classList.add('refreshing');
    setTimeout(() => {
        this.classList.remove('refreshing');
        updateEventStatuses();
    }, 500);
});

// Filter
document.getElementById('team-filter').addEventListener('change', function() {
    const team = this.value;
    
    document.querySelectorAll('.event-card').forEach(card => {
        const cardTeam = card.querySelector('.event-team').textContent.toLowerCase();
        
        if (team === 'all' || cardTeam.includes(team)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

document.getElementById('type-filter').addEventListener('change', function() {
    const type = this.value;
    
    document.querySelectorAll('.event-card').forEach(card => {
        const cardType = card.classList.contains(type) ? type : 
                        card.querySelector('.event-title').textContent.toLowerCase().includes('show') ? 'live' : 
                        'theater';
        
        if (type === 'all' || cardType === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Inisialisasi
updateWeekDisplay();

// Update status setiap menit
setInterval(updateEventStatuses, 60000);

// Klik event card
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.event-title').textContent;
        const team = this.querySelector('.event-team').textContent;
        const time = this.closest('.schedule-row').querySelector('.time-col').textContent;
        const day = this.closest('.day-col').textContent.replace('\n', ' ');
        
        alert(`Detail Event:\n\nJudul: ${title}\nTeam: ${team}\nHari: ${day}\nWaktu: ${time}`);
    });
});
