import React, { useState, useEffect } from 'react';

export default function Pengeluaran() {
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];
  const [data, setData] = useState([]);

  useEffect(() => {
    const rawDB = JSON.parse(localStorage.getItem('pengeluaran_zeera') || '[]');
    // Filter rentang waktu sederhana untuk data lokal
    const filtered = rawDB.filter(item => {
      if (activeFilter === 'Semua Waktu' || !activeFilter) return true;
      let ts = new Date().getTime();
      if (item.id && item.id.startsWith('EXP-')) ts = parseInt(item.id.split('-')[1]);
      
      const date = new Date(ts);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (activeFilter === 'Hari Ini') return date >= today;
      if (activeFilter === 'Kemarin') {
          const y = new Date(today); y.setDate(y.getDate() - 1);
          return date >= y && date < today;
      }
      if (activeFilter === '7 Hari Terakhir') {
          const l7 = new Date(today); l7.setDate(l7.getDate() - 7);
          return date >= l7;
      }
      if (activeFilter === 'Bulan Ini') {
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      }
      if (activeFilter === 'Bulan Lalu') {
          let lm = today.getMonth() - 1; let y = today.getFullYear();
          if (lm < 0) { lm = 11; y--; }
          return date.getMonth() === lm && date.getFullYear() === y;
      }
      if (activeFilter === 'Tahun Ini') return date.getFullYear() === today.getFullYear();
      return true;
    });
    setData(filtered);
  }, [activeFilter]);

  // Kalkulasi 3 Kontainer KPI
  const totalPengeluaran = data.reduce((acc, curr) => acc + (Number(curr.nominal)||0), 0);
  const totalItem = data.length;
  
  let kategoriTerbesar = '-';
  if (data.length > 0) {
      const sums = {};
      data.forEach(p => {
          if(!sums[p.kategori]) sums[p.kategori] = 0;
          sums[p.kategori] += Number(p.nominal) || 0;
      });
      kategoriTerbesar = Object.keys(sums).reduce((a, b) => sums[a] > sums[b] ? a : b);
  }

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Pengeluaran</h1><p className="text-slate-500 font-medium">Catatan belanja operasional toko.</p></div>
        <div className="flex items-center gap-3 relative">
          <button className="bg-[#f43f5e] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-[20px]">add</span> Catat Pengeluaran</button>
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

      {/* 3 Kontainer KPI yang Hilang Sudah Dikembalikan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran</span><span className="text-3xl font-black text-rose-600 mt-1">Rp {totalPengeluaran.toLocaleString('id-ID')}</span></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori Terbesar</span><span className="text-3xl font-black text-slate-800 mt-1 uppercase">{kategoriTerbesar}</span></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Item</span><span className="text-3xl font-black text-slate-800 mt-1">{totalItem} Data</span></div>
      </div>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100"><tr className="text-slate-400 font-bold text-xs uppercase tracking-wider"><th className="py-4 pr-4 w-[20%]">Tanggal</th><th className="py-4 pr-4 w-[35%]">Keterangan</th><th className="py-4 pr-4 w-[25%]">Kategori</th><th className="py-4 pr-4 w-[20%] text-right">Nominal</th></tr></thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                {data.length === 0 ? <tr><td colSpan="4" className="text-center py-8 text-slate-500 font-medium">Tidak ada pengeluaran pada periode ini.</td></tr> : data.slice().reverse().map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors"><td className="py-3.5 pr-4 text-slate-500 font-medium">{d.tanggal}</td><td className="py-3.5 pr-4 font-bold text-slate-800">{d.keterangan}</td><td className="py-3.5 pr-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">{d.kategori}</span></td><td className="py-3.5 pr-4 font-black text-right text-rose-600">Rp {(Number(d.nominal)||0).toLocaleString('id-ID')}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}