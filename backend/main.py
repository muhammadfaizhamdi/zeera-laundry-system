from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import engine, SessionLocal
import time

# Otomatis membuat tabel di PostgreSQL
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zeera Laundry API")

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "Sukses", "pesan": "Server FastAPI Berjalan!"}

# ==========================================
# ENDPOINT AUTENTIKASI (LOGIN & REGISTER)
# ==========================================
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
import bcrypt
import secrets

# 1. Definisi Tabel Pengguna di Database
class Pengguna(models.Base):
    __tablename__ = "pengguna"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    nama_lengkap = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="Karyawan")

# Paksa update tabel baru ke PostgreSQL
models.Base.metadata.create_all(bind=engine)

# 2. Skema Data Frontend
class RegisterRequest(BaseModel):
    nama_lengkap: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

# 3. Endpoint Register
@app.post("/api/register")
def register_user(user_data: RegisterRequest, db: Session = Depends(get_db)):
    # Cek apakah email sudah terdaftar
    user_exist = db.query(Pengguna).filter(Pengguna.email == user_data.email).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="Email sudah digunakan!")
    
    # Enkripsi Password menggunakan bcrypt murni (Anti-Error)
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), salt).decode('utf-8')
    
    # Simpan akun baru
    new_user = Pengguna(
        nama_lengkap=user_data.nama_lengkap,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    
    return {"message": "Akun berhasil dibuat", "status": "success"}

# 4. Endpoint Login
@app.post("/api/login")
def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    # Cari email di database
    user = db.query(Pengguna).filter(Pengguna.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email tidak ditemukan!")
        
    # Cocokkan Hash Password menggunakan bcrypt murni
    if not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Kata sandi salah!")
        
    # Generate Token Sederhana & Kembalikan Role-nya
    fake_token = secrets.token_hex(32)
    return {
        "token": fake_token,
        "user": {
            "nama": user.nama_lengkap,
            "role": user.role
        }
    }

# ==========================================
# ENDPOINT PELANGGAN
# ==========================================
@app.post("/api/pelanggan/", response_model=schemas.PelangganResponse)
def create_pelanggan(pelanggan: schemas.PelangganCreate, db: Session = Depends(get_db)):
    db_pelanggan = db.query(models.Pelanggan).filter(models.Pelanggan.no_whatsapp == pelanggan.no_whatsapp).first()
    if db_pelanggan:
        raise HTTPException(status_code=400, detail="Nomor WhatsApp sudah terdaftar di sistem")
    
    pelanggan_baru = models.Pelanggan(
        nama_lengkap=pelanggan.nama_lengkap,
        no_whatsapp=pelanggan.no_whatsapp,
        alamat=pelanggan.alamat
    )
    db.add(pelanggan_baru)
    db.commit()
    db.refresh(pelanggan_baru)
    return pelanggan_baru

from sqlalchemy import func

@app.get("/api/pelanggan/", response_model=list[schemas.PelangganResponse])
def get_semua_pelanggan(db: Session = Depends(get_db)):
    pelanggan_list = db.query(models.Pelanggan).order_by(models.Pelanggan.nama_lengkap.asc()).all()
    
    # Hitung otomatis total belanja (hanya yang sudah Lunas) untuk tiap pelanggan
    for p in pelanggan_list:
        total = db.query(func.sum(models.Pesanan.total_harga)).filter(
            models.Pesanan.pelanggan_id == p.id,
            models.Pesanan.status_bayar == "Lunas"
        ).scalar()
        p.total_omset = total if total else 0
        
    return pelanggan_list

@app.delete("/api/pelanggan/{id}")
def hapus_pelanggan(id: int, db: Session = Depends(get_db)):
    pelanggan = db.query(models.Pelanggan).filter(models.Pelanggan.id == id).first()
    if not pelanggan:
        raise HTTPException(status_code=404, detail="Pelanggan tidak ditemukan")
    
    try:
        db.delete(pelanggan)
        db.commit()
        return {"pesan": "Pelanggan berhasil dihapus"}
    except Exception as e:
        db.rollback()
        # Jika gagal dihapus karena terikat pesanan, lemparkan error ini
        raise HTTPException(status_code=400, detail="Pelanggan tidak bisa dihapus karena masih memiliki riwayat pesanan.")

@app.put("/api/pelanggan/{id}")
def update_pelanggan(id: int, pelanggan_update: schemas.PelangganCreate, db: Session = Depends(get_db)):
    pelanggan = db.query(models.Pelanggan).filter(models.Pelanggan.id == id).first()
    if not pelanggan:
        raise HTTPException(status_code=404, detail="Pelanggan tidak ditemukan")
    
    # Update data
    pelanggan.nama_lengkap = pelanggan_update.nama_lengkap
    pelanggan.no_whatsapp = pelanggan_update.no_whatsapp
    pelanggan.alamat = pelanggan_update.alamat
    
    db.commit()
    db.refresh(pelanggan)
    return {"pesan": "Data pelanggan berhasil diupdate"}

# ==========================================
# ENDPOINT LAYANAN (KATALOG)
# ==========================================
@app.get("/api/layanan/", response_model=list[schemas.LayananResponse])
def get_semua_layanan(db: Session = Depends(get_db)):
    return db.query(models.Layanan).order_by(models.Layanan.urutan_kategori.asc(), models.Layanan.urutan_item.asc()).all()

@app.put("/api/layanan/{id}", response_model=schemas.LayananResponse)
def update_layanan(id: int, layanan: schemas.LayananCreate, db: Session = Depends(get_db)):
    db_layanan = db.query(models.Layanan).filter(models.Layanan.id == id).first()
    if not db_layanan:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    db_layanan.kategori = layanan.kategori
    db_layanan.nama_layanan = layanan.nama_layanan
    db_layanan.harga = layanan.harga
    db_layanan.satuan = layanan.satuan
    db_layanan.estimasi_waktu = layanan.estimasi_waktu
    db.commit()
    db.refresh(db_layanan)
    return db_layanan

@app.delete("/api/layanan/{id}")
def hapus_layanan(id: int, db: Session = Depends(get_db)):
    db_layanan = db.query(models.Layanan).filter(models.Layanan.id == id).first()
    if not db_layanan:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    db.delete(db_layanan)
    db.commit()
    return {"pesan": "Layanan berhasil dihapus"}

@app.post("/api/layanan/update-urutan/")
def update_urutan_layanan(data_urutan: list[schemas.UpdateUrutanLayanan], db: Session = Depends(get_db)):
    for data in data_urutan:
        db.query(models.Layanan).filter(models.Layanan.id == data.id).update({
            "urutan_kategori": data.urutan_kategori,
            "urutan_item": data.urutan_item
        })
    db.commit()
    return {"status": "Sukses"}

@app.post("/api/layanan/", response_model=schemas.LayananResponse)
def create_layanan(layanan: schemas.LayananCreate, db: Session = Depends(get_db)):
    db_layanan = models.Layanan(
        kategori=layanan.kategori,
        nama_layanan=layanan.nama_layanan,
        harga=layanan.harga,
        satuan=layanan.satuan,
        estimasi_waktu=layanan.estimasi_waktu,
        urutan_kategori=layanan.urutan_kategori,
        urutan_item=layanan.urutan_item,
        outlet_id=layanan.outlet_id
    )
    db.add(db_layanan)
    db.commit()
    db.refresh(db_layanan)
    return db_layanan

@app.post("/api/seed-layanan/")
def injeksi_data_layanan(db: Session = Depends(get_db)):
    if db.query(models.Layanan).count() > 0:
        return {"pesan": "Katalog Layanan sudah ada di Database!"}
    
    # Data lengkap dari katalog Zeera Laundry
    data_awal = [
        {"kategori": "Paket", "nama_layanan": "SANTUY", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
        {"kategori": "Paket", "nama_layanan": "KEPEPET", "harga": 6000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Paket", "nama_layanan": "Express 6 Jam", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
        {"kategori": "Paket", "nama_layanan": "Express 4 Jam", "harga": 12000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
        {"kategori": "Paket", "nama_layanan": "Express 12 Jam", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "12 Jam"},
        {"kategori": "Paket", "nama_layanan": "Ekspress 2jam", "harga": 15000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
        {"kategori": "Cuci Kering", "nama_layanan": "Reguler", "harga": 4000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
        {"kategori": "Cuci Kering", "nama_layanan": "Kilat", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Cuci Kering", "nama_layanan": "Express 6 Jam", "harga": 7000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
        {"kategori": "Cuci Kering", "nama_layanan": "Express 4 Jam", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "4 Jam"},
        {"kategori": "Setrika", "nama_layanan": "Kilat", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Setrika", "nama_layanan": "Reguler", "harga": 4000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
        {"kategori": "Setrika", "nama_layanan": "Express 6 Jam", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
        {"kategori": "Setrika", "nama_layanan": "Express 1 Jam", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "1 Jam"},
        {"kategori": "Setrika", "nama_layanan": "Setrika 3 Pcs", "harga": 10000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Setrika", "nama_layanan": "Setrika per pcs", "harga": 4000, "satuan": "Pcs", "estimasi_waktu": "4 Jam"},
        {"kategori": "Sepatu", "nama_layanan": "Reguler", "harga": 20000, "satuan": "Psg", "estimasi_waktu": "3 Hari"},
        {"kategori": "Sepatu", "nama_layanan": "SANTUY", "harga": 25000, "satuan": "Psg", "estimasi_waktu": "3 Hari"},
        {"kategori": "Sepatu", "nama_layanan": "KEPEPET", "harga": 30000, "satuan": "Psg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Sepatu", "nama_layanan": "Repaint SOL", "harga": 30000, "satuan": "Psg", "estimasi_waktu": "3 Hari"},
        {"kategori": "Bedcover", "nama_layanan": "Kecil", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Bedcover", "nama_layanan": "Queen/Besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Bedcover", "nama_layanan": "Jumbo", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Bedcover", "nama_layanan": "Kecil Express 6jam", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "6 Jam"},
        {"kategori": "Satuan", "nama_layanan": "Selimut Kecil", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Selimut Besar", "harga": 12000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Sprei", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Handuk", "harga": 6000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Kemeja", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Jaket", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Sendal", "harga": 20000, "satuan": "Psg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Satuan", "nama_layanan": "Gorden", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Treatment", "nama_layanan": "Noda Bandel Putih", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Treatment", "nama_layanan": "Noda Sedang Putih", "harga": 17000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Treatment", "nama_layanan": "Noda Kecil Putih", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Treatment", "nama_layanan": "Clemek", "harga": 8000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Boneka", "nama_layanan": "Super Besar", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Boneka", "nama_layanan": "Sedang", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Boneka", "nama_layanan": "Kecil", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Delivery", "nama_layanan": "Paket Kepepet", "harga": 7000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Delivery", "nama_layanan": "Paket Santuy", "harga": 6000, "satuan": "Kg", "estimasi_waktu": "2 Hari"},
        {"kategori": "Delivery", "nama_layanan": "Paket Reguler", "harga": 5000, "satuan": "Kg", "estimasi_waktu": "3 Hari"},
        {"kategori": "Delivery", "nama_layanan": "Express 6 Jam", "harga": 12000, "satuan": "Kg", "estimasi_waktu": "6 Jam"},
        {"kategori": "Tidur", "nama_layanan": "Bantal Kecil", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Tidur", "nama_layanan": "Bantal Besar", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Tidur", "nama_layanan": "Guling", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Tidur", "nama_layanan": "Bantal Leher", "harga": 12000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Lainnya", "nama_layanan": "Extra Di Hanger", "harga": 2000, "satuan": "Pcs", "estimasi_waktu": "Langsung"},
        {"kategori": "Lainnya", "nama_layanan": "Extra Pemutih", "harga": 3000, "satuan": "Pcs", "estimasi_waktu": "Langsung"},
        {"kategori": "Lainnya", "nama_layanan": "Setrika Satuan dan Plastik", "harga": 5000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Karpet", "nama_layanan": "Bulu Kecil", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Karpet", "nama_layanan": "Karpet Reguler", "harga": 20000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Alat Laundry", "nama_layanan": "Sabun 5L", "harga": 45000, "satuan": "Pcs", "estimasi_waktu": "Langsung"},
        {"kategori": "Alat Laundry", "nama_layanan": "Refill Parfume Grade A", "harga": 30000, "satuan": "Pcs", "estimasi_waktu": "Langsung"},
        {"kategori": "D_Paragon", "nama_layanan": "Bedcover", "harga": 27000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
        {"kategori": "D_Paragon", "nama_layanan": "Sprei Set", "harga": 10000, "satuan": "Pcs", "estimasi_waktu": "1 Hari"},
        {"kategori": "Tas", "nama_layanan": "Ransel", "harga": 15000, "satuan": "Pcs", "estimasi_waktu": "2 Hari"},
        {"kategori": "Tas", "nama_layanan": "Tas Carier", "harga": 25000, "satuan": "Pcs", "estimasi_waktu": "3 Hari"},
        {"kategori": "Lebaran", "nama_layanan": "Kepepet", "harga": 8000, "satuan": "Kg", "estimasi_waktu": "1 Hari"},
        {"kategori": "Lebaran", "nama_layanan": "SANTUY", "harga": 6000, "satuan": "Kg", "estimasi_waktu": "2 Hari"}
    ]
    for item in data_awal:
        db.add(models.Layanan(**item))
    db.commit()
    return {"pesan": "Sukses memasukkan data katalog ke PostgreSQL!"}

# ==========================================
# ENDPOINT PESANAN (TRANSAKSI)
# ==========================================
@app.post("/api/pesanan/")
def create_pesanan(pesanan: schemas.PesananCreate, db: Session = Depends(get_db)):
    # Membuat ID 100% unik: Waktu (Detik) + 4 Karakter Acak (Contoh: TRX1784544299A1B2)
    id_trx = f"TRX{int(time.time())}{secrets.token_hex(2).upper()}"
    pesanan_baru = models.Pesanan(
        id_transaksi=id_trx,
        pelanggan_id=pesanan.pelanggan_id,
        total_harga=pesanan.total_harga,
        status_bayar=pesanan.status_bayar,
        metode_pembayaran=pesanan.metode_pembayaran,
        parfum=pesanan.parfum,
        keterangan=pesanan.keterangan,
        detail_layanan=pesanan.detail_layanan,
        outlet_id=pesanan.outlet_id
    )
    db.add(pesanan_baru)
    
    pelanggan_terkait = db.query(models. Pelanggan).filter(models. Pelanggan.id == pesanan.pelanggan_id).first()
    if pelanggan_terkait:
        pelanggan_terkait.total_transaksi += 1
        
    db.commit()
    return {"status": "Sukses", "id_transaksi": id_trx}

@app.get("/api/pesanan/")
def get_semua_pesanan (db: Session = Depends(get_db)):
    hasil_query = db.query(models. Pesanan, models. Pelanggan.nama_lengkap, models.Pelanggan.no_whatsapp)\
        .outerjoin(models. Pelanggan, models. Pesanan.pelanggan_id == models. Pelanggan.id)\
        .order_by(models. Pesanan.id.desc())\
        .all()
    
    data_pesanan = []
    for pesanan, nama_pelanggan, no_whatsapp in hasil_query:
        data_pesanan.append({
            "id_transaksi": pesanan.id_transaksi,
            "nama_pelanggan": nama_pelanggan or "Pelanggan Anonim",
            "no_whatsapp": no_whatsapp or "",
            "total_harga": pesanan.total_harga,
            "status_pesanan": pesanan.status_pesanan,
            "status_bayar": pesanan.status_bayar,
            "metode_pembayaran": pesanan.metode_pembayaran,
            "parfum": pesanan.parfum,
            "keterangan": pesanan.keterangan,
            "detail_layanan": pesanan.detail_layanan,
            "tracking_data": pesanan.tracking_data # INI DATA TRACKER KARYAWAN
        })
    return data_pesanan

from pydantic import BaseModel

# Skema kilat untuk menerima status baru
class UpdateStatusPesanan(BaseModel):
    status_pesanan: str
    status_bayar: str = None
    metode_pembayaran: str = None
    parfum: str = None
    keterangan: str = None
    tracking_data: str = None # MENERIMA JSON TRACKER DARI FRONTEND

@app.put("/api/pesanan/{id_transaksi}/")
def update_status_pesanan(id_transaksi: str, data: UpdateStatusPesanan, db: Session = Depends(get_db)):
    # Cari pesanan berdasarkan ID TRX
    pesanan = db.query(models.Pesanan).filter(models.Pesanan.id_transaksi == id_transaksi).first()
    if not pesanan:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan di database")
    
    # Timpa status lamanya dengan data baru dari modal HTML
    pesanan.status_pesanan = data.status_pesanan
    pesanan.status_bayar = data.status_bayar
    pesanan.metode_pembayaran = data.metode_pembayaran
    pesanan.parfum = data.parfum
    pesanan.keterangan = data.keterangan
    pesanan.tracking_data = data.tracking_data # SIMPAN KE DATABASE

    db.commit()
    return {"status": "Sukses", "pesan": f"Data pesanan {id_transaksi} berhasil diupdate secara menyeluruh"}

# ==========================================
# ENDPOINT PENGATURAN GLOBAL (PROFIL, PEGAWAI, DLL)
# ==========================================
class PengaturanUpdate(BaseModel):
    kunci: str
    nilai: str

@app.get("/api/pengaturan/")
def get_pengaturan(db: Session = Depends(get_db)):
    return db.query(models.Pengaturan).all()

@app.post("/api/pengaturan/")
def update_pengaturan(data: PengaturanUpdate, db: Session = Depends(get_db)):
    setting = db.query(models.Pengaturan).filter(models.Pengaturan.kunci == data.kunci).first()
    if setting:
        setting.nilai = data.nilai
    else:
        new_setting = models.Pengaturan(kunci=data.kunci, nilai=data.nilai)
        db.add(new_setting)
    db.commit()
    return {"status": "Sukses"}

# ==========================================
# API KHUSUS PUBLIK (TRACKING PELANGGAN)
# ==========================================
@app.get("/api/track/{id_transaksi}")
def lacak_pesanan_publik(id_transaksi: str, db: Session = Depends(get_db)):
    print(f"\n[DEBUG TRACKING] Ada pelanggan mencari ID: '{id_transaksi}'")
    
    pesanan = db.query(models.Pesanan).filter(models.Pesanan.id_transaksi == id_transaksi).first()
    
    if not pesanan:
        print("[DEBUG TRACKING] Hasil: GAGAL (ID tidak ditemukan di database)\n")
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")

    print("[DEBUG TRACKING] Hasil: SUKSES (Data dikirim ke pelanggan)\n")
    
    # Menghapus 'nama_pelanggan' demi keamanan data (Data Privacy) di jalur publik
    return {
        "id_transaksi": pesanan.id_transaksi,
        "status_pesanan": pesanan.status_pesanan,
        "status_bayar": pesanan.status_bayar,
        "total_harga": pesanan.total_harga,
        "detail_layanan": pesanan.detail_layanan,
        "tracking_data": pesanan.tracking_data,
        "tanggal_masuk": pesanan.id_transaksi[3:13] 
    }