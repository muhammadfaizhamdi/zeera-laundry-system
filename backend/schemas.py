from pydantic import BaseModel
from typing import Optional

# Skema saat menerima data baru dari HTML (Frontend)
class PelangganCreate(BaseModel):
    nama_lengkap: str
    no_whatsapp: str
    alamat: Optional[str] = None

# Skema saat mengirim data dari Database ke HTML (Frontend)
class PelangganResponse(PelangganCreate):
    id: int
    total_transaksi: int
    total_omset: int = 0

    class Config:
        from_attributes = True

class LayananResponse(BaseModel):
    id: int
    kategori: str
    nama_layanan: str
    harga: int
    satuan: str
    estimasi_waktu: str
    urutan_kategori: Optional[int] = 99
    urutan_item: Optional[int] = 99

    class Config:
        from_attributes = True

class LayananCreate(BaseModel):
    kategori: str
    nama_layanan: str
    harga: int
    satuan: str
    estimasi_waktu: str
    urutan_kategori: Optional[int] = 99
    urutan_item: Optional[int] = 99
    outlet_id: Optional[int] = 1

# SKEMA BARU KHUSUS UNTUK DRAG & DROP
class UpdateUrutanLayanan(BaseModel):
    id: int
    urutan_kategori: int
    urutan_item: int

class PesananCreate(BaseModel):
    pelanggan_id: int
    total_harga: int
    status_bayar: str
    metode_pembayaran: Optional[str] = None
    parfum: Optional[str] = None
    keterangan: Optional[str] = None
    detail_layanan: Optional[str] = None
    outlet_id: Optional[int] = 1