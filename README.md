# Bakso & Mie Ayam SMD - Website

Website resmi Bakso & Mie Ayam SMD, Samarinda, Kalimantan Timur.

## Fitur

- **Homepage** - Hero, menu produk, about, kontak, Google Maps Samarinda
- **Admin Panel** - Kelola produk, kategori, pengaturan toko, media sosial
- **Social Media** - Popup sidebar Facebook, Instagram, TikTok (kiri atas)
- **Responsive** - Tampilan optimal di desktop dan mobile
- **WhatsApp Order** - Langsung pesan via WhatsApp

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

# 2. Jalankan server
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
- **Password:** `admin123`

> Ganti password di file `.env` untuk keamanan.

## Konfigurasi (.env)

Buka file `.env` untuk mengatur:

```env
# Port (ganti jika port sudah terpakai)
PORT=3000

# Admin credentials
ADMIN_USER=admin
ADMIN_PASSWORD=admin123

# Informasi Toko
STORE_NAME=Bakso & Mie Ayam SMD
STORE_ADDRESS=Jl. P. Diponegoro No. 45, Samarinda, Kalimantan Timur
STORE_PHONE=0812-3456-7890
STORE_HOURS=08:00 - 21:00 WITA

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
website-bakso-smd/
├── server.js           # Backend Express.js
├── package.json        # Dependencies
├── .env                # Konfigurasi environment
├── .gitignore          # File yang di-ignore git
├── README.md           # Panduan ini
├── data/               # Database JSON (auto-create)
├── uploads/            # Gambar produk
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

## Tips

- **Backup data:** Copy folder `data/` untuk backup database
- **Upload gambar:** Gambar disimpan di folder `uploads/`
- **Social media:** Klik ikon share di kiri atas homepage untuk popup social media
- **Admin panel:** Bisa edit semua pengaturan toko termasuk URL social media

## License

MIT
# Noodle-Eatery
