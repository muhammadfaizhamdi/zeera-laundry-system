import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/admin/Dashboard';
import BuatPesanan from './pages/admin/BuatPesanan';
import Pesanan from './pages/admin/Pesanan';
import Pelanggan from './pages/admin/Pelanggan';
import Laporan from './pages/admin/Laporan';
import Pengaturan from './pages/admin/Pengaturan';
import Lacak from './pages/customer/Lacak';

const PlaceholderPage = ({ title }) => (
  <main className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-white/50 p-6 md:p-8 h-full overflow-hidden">
    <h1 className="text-3xl font-extrabold text-slate-800">{title}</h1>
    <p className="text-slate-500 font-medium mt-2">Halaman ini sedang dalam proses migrasi ke React.</p>
  </main>
);

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

          {/* Sub-Laporan Placeholder */}
          <Route path="laporan/keuangan/detail-omset" element={<PlaceholderPage title="Detail Omset" />} />
          <Route path="laporan/keuangan/pendapatan-bersih" element={<PlaceholderPage title="Pendapatan Bersih" />} />
          <Route path="laporan/keuangan/pengeluaran" element={<PlaceholderPage title="Pengeluaran" />} />
          <Route path="laporan/pelanggan/pelanggan-baru" element={<PlaceholderPage title="Pelanggan Baru" />} />
          <Route path="laporan/pelanggan/pelanggan-aktif" element={<PlaceholderPage title="Pelanggan Aktif" />} />
          <Route path="laporan/pelanggan/data-loyalitas" element={<PlaceholderPage title="Data Loyalitas (Top Spender)" />} />
          <Route path="laporan/transaksi/transaksi-masuk" element={<PlaceholderPage title="Transaksi Masuk" />} />
          <Route path="laporan/transaksi/transaksi-selesai" element={<PlaceholderPage title="Transaksi Selesai" />} />
          <Route path="laporan/transaksi-batal" element={<PlaceholderPage title="Transaksi Batal" />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;