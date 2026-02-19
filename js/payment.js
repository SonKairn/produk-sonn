const PAYMENT_DATA = {
    dana: {
        name: "DANA",
        icon: "fas fa-wallet",
        number: "083137743419",
        instructions: [
            "Buka aplikasi DANA",
            "Pilih menu 'Kirim'",
            "Masukkan nomor: 083137743419",
            "Masukkan nominal sesuai harga",
            "Konfirmasi pembayaran",
            "Screenshot bukti"
        ]
    },
    gopay: {
        name: "GOPAY",
        icon: "fas fa-mobile-alt",
        number: "082315865501",
        instructions: [
            "Buka aplikasi GOPAY",
            "Pilih menu 'Bayar'",
            "Masukkan nomor: 082315865501",
            "Masukkan nominal",
            "Selesaikan dengan PIN",
            "Screenshot bukti"
        ]
    },
    qris: {
        name: "QRIS",
        icon: "fas fa-qrcode",
        qrUrl: "https://files.catbox.moe/x7n2ds.png",
        instructions: [
            "Buka aplikasi pembayaran",
            "Pilih 'Scan QR'",
            "Scan QR code",
            "Masukkan nominal",
            "Konfirmasi pembayaran",
            "Screenshot bukti"
        ]
    }
};

const TELEGRAM_USERNAME = "SonKairn";
const NOTE_MESSAGE = "WAJIB kirim bukti TF, kalau gak, gak diproses";

function openPurchaseModal(product) {
    selectedProduct = product;
    const modalBody = document.getElementById('purchaseModalBody');
    
    modalBody.innerHTML = `
        <div style="margin-bottom:20px;">
            <h4 style="color:var(--primary);">${product.name}</h4>
            <p style="font-size:1.3rem; font-weight:600;">Rp ${product.price.toLocaleString('id-ID')}</p>
        </div>
        
        <h5 style="margin-bottom:15px;">Pilih Metode</h5>
        <div class="payment-methods">
            <div class="payment-card" onclick="selectPayment('dana')">
                <div class="payment-icon"><i class="fas fa-wallet"></i></div>
                <div class="payment-info">
                    <div class="payment-name">DANA</div>
                    <div class="payment-desc">Transfer DANA</div>
                </div>
            </div>
            
            <div class="payment-card" onclick="selectPayment('gopay')">
                <div class="payment-icon"><i class="fas fa-mobile-alt"></i></div>
                <div class="payment-info">
                    <div class="payment-name">GOPAY</div>
                    <div class="payment-desc">Transfer GOPAY</div>
                </div>
            </div>
            
            <div class="payment-card" onclick="selectPayment('qris')">
                <div class="payment-icon"><i class="fas fa-qrcode"></i></div>
                <div class="payment-info">
                    <div class="payment-name">QRIS</div>
                    <div class="payment-desc">Scan QR</div>
                </div>
            </div>
        </div>
        
        <div class="note">
            <i class="fas fa-info-circle"></i> ${NOTE_MESSAGE}
        </div>
    `;
    
    document.getElementById('purchaseModal').classList.add('active');
}

window.selectPayment = function(paymentType) {
    document.getElementById('purchaseModal').classList.remove('active');
    showPaymentDetail(selectedProduct, paymentType);
};

function showPaymentDetail(product, paymentType) {
    const payment = PAYMENT_DATA[paymentType];
    const modalBody = document.getElementById('paymentDetailBody');
    
    let paymentHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <h4 style="color:var(--primary);">${product.name}</h4>
            <p style="font-size:1.5rem; font-weight:600;">Rp ${product.price.toLocaleString('id-ID')}</p>
        </div>
        
        <div class="payment-detail">
            <h5 class="payment-detail-title"><i class="fas fa-credit-card"></i> ${payment.name}</h5>
    `;
    
    if (paymentType === 'qris') {
        paymentHTML += `
            <img src="${payment.qrUrl}" class="qr-image" alt="QRIS" loading="lazy" onclick="window.zoomQR('${payment.qrUrl}')" title="Klik perbesar" onerror="this.src='https://via.placeholder.com/200'">
            <p style="text-align:center; font-size:0.8rem;">Klik gambar untuk perbesar</p>
        `;
    } else {
        paymentHTML += `
            <div class="payment-number">
                <span>${payment.number}</span>
                <button class="copy-btn" onclick="copyToClipboard('${payment.number}')">
                    <i class="fas fa-copy"></i> Salin
                </button>
            </div>
        `;
    }
    
    paymentHTML += `
            <div style="margin:20px 0;">
                <strong>Cara:</strong>
                <ol class="instruction-list">
                    ${payment.instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
            </div>
            
            <div class="note">
                <i class="fas fa-exclamation-triangle"></i> ${NOTE_MESSAGE}
            </div>
            
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn btn-secondary" style="flex:1;" onclick="closePaymentModal()">Tutup</button>
                <button class="btn btn-gradient" style="flex:2;" onclick="sendPaymentProof('${paymentType}')">Kirim Bukti</button>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = paymentHTML;
    document.getElementById('paymentDetailModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentDetailModal').classList.remove('active');
}

function sendPaymentProof(paymentType) {
    const payment = PAYMENT_DATA[paymentType];
    const message = `🛍️ *KONFIRMASI - Son Official*\n\n` +
        `*Produk:* ${selectedProduct.name}\n` +
        `*Harga:* Rp ${selectedProduct.price.toLocaleString('id-ID')}\n` +
        `*Metode:* ${payment.name}\n` +
        `*Tujuan:* ${payment.number || 'QRIS'}\n\n` +
        `📌 Kirim screenshot bukti`;
    
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`, '_blank');
    closePaymentModal();
    showNotif('Kirim bukti ke Telegram');
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotif('Nomor disalin!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotif('Nomor disalin!');
    });
};