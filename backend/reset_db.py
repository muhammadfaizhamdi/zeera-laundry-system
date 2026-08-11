from database import SessionLocal, engine
from sqlalchemy import text
import models

db = SessionLocal()
try:
    # Menghapus tabel layanan dan pesanan agar skema baru (outlet_id) bisa masuk
    db.execute(text("DROP TABLE IF EXISTS pesanan CASCADE;"))
    db.execute(text("DROP TABLE IF EXISTS layanan CASCADE;"))
    db.commit()
    print("Tabel pesanan dan layanan berhasil direset!")
except Exception as e:
    print(f"Gagal mengosongkan: {e}")
finally:
    db.close()

# Memaksa pembuatan ulang tabel dengan kolom outlet_id terbaru
models.Base.metadata.create_all(bind=engine)