import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem('zeera_token');
      localStorage.removeItem('zeera_user');
      navigate('/login');
    }
  };

  return (
    <aside className="hidden md:flex w-64 bg-[#0f766e] text-white rounded-[2rem] p-6 flex-col h-full shadow-2xl z-40 shrink-0">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm mb-8">
        <img 
          alt="Zeera Laundry Logo" 
          src="/logo-zeera.jpg" 
          className="w-11 h-11 flex-shrink-0 object-cover bg-white rounded-[12px] p-1.5 shadow-md"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/44?text=ZL' }} 
        />
        <span className="font-black text-xl text-white tracking-wide whitespace-nowrap">
          Zeera Admin
        </span>
      </div>

      {/* Menu Navigasi Utama */}
      <nav className="flex-1 flex flex-col gap-2">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `rounded-xl p-3 flex items-center gap-3 transition-all ${isActive ? 'bg-white/20 font-bold text-white shadow-sm' : 'text-teal-100 hover:bg-white/10 font-medium'}`}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>dashboard</span>
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink 
          to="/buat-pesanan" 
          className={({ isActive }) => `rounded-xl p-3 flex items-center gap-3 transition-all ${isActive ? 'bg-white/20 font-bold text-white shadow-sm' : 'text-teal-100 hover:bg-white/10 font-medium'}`}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>add_shopping_cart</span>
              Buat Pesanan
            </>
          )}
        </NavLink>

        <NavLink 
          to="/pesanan" 
          className={({ isActive }) => `rounded-xl p-3 flex items-center gap-3 transition-all ${isActive ? 'bg-white/20 font-bold text-white shadow-sm' : 'text-teal-100 hover:bg-white/10 font-medium'}`}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>receipt_long</span>
              Pesanan
            </>
          )}
        </NavLink>

        <NavLink 
          to="/pelanggan" 
          className={({ isActive }) => `rounded-xl p-3 flex items-center gap-3 transition-all ${isActive ? 'bg-white/20 font-bold text-white shadow-sm' : 'text-teal-100 hover:bg-white/10 font-medium'}`}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>group</span>
              Pelanggan
            </>
          )}
        </NavLink>

        <NavLink 
          to="/laporan" 
          className={({ isActive }) => `rounded-xl p-3 flex items-center gap-3 transition-all ${isActive ? 'bg-white/20 font-bold text-white shadow-sm' : 'text-teal-100 hover:bg-white/10 font-medium'}`}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>bar_chart</span>
              Laporan
            </>
          )}
        </NavLink>
      </nav>

      {/* Pengaturan & Logout */}
      <div className="mt-auto pt-6 border-t border-white/20 flex flex-col gap-2">
        <NavLink 
          to="/pengaturan" 
          className={({ isActive }) => `w-full rounded-xl p-3 flex items-center gap-3 transition-all ${isActive ? 'bg-white/20 font-bold text-white shadow-sm' : 'text-teal-100 hover:bg-white/10 hover:text-white font-medium'}`}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>settings</span>
              Pengaturan
            </>
          )}
        </NavLink>

        <button 
          onClick={handleLogout} 
          className="w-full text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-all p-3 flex items-center gap-3 font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          Keluar
        </button>
      </div>

    </aside>
  );
}