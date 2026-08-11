import requests
import time

# URL Endpoint API Backend Anda
API_URL = "http://127.0.0.1:8000/api/layanan/"

# Data 126 Layanan Lengkap yang sudah dikalibrasi
data_layanan = [
    # 1. Paket (6)
    {"kategori": "Paket", "nama_layanan": "SANTUY", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
    {"kategori": "Paket", "nama_layanan": "KEPEPET", "harga": 6000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
    {"kategori": "Paket", "nama_layanan": "Express (12 Jam)", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "12 Jam"},
    {"kategori": "Paket", "nama_layanan": "Express (6 Jam)", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
    {"kategori": "Paket", "nama_layanan": "Express (4 Jam)", "harga": 12000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
    {"kategori": "Paket", "nama_layanan": "Express (2 Jam)", "harga": 15000, "satuan": "Kg", "estimasi_waktu": "2 Jam"},
    
    # 2. Kiloan Cuci Kering (4)
    {"kategori": "Kiloan Cuci Kering", "nama_layanan": "Cuci Kering Reguler", "harga": 4000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
    {"kategori": "Kiloan Cuci Kering", "nama_layanan": "Cuci Kering Kilat", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
    {"kategori": "Kiloan Cuci Kering", "nama_layanan": "Cuci Kering Express (6 Jam)", "harga": 7000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
    {"kategori": "Kiloan Cuci Kering", "nama_layanan": "Cuci Kering Express (4 Jam)", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
    
    # 3. Kiloan Setrika (6)
    {"kategori": "Kiloan Setrika", "nama_layanan": "Setrika Kilat", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
    {"kategori": "Kiloan Setrika", "nama_layanan": "Setrika Reguler", "harga": 4000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
    {"kategori": "Kiloan Setrika", "nama_layanan": "Setrika Express (4 Jam)", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
    {"kategori": "Kiloan Setrika", "nama_layanan": "Setrika Express (2 Jam)", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "2 Jam"},
    {"kategori": "Kiloan Setrika", "nama_layanan": "Setrika 3 Pcs", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
    {"kategori": "Kiloan Setrika", "nama_layanan": "Setrika per pcs (4 Jam)", "harga": 4000, "satuan": "Pcs", "estimasi_waktu": "4 Jam"},
    
    # 4. Sepatu (4)
    {"kategori": "Sepatu", "nama_layanan": "Reguler", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Sepatu", "nama_layanan": "SANTUY ", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"}, 
    {"kategori": "Sepatu", "nama_layanan": "KEPEPET ", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"}, 
    {"kategori": "Sepatu", "nama_layanan": "Repaint (SOL)", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    
    # 5. Bedcover (9)
    {"kategori": "Bedcover", "nama_layanan": "Bedcover kecil", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover queen / besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover jumbo", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover kecil (1 Hari)", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover queen (1 Hari)", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover jumbo (1 Hari)", "harga": 35000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover kecil express (6 Jam)", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "6 Jam"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover queen express (6 Jam)", "harga": 40000, "satuan": "Pcs", "estimasi_waktu": "6 Jam"},
    {"kategori": "Bedcover", "nama_layanan": "Bedcover jumbo express (6 Jam)", "harga": 45000, "satuan": "Pcs", "estimasi_waktu": "6 Jam"},
    
    # 6. Satuan (29) 
    {"kategori": "Satuan", "nama_layanan": "Selimut Kecil", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Selimut Besar", "harga": 12000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Sprei ", "harga": 5000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"}, 
    {"kategori": "Satuan", "nama_layanan": "Handuk", "harga": 6000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Selimut besar express (8 Jam)", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "8 Jam"},
    {"kategori": "Satuan", "nama_layanan": "Boneka kecil express (8 Jam)", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "8 Jam"},
    {"kategori": "Satuan", "nama_layanan": "Kemeja", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Jaket", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Keset ", "harga": 3000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"}, 
    {"kategori": "Satuan", "nama_layanan": "Selimut besar express (4 Jam)", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "4 Jam"},
    {"kategori": "Satuan", "nama_layanan": "Sendal", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Gorden", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Satuan (3 Jam)", "harga": 12000, "satuan": "Pcs", "estimasi_waktu": "3 Jam"},
    {"kategori": "Satuan", "nama_layanan": "Sleeping bag", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Jas hujan", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Sprei express (4 Jam)", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "4 Jam"},
    {"kategori": "Satuan", "nama_layanan": "Kebaya + Songket", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Brukat", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Sajadah tebal", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Sajadah", "harga": 6000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Jas Reguler", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Jas Kilat", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Toga", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Kebaya 1 stel", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Gamis", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Satuan", "nama_layanan": "Karpet kecil express (8 Jam)", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "8 Jam"},
    
    # 7. Treatment (5)
    {"kategori": "Treatment", "nama_layanan": "Noda bandel putih", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Treatment", "nama_layanan": "Noda sedang putih", "harga": 17000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Treatment", "nama_layanan": "Noda kecil putih", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Treatment", "nama_layanan": "Clemek", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Treatment", "nama_layanan": "Kemeja Treatment", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"}, 
    
    # 8. Boneka (7)
    {"kategori": "Boneka", "nama_layanan": "Boneka super besar", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Boneka", "nama_layanan": "Boneka Sedang", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Boneka", "nama_layanan": "Boneka Kecil", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Boneka", "nama_layanan": "Boneka besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Boneka", "nama_layanan": "Boneka mini", "harga": 6000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Boneka", "nama_layanan": "Boneka kecil express ", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "5 Jam"}, 
    {"kategori": "Boneka", "nama_layanan": "Boneka Big", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    
    # 9. Delivery (6)
    {"kategori": "Delivery", "nama_layanan": "Paket Kepepet", "harga": 7000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
    {"kategori": "Delivery", "nama_layanan": "Paket Santuy", "harga": 6000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
    {"kategori": "Delivery", "nama_layanan": "Paket Reguler", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "3 Hari"},
    {"kategori": "Delivery", "nama_layanan": "Express (6 Jam)", "harga": 12000, "satuan": "Kg", "estimasi_waktu": "6 Jam"}, 
    {"kategori": "Delivery", "nama_layanan": "Cuci Kering Reguler ", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "2 Hari"}, 
    {"kategori": "Delivery", "nama_layanan": "Selimut kecil ", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"}, 
    
    # 10. Tidur (9)
    {"kategori": "Tidur", "nama_layanan": "Bantal Kecil", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Bantal", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Extra Bantal Putih", "harga": 5000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Bantal besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Guling besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Guling", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Bantal treatment motif", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Putih treatment", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Tidur", "nama_layanan": "Bantal leher", "harga": 12000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    
    # 11. Lainnya (4)
    {"kategori": "Lainnya", "nama_layanan": "Extra Di Hanger", "harga": 2000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Lainnya", "nama_layanan": "Extra Pemutih", "harga": 3000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Lainnya", "nama_layanan": "Extra packing satuan", "harga": 2000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Lainnya", "nama_layanan": "setrika Satuan dan plastik", "harga": 5000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    
    # 12. Karpet (5)
    {"kategori": "Karpet", "nama_layanan": "Karpet bulu kecil", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Karpet", "nama_layanan": "Karpet bulu besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Karpet", "nama_layanan": "Karpet tebal kecil", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Karpet", "nama_layanan": "Karpet", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Karpet", "nama_layanan": "Karpet besar", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "4 Hari"},
    
    # 13. Alat Laundry (8)
    {"kategori": "Alat Laundry", "nama_layanan": "Refill Sabun 5L", "harga": 40000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Sabun 5L", "harga": 45000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Refill Sabun 1L", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "1 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Sabun 1L", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "1 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Refill Parfume grade C", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Refill Parfume grade B", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Refill parfum grade A", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    {"kategori": "Alat Laundry", "nama_layanan": "Reffil parfum 600ml", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "0 Jam"},
    
    # 14. Sandal (1)
    {"kategori": "Sandal", "nama_layanan": "Sandal", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    
    # 15. D'Paragon (5)
    {"kategori": "D'Paragon", "nama_layanan": "Bedcover ", "harga": 27000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"}, 
    {"kategori": "D'Paragon", "nama_layanan": "Sprei Set", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "D'Paragon", "nama_layanan": "Handuk ", "harga": 5000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"}, 
    {"kategori": "D'Paragon", "nama_layanan": "Matras", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "D'Paragon", "nama_layanan": "Keset  ", "harga": 3000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"}, 
    
    # 16. Tas (5)
    {"kategori": "Tas", "nama_layanan": "Tas Ransel", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Tas", "nama_layanan": "Tas kecil", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
    {"kategori": "Tas", "nama_layanan": "Tas carier", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
    {"kategori": "Tas", "nama_layanan": "Tas (6 Jam)", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "6 Jam"},
    {"kategori": "Tas", "nama_layanan": "Tas ransel ", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"}, 
    
    # 17. Sarung (1)
    {"kategori": "Sarung", "nama_layanan": "Sarung kursi", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    
    # 18. Lebaran (12)
    {"kategori": "Lebaran", "nama_layanan": "Kepepet  ", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "1 Hari"}, 
    {"kategori": "Lebaran", "nama_layanan": "SANTUY  ", "harga": 6000, "satuan": "Kg", "estimasi_waktu": "2 Hari"}, 
    {"kategori": "Lebaran", "nama_layanan": "Express (6 Jam)  ", "harga": 13000, "satuan": "Kg", "estimasi_waktu": "6 Jam"}, 
    {"kategori": "Lebaran", "nama_layanan": "Express (4 Jam) ", "harga": 15000, "satuan": "Kg", "estimasi_waktu": "4 Jam"}, 
    {"kategori": "Lebaran", "nama_layanan": "Cuci kering (4 Jam)", "harga": 9000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
    {"kategori": "Lebaran", "nama_layanan": "Cuci kering (6 Jam)", "harga": 7000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
    {"kategori": "Lebaran", "nama_layanan": "Setrika (4 Jam)", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
    {"kategori": "Lebaran", "nama_layanan": "Setrika (6 Jam)", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
    {"kategori": "Lebaran", "nama_layanan": "Selimut tipis", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Lebaran", "nama_layanan": "Selimut besar tebal", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Lebaran", "nama_layanan": "Bedcover single", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
    {"kategori": "Lebaran", "nama_layanan": "Bedcover besar", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"}
]

print(f"Memulai seeding {len(data_layanan)} layanan ke Database...")

sukses = 0
gagal = 0

for item in data_layanan:
    try:
        response = requests.post(API_URL, json=item)
        if response.status_code in [200, 201]:
            print(f"✅ Sukses: {item['nama_layanan']} ({item['kategori']})")
            sukses += 1
        else:
            print(f"❌ Gagal: {item['nama_layanan']} - Pesan: {response.text}")
            gagal += 1
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error Koneksi pada {item['nama_layanan']}: {e}")
        gagal += 1
        
    time.sleep(0.1) # Jeda kecil agar server tidak kewalahan

print("-" * 30)
print(f"Proses Selesai! ✅ Sukses: {sukses} | ❌ Gagal: {gagal}")
print("Silakan refresh halaman Buat Pesanan Anda di browser.")