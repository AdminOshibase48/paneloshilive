document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingVideo = document.getElementById('loadingVideo');
    const mainContent = document.getElementById('mainContent');
    
    // 1. Start loading the video
    loadingVideo.load();
    
    // 2. When video metadata is loaded
    loadingVideo.onloadedmetadata = function() {
        // Play the video
        loadingVideo.play();
        
        // Set minimum display time (3 seconds in this case)
        setTimeout(function() {
            // 3. When video ends, hide loading screen
            loadingVideo.onended = function() {
                loadingScreen.style.opacity = '0';
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                    mainContent.style.display = 'block';
                }, 500); // Fade-out duration
            };
            
            // If video doesn't end naturally (e.g., looped video), force transition after 3 seconds
            setTimeout(function() {
                if(loadingScreen.style.display !== 'none') {
                    loadingScreen.style.opacity = '0';
                    setTimeout(function() {
                        loadingScreen.style.display = 'none';
                        mainContent.style.display = 'block';
                    }, 500);
                }
            }, 3000);
        }, 500);
    };
    
    // Fallback if video fails to load
    loadingVideo.onerror = function() {
        loadingScreen.innerHTML = '<p class="loading-text">OSHI LIVE 48</p>';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 2000);
    };
});
