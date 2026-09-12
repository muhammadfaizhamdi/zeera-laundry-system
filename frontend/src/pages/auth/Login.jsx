import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('zeera_token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Pemanggilan Real API ke Backend FastAPI
      const response = await fetch('http://127.0.0.1:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
      });
      
      const data = await response.json();

      if (response.ok && data.token) {
          localStorage.setItem('zeera_token', data.token);
          if (data.user) localStorage.setItem('zeera_user', JSON.stringify(data.user));
          navigate('/dashboard', { replace: true });
      } else {
          setError(data.detail || data.message || 'Login gagal! Periksa kembali Email dan Kata Sandi Anda.');
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('Gagal terhubung ke server backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans text-slate-800">
      <div className="w-full max-w-4xl min-h-[600px] bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-teal-900/20 overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white shrink-0 my-auto relative z-10">
        
        {/* Bagian Kiri */}
        <div className="bg-[#0f766e] p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#fd761a]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm mb-6 z-10">
            <img alt="Zeera Laundry Logo" className="w-28 h-28 object-cover rounded-2xl shadow-lg" src="/logo-zeera.jpg" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 z-10 tracking-tight leading-tight">Sistem Manajemen<br/>Zeera</h1>
          <p className="text-teal-100 z-10 max-w-xs text-sm leading-relaxed">Kelola operasional, pantau transaksi, dan tingkatkan efisiensi laundry.</p>
        </div>

        {/* Bagian Kanan (Form) */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1.5">Selamat Datang</h2>
            <p className="text-slate-500 text-sm">Silakan masuk untuk melanjutkan.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 transition-all duration-300">
            <div>
              <label className="block font-semibold text-slate-600 text-sm mb-1.5" htmlFor="email">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                </div>
                <input 
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E] transition-colors text-sm text-slate-800 outline-none" 
                  id="email" placeholder="nama@gmail.com" required type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 text-sm mb-1.5" htmlFor="password">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                </div>
                <input 
                  className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E] transition-colors text-sm text-slate-800 tracking-widest outline-none placeholder:tracking-widest" 
                  id="password" placeholder="••••••••" required type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] transition-colors focus:outline-none" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                {/* CHECKBOX BULAT SEMPURNA */}
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    id="remember-me" 
                    className="peer appearance-none w-4 h-4 border-2 border-slate-300 rounded-full checked:bg-[#0F766E] checked:border-[#0F766E] transition-all cursor-pointer bg-white" 
                  />
                  <span className="material-symbols-outlined absolute text-white text-[12px] font-bold opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Ingat saya</span>
              </label>
              <div className="text-sm">
                <Link className="font-bold text-[#0F766E] hover:text-teal-800 transition-colors" to="/lupa-sandi">Lupa sandi?</Link>
              </div>
            </div>

            <div className="pt-4">
              <button disabled={isLoading} className="w-full bg-[#0F766E] text-white rounded-full py-3 text-[15px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0" type="submit">
                {isLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span><span>Memeriksa...</span></>
                ) : (
                  <><span>Masuk</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun? <Link className="text-[#0F766E] font-bold hover:underline" to="/daftar-akun">Daftar di sini</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}