import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/admin/Dashboard';
import BuatPesanan from './pages/admin/BuatPesanan';
import Pesanan from './pages/admin/Pesanan';
import Pelanggan from './pages/admin/Pelanggan';
import Laporan from './pages/admin/Laporan';
import Pengaturan from './pages/admin/Pengaturan';
import Lacak from './pages/customer/Lacak';

// Import 9 Komponen Sub-Laporan Baru
import DetailOmset from './pages/admin/laporan/keuangan/DetailOmset';
import PendapatanBersih from './pages/admin/laporan/keuangan/PendapatanBersih';
import Pengeluaran from './pages/admin/laporan/keuangan/Pengeluaran';
import PelangganBaru from './pages/admin/laporan/pelanggan/PelangganBaru';
import PelangganAktif from './pages/admin/laporan/pelanggan/PelangganAktif';
import DataLoyalitas from './pages/admin/laporan/pelanggan/DataLoyalitas';
import TransaksiMasuk from './pages/admin/laporan/transaksi/TransaksiMasuk';
import TransaksiSelesai from './pages/admin/laporan/transaksi/TransaksiSelesai';
import TransaksiBatal from './pages/admin/laporan/transaksi/TransaksiBatal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== RUTE PUBLIK (CUSTOMER) ===== */}
        <Route path="/lacak" element={<Lacak />} />

        {/* ===== RUTE ADMIN ===== */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="buat-pesanan" element={<BuatPesanan />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="pelanggan" element={<Pelanggan />} />
          <Route path="laporan" element={<Laporan />} /> 
          <Route path="pengaturan" element={<Pengaturan />} />

          {/* Sub-Laporan Keuangan */}
          <Route path="laporan/keuangan/detail-omset" element={<DetailOmset />} />
          <Route path="laporan/keuangan/pendapatan-bersih" element={<PendapatanBersih />} />
          <Route path="laporan/keuangan/pengeluaran" element={<Pengeluaran />} />
          
          {/* Sub-Laporan Pelanggan */}
          <Route path="laporan/pelanggan/pelanggan-baru" element={<PelangganBaru />} />
          <Route path="laporan/pelanggan/pelanggan-aktif" element={<PelangganAktif />} />
          <Route path="laporan/pelanggan/data-loyalitas" element={<DataLoyalitas />} />
          
          {/* Sub-Laporan Transaksi (Perbaikan Typo Transaksi Batal ada di sini) */}
          <Route path="laporan/transaksi/transaksi-masuk" element={<TransaksiMasuk />} />
          <Route path="laporan/transaksi/transaksi-selesai" element={<TransaksiSelesai />} />
          <Route path="laporan/transaksi/transaksi-batal" element={<TransaksiBatal />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;