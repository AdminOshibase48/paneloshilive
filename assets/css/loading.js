document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingVideo = document.getElementById('loadingVideo');
    const mainContent = document.getElementById('mainContent');

    // 1. Fungsi untuk menyembunyikan loading
    const hideLoading = () => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Tampilkan konten utama
        mainContent.style.opacity = '1';
    };

    // 2. Cek support video
    if (loadingVideo.canPlayType) {
        // Force load video
        loadingVideo.load();
        
        // 3. Saat video bisa diputar
        loadingVideo.oncanplay = () => {
            loadingVideo.play().catch(e => {
                console.log("Autoplay blocked:", e);
                hideLoading();
            });
        };

        // 4. Saat video selesai
        loadingVideo.onended = hideLoading;

        // 5. Jika video error
        loadingVideo.onerror = hideLoading;
        
        // 6. Timeout fallback (5 detik maksimal)
        setTimeout(hideLoading, 5000);
    } else {
        // Browser tidak support video
        hideLoading();
    }
});
