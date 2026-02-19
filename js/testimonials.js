let testimonials = [];

function loadTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;
    
    container.innerHTML = '<div style="padding:40px; text-align:center;">Memuat testimoni...</div>';
    
    db.collection("testimonials").orderBy("createdAt", "desc").get()
        .then(snapshot => {
            testimonials = [];
            container.innerHTML = '';
            
            snapshot.forEach((doc, index) => {
                const t = { id: doc.id, ...doc.data() };
                testimonials.push(t);
                renderTestimonialCard(t, index);
            });
            
            document.getElementById('testimoniCount').textContent = testimonials.length;
            
            if (testimonials.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:40px;">Belum ada testimoni.</div>';
            }
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<div style="text-align:center; padding:40px;">Gagal memuat testimoni.</div>';
        });
}

function renderTestimonialCard(t, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `<img src="${t.imageUrl || 'https://via.placeholder.com/400x300'}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300'">`;
    
    card.onclick = () => {
        document.getElementById('fullSizeImage').src = t.imageUrl;
        document.getElementById('fullImageModal').classList.add('active');
    };
    
    document.getElementById('testimonialsContainer').appendChild(card);
}

function addNewTestimonial() {
    const url = document.getElementById('testimonialImageUrl').value.trim();
    if (!url || !isValidUrl(url)) {
        showNotif('URL tidak valid', 'error'); return;
    }
    
    const btn = document.getElementById('addTestimonialBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menambah...';
    
    db.collection("testimonials").add({
        imageUrl: url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        document.getElementById('testimonialImageUrl').value = '';
        document.getElementById('testimonialImagePreview').style.display = 'none';
        showNotif('Testimoni ditambahkan');
        loadTestimonials();
    })
    .catch(err => { console.error(err); showNotif('Gagal', 'error'); })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> Tambah Testimoni';
    });
}

function deleteTestimonial(id) {
    if (confirm('Hapus testimoni ini?')) {
        db.collection("testimonials").doc(id).delete()
            .then(() => { showNotif('Testimoni dihapus'); loadTestimonials(); })
            .catch(err => { console.error(err); showNotif('Gagal', 'error'); });
    }
}

document.getElementById('addTestimonialBtn')?.addEventListener('click', addNewTestimonial);