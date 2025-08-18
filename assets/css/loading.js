document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingVideo = document.getElementById('loadingVideo');
    const mainContent = document.getElementById('mainContent');

    // 1. Cek apakah video didukung
    if (loadingVideo.canPlayType) {
        // 2. Atur video untuk loop (jika perlu)
        loadingVideo.loop = false;
        
        // 3. Saat video siap diputar
        loadingVideo.oncanplay = function() {
            // Mulai pemutaran
            loadingVideo.play().catch(e => {
                console.log("Autoplay blocked:", e);
                handleLoadingComplete();
            });
        };
        
        // 4. Saat video selesai
        loadingVideo.onended = handleLoadingComplete;
        
        // 5. Jika video error
        loadingVideo.onerror = handleLoadingComplete;
        
        // 6. Timeout fallback (5 detik)
        setTimeout(handleLoadingComplete, 5000);
    } else {
        // Browser tidak support video
        handleLoadingComplete();
    }

    function handleLoadingComplete() {
        // Animasi fade out
        loadingScreen.style.transition = "opacity 0.5s ease";
        loadingScreen.style.opacity = 0;
        
        // Sembunyikan setelah animasi selesai
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
    }
});
