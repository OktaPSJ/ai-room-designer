# 🚀 Quick Start Guide - AI Room Designer

## Cara Tercepat untuk Memulai

### 1️⃣ Jalankan Server

**Mac/Linux:**
```bash
./start_server.sh
```

**Windows:**
```bash
start_server.bat
```

Server akan otomatis:
- ✅ Mengecek dependencies
- ✅ Membuat file .env jika belum ada
- ✅ Menjalankan development server
- ✅ Membuka di http://localhost:5173

### 2️⃣ Dapatkan Gemini API Key (GRATIS)

1. Buka: https://makersuite.google.com/app/apikey
2. Login dengan Google account
3. Klik "Create API Key"
4. Copy API key yang didapat

### 3️⃣ Tambahkan API Key

Edit file `.env` dan tambahkan API key:
```
VITE_GEMINI_API_KEY=AIzaSy...your_key_here
```

### 4️⃣ Restart Server

Tekan `Ctrl+C` untuk stop server, lalu jalankan lagi:
```bash
./start_server.sh
```

### 5️⃣ Mulai Menggunakan!

1. Buka http://localhost:5173 di browser
2. Upload foto ruangan kosong
3. Pilih style yang diinginkan
4. Klik "Generate AI Design Suggestions"
5. Lihat hasilnya! 🎉

---

## Troubleshooting

### Server tidak jalan?
```bash
# Install dependencies dulu
npm install

# Lalu jalankan
./start_server.sh
```

### AI tidak bekerja?
- Pastikan API key sudah ditambahkan ke `.env`
- Restart server setelah menambahkan API key
- Cek console browser untuk error messages

### Port 5173 sudah dipakai?
```bash
# Edit vite.config.js dan ubah port
# Atau stop aplikasi yang menggunakan port tersebut
```

---

## Tips Penggunaan

### Free Tier
- 3 uploads per hari
- Limit reset setiap tengah malam
- Hasil ada watermark
- Tampil iklan

### Upgrade ke Premium (Demo)
1. Klik "Try Premium" di header
2. Masukkan email
3. Enjoy unlimited features!

---

## Perintah Berguna

```bash
# Start server
./start_server.sh

# Build untuk production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

---

**Selamat mencoba! 🎨✨**
