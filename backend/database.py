from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Format URL: postgresql://username:password@server:port/nama_database
# PENTING: Ganti "password_anda" dengan password PostgreSQL yang Anda buat saat instalasi
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:faiz123@localhost:5432/zeera_laundry"

# Membuat mesin koneksi
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Membuat sesi database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk membuat model tabel
Base = declarative_base()