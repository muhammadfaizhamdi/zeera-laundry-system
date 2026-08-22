// --- 1. Fungsi Mengecek Kunci Sesi ---
function periksaSesi() {
    const user = localStorage.getItem('zeera_user');
    
    if (!user) {
        // Sesuaikan path ini jika strukturnya berbeda di Live Server Anda
        window.location.replace('/admin/auth/login.html'); 
    }
}

// --- 2. Fungsi Eksekusi Logout ---
function prosesLogout() {
    localStorage.removeItem('zeera_user');
    localStorage.removeItem('zeera_token');
    
    // Tendang ke login
    window.location.replace('/admin/auth/login.html');
}

// --- 3. Eksekusi Saat Halaman Pertama Kali Dibuka ---
periksaSesi();

// --- 4. JURUS ANTI-BFCACHE (Menangkal Tombol Kembali Browser) ---
window.addEventListener('pageshow', function (event) {
    // Jika halaman dimuat dari cache memori (karena tombol Back ditekan)
    if (event.persisted) {
        // Paksa satpam untuk mengecek kunci ulang!
        periksaSesi();
    }
});