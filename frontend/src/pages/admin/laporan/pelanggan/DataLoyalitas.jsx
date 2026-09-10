import React, { useState } from 'react';

export default function DataLoyalitas() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Data Loyalitas (Top Spender)</h1><p className="text-slate-500 font-medium">Peringkat pelanggan berdasarkan total omset sepanjang masa.</p></div>
        <button className="bg-[#10b981] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-[20px]">download</span> Export Excel</button>
      </header>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8">
        <div className="relative w-full max-w-[340px] mb-6 shrink-0">
          <span className="material-symbols-outlined absolute left-4 top-2.5 w-4 h-4 text-slate-400">search</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} type="search" placeholder="Cari pelanggan..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100">
              <tr className="text-slate-400 font-bold text-xs uppercase tracking-wider"><th className="py-4 pr-4 w-[10%] text-center">RANK</th><th className="py-4 pr-4 w-[25%]">PELANGGAN</th><th className="py-4 pr-4 w-[20%]">TOTAL TRX</th><th className="py-4 pr-4 w-[25%]">TOTAL OMSET</th><th className="py-4 pr-4 w-[20%]">LEVEL</th></tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-3.5 pr-4 text-center font-black text-amber-500 text-lg">#1</td><td className="py-3.5 pr-4 font-bold text-slate-800 capitalize">Budi Santoso</td><td className="py-3.5 pr-4 text-slate-500 font-medium">25 Pesanan</td><td className="py-3.5 pr-4 font-black text-[#0f766e]">Rp 3.000.000</td><td className="py-3.5 pr-4"><span className="inline-flex items-center bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-amber-200">👑 Gold Member</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}