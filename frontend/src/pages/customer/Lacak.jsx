import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Lacak() {
  const [searchParams] = useSearchParams();
  const [trxId, setTrxId] = useState(searchParams.get('trx') || '');
  const [isScanning, setIsScanning] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (searchParams.get('trx')) {
      handleTrack(searchParams.get('trx'));
    }
  }, [searchParams]);

  const handleTrack = async (idToTrack = trxId) => {
    if (!idToTrack.trim()) return alert("Silakan masukkan ID Pesanan.");
    setIsTracking(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/track/${idToTrack}`);
      if (!res.ok) throw new Error("Tidak ditemukan");
      const data = await res.json();
      setOrderData(data);
    } catch (error) {
      setErrorMsg("Pesanan dengan ID tersebut tidak ditemukan. Periksa kembali ID Anda.");
    } finally {
      setIsTracking(false);
    }
  };

  const startScanner = () => {
    setIsScanning(true);
    setOrderData(null);
    setErrorMsg('');
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false);
      scanner.render(
        (decodedText) => {
          scanner.clear();
          setIsScanning(false);
          let extractedId = decodedText;
          try {
            const url = new URL(decodedText);
            if (url.searchParams.has('trx')) extractedId = url.searchParams.get('trx');
          } catch (e) { }
          setTrxId(extractedId);
          handleTrack(extractedId);
        },
        (err) => { /* Abaikan error per frame */ }
      );
    }, 100);
  };

  const formatWaktuMasuk = (unixStr) => {
    const d = new Date(parseInt(unixStr) * 1000);
    return isNaN(d) ? 'Pesanan diterima' : `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - Pesanan diterima`;
  };

  const renderStep = (state, icon, title, descActive, descCompleted) => {
    if (state === 'completed') return (
      <div className="flex gap-4 md:gap-6 relative z-10 mb-8">
        <div className="flex-shrink-0 w-10 h-10 bg-[#0F766E] text-white rounded-full flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-xl" style={{fontVariationSettings: '"FILL" 1'}}>check</span></div>
        <div className="flex flex-col justify-center"><h3 className="font-bold text-lg text-slate-800">{title}</h3><p className="text-sm text-slate-500">{descCompleted}</p></div>
      </div>
    );
    if (state === 'active') return (
      <div className="flex gap-4 md:gap-6 relative z-10 mb-8 -ml-2 -mr-2 bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-2xl p-5 shadow-sm transform transition-all hover:scale-[1.02]">
        <div className="flex-shrink-0 w-10 h-10 bg-white text-[#F97316] border-2 border-[#F97316] rounded-full flex items-center justify-center shadow-md relative">
          <div className="absolute inset-0 rounded-full border-2 border-[#F97316] animate-ping opacity-50"></div>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-lg text-[#F97316]">{title}</h3>
            <span className="bg-[#F97316] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase animate-pulse shrink-0 tracking-wider">Sedang Diproses</span>
          </div>
          <p className="text-sm text-slate-600 mt-1">{descActive}</p>
        </div>
      </div>
    );
    return (
      <div className="flex gap-4 md:gap-6 relative z-10 mb-8 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 text-slate-400 border-2 border-slate-200 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xl">{icon}</span></div>
        <div className="flex flex-col justify-center"><h3 className="font-bold text-lg text-slate-500">{title}</h3></div>
      </div>
    );
  };

  const getTimelineSteps = () => {
    if (!orderData || orderData.status_pesanan === 'Batal') return null;
    const tracking = orderData.tracking_data && orderData.tracking_data !== 'null' ? JSON.parse(orderData.tracking_data) : {};
    const isCuci = tracking.cuci?.done, isKering = tracking.kering?.done, isSetrika = tracking.setrika?.done, isPacking = tracking.packing?.done;
    const s = orderData.status_pesanan;

    let a='future', c='future', k='future', set='future', p='future', sa='future', sls='future';

    if (s === 'Antrian') a = 'active';
    else if (s === 'Proses') {
      a = 'completed';
      if (!isCuci) c = 'active';
      else if (!isKering) { c = 'completed'; k = 'active'; }
      else if (!isSetrika) { c = k = 'completed'; set = 'active'; }
      else if (!isPacking) { c = k = set = 'completed'; p = 'active'; }
      else { c = k = set = p = 'completed'; }
    }
    else if (s === 'Siap Ambil') { a = c = k = set = p = 'completed'; sa = 'active'; }
    else if (s === 'Selesai') { a = c = k = set = p = sa = sls = 'completed'; }

    return (
      <div className="relative flex flex-col mt-4 pl-2 md:pl-4">
        <div className="absolute left-[27px] md:left-[35px] top-6 bottom-10 w-[2px] bg-slate-200 z-0"></div>
        {renderStep(a, 'receipt_long', 'Antrean', 'Pesanan sedang menunggu untuk diproses.', formatWaktuMasuk(orderData.tanggal_masuk))}
        {renderStep(c, 'water_drop', 'Dicuci', 'Pakaian Anda sedang dicuci dengan deterjen premium.', tracking.cuci?.time ? `Selesai dicuci pkl ${tracking.cuci.time}` : 'Telah dicuci')}
        {renderStep(k, 'air', 'Dikeringkan', 'Pakaian Anda sedang dalam tahap pengeringan mesin.', tracking.kering?.time ? `Selesai dikeringkan pkl ${tracking.kering.time}` : 'Telah dikeringkan')}
        {renderStep(set, 'iron', 'Disetrika', 'Pakaian Anda sedang disetrika dan dirapikan.', tracking.setrika?.time ? `Selesai disetrika pkl ${tracking.setrika.time}` : 'Telah disetrika')}
        {renderStep(p, 'inventory_2', 'Di-packing', 'Pakaian sedang dikemas rapi dan diberi parfum.', tracking.packing?.time ? `Selesai di-packing pkl ${tracking.packing.time}` : 'Telah dikemas')}
        {renderStep(sa, 'storefront', 'Siap Ambil', 'Pakaian Anda sudah rapi dan menunggu untuk diambil.', 'Pakaian telah diambil')}
        {renderStep(sls, 'done_all', 'Selesai', '', 'Transaksi telah selesai. Terima kasih!')}
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] w-full h-full mx-auto flex p-4 md:p-6 lg:p-8 gap-4 md:gap-6 relative">
      <div className="flex-1 flex flex-col items-center gap-6 w-full h-full overflow-y-auto pr-2 custom-scrollbar">
        <header className="flex flex-col items-center gap-4 mb-2 mt-8">
          <img alt="Zeera Laundry" className="w-24 h-24 rounded-full shadow-md object-cover border-2 border-white" src="/logo-zeera.jpg" onError={(e) => e.target.src='https://via.placeholder.com/150?text=ZL'} />
          <h1 className="text-[#0F766E] font-extrabold text-2xl tracking-tight uppercase">Zeera Laundry</h1>
        </header>
        
        <div className="text-center mb-2 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">Lacak Cucian Anda</h2>
          <p className="text-slate-500 text-lg">Pantau status pakaian Anda secara real-time.</p>
        </div>

        <main className="w-full max-w-xl bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white relative z-10">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
              <input value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full pl-12 pr-14 py-3 rounded-full bg-slate-50 border border-slate-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0f766e]/50 focus:border-[#0f766e] transition-all text-slate-700 font-medium" placeholder="Masukkan ID (TRX...)" type="text" /> 
              <button onClick={startScanner} className="absolute right-2 w-9 h-9 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 flex items-center justify-center transition-colors" title="Scan QR Struk"><span className="material-symbols-outlined text-[18px]">qr_code_scanner</span></button>
            </div>
            <button onClick={() => handleTrack()} disabled={isTracking} className="bg-[#F97316] text-white rounded-full px-6 md:px-8 font-bold shadow-lg hover:bg-orange-600 active:scale-95 transition-all focus:outline-none disabled:opacity-70">
              {isTracking ? 'Mencari...' : 'Lacak'}
            </button>
          </div>

          {isScanning && (
            <div className="flex flex-col items-center mb-8">
              <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg p-2">
                <div id="reader" className="w-full rounded-xl overflow-hidden"></div>
              </div>
              <button onClick={() => { setIsScanning(false); document.getElementById('reader').innerHTML=''; }} className="mt-4 px-6 py-2 bg-red-50 text-red-600 font-bold rounded-full border border-red-100 hover:bg-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">close</span> Batal Scan
              </button>
            </div>
          )}

          {errorMsg && <div className="text-center text-red-500 font-bold mb-6">{errorMsg}</div>}

          {orderData?.status_pesanan === 'Batal' && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500">cancel</span>
              <div><h4 className="font-bold">Pesanan Dibatalkan</h4><p className="text-sm">Pesanan ini telah dibatalkan. Silakan hubungi admin.</p></div>
            </div>
          )}

          {getTimelineSteps()}
        </main>
      </div>
    </div>
  );
}