# 🎬 MovieList

**MovieList** adalah aplikasi web pustaka film pribadi (*Personal Movie Library*) yang dibangun menggunakan **React** dan **Vite**. Aplikasi ini memudahkan pengguna menjelajahi koleksi film, mencari judul, melihat detail, mengelola favorit, serta membuat profil pengguna.

## 🚀 Fitur Utama

- **Home & Movie Catalog**: Menampilkan koleksi film dalam bentuk kartu.
- **Search & Genre Filter**: Mencari film berdasarkan judul dan menyaring berdasarkan genre.
- **Movie Detail**: Melihat poster, rating, tahun rilis, durasi, sutradara, dan sinopsis.
- **Add, Edit, Delete Movie**: Mengelola data koleksi film.
- **Poster Preview**: Melihat pratinjau poster sebelum film disimpan.
- **Upload Poster**: Memilih poster dari perangkat (JPG, PNG, WEBP, atau GIF). Gambar otomatis diperkecil dan disimpan sebagai JPEG agar lebih hemat ruang.
- **Poster URL Validation**: Memeriksa apakah URL poster dapat dimuat. Jika gagal, pengguna mendapat pesan dan dapat mengganti URL atau mengunggah gambar.
- **Favorites**: Menyimpan daftar film favorit untuk setiap akun.
- **Account & Profile**: Registrasi, login, logout, avatar, bio, dan edit profil.
- **404 Not Found**: Menangani alamat halaman yang tidak ditemukan.

## 🛠️ Teknologi yang Digunakan

- **React** untuk membangun antarmuka.
- **JavaScript** untuk logika aplikasi.
- **Vite** untuk development server dan proses build.
- **CSS** untuk styling dan tampilan responsif.
- **React Router DOM** untuk navigasi halaman.
- **Lucide React** untuk ikon.
- **Local Storage** untuk menyimpan akun, profil, koleksi film, dan favorit pada browser.

## 📁 Struktur Folder

```text
movielist/
├── public/
├── src/
│   ├── assets/
│   ├── components/      # Navbar, Footer, MovieCard, MovieForm, SearchBar, Poster
│   ├── data/            # Data awal film (movies.js)
│   ├── pages/           # Home, Favorites, MovieDetail, Account, NotFound
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## ▶️ Menjalankan Aplikasi

Pastikan Node.js sudah terpasang. Buka terminal di folder `movielist`, kemudian jalankan:

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal.

## ℹ️ Catatan Penyimpanan dan Akun

Aplikasi ini merupakan proyek pembelajaran sisi depan (*front-end*). Data akun, profil, film, dan favorit disimpan di Local Storage browser, sehingga tidak tersinkron antarperangkat. Poster yang diunggah diperkecil dan disimpan sebagai data gambar di browser. Kapasitas Local Storage terbatas; jika koleksi poster terlalu banyak, penyimpanan browser dapat penuh.

Untuk aplikasi produksi, sebaiknya gunakan backend, database, penyimpanan file, serta sistem autentikasi yang benar. Jangan gunakan password penting atau password yang dipakai di layanan lain pada versi demo ini.
