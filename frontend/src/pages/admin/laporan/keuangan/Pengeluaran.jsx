import React, { useState, useEffect } from 'react';

export default function Pengeluaran() {
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];
  const [data, setData] = useState([]);

  useEffect(() => {
    const rawDB = JSON.parse(localStorage.getItem('pengeluaran_zeera') || '[]');
    // Filter sederhana untuk demo (Bisa disempurnakan dengan parse Tanggal ID)
    setData(rawDB);
  }, [activeFilter]);

  const totalPengeluaran = data.reduce((acc, curr) => acc + (Number(curr.nominal)||0), 0);

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Pengeluaran</h1><p className="text-slate-500 font-medium">Catatan belanja operasional toko.</p></div>
        <div className="flex items-center gap-3 relative">
          <button className="bg-[#f43f5e] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-[20px]">add</span> Catat Pengeluaran</button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"><span className="material-symbols-outlined text-[20px]">calendar_today</span> <span>{activeFilter}</span> <span className="material-symbols-outlined text-[20px]">expand_more</span></button>
            {isDropdownOpen && (
              <ul className="absolute top-[calc(100%+8px)] right-0 w-[175px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-sm font-medium text-slate-600 p-2 z-50">
                {filters.map(f => (<li key={f} onClick={() => { setActiveFilter(f); setIsDropdownOpen(false); }} className={`p-3 rounded-lg cursor-pointer flex justify-between ${activeFilter === f ? 'text-[#0f766e] bg-teal-50/50 font-bold' : 'hover:bg-slate-50'}`}><span>{f}</span> <span className={`material-symbols-outlined text-[18px] ${activeFilter === f ? '' : 'opacity-0'}`}>check</span></li>))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran</span><span className="text-3xl font-black text-rose-600 mt-1">Rp {totalPengeluaran.toLocaleString('id-ID')}</span></div>
      </div>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100"><tr className="text-slate-400 font-bold text-xs uppercase tracking-wider"><th className="py-4 pr-4 w-[20%]">Tanggal</th><th className="py-4 pr-4 w-[35%]">Keterangan</th><th className="py-4 pr-4 w-[25%]">Kategori</th><th className="py-4 pr-4 w-[20%] text-right">Nominal</th></tr></thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                {data.length === 0 ? <tr><td colSpan="4" className="text-center py-8 text-slate-500">Tidak ada pengeluaran.</td></tr> : data.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors"><td className="py-3.5 pr-4 text-slate-500 font-medium">{d.tanggal}</td><td className="py-3.5 pr-4 font-bold text-slate-800">{d.keterangan}</td><td className="py-3.5 pr-4 font-semibold text-rose-600">{d.kategori}</td><td className="py-3.5 pr-4 font-black text-right text-rose-600">Rp {(Number(d.nominal)||0).toLocaleString('id-ID')}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}