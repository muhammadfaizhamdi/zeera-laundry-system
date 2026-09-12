import React, { useState } from 'react';
import { usePesananData } from '../../../../hooks/usePesananData';

export default function TransaksiMasuk() {
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];

  const { data, isLoading } = usePesananData(activeFilter);
  const dataMasuk = data.filter(p => p.status_pesanan === 'Antrian' || p.status_pesanan === 'Proses');

  const getBadgeHTML = (status) => {
    if(status === 'Antrian') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Antrian</span>;
    if(status === 'Proses') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100"><span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>Proses</span>;
    return null;
  };

  const formatTgl = (idTrx) => {
    if(!idTrx) return '-';
    return new Date(parseInt(idTrx.substring(3, 13)) * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Transaksi Masuk</h1><p className="text-slate-500 font-medium">Pesanan dalam status Antrian dan Proses.</p></div>
        <div className="flex items-center gap-3 relative">
          <button className="bg-[#10b981] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-[20px]">download</span> Export Excel</button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-[20px]">calendar_today</span> <span>{activeFilter}</span> <span className="material-symbols-outlined text-[20px]">expand_more</span></button>
            {isDropdownOpen && (
              <ul className="absolute top-[calc(100%+8px)] right-0 w-[175px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-sm font-medium text-slate-600 p-2 z-50">
                {filters.map(f => (<li key={f} onClick={() => { setActiveFilter(f); setIsDropdownOpen(false); }} className={`p-3 rounded-lg cursor-pointer flex justify-between ${activeFilter === f ? 'text-[#0f766e] bg-teal-50/50 font-bold' : 'hover:bg-slate-50'}`}><span>{f}</span> <span className={`material-symbols-outlined text-[18px] ${activeFilter === f ? '' : 'opacity-0'}`}>check</span></li>))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100"><tr className="text-slate-400 font-bold text-xs uppercase tracking-wider"><th className="py-4 pr-4 w-[25%]">Tanggal</th><th className="py-4 pr-4 w-[25%]">Pelanggan</th><th className="py-4 pr-4 w-[20%]">Total</th><th className="py-4 pr-4 w-[15%]">Status</th><th className="py-4 pr-4 w-[15%]">Aksi</th></tr></thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {isLoading ? <tr><td colSpan="5" className="py-8 text-center text-slate-500">Memuat data API...</td></tr> : dataMasuk.length === 0 ? <tr><td colSpan="5" className="py-8 text-center text-slate-500">Tidak ada transaksi masuk di periode ini.</td></tr> : dataMasuk.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors"><td className="py-3.5 pr-4 text-slate-500 font-medium">{formatTgl(row.id_transaksi)}</td><td className="py-3.5 pr-4 font-bold text-slate-800 capitalize">{row.nama_pelanggan || 'Anonim'}</td><td className="py-3.5 pr-4 font-black text-[#0f766e]">Rp {(Number(row.total_harga)||0).toLocaleString('id-ID')}</td><td className="py-3.5 pr-4">{getBadgeHTML(row.status_pesanan)}</td><td className="py-3.5 pr-4"><button className="text-[#0F766E] font-bold hover:underline text-sm outline-none">Detail</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}