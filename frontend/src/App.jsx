import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// Halaman Utama & Auth
import Login from './pages/auth/Login';
import DaftarAkun from './pages/auth/DaftarAkun';
import LupaSandi from './pages/auth/LupaSandi';
import Dashboard from './pages/admin/Dashboard';
import BuatPesanan from './pages/admin/BuatPesanan';
import Pesanan from './pages/admin/Pesanan';
import Pelanggan from './pages/admin/Pelanggan';
import Laporan from './pages/admin/Laporan';
import Pengaturan from './pages/admin/Pengaturan';
import Lacak from './pages/customer/Lacak';

// 9 Komponen Sub-Laporan 
import DetailOmset from './pages/admin/laporan/keuangan/DetailOmset';
import PendapatanBersih from './pages/admin/laporan/keuangan/PendapatanBersih';
import Pengeluaran from './pages/admin/laporan/keuangan/Pengeluaran';
import PelangganBaru from './pages/admin/laporan/pelanggan/PelangganBaru';
import PelangganAktif from './pages/admin/laporan/pelanggan/PelangganAktif';
import DataLoyalitas from './pages/admin/laporan/pelanggan/DataLoyalitas';
import TransaksiMasuk from './pages/admin/laporan/transaksi/TransaksiMasuk';
import TransaksiSelesai from './pages/admin/laporan/transaksi/TransaksiSelesai';
import TransaksiBatal from './pages/admin/laporan/transaksi/TransaksiBatal';

// Komponen Satpam (Route Protection)
const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('zeera_token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== RUTE PUBLIK (Bebas Diakses) ===== */}
        <Route path="/lacak" element={<Lacak />} />
        <Route path="/login" element={<Login />} />
        <Route path="/daftar-akun" element={<DaftarAkun />} />
        <Route path="/lupa-sandi" element={<LupaSandi />} />

        {/* ===== RUTE ADMIN (Terproteksi Satpam) ===== */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="buat-pesanan" element={<BuatPesanan />} />
            <Route path="pesanan" element={<Pesanan />} />
            <Route path="pelanggan" element={<Pelanggan />} />
            <Route path="laporan" element={<Laporan />} /> 
            <Route path="pengaturan" element={<Pengaturan />} />

            {/* Sub-Laporan */}
            <Route path="laporan/keuangan/detail-omset" element={<DetailOmset />} />
            <Route path="laporan/keuangan/pendapatan-bersih" element={<PendapatanBersih />} />
            <Route path="laporan/keuangan/pengeluaran" element={<Pengeluaran />} />
            <Route path="laporan/pelanggan/pelanggan-baru" element={<PelangganBaru />} />
            <Route path="laporan/pelanggan/pelanggan-aktif" element={<PelangganAktif />} />
            <Route path="laporan/pelanggan/data-loyalitas" element={<DataLoyalitas />} />
            <Route path="laporan/transaksi/transaksi-masuk" element={<TransaksiMasuk />} />
            <Route path="laporan/transaksi/transaksi-selesai" element={<TransaksiSelesai />} />
            <Route path="laporan/transaksi/transaksi-batal" element={<TransaksiBatal />} />
          </Route>
        </Route>

        {/* Tangkap URL salah (404) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;