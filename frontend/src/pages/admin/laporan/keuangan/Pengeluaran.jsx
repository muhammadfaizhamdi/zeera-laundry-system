import React, { useState } from 'react';
export default function Pengeluaran() {
   // ... (Identik dengan format di atas, tambahkan state untuk Modal "Catat Pengeluaran")
  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Pengeluaran</h1><p className="text-slate-500 text-sm">Catatan belanja operasional toko.</p></div>
        <button className="bg-[#f43f5e] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all">Catat Pengeluaran</button>
      </header>
      {/* ... Sisa grid & table */}
    </div>
  );
}