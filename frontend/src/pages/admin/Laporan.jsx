import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Inisialisasi Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Laporan() {
  const [activeFilter, setActiveFilter] = useState('Bulan Ini');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCard, setOpenCard] = useState(null); // State untuk akordion menu bawah

  // Dummy State untuk menahan angka (nanti dikoneksikan ke API seperti Dashboard)
  const [stats, setStats] = useState({
    omset: 0, pendapatan: 0, pengeluaran: 0, masuk: 0, selesai: 0, batal: 0
  });

  const filters = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];

  const toggleAccordion = (cardName) => {
    setOpenCard(openCard === cardName ? null : cardName);
  };

  // Konfigurasi Data Chart.js React
  const chartData = {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        label: 'Pemasukan (Rp)',
        data: [100000, 250000, 150000, 400000, 300000, 500000, 450000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: '#10b981'
      },
      {
        label: 'Pengeluaran (Rp)',
        data: [50000, 100000, 50000, 200000, 100000, 150000, 100000],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 3, borderDash: [5, 5], tension: 0.4, fill: true, pointBackgroundColor: '#f43f5e'
      }
    ]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'Inter', weight: 'bold' } } } },
    scales: { 
      y: { beginAtZero: true, grid: { borderDash: [4, 4] }, ticks: { callback: (value) => 'Rp ' + (value/1000) + 'k' } },
      x: { grid: { display: false } } 
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0 relative z-50">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Laporan Bisnis</h1>
          <p className="text-slate-500 font-medium">Ringkasan performa dan data keuangan laundry Anda.</p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <button className="bg-[#10b981] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">print</span>
            <span className="hidden md:inline">Cetak Ringkasan</span>
          </button>

          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span>{activeFilter}</span>
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-[175px] bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <ul className="text-sm font-medium text-slate-600 p-2">
                  {filters.map(filter => (
                    <li key={filter} onClick={() => { setActiveFilter(filter); setIsDropdownOpen(false); }} className={`p-3 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${activeFilter === filter ? 'text-[#0f766e] bg-teal-50/50 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span>{filter}</span>
                      <span className={`material-symbols-outlined text-[18px] ${activeFilter === filter ? '' : 'opacity-0'}`}>check</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
        <Link to="/laporan/keuangan/detail-omset" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md group">
          <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"><span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>payments</span></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Pemasukan (Lunas+DP)</p>
            <p className="text-2xl font-black text-slate-800 leading-none">Rp {stats.omset.toLocaleString('id-ID')}</p>
          </div>
        </Link>
        <Link to="/laporan/keuangan/pendapatan-bersih" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md group">
          <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-blue-100"><span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Pendapatan Bersih</p>
            <p className="text-2xl font-black text-slate-800 leading-none">Rp {stats.pendapatan.toLocaleString('id-ID')}</p>
          </div>
        </Link>
        <Link to="/laporan/keuangan/pengeluaran" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md group">
          <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center bg-rose-50 text-rose-600 group-hover:bg-rose-100"><span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>receipt_long</span></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Pengeluaran</p>
            <p className="text-2xl font-black text-slate-800 leading-none">Rp {stats.pengeluaran.toLocaleString('id-ID')}</p>
          </div>
        </Link>
        <Link to="/laporan/transaksi/transaksi-masuk" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md group">
          <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"><span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Transaksi Aktif</p>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats.masuk}</p>
          </div>
        </Link>
        <Link to="/laporan/transaksi/transaksi-selesai" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md group">
          <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center bg-orange-50 text-orange-600 group-hover:bg-orange-100"><span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>outbox</span></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Pesanan Selesai</p>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats.selesai}</p>
          </div>
        </Link>
        <Link to="/laporan/transaksi/transaksi-batal" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md group">
          <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center bg-slate-100 text-slate-500 group-hover:bg-slate-200"><span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>cancel</span></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Transaksi Batal</p>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats.batal}</p>
          </div>
        </Link>
      </div>

      {/* Grafik */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white shadow-sm mb-8 flex flex-col relative w-full">
        <h3 className="font-extrabold text-lg text-slate-800 mb-4">Grafik Arus Kas <span className="text-slate-400 font-medium text-sm ml-1">({activeFilter})</span></h3>
        <div className="relative w-full h-[250px] md:h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Direktori Laporan */}
      <div className="flex flex-col gap-4 mt-0 mb-8">
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Detail Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Akordion Transaksi */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start cursor-pointer w-full" onClick={() => toggleAccordion('transaksi')}>
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>swap_horizontal_circle</span></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Laporan Transaksi</h3>
                <p className="text-sm text-slate-500 mb-2">Semua data transaksi masuk, selesai, dan batal.</p>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openCard === 'transaksi' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openCard === 'transaksi' && (
              <ul className="w-full border-t border-slate-100 pt-4 mt-2 space-y-3 text-sm text-slate-600 font-medium animate-in fade-in slide-in-from-top-2">
                <Link to="/laporan/transaksi/transaksi-masuk" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-[20px]">add_circle</span>Transaksi Masuk</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
                <Link to="/laporan/transaksi/transaksi-selesai" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>Transaksi Selesai</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
                <Link to="/laporan/transaksi/transaksi-batal" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-rose-500 text-[20px]">cancel</span>Transaksi Batal</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
              </ul>
            )}
          </div>

          {/* Akordion Keuangan */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start cursor-pointer w-full" onClick={() => toggleAccordion('keuangan')}>
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>monitoring</span></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Laporan Keuangan</h3>
                <p className="text-sm text-slate-500 mb-2">Detail omset, pendapatan bersih, dan pengeluaran.</p>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openCard === 'keuangan' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openCard === 'keuangan' && (
              <ul className="w-full border-t border-slate-100 pt-4 mt-2 space-y-3 text-sm text-slate-600 font-medium animate-in fade-in slide-in-from-top-2">
                <Link to="/laporan/keuangan/detail-omset" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-orange-500 text-[20px]">payments</span>Detail Omset</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
                <Link to="/laporan/keuangan/pendapatan-bersih" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-orange-500 text-[20px]">account_balance_wallet</span>Pendapatan Bersih</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
                <Link to="/laporan/keuangan/pengeluaran" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-rose-500 text-[20px]">receipt_long</span>Pengeluaran</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
              </ul>
            )}
          </div>

          {/* Akordion Pelanggan */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start cursor-pointer w-full" onClick={() => toggleAccordion('pelanggan')}>
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>group</span></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Laporan Pelanggan</h3>
                <p className="text-sm text-slate-500 mb-2">Pertumbuhan pelanggan, loyalitas, dan detail.</p>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openCard === 'pelanggan' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openCard === 'pelanggan' && (
              <ul className="w-full border-t border-slate-100 pt-4 mt-2 space-y-3 text-sm text-slate-600 font-medium animate-in fade-in slide-in-from-top-2">
                <Link to="/laporan/pelanggan/pelanggan-baru" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-500 text-[20px]">person_add</span>Pelanggan Baru</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
                <Link to="/laporan/pelanggan/pelanggan-aktif" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-500 text-[20px]">how_to_reg</span>Pelanggan Aktif</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
                <Link to="/laporan/pelanggan/data-loyalitas" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-500 text-[20px]">loyalty</span>Data Loyalitas</span><span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span></Link>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}