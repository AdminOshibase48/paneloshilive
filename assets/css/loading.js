document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  const mainContent = document.getElementById("mainContent");
  const loadingVideo = document.getElementById("loadingVideo");

  if (loadingVideo) {
    loadingVideo.onended = () => {
      loadingScreen.style.display = "none";
      mainContent.style.opacity = "1";
    };
  } else {
    // fallback kalau video gagal load
    loadingScreen.style.display = "none";
    mainContent.style.opacity = "1";
  }
});
