import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulasi pemanggilan API Login (Nanti diganti dengan fetch ke FastAPI)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        // Simpan token/sesi ke memori browser
        localStorage.setItem('zeera_token', 'valid_token_123');
        localStorage.setItem('zeera_user', JSON.stringify({ nama: 'Admin Zeera', role: 'admin' }));
        
        // Arahkan ke dashboard
        navigate('/dashboard', { replace: true });
      } else {
        setError('Username atau password salah!');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Ornamen Latar Belakang (Glassmorphism) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Kontainer Form Login */}
      <div className="relative w-full max-w-md p-8 md:p-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-white">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4 border border-slate-50 overflow-hidden">
            <img src="/logo-zeera.jpg" alt="Zeera Laundry" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block';}} />
            <span className="material-symbols-outlined text-4xl text-[#0f766e] hidden">local_laundry_service</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Zeera Laundry</h1>
          <p className="text-slate-500 font-medium mt-1">Sistem Manajemen Operasional</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 transition-all"
                placeholder="Masukkan username..." 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 transition-all"
                placeholder="Masukkan password..." 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0f766e] text-white font-bold rounded-2xl py-4 mt-2 shadow-lg shadow-teal-600/30 hover:bg-[#0d645e] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin">autorenew</span>
            ) : (
              <>Masuk ke Sistem <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}