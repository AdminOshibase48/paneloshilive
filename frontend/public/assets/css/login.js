document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;
        
        // Simpan data login jika remember me dicentang
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Validasi sederhana
        if (!email || !password) {
            showAlert('error', 'Harap isi semua field');
            return;
        }
        
        // Simulasi login (dalam implementasi real, ini akan diganti dengan AJAX/Fetch)
        simulateLogin(email, password);
    });
    
    // Isi email jika ada di localStorage
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.querySelector('input[name="remember"]').checked = true;
    }
    
    // Fungsi untuk menampilkan alert
    function showAlert(type, message) {
        // Hapus alert sebelumnya jika ada
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        loginForm.insertBefore(alertDiv, loginForm.firstChild);
        
        // Hilangkan alert setelah 3 detik
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
    
    // Fungsi simulasi login
    function simulateLogin(email, password) {
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        
        // Tampilkan loading
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        loginBtn.disabled = true;
        
        // Simulasi delay request
        setTimeout(() => {
            // Ini contoh sederhana, di implementasi real Anda akan melakukan request ke server
            if (email === 'admin@oshilive48.com' && password === 'password123') {
                // Simpan token/session (dalam implementasi real)
                sessionStorage.setItem('isLoggedIn', 'true');
                
                // Redirect ke halaman streaming
                window.location.href = 'streaming.html';
            } else {
                showAlert('error', 'Email atau password salah');
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            }
        }, 1500);
    }
    
    // Social login buttons
    document.querySelector('.social-btn.google').addEventListener('click', function() {
        alert('Login dengan Google akan diimplementasikan');
    });
    
    document.querySelector('.social-btn.facebook').addEventListener('click', function() {
        alert('Login dengan Facebook akan diimplementasikan');
    });
});
