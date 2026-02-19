const firebaseConfig = {
    apiKey: "AIzaSyDFV42d5paKrxcFV9GWW9eKNM4DAv-dwQY",
    authDomain: "sonofficial-3e0ee.firebaseapp.com",
    projectId: "sonofficial-3e0ee",
    storageBucket: "sonofficial-3e0ee.firebasestorage.app",
    messagingSenderId: "1013214957980",
    appId: "1:1013214957980:web:dc9cf7e2910e466783b859"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Cloudinary config (ganti punya lo)
const CLOUD_NAME = 'dfuravgrm';
const PRODUK_UPLOAD_PRESET = 'sonn_produk_unsigned';
const TESTIMONI_UPLOAD_PRESET = 'sonn_testimoni_unsigned';