import React, { useState } from 'react';
import { usePesananData } from '../../../../hooks/usePesananData';

export default function DetailOmset() {
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];

  const { data, isLoading } = usePesananData(activeFilter);
  
  // Kalkulasi Keuangan
  const validPemasukan = data.filter(p => p.status_pesanan !== 'Batal');
  let totalOmset = 0, totalTunai = 0, totalQRIS = 0;
  
  validPemasukan.forEach(p => {
      const harga = Number(p.total_harga) || 0;
      totalOmset += harga;
      
      let metode = 'Tunai';
      try {
          if (p.keterangan && p.keterangan.startsWith('{')) {
              const info = JSON.parse(p.keterangan);
              if (info.metode) metode = info.metode;
          }
      } catch(e) {}
      
      p.metodeBayar = metode;
      if (metode === 'Tunai') totalTunai += harga; else totalQRIS += harga;
  });

  const formatTgl = (idTrx) => {
    if(!idTrx) return '-'; return new Date(parseInt(idTrx.substring(3, 13)) * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div><h1 className="text-3xl font-extrabold text-slate-800 mb-1">Detail Omset</h1><p className="text-slate-500 font-medium">Rincian pendapatan kotor berdasarkan metode pembayaran.</p></div>
        <div className="flex items-center gap-3 relative">
          <button className="bg-[#10b981] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-[20px]">download</span> Export Excel</button>
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
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omset</span><span className="text-3xl font-black text-slate-800 mt-1">Rp {totalOmset.toLocaleString('id-ID')}</span></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uang Tunai</span><span className="text-3xl font-black text-slate-800 mt-1">Rp {totalTunai.toLocaleString('id-ID')}</span></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(8,112,184,0.08)] flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">QRIS/Transfer</span><span className="text-3xl font-black text-slate-800 mt-1">Rp {totalQRIS.toLocaleString('id-ID')}</span></div>
      </div>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8">
        <div className="relative w-full max-w-[340px] mb-6 shrink-0">
          <span className="material-symbols-outlined absolute left-4 top-2.5 w-4 h-4 text-slate-400">search</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} type="search" placeholder="Cari pesanan..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100"><tr className="text-slate-400 font-bold text-xs uppercase tracking-wider"><th className="py-4 pr-4 w-[20%]">ID Transaksi</th><th className="py-4 pr-4 w-[25%]">Tanggal</th><th className="py-4 pr-4 w-[25%]">Pelanggan</th><th className="py-4 pr-4 w-[15%]">Metode</th><th className="py-4 pr-4 w-[15%] text-right">Nominal</th></tr></thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {isLoading ? <tr><td colSpan="5" className="py-8 text-center text-slate-500">Memuat data API...</td></tr> : validPemasukan.filter(d => (d.nama_pelanggan||'').toLowerCase().includes(search.toLowerCase()) || d.id_transaksi.toLowerCase().includes(search.toLowerCase())).map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                  <td className="py-3.5 pr-4 font-bold text-slate-800">{row.id_transaksi}</td><td className="py-3.5 pr-4 text-slate-500 font-medium">{formatTgl(row.id_transaksi)}</td><td className="py-3.5 pr-4 font-bold text-slate-800 capitalize">{row.nama_pelanggan || 'Anonim'}</td><td className={`py-3.5 pr-4 font-black ${row.metodeBayar==='Tunai'?'text-emerald-600':'text-blue-600'}`}>{row.metodeBayar}</td><td className="py-3.5 pr-4 font-black text-right text-[#0f766e]">Rp {(Number(row.total_harga)||0).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}