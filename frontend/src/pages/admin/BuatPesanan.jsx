import React, { useState, useEffect } from 'react';

export default function BuatPesanan() {
  // ================= STATE MANAGEMENT =================
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchLayanan, setSearchLayanan] = useState('');

  const [cart, setCart] = useState([]);
  
  const [customers, setCustomers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustDropdown, setShowCustDropdown] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('belum_bayar');
  const [cashReceived, setCashReceived] = useState('');
  const [parfum, setParfum] = useState('-');
  const [keterangan, setKeterangan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:8000/api";
  
  // Icon Mapping
  const iconMap = { 
    "Paket": "local_laundry_service", "Kiloan Cuci Kering": "dry_cleaning", "Kiloan Setrika": "iron", 
    "Sepatu": "steps", "Bedcover": "bed", "Satuan": "checkroom", "Treatment": "wash", 
    "Boneka": "cruelty_free", "Delivery": "local_shipping", "Tidur": "king_bed", 
    "Lainnya": "more_horiz", "Karpet": "texture", "Alat Laundry": "soap", 
    "D'Paragon": "apartment", "Tas": "backpack", "Lebaran": "mosque", "Sandal": "snowshoeing", "Sarung": "chair" 
  };

  // ================= LIFECYCLE & API FETCH =================
  useEffect(() => {
    fetchLayanan();
    fetchPelanggan();
  }, []);

  const fetchLayanan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/layanan/`);
      const data = await response.json();
      
      let orderedCategories = [];
      const formattedData = data.map(item => {
        let cat = item.kategori || "Lainnya";
        if (!orderedCategories.includes(cat)) orderedCategories.push(cat);
        return { ...item, kategori: cat.trim(), qty: 1 }; // Default Qty 1
      });
      
      setCategories(['Semua', ...orderedCategories]);
      setServices(formattedData);
    } catch (error) {
      console.error("Gagal menarik data layanan:", error);
    }
  };

  const fetchPelanggan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pelanggan/`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Gagal menarik data pelanggan:", error);
    }
  };

  // ================= LOGIKA KERANJANG =================
  const addToCart = (service) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === service.id);
      if (existing) {
        return prevCart.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...service, qty: 1 }];
    });
  };

  const updateQty = (id, newQty) => {
    const qty = parseFloat(newQty);
    if (isNaN(qty) || qty <= 0) return;
    setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, qty: qty } : item));
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // ================= KALKULASI MATEMATIKA =================
  const grandTotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  const uangDiterima = parseInt(cashReceived.replace(/\D/g, '')) || 0;
  
  let sisaTagihan = grandTotal;
  let kembalian = 0;
  let dpAmount = 0;

  if (paymentMethod === 'Tunai') {
    if (uangDiterima >= grandTotal) {
      sisaTagihan = 0;
      kembalian = uangDiterima - grandTotal;
      dpAmount = grandTotal;
    } else {
      sisaTagihan = grandTotal - uangDiterima;
      dpAmount = uangDiterima;
    }
  } else if (paymentMethod === 'QRIS' || paymentMethod === 'Transfer BCA') {
    sisaTagihan = 0;
  }

  // ================= FILTER DATA =================
  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'Semua' || s.kategori === activeCategory;
    const matchSearch = s.nama_layanan.toLowerCase().includes(searchLayanan.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredCustomers = customers.filter(c => 
    c.nama_lengkap.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  // ================= GROUPING LAYANAN =================
  const groupedServices = filteredServices.reduce((acc, service) => {
    const categoryName = service.kategori || 'Lainnya';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(service);
    return acc;
  }, {});

  // ================= SUBMIT API =================
  const prosesPesanan = async () => {
    if (!selectedCustomer) return alert("Pilih pelanggan terlebih dahulu!");
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (paymentMethod === 'Tunai' && uangDiterima <= 0) return alert("Masukkan nominal uang diterima!");

    setIsProcessing(true);
    let finalLunasStatus = (sisaTagihan === 0 && paymentMethod !== 'belum_bayar') ? "Lunas" : "Belum Lunas";
    let metaPayload = { catatan: keterangan.trim(), diskon: 0, dp: dpAmount, uang_diterima: uangDiterima, kembalian: kembalian };

    const payload = {
      pelanggan_id: selectedCustomer.id,
      total_harga: grandTotal,
      status_bayar: finalLunasStatus,
      metode_pembayaran: paymentMethod !== 'belum_bayar' ? paymentMethod : null,
      parfum: parfum,
      keterangan: JSON.stringify(metaPayload),
      detail_layanan: JSON.stringify(cart.map(c => ({
        name: c.nama_layanan, price: c.harga, unit: c.satuan, qty: c.qty, est: c.estimasi_waktu, icon: iconMap[c.kategori] || "local_laundry_service"
      })))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/pesanan/`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Pesanan berhasil dibuat!");
        setCart([]); setKeterangan(''); setCashReceived(''); setPaymentMethod('belum_bayar'); setSelectedCustomer(null); setSearchCustomer('');
      } else {
        alert("Gagal memproses pesanan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex w-full h-full gap-4 md:gap-6 overflow-hidden">
      
      {/* ================= AREA KIRI: KATALOG LAYANAN ================= */}
      <main className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-white/50 p-6 md:p-8 h-full overflow-hidden">
        
        <header className="flex justify-between items-center mb-6 shrink-0 w-full gap-4">
          <h1 className="text-3xl font-extrabold text-slate-800 whitespace-nowrap">Katalog Layanan</h1>
          <div className="relative w-full max-w-[280px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              value={searchLayanan} onChange={(e) => setSearchLayanan(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766e] text-sm" 
              placeholder="Cari layanan..." type="text" 
            />
          </div>
        </header>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 mb-2 shrink-0 hide-scroll">
          {categories.map(cat => (
            <button 
              key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#0f766e] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Layanan */}
        <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar scroll-smooth">
          {services.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 mt-10">
              <span className="material-symbols-outlined animate-spin text-4xl mb-2 text-[#0f766e]">autorenew</span>
              <p className="text-sm font-bold">Terhubung ke Database...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.keys(groupedServices).map((categoryName, index) => (
                <div key={index} className="flex flex-col gap-3 shrink-0">
                  
                  {/* Judul Pemisah Kategori */}
                  <div className="px-2 mt-2 shrink-0">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{categoryName}</h2>
                  </div>

                  {/* Daftar Layanan di dalam Kategori Tersebut */}
                  {groupedServices[categoryName].map(service => (
                    <div key={service.id} onClick={() => addToCart(service)} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-[#0f766e]/30 transition-all cursor-pointer group shrink-0">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">{iconMap[service.kategori] || "local_laundry_service"}</span>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-slate-800 text-base">{service.nama_layanan}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{service.kategori}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-slate-100 ml-4">
                        <div className="text-right">
                          <p className="font-black text-[#0f766e] text-sm leading-tight">Rp {service.harga.toLocaleString('id-ID')}</p>
                          <p className="text-[10px] font-bold text-slate-400">/ {service.satuan} - {service.estimasi_waktu}</p>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#0f766e] group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ================= AREA KANAN: KERANJANG KASIR ================= */}
      <aside className="w-full md:w-[360px] flex-shrink-0 flex flex-col bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(8,112,184,0.08)] border border-slate-100 h-full overflow-hidden">
        
        {/* Header Keranjang & Pencarian Pelanggan */}
        <div className="p-5 pb-3 border-b border-slate-100 bg-white z-20">
          <h2 className="text-base font-bold text-slate-800 mb-2">Detail Pesanan</h2>
          <label className="text-sm font-bold text-slate-800 mb-2 block">Pilih Pelanggan</label>
          
          {!selectedCustomer ? (
            <div className="relative group w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input 
                value={searchCustomer} 
                onChange={(e) => { setSearchCustomer(e.target.value); setShowCustDropdown(true); }}
                onFocus={() => setShowCustDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustDropdown(false), 200)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766e] text-sm" 
                placeholder="Cari nama..." type="text" 
              />
              {showCustDropdown && searchCustomer && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredCustomers.map(cust => (
                    <div key={cust.id} onMouseDown={() => { setSelectedCustomer(cust); setSearchCustomer(''); }} className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-700">{cust.nama_lengkap}</span>
                      <span className="text-xs text-slate-400 font-medium">{cust.no_whatsapp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex pl-3 pr-4 py-2 bg-[#0f766e]/10 border border-[#0f766e]/20 rounded-xl items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-xs">
                  {selectedCustomer.nama_lengkap.substring(0,2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 leading-tight truncate w-32">{selectedCustomer.nama_lengkap}</span>
                  <span className="text-[10px] font-bold text-[#0f766e]">{selectedCustomer.no_whatsapp}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-red-500 transition-colors flex items-center" title="Ganti Pelanggan">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}
        </div>
        
        {/* List Item Keranjang */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 cart-scroll">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
              <p className="text-sm font-bold">Keranjang Kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col relative group">
                <button onClick={() => removeFromCart(item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full p-0.5 z-10">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <div className="pr-6 mb-1.5">
                  <h4 className="font-bold text-[13px] text-slate-800 leading-tight">{item.nama_layanan}</h4>
                  <span className="text-[11px] text-slate-400">Rp {item.harga.toLocaleString('id-ID')}/{item.satuan} &bull; <b className="text-[#0f766e]">Est: {item.estimasi_waktu}</b></span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <button onClick={() => updateQty(item.id, item.qty - 0.5)} className="w-6 h-6 flex items-center justify-center text-slate-500 rounded-md hover:bg-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <input 
                      type="number" step="any" value={item.qty} 
                      onChange={(e) => updateQty(item.id, e.target.value)} 
                      className="w-10 text-center bg-transparent border-none p-0 text-xs font-black focus:ring-0 text-slate-800 outline-none" 
                    />
                    <button onClick={() => updateQty(item.id, item.qty + 0.5)} className="w-6 h-6 flex items-center justify-center text-slate-500 rounded-md hover:bg-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                  <span className="font-black text-[#0f766e] text-sm">Rp {(item.harga * item.qty).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Form Pembayaran Akhir */}
        <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-10 flex flex-col gap-3.5">
          
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 block">Parfum</label>
              <select value={parfum} onChange={(e) => setParfum(e.target.value)} style={{appearance: 'none'}} className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0f766e] outline-none cursor-pointer">
                <option value="Snappy">Snappy</option>
                <option value="Sakura">Sakura</option>
                <option value="Akasia">Akasia</option>
                <option value="-">Tanpa Parfum</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 block">Metode Bayar</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{appearance: 'none'}} className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0f766e] outline-none cursor-pointer">
                <option value="belum_bayar">Belum Bayar</option>
                <option value="Tunai">Tunai</option>
                <option value="Transfer BCA">Transfer BCA</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          </div>
          
          <input 
            value={keterangan} onChange={(e) => setKeterangan(e.target.value)} 
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0f766e]/50 outline-none" 
            placeholder="Catatan/Keterangan tambahan..." type="text" 
          />
          
          {paymentMethod === 'Tunai' && (
            <div className="mt-1 pt-3 border-t border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 block">Uang Diterima (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input 
                  value={cashReceived} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setCashReceived(val ? new Intl.NumberFormat('id-ID').format(val) : '');
                  }} 
                  type="text" className="w-full bg-white border-2 border-blue-500/60 text-slate-800 text-xl font-black rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm" placeholder="0" 
                />
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col">
            <div className="flex justify-between items-center mb-2 text-sm font-bold">
              <span className="text-slate-500">Total Tagihan</span>
              <span className="text-slate-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
            
            {paymentMethod === 'Tunai' && uangDiterima > 0 && uangDiterima < grandTotal && (
              <div className="flex justify-between items-center mb-2 text-sm font-bold">
                <span className="text-indigo-500">Uang Muka (DP)</span>
                <span className="text-indigo-600">Rp {uangDiterima.toLocaleString('id-ID')}</span>
              </div>
            )}
            
            {paymentMethod === 'Tunai' && kembalian > 0 && (
              <div className="flex justify-between items-center mb-3 text-sm font-bold">
                <span className="text-[#f97316]">Kembalian</span>
                <span className="text-[#f97316]">Rp {kembalian.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between items-end mb-4 pt-3 border-t border-slate-200 border-dashed">
              <span className="text-[#0f766e] font-extrabold text-sm">{sisaTagihan === 0 && paymentMethod !== 'belum_bayar' ? 'Status Tagihan' : 'Sisa Tagihan'}</span>
              <span className="text-2xl font-black text-[#0f766e] tracking-tight">{sisaTagihan === 0 && paymentMethod !== 'belum_bayar' ? 'LUNAS' : `Rp ${sisaTagihan.toLocaleString('id-ID')}`}</span>
            </div>
            
            <button 
              onClick={prosesPesanan} disabled={isProcessing}
              className={`w-full text-white font-bold text-lg py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-400' : 'bg-[#f97316] hover:bg-[#ea580c] shadow-orange-500/30 active:scale-[0.98]'}`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isProcessing ? 'animate-spin' : ''}`}>{isProcessing ? 'autorenew' : 'task_alt'}</span> 
              {isProcessing ? 'Memproses...' : 'Simpan Pesanan'}
            </button>
          </div>

        </div>
      </aside>
    </div>
  );
}