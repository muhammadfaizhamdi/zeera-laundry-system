import { useState, useEffect } from 'react';

export function usePesananData(activeFilter = 'Bulan Ini') {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pesanan/")
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!allData.length) {
      setFilteredData([]);
      return;
    }

    const filtered = allData.filter(item => {
      if (activeFilter === 'Semua Waktu' || !activeFilter) return true;
      
      let dateMasuk = new Date();
      if (item.id_transaksi && item.id_transaksi.startsWith('TRX')) {
        dateMasuk = new Date(parseInt(item.id_transaksi.substring(3, 13)) * 1000);
      } else if (item.created_at) {
        dateMasuk = new Date(item.created_at);
      }

      const date = new Date(dateMasuk);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (activeFilter === 'Hari Ini') return date >= today;
      if (activeFilter === 'Kemarin') {
          const y = new Date(today); y.setDate(y.getDate() - 1);
          return date >= y && date < today;
      }
      if (activeFilter === '7 Hari Terakhir') {
          const l7 = new Date(today); l7.setDate(l7.getDate() - 7);
          return date >= l7;
      }
      if (activeFilter === 'Bulan Ini') {
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      }
      if (activeFilter === 'Bulan Lalu') {
          let lm = today.getMonth() - 1; let y = today.getFullYear();
          if (lm < 0) { lm = 11; y--; }
          return date.getMonth() === lm && date.getFullYear() === y;
      }
      if (activeFilter === 'Tahun Ini') return date.getFullYear() === today.getFullYear();
      
      return true;
    });

    setFilteredData(filtered);
  }, [allData, activeFilter]);

  return { data: filteredData, allData, isLoading };
}