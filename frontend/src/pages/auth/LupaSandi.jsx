import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LupaSandi() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert('Berhasil! Tautan reset kata sandi telah dikirim ke email: ' + email);
      navigate('/login');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans text-slate-800">
      <div className="w-full max-w-4xl min-h-[600px] bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-teal-900/20 overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white shrink-0 my-auto relative z-10">
        
        {/* Bagian Kiri */}
        <div className="bg-[#0f766e] p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#fd761a]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm mb-6 z-10">
            <img alt="Zeera Laundry Logo" className="w-28 h-28 object-cover rounded-2xl shadow-lg" src="/logo-zeera.jpg"/>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 z-10 tracking-tight leading-tight">Sistem Manajemen<br/>Zeera</h1>
          <p className="text-teal-100 z-10 max-w-xs text-sm leading-relaxed">Kelola operasional, pantau transaksi, dan tingkatkan efisiensi laundry.</p>
        </div>

        {/* Bagian Kanan (Form) */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lupa Kata Sandi?</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mereset kata sandi Anda.</p>
          </div>
          <form onSubmit={handleForgot} className="space-y-6">
            <div>
              <label className="block font-semibold text-slate-600 text-sm mb-1.5" htmlFor="email">Alamat Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                <input 
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E] transition-colors text-sm text-slate-800 outline-none" 
                  id="email" placeholder="nama@email.com" required type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-4">
              <button disabled={isLoading} className="w-full bg-[#0F766E] text-white rounded-full py-3 text-[15px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:hover:translate-y-0" type="submit">
                {isLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span><span>Memproses...</span></>
                ) : (
                  <><span>Kirim Tautan Reset</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                )}
              </button>
            </div>
          </form>
          <div className="mt-8 flex justify-center">
            <Link className="inline-flex items-center gap-1.5 font-semibold text-[#0F766E] hover:text-teal-800 transition-colors group p-2 -m-2 rounded-lg hover:bg-slate-50" to="/login">
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}