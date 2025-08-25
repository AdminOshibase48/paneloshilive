document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah user sudah login
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Jika belum login, redirect ke halaman login
        window.location.href = 'index.html';
        return;
    }
    
    // Set username di dashboard
    if (username) {
        document.getElementById('user-name').textContent = username;
    }
    
    // Elements
    const logoutBtn = document.getElementById('logout-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    const addMemberBtn = document.getElementById('add-member-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const scheduleForm = document.getElementById('schedule-form');
    const membershipForm = document.getElementById('membership-form');
    const scheduleTable = document.getElementById('schedule-table');
    const membershipTable = document.getElementById('membership-table');
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            // Hapus status login
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            
            // Redirect ke halaman login
            window.location.href = 'index.html';
        }
    });
    
    // Menu navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked menu item and corresponding section
            this.classList.add('active');
            const target = this.getAttribute('data-target');
            document.getElementById(`${target}-section`).classList.add('active');
        });
    });
    
    // Open modal for adding schedule
    addScheduleBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Tambah Jadwal Baru';
        modalBackdrop.style.display = 'flex';
        scheduleForm.classList.add('active');
        membershipForm.classList.remove('active');
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('event-date').value = today;
    });
    
    // Open modal for adding member
    addMemberBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Tambah Member Baru';
        modalBackdrop.style.display = 'flex';
        membershipForm.classList.add('active');
        scheduleForm.classList.remove('active');
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('join-date').value = today;
    });
    
    // Close modal
    function closeModal() {
        modalBackdrop.style.display = 'none';
        scheduleForm.reset();
        membershipForm.reset();
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtns.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Close modal when clicking outside
    modalBackdrop.addEventListener('click', function(e) {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });
    
    // Handle schedule form submission
    scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('event-date').value;
        const name = document.getElementById('event-name').value;
        const location = document.getElementById('event-location').value;
        
        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        
        // Add new row to table
        const tbody = scheduleTable.querySelector('tbody');
        const rowCount = tbody.children.length + 1;
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>${formattedDate}</td>
            <td>${name}</td>
            <td>${location}</td>
            <td>
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(newRow);
        addRowListeners(newRow, scheduleTable);
        closeModal();
        
        alert('Jadwal berhasil ditambahkan!');
    });
    
    // Handle membership form submission
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('member-name').value;
        const username = document.getElementById('member-username').value;
        const status = document.getElementById('member-status').value;
        const joinDate = document.getElementById('join-date').value;
        
        // Format date for display
        const formattedDate = new Date(joinDate).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        
        // Add new row to table
        const tbody = membershipTable.querySelector('tbody');
        const rowCount = tbody.children.length + 1;
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>${name}</td>
            <td>${username}</td>
            <td><span class="status ${status}">${status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span></td>
            <td>${formattedDate}</td>
            <td>
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(newRow);
        addRowListeners(newRow, membershipTable);
        closeModal();
        
        alert('Member berhasil ditambahkan!');
    });
    
    // Add event listeners to table rows for edit/delete
    function addRowListeners(row, table) {
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            alert('Fitur edit akan segera tersedia!');
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                row.remove();
                
                // Update row numbers
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach((row, index) => {
                    row.cells[0].textContent = index + 1;
                });
                
                alert('Data berhasil dihapus!');
            }
        });
    }
    
    // Initialize row listeners for existing table rows
    function initializeTableListeners() {
        const scheduleRows = scheduleTable.querySelectorAll('tbody tr');
        const memberRows = membershipTable.querySelectorAll('tbody tr');
        
        scheduleRows.forEach(row => addRowListeners(row, scheduleTable));
        memberRows.forEach(row => addRowListeners(row, membershipTable));
    }
    
    initializeTableListeners();
    
    // Add keyboard event listener for Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalBackdrop.style.display === 'flex') {
            closeModal();
        }
    });
});
