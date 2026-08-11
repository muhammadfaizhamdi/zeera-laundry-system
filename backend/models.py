from sqlalchemy import Column, Integer, String, Text
from database import Base

class Pelanggan(Base):
    __tablename__ = "pelanggan"

    id = Column(Integer, primary_key=True, index=True)
    nama_lengkap = Column(String(100), index=True)
    no_whatsapp = Column(String(20), unique=True, index=True)
    alamat = Column(Text, nullable=True)
    # Default total transaksi untuk pelanggan baru adalah 0
    total_transaksi = Column(Integer, default=0)

from sqlalchemy import ForeignKey

class Layanan(Base):
    __tablename__ = "layanan"

    id = Column(Integer, primary_key=True, index=True)
    kategori = Column(String(50))      # Contoh: Paket, Cuci Kering, Sepatu
    nama_layanan = Column(String(100)) # Contoh: SANTUY, KEPEPET
    harga = Column(Integer)
    satuan = Column(String(20))        # Contoh: Kg, Pcs, Psg
    estimasi_waktu = Column(String(50))# Contoh: 2 Hari, 6 Jam
    # DUA KOLOM BARU UNTUK FITUR DRAG & DROP
    urutan_kategori = Column(Integer, default=99)
    urutan_item = Column(Integer, default=99)
    outlet_id = Column(Integer, default=1, index=True) # 1 merepresentasikan Cabang Pusat

class Pesanan(Base):
    __tablename__ = "pesanan"

    id = Column(Integer, primary_key=True, index=True)
    id_transaksi = Column(String(50), unique=True, index=True) # Contoh: TRX171...
    pelanggan_id = Column(Integer, ForeignKey("pelanggan.id"))
    total_harga = Column(Integer)
    status_pesanan = Column(String(50), default="Antrian")     # Antrian, Proses, Selesai, Batal
    status_bayar = Column(String(50), default="Belum Lunas")   # Belum Lunas, Lunas
    metode_pembayaran = Column(String(50), nullable=True)
    parfum = Column(String(50), nullable=True)
    keterangan = Column(Text, nullable=True)
    detail_layanan = Column(Text, nullable=True)
    tracking_data = Column(Text, nullable=True) # INI UNTUK MENYIMPAN DATA 4 TAHAP KARYAWAN
    outlet_id = Column(Integer, default=1, index=True) # Menyimpan riwayat cabang mana yang memproses

class Pengaturan(Base):
    __tablename__ = "pengaturan"
    id = Column(Integer, primary_key=True, index=True)
    kunci = Column(String(100), unique=True, index=True) # Contoh: 'outlet_nama', 'list_pegawai'
    nilai = Column(Text) # Menyimpan teks atau format JSON Array