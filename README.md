# Toko Online - Template Website

Template website toko makanan (bakso, mie ayam, dll) dengan admin panel, social media popup, dan WhatsApp order.

## Fitur

- **Homepage** - Hero, menu produk, about, kontak, Google Maps
- **Admin Panel** - Kelola produk, kategori, pengaturan toko, gambar hero/about
- **Social Media** - Popup sidebar Facebook, Instagram, TikTok
- **Responsive** - Tampilan optimal di desktop dan mobile
- **WhatsApp Order** - Langsung pesan via WhatsApp
- **Image Upload** - Upload gambar produk dan gambar website

## Teknologi

- **Backend:** Express.js (Node.js)
- **Frontend:** HTML5, CSS3, JavaScript
- **Database:** JSON file (tidak perlu install database)
- **Auth:** bcryptjs + express-session

## Persiapan

1. Pastikan **Node.js** sudah terinstall (v16 atau lebih)
2. Clone/download project ini
3. Buka terminal di folder project

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example ke .env
cp .env.example .env

# 3. Edit .env sesuai kebutuhan toko Anda

# 4. Jalankan server
npm start
```

Server akan berjalan di `http://localhost:3000`

## Akses

| Halaman | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |

## Login Admin

- **Username:** `admin`
- **Password:** sesuai di file `.env`

## Konfigurasi (.env)

Buka file `.env` untuk mengatur:

```env
# Port
PORT=3000

# Admin credentials
ADMIN_USER=admin
ADMIN_PASSWORD=your-password-here

# Informasi Toko
STORE_NAME=Nama Toko Anda
STORE_ADDRESS=Jl. Contoh No. 123, Kota, Provinsi
STORE_PHONE=0812-3456-7890
STORE_HOURS=08:00 - 21:00
STORE_DESCRIPTION=Deskripsi singkat tentang toko Anda

# Social Media
FACEBOOK_URL=https://www.facebook.com/...
INSTAGRAM_URL=https://www.instagram.com/...
TIKTOK_URL=https://www.tiktok.com/@...
```

## Ganti Port

Jika port `3000` sudah terpakai, edit file `.env`:

```env
PORT=4000
```

Lalu jalankan ulang:
```bash
npm start
```

## Struktur Project

```
toko-online-template/
├── server.js           # Backend Express.js
├── package.json        # Dependencies
├── .env                # Konfigurasi environment
├── .env.example        # Template .env
├── .gitignore          # File yang di-ignore git
├── README.md           # Panduan ini
├── data/               # Database JSON (auto-create)
│   └── store.json      # Database toko (auto-create saat pertama kali run)
├── uploads/            # Gambar produk & website
├── views/              # Halaman HTML
│   ├── index.html      # Homepage
│   ├── login.html      # Login admin
│   └── dashboard.html  # Admin dashboard
└── public/
    ├── css/
    │   ├── style.css   # Frontend CSS
    │   └── admin.css   # Admin CSS
    └── js/
        ├── main.js     # Frontend JS
        └── admin.js    # Admin JS
```

## Cara Pakai untuk Toko Sendiri

1. Clone project ini
2. Edit `.env` dengan data toko Anda
3. Jalankan `npm install && npm start`
4. Login admin di `/admin/login`
5. Upload gambar hero dan foto toko di menu **Pengaturan > Gambar Website**
6. Tambahkan produk dan kategori sesuai kebutuhan

## Tips

- **Backup data:** Copy folder `data/` untuk backup database
- **Upload gambar:** Gambar disimpan di folder `uploads/`
- **Social media:** Klik ikon share di kiri atas homepage untuk popup social media
- **Admin panel:** Bisa edit semua pengaturan toko termasuk URL social media dan gambar website

## License

MIT
