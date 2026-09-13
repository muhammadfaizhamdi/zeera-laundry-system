import { useState, useEffect } from 'react';

export function usePelangganData(activeFilter = 'Bulan Ini') {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pelanggan/")
      .then(res => res.json())
      .then(data => {
        setAllData(Array.isArray(data) ? data : []);
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
      if (!activeFilter) return true;
      
      // Filter berdasarkan tanggal pelanggan ditambahkan ke sistem
      let dateDaftar = new Date();
      if (item.created_at) dateDaftar = new Date(item.created_at);

      const date = new Date(dateDaftar);
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