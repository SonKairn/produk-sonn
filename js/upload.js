async function uploadToCloudinary(file, preset) {
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
        throw new Error('Maks 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Gagal upload: ' + error.message);
    }
}

// Upload produk
let selectedProductFile = null;
const productFileInput = document.getElementById('productFileInput');
const productUploadSubmit = document.getElementById('productUploadSubmit');
const productUploadStatus = document.getElementById('productUploadStatus');

productFileInput?.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        selectedProductFile = e.target.files[0];
        productUploadStatus.textContent = 'File: ' + selectedProductFile.name;
        
        if (selectedProductFile.size > 10 * 1024 * 1024) {
            productUploadStatus.textContent = 'File terlalu besar (maks 10MB)';
            productUploadSubmit.style.display = 'none';
            selectedProductFile = null;
        } else {
            productUploadSubmit.style.display = 'inline-block';
        }
    } else {
        selectedProductFile = null;
        productUploadStatus.textContent = '';
        productUploadSubmit.style.display = 'none';
    }
});

productUploadSubmit?.addEventListener('click', async function() {
    if (!selectedProductFile) {
        showNotif('Pilih file dulu', 'error');
        return;
    }
    
    productUploadSubmit.disabled = true;
    productUploadSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Upload...';
    productUploadStatus.textContent = 'Mengupload...';
    
    try {
        const url = await uploadToCloudinary(selectedProductFile, PRODUK_UPLOAD_PRESET);
        document.getElementById('productImageUrl').value = url;
        
        const preview = document.getElementById('productImagePreview');
        preview.style.display = 'block';
        document.getElementById('productImagePreviewImg').src = url;
        
        showNotif('Upload berhasil!');
        productUploadStatus.textContent = 'Selesai';
        productUploadSubmit.style.display = 'none';
        productFileInput.value = '';
        selectedProductFile = null;
    } catch (error) {
        showNotif(error.message, 'error');
        productUploadStatus.textContent = 'Gagal, isi manual';
        productUploadSubmit.style.display = 'none';
    } finally {
        productUploadSubmit.disabled = false;
        productUploadSubmit.innerHTML = '<i class="fas fa-upload"></i> Upload';
    }
});

// Upload testimoni
let selectedTestimonialFile = null;
const testimonialFileInput = document.getElementById('testimonialFileInput');
const testimonialUploadSubmit = document.getElementById('testimonialUploadSubmit');
const testimonialUploadStatus = document.getElementById('testimonialUploadStatus');

testimonialFileInput?.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        selectedTestimonialFile = e.target.files[0];
        testimonialUploadStatus.textContent = 'File: ' + selectedTestimonialFile.name;
        
        if (selectedTestimonialFile.size > 10 * 1024 * 1024) {
            testimonialUploadStatus.textContent = 'File terlalu besar (maks 10MB)';
            testimonialUploadSubmit.style.display = 'none';
            selectedTestimonialFile = null;
        } else {
            testimonialUploadSubmit.style.display = 'inline-block';
        }
    } else {
        selectedTestimonialFile = null;
        testimonialUploadStatus.textContent = '';
        testimonialUploadSubmit.style.display = 'none';
    }
});

testimonialUploadSubmit?.addEventListener('click', async function() {
    if (!selectedTestimonialFile) {
        showNotif('Pilih file dulu', 'error');
        return;
    }
    
    testimonialUploadSubmit.disabled = true;
    testimonialUploadSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Upload...';
    testimonialUploadStatus.textContent = 'Mengupload...';
    
    try {
        const url = await uploadToCloudinary(selectedTestimonialFile, TESTIMONI_UPLOAD_PRESET);
        document.getElementById('testimonialImageUrl').value = url;
        
        const preview = document.getElementById('testimonialImagePreview');
        preview.style.display = 'block';
        document.getElementById('testimonialImagePreviewImg').src = url;
        
        showNotif('Upload berhasil!');
        testimonialUploadStatus.textContent = 'Selesai';
        testimonialUploadSubmit.style.display = 'none';
        testimonialFileInput.value = '';
        selectedTestimonialFile = null;
    } catch (error) {
        showNotif(error.message, 'error');
        testimonialUploadStatus.textContent = 'Gagal, isi manual';
        testimonialUploadSubmit.style.display = 'none';
    } finally {
        testimonialUploadSubmit.disabled = false;
        testimonialUploadSubmit.innerHTML = '<i class="fas fa-upload"></i> Upload';
    }
});