import React, { useState, useEffect } from 'react';

export default function ModalDetailPesanan({ isOpen, onClose, order, onRefresh }) {
  const [status, setStatus] = useState('Antrian');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status_pesanan || 'Antrian');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSimpan = async () => {
    if (!window.confirm("Simpan perubahan pesanan ini?")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pesanan/${order.id_transaksi || order.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_pesanan: status,
          status_bayar: order.status_bayar,
          metode_pembayaran: order.metode_pembayaran,
          parfum: order.parfum,
          keterangan: order.keterangan,
          tracking_data: order.tracking_data
        })
      });
      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        alert("Gagal memperbarui status ke server.");
      }
    } catch (error) {
      alert("Kesalahan jaringan.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Parsing Data
  const formatRp = (num) => 'Rp ' + (Number(num) || 0).toLocaleString('id-ID');
  const inisial = (order.nama_pelanggan || 'An').substring(0, 2).toUpperCase();
  let items = [];
  try { items = JSON.parse(order.detail_layanan || '[]'); } catch (e) {}

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Detail Pesanan</h3>
            <p className="text-sm font-bold text-slate-400 mt-0.5 uppercase tracking-wider">ID: {order.id_transaksi}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors" title="Cetak Nota"><span className="material-symbols-outlined text-[20px]">print</span></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"><span className="material-symbols-outlined text-[22px]">close</span></button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#0f766e] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">{inisial}</div>
            <div>
              <p className="font-bold text-lg text-slate-800 leading-tight capitalize">{order.nama_pelanggan || 'Anonim'}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{order.no_whatsapp || '-'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Layanan Yang Dipesan</h4>
            <div className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col gap-2 shadow-sm">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">{item.icon || 'local_laundry_service'}</span></div>
                    <div><h3 className="font-bold text-slate-800 text-sm">{item.name}</h3><p className="text-[10px] font-bold text-slate-400">Qty: {item.qty} {item.unit}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#0f766e] text-sm">{formatRp(item.price * item.qty)}</p>
                    <p className="text-[10px] font-bold text-slate-400">Est: {item.est}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f766e]/5 p-5 rounded-2xl border border-[#0f766e]/10 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
              <span>Status Pembayaran</span>
              <span className={order.status_bayar === 'Lunas' ? 'text-emerald-600' : 'text-rose-600'}>{order.status_bayar}</span>
            </div>
            <div className="w-full h-px bg-[#0f766e]/20 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 text-lg">Total Tagihan</span>
              <span className="font-black text-[#0f766e] text-3xl tracking-tight">{formatRp(order.total_harga)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex gap-4 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-1/3 bg-slate-50 border border-slate-200 text-slate-800 font-black text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f766e]">
            <option value="Antrian">Antrian</option>
            <option value="Proses">Proses</option>
            <option value="Siap Ambil">Siap Ambil</option>
            <option value="Selesai">Selesai</option>
            <option value="Batal">Batal</option>
          </select>
          <button onClick={handleSimpan} disabled={isProcessing} className="flex-1 bg-[#0f766e] text-white font-bold py-3.5 rounded-xl hover:bg-teal-800 transition-all text-base shadow-lg shadow-teal-900/20 flex justify-center items-center gap-2">
            <span className={`material-symbols-outlined text-[22px] ${isProcessing ? 'animate-spin' : ''}`}>{isProcessing ? 'autorenew' : 'save'}</span> 
            {isProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}