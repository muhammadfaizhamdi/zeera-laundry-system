import React, { useState, useEffect } from 'react';

export default function DetailOmset() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({ omset: 0, tunai: 0, qris: 0 });
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];

  // Fungsi Filter Waktu Dummy (Harusnya pakai timestamp logic seperti sebelumnya)
  // Untuk mempercepat, anggap data selalu dirender
  useEffect(() => {
    // Simulasi Fetch
    const dummyData = [
      { id: 'TRX1710001', tanggal: '12 Okt 2026, 14:00', pelanggan: 'Budi Santoso', metode: 'Tunai', status: 'Lunas', nominal: 45000 },
      { id: 'TRX1710002', tanggal: '12 Okt 2026, 15:30', pelanggan: 'Siti Aminah', metode: 'QRIS', status: 'Lunas', nominal: 70000 },
    ];
    setData(dummyData);
    setTotal({ omset: 115000, tunai: 45000, qris: 70000 });
  }, [activeFilter]);

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Detail Omset</h1>
          <p className="text-slate-500 text-sm">Rincian pendapatan kotor berdasarkan metode pembayaran.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button className="bg-[#10b981] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">download</span> Export Excel
          </button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span> <span>{activeFilter}</span> <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
            {isDropdownOpen && (
              <ul className="absolute top-[calc(100%+8px)] right-0 w-[175px] bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden text-sm font-medium text-slate-600 p-2">
                {filters.map(f => (
                  <li key={f} onClick={() => { setActiveFilter(f); setIsDropdownOpen(false); }} className={`p-3 rounded-lg cursor-pointer flex justify-between ${activeFilter === f ? 'text-[#0f766e] bg-teal-50/50 font-bold' : 'hover:bg-slate-50'}`}>
                    <span>{f}</span> <span className={`material-symbols-outlined text-[18px] ${activeFilter === f ? '' : 'opacity-0'}`}>check</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        {['Total Omset', 'Uang Tunai', 'QRIS/Transfer'].map((title, i) => (
          <div key={title} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
            <span className="text-3xl font-black text-slate-800 mt-1">Rp {Object.values(total)[i].toLocaleString('id-ID')}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 overflow-hidden min-h-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
          <h3 className="font-bold text-slate-800 hidden md:block">Riwayat Pemasukan</h3>
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 transition-all" placeholder="Cari ID atau Nama..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll custom-scrollbar pr-2 min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider bg-white">
                <th className="py-4 pr-4 w-[20%]">ID Transaksi</th><th className="py-4 pr-4 w-[20%]">Tanggal</th><th className="py-4 pr-4 w-[20%]">Pelanggan</th><th className="py-4 pr-4 w-[15%]">Metode</th><th className="py-4 pr-4 w-[15%]">Status</th><th className="py-4 pr-4 w-[10%] text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {data.filter(d => d.pelanggan.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())).map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                  <td className="py-4 pr-4 font-bold text-slate-800">{row.id}</td><td className="py-4 pr-4 text-slate-500">{row.tanggal}</td><td className="py-4 pr-4 font-medium text-slate-700 capitalize">{row.pelanggan}</td><td className={`py-4 pr-4 font-semibold ${row.metode==='Tunai'?'text-emerald-600':'text-blue-600'}`}>{row.metode}</td><td className="py-4 pr-4"><span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-emerald-200">Lunas</span></td><td className="py-4 pr-4 font-bold text-right text-slate-800">Rp {row.nominal.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}