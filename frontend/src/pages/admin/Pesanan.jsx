import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalDetailPesanan from '../../components/ModalDetailPesanan';

export default function Pesanan() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pesanan/`);
      const data = await response.json();
      
      // Urutkan dari yang terbaru
      const sortedData = data.sort((a, b) => b.id - a.id);
      setOrders(sortedData);
      setFilteredOrders(sortedData);
    } catch (error) {
      console.error("Gagal menarik data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Logika Filter & Search (Berjalan otomatis saat state berubah)
  useEffect(() => {
    let result = orders;
    if (activeFilter !== 'Semua') {
      result = result.filter(o => o.status_pesanan === activeFilter);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(o => 
        (o.nama_pelanggan || '').toLowerCase().includes(lowerSearch) || 
        (o.id_transaksi || '').toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredOrders(result);
  }, [search, activeFilter, orders]);

  // Utility Format Waktu
  const formatWaktu = (unixStr) => {
    if (!unixStr) return 'Hari Ini';
    if (unixStr.startsWith('TRX')) {
      const d = new Date(parseInt(unixStr.substring(3, 13)) * 1000);
      if (isNaN(d)) return 'Hari Ini';
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
             d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    return 'Hari Ini';
  };

  const getBadgeHTML = (status) => {
    switch(status) {
      case 'Antrian': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Antrian</span>;
      case 'Proses': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100"><span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>Proses</span>;
      case 'Siap Ambil': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"><span className="flex items-center justify-center w-3.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span></span>Siap Ambil</span>;
      case 'Selesai': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Selesai</span>;
      case 'Batal': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>Batal</span>;
      default: return null;
    }
  };

  const getBayarBadge = (p) => {
    let dpVal = 0;
    try { if (p.keterangan?.startsWith('{')) dpVal = JSON.parse(p.keterangan).dp || 0; } catch(e){}
    if (p.status_bayar === 'Lunas') return <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-emerald-200 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Lunas</span>;
    if (dpVal > 0) return <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-amber-200 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Uang Muka</span>;
    return <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-rose-200 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Belum Lunas</span>;
  };

  const filters = ['Semua', 'Antrian', 'Proses', 'Siap Ambil', 'Selesai', 'Batal'];

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Header Disamakan ke text-3xl */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Daftar Pesanan</h1>
          <p className="text-slate-500 font-medium">Kelola, cari, dan pantau seluruh transaksi laundry.</p>
        </div>
        <Link to="/buat-pesanan" className="block w-full md:w-auto">
          <button className="bg-[#fd761a] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full md:w-auto whitespace-nowrap">
            <span className="material-symbols-outlined font-bold text-lg">add</span> Buat Pesanan
          </button>
        </Link>
      </header>

      {/* Konten Tabel */}
      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8 relative z-10">
        <div className="flex justify-between items-center gap-4 mb-6 w-full">
          <div className="relative flex-1 shrink-0">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-full border border-slate-200 text-sm outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" 
              placeholder="Cari nama atau ID..." type="text"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0 pr-1">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all shrink-0 ${activeFilter === f ? 'bg-[#0F766E] text-white border border-transparent' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <th className="w-[25%] text-left pr-4 whitespace-nowrap py-4">TANGGAL MASUK</th>
                <th className="w-[18%] text-left pr-4 whitespace-nowrap py-4">PELANGGAN</th>
                <th className="w-[14%] text-left pr-4 whitespace-nowrap py-4">TOTAL</th>
                <th className="w-[15%] text-center px-2 whitespace-nowrap py-4">PEMBAYARAN</th>
                <th className="w-[14%] text-center px-2 whitespace-nowrap py-4">STATUS</th>
                <th className="w-[14%] text-center px-2 whitespace-nowrap py-4">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500"><span className="material-symbols-outlined animate-spin text-3xl mb-2 text-[#0f766e]">autorenew</span><p>Memuat data...</p></td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Tidak ada data pesanan.</td></tr>
              ) : (
                filteredOrders.map(p => (
                  <tr key={p.id} onClick={() => setSelectedOrder(p)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0">
                    <td className="w-[25%] text-left pr-4 py-4 text-slate-500 font-medium whitespace-nowrap">{formatWaktu(p.id_transaksi)}</td>
                    <td className="w-[18%] text-left pr-4 py-4 font-bold text-slate-800 truncate capitalize">{p.nama_pelanggan || 'Anonim'}</td>
                    <td className="w-[14%] text-left pr-4 py-4 font-black text-[#0f766e]">Rp {(Number(p.total_harga)||0).toLocaleString('id-ID')}</td>
                    <td className="w-[15%] text-center px-2 py-4">{getBayarBadge(p)}</td>
                    <td className="w-[14%] text-center px-2 py-4">{getBadgeHTML(p.status_pesanan)}</td>
                    <td className="w-[14%] text-center px-2 py-4">
                      <div className="relative flex items-center justify-center text-[#0f766e] font-bold text-sm overflow-hidden h-6 w-24 mx-auto">
                        <span className="absolute transition-all duration-500 ease-out transform group-hover:translate-x-8 group-hover:opacity-0">Detail</span>
                        <span className="material-symbols-outlined text-[20px] absolute transition-all duration-500 ease-out transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">arrow_forward</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalDetailPesanan isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} onRefresh={fetchOrders} />
    </div>
  );
}