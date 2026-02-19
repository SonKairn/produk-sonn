// State admin
let isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

function handleLogin() {
    const u = document.getElementById('adminUsername').value;
    const p = document.getElementById('adminPassword').value;
    if (u === 'SONN' && p === 'KAIRN') {
        isAdmin = true;
        localStorage.setItem('adminLoggedIn', 'true');
        showNotif('Login berhasil');
        showPage('adminPage');
    } else {
        showNotif('Username/password salah', 'error');
    }
}

function handleLogout() {
    isAdmin = false;
    localStorage.removeItem('adminLoggedIn');
    showNotif('Logout berhasil');
    showPage('homePage');
}

document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
