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
    
    // Data contoh
    let schedules = [
        { id: 1, date: '2023-08-15', name: 'Live Performance', location: 'Studio 1' },
        { id: 2, date: '2023-08-20', name: 'Meet & Greet', location: 'Hall A' }
    ];
    
    let members = [
        { id: 1, name: 'Sakura Miyawaki', username: 'sakura48', status: 'active', joinDate: '2023-01-12' },
        { id: 2, name: 'Yuki Yamada', username: 'yuki48', status: 'inactive', joinDate: '2023-03-03' }
    ];
    
    // Inisialisasi data
    function initializeData() {
        // Load schedules
        renderSchedules();
        
        // Load members
        renderMembers();
        
        // Update statistik
        updateStats();
    }
    
    // Render schedules ke tabel
    function renderSchedules() {
        const tbody = scheduleTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        schedules.forEach((schedule, index) => {
            const formattedDate = new Date(schedule.date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td>${schedule.name}</td>
                <td>${schedule.location}</td>
                <td>
                    <button class="edit-btn" data-id="${schedule.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${schedule.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners
        addTableListeners(scheduleTable, schedules, 'schedule');
    }
    
    // Render members ke tabel
    function renderMembers() {
        const tbody = membershipTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        members.forEach((member, index) => {
            const formattedDate = new Date(member.joinDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.username}</td>
                <td><span class="status ${member.status}">${member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span></td>
                <td>${formattedDate}</td>
                <td>
                    <button class="edit-btn" data-id="${member.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${member.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners
        addTableListeners(membershipTable, members, 'member');
    }
    
    // Update statistik dashboard
    function updateStats() {
        document.getElementById('total-schedules').textContent = schedules.length;
        document.getElementById('total-members').textContent = members.length;
    }
    
    // Add event listeners to table rows
    function addTableListeners(table, data, type) {
        const editBtns = table.querySelectorAll('.edit-btn');
        const deleteBtns = table.querySelectorAll('.delete-btn');
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const item = data.find(item => item.id === id);
                
                if (item) {
                    if (type === 'schedule') {
                        openEditSchedule(item);
                    } else {
                        openEditMember(item);
                    }
                }
            });
        });
        
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                
                if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                    if (type === 'schedule') {
                        schedules = schedules.filter(item => item.id !== id);
                        renderSchedules();
                    } else {
                        members = members.filter(item => item.id !== id);
                        renderMembers();
                    }
                    
                    updateStats();
                    alert('Data berhasil dihapus!');
                }
            });
        });
    }
    
    // Open modal untuk edit schedule
    function openEditSchedule(schedule) {
        document.getElementById('modal-title').textContent = 'Edit Jadwal';
        modalBackdrop.style.display = 'flex';
        scheduleForm.classList.add('active');
        membershipForm.classList.remove('active');
        
        // Isi form dengan data yang ada
        document.getElementById('schedule-id').value = schedule.id;
        document.getElementById('event-date').value = schedule.date;
        document.getElementById('event-name').value = schedule.name;
        document.getElementById('event-location').value = schedule.location;
    }
    
    // Open modal untuk edit member
    function openEditMember(member) {
        document.getElementById('modal-title').textContent = 'Edit Member';
        modalBackdrop.style.display = 'flex';
        membershipForm.classList.add('active');
        scheduleForm.classList.remove('active');
        
        // Isi form dengan data yang ada
        document.getElementById('member-id').value = member.id;
        document.getElementById('member-name').value = member.name;
        document.getElementById('member-username').value = member.username;
        document.getElementById('member-status').value = member.status;
        document.getElementById('join-date').value = member.joinDate;
    }
    
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
        
        // Reset form
        document.getElementById('schedule-id').value = '';
        document.getElementById('event-date').value = '';
        document.getElementById('event-name').value = '';
        document.getElementById('event-location').value = '';
        
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
        
        // Reset form
        document.getElementById('member-id').value = '';
        document.getElementById('member-name').value = '';
        document.getElementById('member-username').value = '';
        document.getElementById('member-status').value = 'active';
        document.getElementById('join-date').value = '';
        
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
        const id = document.getElementById('schedule-id').value;
        const date = document.getElementById('event-date').value;
        const name = document.getElementById('event-name').value;
        const location = document.getElementById('event-location').value;
        
        if (id) {
            // Edit existing schedule
            const index = schedules.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                schedules[index] = { id: parseInt(id), date, name, location };
            }
        } else {
            // Add new schedule
            const newId = schedules.length > 0 ? Math.max(...schedules.map(item => item.id)) + 1 : 1;
            schedules.push({ id: newId, date, name, location });
        }
        
        renderSchedules();
        updateStats();
        closeModal();
        
        alert(`Jadwal berhasil ${id ? 'diperbarui' : 'ditambahkan'}!`);
    });
    
    // Handle membership form submission
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('member-id').value;
        const name = document.getElementById('member-name').value;
        const username = document.getElementById('member-username').value;
        const status = document.getElementById('member-status').value;
        const joinDate = document.getElementById('join-date').value;
        
        if (id) {
            // Edit existing member
            const index = members.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                members[index] = { id: parseInt(id), name, username, status, joinDate };
            }
        } else {
            // Add new member
            const newId = members.length > 0 ? Math.max(...members.map(item => item.id)) + 1 : 1;
            members.push({ id: newId, name, username, status, joinDate });
        }
        
        renderMembers();
        updateStats();
        closeModal();
        
        alert(`Member berhasil ${id ? 'diperbarui' : 'ditambahkan'}!`);
    });
    
    // Add keyboard event listener for Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalBackdrop.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Initialize data
    initializeData();
});
