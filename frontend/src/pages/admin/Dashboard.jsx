import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalDetailPesanan from '../../components/ModalDetailPesanan';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [allDataPesanan, setAllDataPesanan] = useState([]);
  const [stats, setStats] = useState({ omset: 0, baru: 0, harusSelesai: 0, terlambat: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ kategori: '', keterangan: '', jumlah: '', nominal: '' });
  
  // State Modal List (Card Kategori)
  const [listModalType, setListModalType] = useState(null); // 'baru', 'proses', 'terlambat'

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/pesanan/");
      const data = await response.json();
      
      const today = new Date();
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

      let omset = 0, baru = 0, harus = 0, telat = 0;
      
      const processedData = data.map(p => {
        let dateMasuk = new Date();
        if (p.id_transaksi && p.id_transaksi.startsWith('TRX')) {
          dateMasuk = new Date(parseInt(p.id_transaksi.substring(3, 13)) * 1000);
        } else if (p.created_at) {
          dateMasuk = new Date(p.created_at);
        }

        // Cari estimasi tercepat dari detail_layanan
        let items = []; try { items = JSON.parse(p.detail_layanan || '[]'); } catch(e){}
        let estDatesArray = [];
        if (items.length > 0) {
            items.forEach(item => {
                let estText = item.est || '1 Hari';
                let est = new Date(dateMasuk.getTime());
                let num = parseInt(estText.match(/\d+/)) || 1;
                if (estText.toLowerCase().includes('jam')) { est.setHours(est.getHours() + num); } else { est.setDate(est.getDate() + num); }
                estDatesArray.push(est);
            });
        } else {
            let est = new Date(dateMasuk.getTime()); est.setDate(est.getDate() + 1); estDatesArray.push(est);
        }
        estDatesArray.sort((a,b) => a - b);
        let fastestEst = estDatesArray[0];

        const isToday = dateMasuk.toDateString() === today.toDateString();
        p.isPesananBaru = false; p.isHarusSelesai = false; p.isTerlambat = false; p.fastestEst = fastestEst; p.dateMasuk = dateMasuk;

        if (isToday) { p.isPesananBaru = true; baru++; }
        if (isToday && p.status_pesanan !== 'Batal') omset += (Number(p.total_harga) || 0);

        if (p.status_pesanan !== 'Selesai' && p.status_pesanan !== 'Batal' && p.status_pesanan !== 'Siap Ambil') {
          let estDateOnly = new Date(fastestEst.getFullYear(), fastestEst.getMonth(), fastestEst.getDate()).getTime();
          if (estDateOnly === todayDateOnly) { p.isHarusSelesai = true; harus++; }
          if (fastestEst.getTime() < today.getTime()) { p.isTerlambat = true; telat++; }
        }
        return p;
      });

      setStats({ omset, baru, harusSelesai: harus, terlambat: telat });
      setAllDataPesanan(processedData);
      setOrders(processedData.sort((a, b) => b.id - a.id).slice(0, 10)); 
    } catch (error) {
      console.error("Gagal load data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSimpanPengeluaran = () => {
    if(!expenseForm.kategori || !expenseForm.keterangan || !expenseForm.jumlah || !expenseForm.nominal) {
      return alert("Lengkapi semua form pengeluaran!");
    }
    const db = JSON.parse(localStorage.getItem('pengeluaran_zeera') || '[]');
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'}) + ', ' + now.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) + ' WIB';
    
    db.push({
      id: 'EXP-' + now.getTime(),
      tanggal: dateStr,
      kategori: expenseForm.kategori,
      keterangan: expenseForm.keterangan,
      jumlah: expenseForm.jumlah,
      nominal: parseInt(expenseForm.nominal)
    });
    localStorage.setItem('pengeluaran_zeera', JSON.stringify(db));
    setIsExpenseModalOpen(false);
    setExpenseForm({ kategori: '', keterangan: '', jumlah: '', nominal: '' });
    alert("Pengeluaran berhasil dicatat!");
  };

  const getBadgeHTML = (status) => {
    switch(status) {
      case 'Antrian': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Antrian</span>;
      case 'Proses': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100"><span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>Proses</span>;
      case 'Siap Ambil': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"><span className="flex items-center justify-center w-3.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span></span>Siap Ambil</span>;
      case 'Selesai': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Selesai</span>;
      case 'Batal': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>Batal</span>;
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

  const formatWaktu = (d) => {
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Rendering Data Modal List
  let listModalData = [];
  let listModalTitle = '';
  let listModalSubtitle = '';
  if (listModalType === 'baru') {
    listModalData = allDataPesanan.filter(p => p.isPesananBaru);
    listModalTitle = 'Pesanan Baru (Hari Ini)'; listModalSubtitle = 'Daftar semua antrian yang masuk pada hari ini.';
  } else if (listModalType === 'proses') {
    listModalData = allDataPesanan.filter(p => p.isHarusSelesai);
    listModalTitle = 'Harus Selesai (Hari Ini)'; listModalSubtitle = 'Daftar pesanan khusus yang tenggat waktunya jatuh pada hari ini.';
  } else if (listModalType === 'terlambat') {
    listModalData = allDataPesanan.filter(p => p.isTerlambat);
    listModalTitle = 'Pesanan Terlambat'; listModalSubtitle = 'Daftar semua pesanan yang telah melewati tenggat waktu estimasi.';
  }

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Halo, Admin!</h1>
          <p className="text-slate-500 font-medium">Ringkasan operasional hari ini.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/laporan/keuangan/detail-omset" className="flex flex-col items-end pr-4 border-r border-slate-200 hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Omset Hari Ini</span>
            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xl">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
              Rp {stats.omset.toLocaleString('id-ID')}
            </div>
          </Link>
          <button onClick={() => setIsExpenseModalOpen(true)} className="whitespace-nowrap px-6 py-3 text-sm font-bold rounded-full flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-100 active:scale-95">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Tambah Pengeluaran
          </button>
          <Link to="/buat-pesanan" className="whitespace-nowrap px-6 py-3 text-sm font-bold rounded-full flex items-center justify-center gap-2 border border-transparent shadow-lg bg-[#fd761a] text-white transition-all duration-200 hover:-translate-y-1 hover:bg-orange-600 active:scale-95">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Buat Pesanan
          </Link>
        </div>
      </header>

      {/* 3 KPI Cards - Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div onClick={() => setListModalType('baru')} className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-100 shadow-[0_30px_60px_rgba(8,_112,_184,_0.08)] flex items-center gap-6 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center bg-emerald-50"><span className="material-symbols-outlined text-emerald-700 text-3xl">fiber_new</span></div>
          <div className="flex flex-col relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Pesanan Baru</p>
            <p className="text-3xl font-black mt-1 text-[#0f766e]">{stats.baru}</p>
          </div>
        </div>

        <div onClick={() => setListModalType('proses')} className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-100 shadow-[0_30px_60px_rgba(8,_112,_184,_0.08)] flex items-center gap-6 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center bg-orange-50"><span className="material-symbols-outlined text-orange-500 text-3xl">pending_actions</span></div>
          <div className="flex flex-col relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Harus Selesai</p>
            <p className="text-3xl font-black mt-1 text-orange-600">{stats.harusSelesai}</p>
          </div>
        </div>

        <div onClick={() => setListModalType('terlambat')} className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-100 shadow-[0_30px_60px_rgba(8,_112,_184,_0.08)] flex items-center gap-6 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center bg-red-50"><span className="material-symbols-outlined text-red-500 text-3xl">warning</span></div>
          <div className="flex flex-col relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Terlambat</p>
            <p className="text-3xl font-black mt-1 text-red-600">{stats.terlambat}</p>
          </div>
        </div>
      </div>

      {/* Table Pesanan Terbaru */}
      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,_112,_184,_0.08)] overflow-hidden min-h-0 p-6 md:p-8 relative z-10">
        <div className="flex justify-between items-center gap-4 mb-6 w-full shrink-0">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Pesanan Terbaru</h2>
          <Link to="/pesanan" className="text-[#0f766e] font-bold text-sm hover:underline flex items-center gap-1 group transition-all">
            Lihat Semua <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
              <tr className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                <th className="w-[25%] text-left pr-4 whitespace-nowrap py-4 pl-6">ID TRANSAKSI</th>
                <th className="w-[25%] text-left pr-4 whitespace-nowrap py-4">PELANGGAN</th>
                <th className="w-[20%] text-left pr-4 whitespace-nowrap py-4">TOTAL</th>
                <th className="w-[15%] text-center px-2 whitespace-nowrap py-4">STATUS</th>
                <th className="w-[15%] text-center px-2 whitespace-nowrap py-4 pr-6">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500"><span className="material-symbols-outlined animate-spin text-3xl mb-2 text-[#0f766e]">autorenew</span><p>Memuat data...</p></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">Belum ada pesanan.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0">
                    <td className="w-[25%] text-left pr-4 py-3.5 pl-6 font-bold text-slate-800">{order.id_transaksi}</td>
                    <td className="w-[25%] text-left pr-4 py-3.5 font-bold text-slate-800 truncate capitalize">{order.nama_pelanggan || 'Anonim'}</td>
                    <td className="w-[20%] text-left pr-4 py-3.5 font-black text-[#0f766e]">Rp {(Number(order.total_harga)||0).toLocaleString('id-ID')}</td>
                    <td className="w-[15%] text-center px-2 py-3.5">{getBadgeHTML(order.status_pesanan)}</td>
                    <td className="w-[15%] text-center px-2 py-3.5 pr-6">
                      <div className="relative flex items-center justify-center text-[#0f766e] font-bold text-sm overflow-hidden h-6 w-16 mx-auto"><span className="absolute transition-all duration-500 ease-out transform group-hover:translate-x-8 group-hover:opacity-0">Detail</span><span className="material-symbols-outlined text-[20px] absolute transition-all duration-500 ease-out transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">arrow_forward</span></div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDetailPesanan isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} onRefresh={fetchData} />

      {/* Modal Tambah Pengeluaran */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsExpenseModalOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200">
                <h3 className="font-extrabold text-xl text-slate-800 mb-4">Catat Pengeluaran Baru</h3>
                <select value={expenseForm.kategori} onChange={e=>setExpenseForm({...expenseForm, kategori: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-rose-500 cursor-pointer" style={{appearance: 'none'}}>
                    <option value="" disabled>Pilih Kategori...</option>
                    <option value="Bahan Baku">Bahan Baku</option>
                    <option value="Bahan Bakar">Bahan Bakar</option>
                    <option value="Perlengkapan">Perlengkapan</option>
                </select>
                <input value={expenseForm.keterangan} onChange={e=>setExpenseForm({...expenseForm, keterangan: e.target.value})} type="text" placeholder="Keterangan (Misal: Sabun Detergen)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-rose-500" />
                <input value={expenseForm.jumlah} onChange={e=>setExpenseForm({...expenseForm, jumlah: e.target.value})} type="text" placeholder="Jumlah (Misal: 5 Liter, 3 Tabung)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-rose-500" />
                <input value={expenseForm.nominal} onChange={e=>setExpenseForm({...expenseForm, nominal: e.target.value})} type="number" placeholder="Total Nominal (Rp)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-sm outline-none focus:border-rose-500" />
                
                <div className="flex gap-3">
                    <button onClick={() => setIsExpenseModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                    <button onClick={handleSimpanPengeluaran} className="flex-1 bg-[#f43f5e] text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-colors">Simpan Data</button>
                </div>
            </div>
        </div>
      )}

      {/* Modal Daftar Pesanan dari KPI Cards */}
      {listModalType && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[55] flex items-center justify-center p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setListModalType(null)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">{listModalTitle}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{listModalSubtitle}</p>
              </div>
              <button onClick={() => setListModalType(null)} className="text-slate-400 hover:text-red-500 transition-colors w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100"><span className="material-symbols-outlined text-[24px]">close</span></button>
            </div>
            
            <div className="flex-1 p-6 bg-slate-50/50 flex flex-col min-h-0">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto custom-scrollbar flex-1">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                      <tr className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                        <th className="w-[25%] text-left pr-4 whitespace-nowrap py-4 pl-6">TANGGAL MASUK</th>
                        <th className="w-[18%] text-left pr-4 whitespace-nowrap py-4">PELANGGAN</th>
                        <th className="w-[14%] text-left pr-4 whitespace-nowrap py-4">TOTAL</th>
                        <th className="w-[15%] text-center px-2 whitespace-nowrap py-4">PEMBAYARAN</th>
                        <th className="w-[14%] text-center px-2 whitespace-nowrap py-4">STATUS</th>
                        <th className="w-[14%] text-center px-2 whitespace-nowrap py-4 pr-6">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                      {listModalData.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-12 text-slate-500 font-medium">Tidak ada data untuk kategori ini.</td></tr>
                      ) : (
                        listModalData.map(p => {
                          const warnaTeks = p.isTerlambat ? 'text-red-500' : (p.isHarusSelesai ? 'text-orange-500' : 'text-[#0f766e]');
                          return (
                            <tr key={p.id} onClick={() => setSelectedOrder(p)} className="hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-100 last:border-0">
                              <td className="w-[25%] text-left pr-4 py-4 pl-6 text-slate-500 font-medium whitespace-nowrap">
                                <span className="block">{formatWaktu(p.dateMasuk)}</span>
                                <span className={`block text-[10px] ${warnaTeks} font-extrabold mt-0.5 tracking-wider uppercase`}>Est: {formatWaktu(p.fastestEst)}</span>
                              </td>
                              <td className="w-[18%] text-left pr-4 py-4 font-bold text-slate-800 truncate capitalize">{p.nama_pelanggan || 'Anonim'}</td>
                              <td className="w-[14%] text-left pr-4 py-4 font-black text-[#0f766e]">Rp {(Number(p.total_harga)||0).toLocaleString('id-ID')}</td>
                              <td className="w-[15%] text-center px-2 py-4">{getBayarBadge(p)}</td>
                              <td className="w-[14%] text-center px-2 py-4">{getBadgeHTML(p.status_pesanan)}</td>
                              <td className="w-[14%] text-center px-2 py-4 pr-6">
                                <div className="relative flex items-center justify-center text-[#0f766e] font-bold text-sm overflow-hidden h-6 w-24 mx-auto"><span className="absolute transition-all duration-500 ease-out transform group-hover:translate-x-8 group-hover:opacity-0">Detail</span><span className="material-symbols-outlined text-[20px] absolute transition-all duration-500 ease-out transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">arrow_forward</span></div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}