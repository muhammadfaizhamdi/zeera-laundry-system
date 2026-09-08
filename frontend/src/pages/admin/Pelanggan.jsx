import React, { useState, useEffect } from 'react';

export default function Pelanggan() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ id: '', nama_lengkap: '', no_whatsapp: '', alamat: '' });

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const fetchPelanggan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pelanggan/`);
      const data = await response.json();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPelanggan(); }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredCustomers(customers.filter(c => 
      (c.nama_lengkap || '').toLowerCase().includes(lower) || 
      (c.no_whatsapp || '').toLowerCase().includes(lower) || 
      (c.alamat || '').toLowerCase().includes(lower)
    ));
  }, [search, customers]);

  const handleEdit = (cust) => {
    setFormData({ id: cust.id, nama_lengkap: cust.nama_lengkap, no_whatsapp: cust.no_whatsapp, alamat: cust.alamat || '' });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ id: '', nama_lengkap: '', no_whatsapp: '', alamat: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus pelanggan "${nama}"? Data tidak bisa dikembalikan!`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/pelanggan/${id}`, { method: "DELETE" });
        if (response.ok) fetchPelanggan();
        else alert("Gagal menghapus pelanggan. Mungkin masih terikat pesanan.");
      } catch (e) { alert("Kesalahan jaringan."); }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nama_lengkap || !formData.no_whatsapp) return alert("Nama dan WhatsApp wajib diisi!");
    
    setIsSaving(true);
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `${API_BASE_URL}/pelanggan/${formData.id}` : `${API_BASE_URL}/pelanggan/`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_lengkap: formData.nama_lengkap, no_whatsapp: formData.no_whatsapp, alamat: formData.alamat })
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchPelanggan();
      } else { alert("Gagal menyimpan data."); }
    } catch (e) { alert("Kesalahan jaringan."); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm p-6 md:p-8 border border-slate-100 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Data Pelanggan</h1>
          <p className="text-slate-500 font-medium">Kelola data pelanggan dan riwayat transaksi.</p>
        </div>
        <button onClick={handleAdd} className="bg-[#f97316] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center whitespace-nowrap shrink-0">
          <span className="material-symbols-outlined font-bold text-lg">add</span> Tambah Pelanggan
        </button>
      </header>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] overflow-hidden min-h-0 p-6 md:p-8 relative z-10">
        <div className="flex justify-between items-center gap-6 mb-6 w-full">
          <div className="relative w-full md:w-80 lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-full border border-slate-200 text-sm outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" placeholder="Cari nama, No. WA..." type="text" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="border-b-2 border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <th className="text-left pr-8 whitespace-nowrap py-4">PELANGGAN</th>
                <th className="text-left pr-8 whitespace-nowrap py-4">NO. WHATSAPP</th>
                <th className="text-left pr-8 whitespace-nowrap py-4">ALAMAT</th>
                <th className="text-left pr-8 whitespace-nowrap py-4">TRANSAKSI</th>
                <th className="text-left pr-8 whitespace-nowrap py-4">TOTAL BELANJA</th>
                <th className="text-left w-[115px] pr-8 whitespace-nowrap py-4">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500"><span className="material-symbols-outlined animate-spin text-3xl mb-2 text-[#0f766e]">autorenew</span><p>Memuat data...</p></td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Tidak ada pelanggan.</td></tr>
              ) : (
                filteredCustomers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                    <td className="text-left pr-8 whitespace-nowrap py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {p.nama_lengkap.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{p.nama_lengkap}</span>
                    </td>
                    <td className="text-left pr-8 whitespace-nowrap py-3.5">{p.no_whatsapp}</td>
                    <td className="text-left pr-8 whitespace-nowrap py-3.5 truncate max-w-[200px]">{p.alamat || '-'}</td>
                    <td className="text-left pr-8 whitespace-nowrap py-3.5"><span className="font-bold text-sm text-[#0f766e]">{p.total_transaksi || 0} Pesanan</span></td>
                    <td className="text-left pr-8 whitespace-nowrap py-3.5 font-bold text-slate-700">Rp {(p.total_omset || 0).toLocaleString('id-ID')}</td>
                    <td className="text-left pr-8 whitespace-nowrap py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                        <button onClick={() => handleDelete(p.id, p.nama_lengkap)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{formData.id ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h3>
                <p className="text-xs text-slate-500 mt-1">Data akan tersimpan di sistem</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 max-h-[60vh]">
              <form className="space-y-5" onSubmit={handleSave}>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nama Lengkap *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">person</span>
                    <input value={formData.nama_lengkap} onChange={e=>setFormData({...formData, nama_lengkap: e.target.value})} type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nomor WhatsApp *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">call</span>
                    <input value={formData.no_whatsapp} onChange={e=>setFormData({...formData, no_whatsapp: e.target.value})} type="number" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Alamat Lengkap</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[18px]">location_on</span>
                    <textarea value={formData.alamat} onChange={e=>setFormData({...formData, alamat: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f766e] outline-none min-h-[80px]"></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-2 gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="w-full bg-[#0f766e] text-white font-bold py-3 rounded-xl hover:bg-teal-800 transition-all text-sm shadow-md">{isSaving ? 'Memproses...' : 'Simpan Data'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}