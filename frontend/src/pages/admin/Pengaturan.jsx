import React, { useState } from 'react';

export default function Pengaturan() {
  // State untuk mengontrol akordion mana yang terbuka
  const [openSetting, setOpenSetting] = useState(null);

  const toggleSetting = (settingName) => {
    setOpenSetting(openSetting === settingName ? null : settingName);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Header seragam text-3xl */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 relative z-10 border border-slate-100 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Pengaturan Sistem</h1>
          <p className="text-slate-500 font-medium">Konfigurasi master data profil, outlet, layanan, hingga hak akses pegawai.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pb-8">
        
        {/* KOLOM KIRI */}
        <div className="flex flex-col gap-6">
          {/* Profil */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleSetting('profil')}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>person</span></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Profil</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Konfigurasi Profil Utama Admin</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openSetting === 'profil' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openSetting === 'profil' && (
              <ul className="flex-col border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2">
                <li className="py-4 px-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Edit Profil</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
              </ul>
            )}
          </div>

          {/* Layanan */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleSetting('layanan')}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>local_laundry_service</span></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Layanan</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Konfigurasi Layanan & Harga</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openSetting === 'layanan' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openSetting === 'layanan' && (
              <ul className="flex-col border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2">
                <li className="py-4 px-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Manajemen Katalog Layanan</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
                <li className="py-4 px-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Manajemen Parfum</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
              </ul>
            )}
          </div>

          {/* Outlet */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleSetting('outlet')}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>storefront</span></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Outlet</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Konfigurasi Profil Outlet dan Jam Operasional</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openSetting === 'outlet' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openSetting === 'outlet' && (
              <ul className="flex-col border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2">
                <li className="py-4 px-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Profil Outlet & Jam Buka</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
                <li className="py-4 px-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Metode Pembayaran</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="flex flex-col gap-6">
          {/* Pegawai */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleSetting('pegawai')}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>badge</span></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Pegawai</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Kelola data dan role pegawai operasional</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openSetting === 'pegawai' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openSetting === 'pegawai' && (
              <ul className="flex-col border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2">
                <li className="py-4 px-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Konfigurasi Pegawai</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
              </ul>
            )}
          </div>

          {/* Keuangan */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleSetting('keuangan')}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Keuangan</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Kelola Pengeluaran Finansial</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openSetting === 'keuangan' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openSetting === 'keuangan' && (
              <ul className="flex-col border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2">
                <li className="py-4 px-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Kategori Pengeluaran</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
                <li className="py-4 px-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Koreksi Pengeluaran</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
              </ul>
            )}
          </div>

          {/* Printer */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleSetting('printer')}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>print</span></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Printer</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Kelola Printer dan Nota</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openSetting === 'printer' ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
            {openSetting === 'printer' && (
              <ul className="flex-col border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2">
                <li className="py-4 px-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Kelola Nota</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
                <li className="py-4 px-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item">
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#0f766e]">Kelola Permission</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                </li>
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}