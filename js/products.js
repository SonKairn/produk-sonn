let products = [];
let selectedProduct = null;
let editingId = null;

function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '<div style="padding:40px; text-align:center;">Memuat produk...</div>';
    db.collection("products").orderBy("createdAt", "desc").get()
        .then(snapshot => {
            products = [];
            container.innerHTML = '';
            document.getElementById('adminProductsList').innerHTML = '';
            
            snapshot.forEach(doc => {
                const p = { id: doc.id, ...doc.data() };
                products.push(p);
                renderProductCard(p);
                if (isAdmin) renderAdminProduct(p);
            });
            
            document.getElementById('productCount').textContent = products.filter(p => !p.soldOut).length;
            if (isAdmin) renderAdminRekomendasi();
            
            if (products.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:40px;">Belum ada produk.</div>';
            }
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<div style="text-align:center; padding:40px;">Gagal memuat produk.</div>';
        });
}

function renderProductCard(p) {
    const card = document.createElement('div');
    card.className = `product-card ${p.soldOut ? 'sold-out' : ''}`;
    card.innerHTML = `
        ${p.soldOut ? '<div class="sold-out-badge">HABIS</div>' : ''}
        ${p.rekomendasi ? '<div class="rekomendasi-badge"><i class="fas fa-star"></i> REKOMENDASI</div>' : ''}
        <div class="product-image-container">
            <img src="${p.imageUrl || 'https://via.placeholder.com/260x180?text=No+Image'}" class="product-image" loading="lazy" onerror="this.src='https://via.placeholder.com/260x180?text=No+Image'">
        </div>
        <div class="product-info">
            <div class="product-name">${p.name || 'Produk'}</div>
            <div class="product-price">Rp ${(p.price || 0).toLocaleString('id-ID')}</div>
            <div class="product-actions">
                <button class="view-btn" data-id="${p.id}"><i class="fas fa-eye"></i> Detail</button>
                <button class="buy-btn" ${p.soldOut ? 'disabled' : ''} data-id="${p.id}"><i class="fas fa-shopping-cart"></i> ${p.soldOut ? 'Habis' : 'Beli'}</button>
            </div>
        </div>
    `;
    
    card.querySelector('.view-btn').onclick = (e) => {
        e.stopPropagation();
        openDetail(p);
    };
    
    card.querySelector('.buy-btn').onclick = (e) => {
        e.stopPropagation();
        if (!p.soldOut) openPurchaseModal(p);
    };
    
    document.getElementById('productsContainer').appendChild(card);
}

function renderAdminProduct(p) {
    const div = document.createElement('div');
    div.className = 'admin-card';
    div.innerHTML = `
        <div class="card-header">
            <img src="${p.imageUrl || 'https://via.placeholder.com/70'}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/70'">
            <div class="card-info">
                <div class="card-name">${p.name || 'Produk'}</div>
                <div class="card-price">Rp ${(p.price || 0).toLocaleString('id-ID')}</div>
            </div>
        </div>
        <div class="card-actions">
            <button class="admin-btn edit" data-id="${p.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="admin-btn delete" data-id="${p.id}"><i class="fas fa-trash"></i> Hapus</button>
        </div>
    `;
    
    div.querySelector('.edit').onclick = () => openEdit(p);
    div.querySelector('.delete').onclick = () => deleteProduct(p.id);
    
    document.getElementById('adminProductsList').appendChild(div);
}

function renderAdminRekomendasi() {
    const container = document.getElementById('adminRekomendasiList');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'admin-card';
        div.innerHTML = `
            <div class="card-header">
                <img src="${p.imageUrl || 'https://via.placeholder.com/70'}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/70'">
                <div class="card-info">
                    <div class="card-name">${p.name || 'Produk'}</div>
                    <div class="card-price">Rp ${(p.price || 0).toLocaleString('id-ID')}</div>
                </div>
            </div>
            <div class="card-actions">
                <button class="admin-btn toggle ${p.rekomendasi ? 'active' : ''}" data-id="${p.id}">
                    <i class="fas fa-star"></i> ${p.rekomendasi ? 'Aktif' : 'Jadikan'}
                </button>
            </div>
        `;
        
        div.querySelector('.toggle').onclick = () => toggleRekomendasi(p.id, !p.rekomendasi);
        container.appendChild(div);
    });
}

function toggleRekomendasi(id, newState) {
    db.collection("products").doc(id).update({ rekomendasi: newState })
        .then(() => {
            showNotif(`Rekomendasi ${newState ? 'ditambahkan' : 'dihapus'}`);
            loadProducts();
        })
        .catch(err => { console.error(err); showNotif('Gagal', 'error'); });
}

function addNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const desc = document.getElementById('productDescription').value.trim();
    const img = document.getElementById('productImageUrl').value.trim();
    
    if (!name || !price || price <= 0 || !img || !isValidUrl(img)) {
        showNotif('Isi semua field dengan benar', 'error'); return;
    }
    
    const btn = document.getElementById('addProductBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menambah...';
    
    db.collection("products").add({
        name, price, description: desc, imageUrl: img,
        soldOut: false, rekomendasi: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productImageUrl').value = '';
        document.getElementById('productImagePreview').style.display = 'none';
        
        showNotif('Produk ditambahkan');
        loadProducts();
    })
    .catch(err => { console.error(err); showNotif('Gagal', 'error'); })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> Tambah Produk';
    });
}

function openEdit(p) {
    editingId = p.id;
    document.getElementById('editProductName').value = p.name || '';
    document.getElementById('editProductPrice').value = p.price || '';
    document.getElementById('editProductDescription').value = p.description || '';
    document.getElementById('editProductImageUrl').value = '';
    document.getElementById('currentProductImage').src = p.imageUrl || 'https://via.placeholder.com/100';
    
    if (p.soldOut) {
        document.getElementById('editSoldOutYes').checked = true;
    } else {
        document.getElementById('editSoldOutNo').checked = true;
    }
    
    document.getElementById('editProductModal').classList.add('active');
}

function saveEdit() {
    const name = document.getElementById('editProductName').value.trim();
    const price = parseInt(document.getElementById('editProductPrice').value);
    const desc = document.getElementById('editProductDescription').value.trim();
    const img = document.getElementById('editProductImageUrl').value.trim();
    const soldOut = document.querySelector('input[name="editSoldOut"]:checked').value === 'true';
    
    if (!name || !price || price <= 0) {
        showNotif('Nama dan harga harus diisi', 'error'); return;
    }
    
    const update = { name, price, description: desc, soldOut };
    if (img && isValidUrl(img)) update.imageUrl = img;
    
    const btn = document.getElementById('saveEditBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    
    db.collection("products").doc(editingId).update(update)
        .then(() => {
            showNotif('Produk diperbarui');
            document.getElementById('editProductModal').classList.remove('active');
            loadProducts();
        })
        .catch(err => { console.error(err); showNotif('Gagal', 'error'); })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save"></i> Simpan';
        });
}

function deleteProduct(id) {
    if (confirm('Hapus produk ini?')) {
        db.collection("products").doc(id).delete()
            .then(() => { showNotif('Produk dihapus'); loadProducts(); })
            .catch(err => { console.error(err); showNotif('Gagal', 'error'); });
    }
}

function openDetail(p) {
    const body = document.getElementById('productDetailBody');
    body.innerHTML = `
        <img src="${p.imageUrl || 'https://via.placeholder.com/400x300'}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300'">
        <div class="detail-description">${(p.description || 'Tidak ada deskripsi.').replace(/\n/g, '<br>')}</div>
    `;
    document.getElementById('productDetailModal').classList.add('active');
}

// Event listeners
document.getElementById('addProductBtn')?.addEventListener('click', addNewProduct);
document.getElementById('saveEditBtn')?.addEventListener('click', saveEdit);