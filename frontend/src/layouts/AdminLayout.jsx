import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

export default function AdminLayout() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 w-full h-screen overflow-hidden font-body-md text-slate-800 relative">
      
      {/* Container Utama */}
      <div className="w-full h-full flex p-4 md:p-6 lg:p-8 gap-4 md:gap-6 relative">
        
        {/* Navigasi Desktop Kiri */}
        <Sidebar />

        {/* Konten Halaman */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          <Outlet />
          
          {/* Spacer khusus Mobile: Penahan agar konten tidak tenggelam di bawah MobileNav */}
          <div className="h-20 md:hidden w-full shrink-0"></div>
        </div>

      </div>

      {/* Navigasi Layar Sentuh Bawah */}
      <MobileNav />

    </div>
  );
}