import { NavLink } from 'react-router-dom';

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 rounded-t-2xl bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-8px_32px_rgba(15,118,110,0.1)] flex justify-around items-center px-4 py-3 pb-safe">
      
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `flex flex-col items-center justify-center w-1/4 transition-colors ${isActive ? 'bg-[#0f766e]/10 text-[#0f766e] rounded-xl px-4 py-2 animate-pulse' : 'text-slate-400 hover:text-[#0f766e]'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined mb-1" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>dashboard</span>
            <span className="font-bold text-[10px]">Dashboard</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/buat-pesanan"
        className={({ isActive }) => `flex flex-col items-center justify-center w-1/4 transition-colors ${isActive ? 'bg-[#0f766e]/10 text-[#0f766e] rounded-xl px-4 py-2 animate-pulse' : 'text-slate-400 hover:text-[#0f766e]'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined mb-1" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>add_shopping_cart</span>
            <span className="font-bold text-[10px]">Pesanan</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/pelanggan"
        className={({ isActive }) => `flex flex-col items-center justify-center w-1/4 transition-colors ${isActive ? 'bg-[#0f766e]/10 text-[#0f766e] rounded-xl px-4 py-2 animate-pulse' : 'text-slate-400 hover:text-[#0f766e]'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined mb-1" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>group</span>
            <span className="font-bold text-[10px]">Pelanggan</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/laporan"
        className={({ isActive }) => `flex flex-col items-center justify-center w-1/4 transition-colors ${isActive ? 'bg-[#0f766e]/10 text-[#0f766e] rounded-xl px-4 py-2 animate-pulse' : 'text-slate-400 hover:text-[#0f766e]'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined mb-1" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>bar_chart</span>
            <span className="font-bold text-[10px]">Laporan</span>
          </>
        )}
      </NavLink>

    </nav>
  );
}