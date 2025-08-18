// Fungsi untuk toggle play/pause
function togglePlayPause() {
    const player = document.getElementById('stream-player');
    const btn = document.querySelector('.play-pause i');
    
    if (btn.classList.contains('fa-pause')) {
        // Pause stream
        btn.classList.remove('fa-pause');
        btn.classList.add('fa-play');
        player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    } else {
        // Play stream
        btn.classList.remove('fa-play');
        btn.classList.add('fa-pause');
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
}

// Fungsi untuk toggle mute/unmute
function toggleMute() {
    const volumeBtn = document.querySelector('.volume-btn i');
    const volumeSlider = document.querySelector('.volume-slider');
    
    if (volumeBtn.classList.contains('fa-volume-up')) {
        // Mute
        volumeBtn.classList.remove('fa-volume-up');
        volumeBtn.classList.add('fa-volume-mute');
        volumeSlider.value = 0;
    } else {
        // Unmute
        volumeBtn.classList.remove('fa-volume-mute');
        volumeBtn.classList.add('fa-volume-up');
        volumeSlider.value = 80;
    }
}

// Fungsi untuk toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Fungsi untuk update viewer count secara acak (simulasi)
function updateViewerCount() {
    const viewersEl = document.querySelector('.viewers');
    const currentCount = parseInt(viewersEl.textContent.replace(/\D/g, ''));
    const newCount = currentCount + Math.floor(Math.random() * 10) - 3;
    viewersEl.textContent = `\uD83D\uDC41 ${Math.max(1000, newCount).toLocaleString()} Penonton`;
}

// Event listeners
document.querySelector('.play-pause').addEventListener('click', togglePlayPause);
document.querySelector('.volume-btn').addEventListener('click', toggleMute);
document.querySelector('.fullscreen').addEventListener('click', toggleFullscreen);
document.querySelector('.btn-fullscreen').addEventListener('click', toggleFullscreen);

// Volume slider
document.querySelector('.volume-slider').addEventListener('input', function() {
    const volumeBtn = document.querySelector('.volume-btn i');
    if (this.value == 0) {
        volumeBtn.classList.remove('fa-volume-up');
        volumeBtn.classList.add('fa-volume-mute');
    } else {
        volumeBtn.classList.remove('fa-volume-mute');
        volumeBtn.classList.add('fa-volume-up');
    }
});

// Theater mode
document.querySelector('.theater-mode').addEventListener('click', function() {
    document.querySelector('.video-container').classList.toggle('theater-mode');
});

// Refresh chat
document.querySelector('.refresh-chat').addEventListener('click', function() {
    this.classList.add('refreshing');
    setTimeout(() => {
        this.classList.remove('refreshing');
        // Simulasi chat baru
        const chatMessages = document.querySelector('.chat-messages');
        const newMessage = document.createElement('div');
        newMessage.className = 'message';
        newMessage.innerHTML = `
            <div class="user-avatar">
                <img src="./assets/images/avatars/user${Math.floor(Math.random() * 5) + 1}.jpg" alt="User">
            </div>
            <div class="message-content">
                <div class="user-name">Fan_${Math.floor(Math.random() * 1000)}</div>
                <div class="message-text">Pertunjukan hari ini keren banget!</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
});

// Toggle chat
document.querySelector('.toggle-chat').addEventListener('click', function() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.classList.toggle('collapsed');
    this.querySelector('i').classList.toggle('fa-chevron-down');
    this.querySelector('i').classList.toggle('fa-chevron-up');
});

// Kirim pesan chat
document.querySelector('.send-btn').addEventListener('click', sendMessage);
document.querySelector('.chat-input input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.querySelector('.chat-messages');
        const newMessage = document.createElement('div');
        newMessage.className = 'message';
        newMessage.innerHTML = `
            <div class="user-avatar">
                <img src="./assets/images/avatars/you.jpg" alt="You">
            </div>
            <div class="message-content">
                <div class="user-name">Anda</div>
                <div class="message-text">${message}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
        chatMessages.appendChild(newMessage);
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Set reminder
document.querySelector('.reminder-btn').addEventListener('click', function() {
    const nextTitle = document.querySelector('.next-title').textContent;
    const nextTime = document.querySelector('.next-time').textContent;
    
    if (this.classList.contains('active')) {
        this.innerHTML = '<i class="fas fa-bell"></i> Reminder';
        this.classList.remove('active');
        alert(`Reminder untuk "${nextTitle}" dibatalkan`);
    } else {
        this.innerHTML = '<i class="fas fa-bell-slash"></i> Batal Reminder';
        this.classList.add('active');
        alert(`Reminder untuk "${nextTitle}" pada ${nextTime} diaktifkan`);
    }
});

// Update viewer count setiap 10 detik
setInterval(updateViewerCount, 10000);

// Scroll chat ke bawah saat load
window.addEventListener('load', function() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
