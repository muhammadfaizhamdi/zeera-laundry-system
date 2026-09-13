import React, { useState } from 'react';
import { usePelangganData } from '../../../../hooks/usePelangganData';

export default function PelangganBaru() {
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];

  const { data, isLoading } = usePelangganData(activeFilter);
  // Data terbaru diurutkan dari yang paling akhir ditambahkan
  const sortedData = [...data].reverse();

  const formatTgl = (tgl) => {
    if (!tgl) return '-'; return new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Pelanggan Baru</h1><p className="text-slate-500 font-medium">Daftar pelanggan yang baru terdaftar di sistem.</p></div>
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
        <div className="relative w-full max-w-[340px] mb-6 shrink-0">
          <span className="material-symbols-outlined absolute left-4 top-2.5 w-4 h-4 text-slate-400">search</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} type="search" placeholder="Cari pelanggan..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100"><tr className="text-slate-400 font-bold text-xs uppercase tracking-wider"><th className="py-4 pr-4 w-[25%]">TANGGAL DAFTAR</th><th className="py-4 pr-4 w-[30%]">PELANGGAN</th><th className="py-4 pr-4 w-[25%]">NO. WA</th><th className="py-4 pr-4 w-[20%]">TOTAL TRX</th></tr></thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500">Memuat data API...</td></tr>
              ) : sortedData.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500">Belum ada pelanggan terdaftar.</td></tr>
              ) : sortedData.filter(d => {
                  // Deteksi dinamis nama dari API
                  const safeName = (d.nama_pelanggan || d.nama_lengkap || d.nama || '').toLowerCase();
                  const safePhone = (d.no_hp || d.no_wa || '');
                  return safeName.includes(search.toLowerCase()) || safePhone.includes(search);
              }).map((row, i) => {
                // Variabel aman untuk render
                const displayNama = row.nama_pelanggan || row.nama_lengkap || row.nama || 'Anonim';
                const displayNoWa = row.no_hp || row.no_wa || '-';
                
                return (
                  <tr key={row.id || i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pr-4 text-slate-500 font-medium">{formatTgl(row.created_at)}</td>
                    <td className="py-3.5 pr-4 font-bold text-slate-800 capitalize">{displayNama}</td>
                    <td className="py-3.5 pr-4 text-slate-500">{displayNoWa}</td>
                    <td className="py-3.5 pr-4 font-black text-[#0f766e]">{row.total_transaksi || 1} Pesanan</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}