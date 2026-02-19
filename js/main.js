// Theme
const themeToggle = document.getElementById('themeToggle');
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    localStorage.setItem('theme', theme);
}
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
themeToggle.addEventListener('click', () => {
    setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
});

// Sidebar
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));

// Navigasi
const pages = document.querySelectorAll('.page');
const homeBtn = document.getElementById('homeBtn');
const productsBtn = document.getElementById('productsBtn');
const testimonialsBtn = document.getElementById('testimonialsBtn');
const feedbackBtn = document.getElementById('feedbackBtn');
const adminBtn = document.getElementById('adminBtn');
const viewAllBtn = document.getElementById('viewAllProductsBtn');

function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.menu-items button').forEach(b => b.classList.remove('active'));
    if (pageId === 'homePage') homeBtn.classList.add('active');
    else if (pageId === 'productsPage') productsBtn.classList.add('active');
    else if (pageId === 'testimonialsPage') testimonialsBtn.classList.add('active');
    else if (pageId === 'feedbackPage') feedbackBtn.classList.add('active');
    else if (pageId === 'adminPage' || pageId === 'loginPage') adminBtn.classList.add('active');

    if (window.innerWidth < 768) sidebar.classList.remove('active');

    if (pageId === 'productsPage') loadProducts();
    if (pageId === 'testimonialsPage') loadTestimonials();
    if (pageId === 'adminPage' && isAdmin) {
        loadProducts();
        loadTestimonials();
    }
}

homeBtn.addEventListener('click', () => showPage('homePage'));
productsBtn.addEventListener('click', () => showPage('productsPage'));
testimonialsBtn.addEventListener('click', () => showPage('testimonialsPage'));
feedbackBtn.addEventListener('click', () => showPage('feedbackPage'));
adminBtn.addEventListener('click', () => isAdmin ? showPage('adminPage') : showPage('loginPage'));
viewAllBtn.addEventListener('click', () => showPage('productsPage'));

// Notifikasi
const notification = document.getElementById('notification');
const notifMsg = document.getElementById('notificationMessage');

function showNotif(msg, type = 'success') {
    notifMsg.textContent = msg;
    notification.className = `notification ${type}`;
    notification.classList.add('active');
    setTimeout(() => notification.classList.remove('active'), 3000);
}

function isValidUrl(url) {
    try { new URL(url); return true; } catch { return false; }
}

// Zoom gambar
window.zoomQR = function(imageUrl) {
    document.getElementById('fullSizeImage').src = imageUrl;
    document.getElementById('fullImageModal').classList.add('active');
}

// Preview manual
document.getElementById('productImageUrl')?.addEventListener('input', function() {
    const url = this.value.trim();
    const preview = document.getElementById('productImagePreview');
    if (url && isValidUrl(url)) {
        preview.style.display = 'block';
        document.getElementById('productImagePreviewImg').src = url;
    } else {
        preview.style.display = 'none';
    }
});

document.getElementById('testimonialImageUrl')?.addEventListener('input', function() {
    const url = this.value.trim();
    const preview = document.getElementById('testimonialImagePreview');
    if (url && isValidUrl(url)) {
        preview.style.display = 'block';
        document.getElementById('testimonialImagePreviewImg').src = url;
    } else {
        preview.style.display = 'none';
    }
});

// Bantuan WhatsApp
document.getElementById('sendToWhatsAppBtn')?.addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const msg = document.getElementById('message').value.trim();
    if (!name || !msg) {
        showNotif('Isi nama dan pesan', 'error');
        return;
    }
    const text = `💬 *BANTUAN - Son Official*\n\n*Nama:* ${name}\n*Pesan:*\n${msg}`;
    window.open(`https://wa.me/6283159696918?text=${encodeURIComponent(text)}`, '_blank');
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    showNotif('Pesan dikirim');
});

// Modal close
document.getElementById('closeDetailModalBtn')?.addEventListener('click', () => {
    document.getElementById('productDetailModal').classList.remove('active');
});
document.getElementById('closeEditModalBtn')?.addEventListener('click', () => {
    document.getElementById('editProductModal').classList.remove('active');
});
document.getElementById('cancelEditBtn')?.addEventListener('click', () => {
    document.getElementById('editProductModal').classList.remove('active');
});
document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    document.getElementById('purchaseModal').classList.remove('active');
});
document.getElementById('closePaymentModalBtn')?.addEventListener('click', closePaymentModal);

// Carousel scroll
const carouselPrev = document.querySelector('.carousel-btn.prev');
const carouselNext = document.querySelector('.carousel-btn.next');
const productsCarousel = document.querySelector('.products-carousel');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const testimonialsCarousel = document.querySelector('.testimonials-carousel');

carouselPrev?.addEventListener('click', () => productsCarousel.scrollBy({ left: -280, behavior: 'smooth' }));
carouselNext?.addEventListener('click', () => productsCarousel.scrollBy({ left: 280, behavior: 'smooth' }));
testimonialPrev?.addEventListener('click', () => testimonialsCarousel.scrollBy({ left: -400, behavior: 'smooth' }));
testimonialNext?.addEventListener('click', () => testimonialsCarousel.scrollBy({ left: 400, behavior: 'smooth' }));

// Tutup modal klik luar
[productDetailModal, editProductModal, purchaseModal, paymentDetailModal, fullImageModal].forEach(modal => {
    modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
});

// Tutup sidebar klik luar
document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Init
if (isAdmin) adminBtn.classList.add('active');
showPage('homePage');
loadProducts();
loadTestimonials();