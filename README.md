# 180DC UNAIR - IT Analyst Test Case (Frontend)

Repositori ini berisi solusi teknis untuk tes seleksi **IT Analyst** di **180 Degrees Consulting Universitas Airlangga**. Proyek ini difokuskan pada pengembangan antarmuka pengguna (Frontend) yang terintegrasi dengan REST API resmi, dengan penekanan pada penyelesaian masalah (*problem solving*) terkait kendala infrastruktur backend.

## Fitur Utama

- **Sistem Autentikasi**: Login dan Register menggunakan JWT (JSON Web Token).
- **Manajemen Produk**: Menampilkan daftar produk dengan fitur pencarian, pengurutan (*sorting*), dan paginasi.
- **Interceptors Axios**: Penanganan otomatis token Bearer pada setiap request dan redirect otomatis saat sesi berakhir (401/405).
- **Advanced API Proxying**: Implementasi Next.js API Routes untuk mengatasi masalah CORS (*Cross-Origin Resource Sharing*) dan Preflight (OPTIONS) pada server produksi.
- **Dual Mode Backend**: Kemampuan beralih antara API Vercel yang disediakan dan Backend kustom untuk memastikan ketersediaan layanan selama demonstrasi. link backend [https://github.com/ThenmusteSatrio/backend_180dc_test_case.git]

## Teknologi yang Digunakan

- **Framework**: Next.js 16 (App Router)
- **Bahasa**: TypeScript
- **State Management & Fetching**: Axios & React Hooks
- **Styling**: Tailwind CSS
- **Tools**: Lucide React (Icons), LocalStorage (Token Persistance)

## Arsitektur Solusi (Problem Solving)

Selama pengembangan, ditemukan kendala teknis pada API backend resmi (`test-180dc.vercel.app`):
1. **CORS Error**: Browser memblokir permintaan langsung karena kebijakan keamanan.
2. **405 Method Not Allowed**: Masalah pada penanganan metode `OPTIONS` (Preflight) saat menyertakan header Authorization.
3. **500 Internal Server Error**: Terjadi pada endpoint *Post Product* meskipun payload sudah valid sesuai dokumentasi.

**Solusi yang diimplementasikan:**
- Membuat **API Proxy** di `app/api/remote/[...path]/route.ts`. Ini memungkinkan permintaan dilakukan di sisi server (Node.js) sehingga melewati aturan CORS browser.
- Menambahkan **Dual Backend Support** di instance Axios untuk memungkinkan transisi ke backend kustom (milik pengembang) jika server utama mengalami kendala fungsional, memastikan presentasi tetap berjalan lancar.

##  Instalasi & Menjalankan Proyek

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/ThenmusteSatrio/frontend_180dc_test_case.git
   cd frontend_180dc_test_case

2. **Instal Dependensi:**
   ```bash
    npm run dev
    # atau jika menggunakan pnpm
    pnpm dev

3. **Instal Dependensi:**
   ```bash
   npm run dev 
   # atau jika menggunakan pnpm
    pnpm run dev

## Konfigurasi Perpindahan Backend

Proyek ini mendukung pergantian sumber data secara cepat melalui file `services/api.ts`. Hal ini memastikan aplikasi tetap fungsional jika salah satu server mengalami kendala.

### Cara mengubah sumber API:

1. Buka file `services/api.ts`.
2. Ubah variabel `USE_CUSTOM_BACKEND`:
   - `false`: Menggunakan API Vercel resmi melalui proxy `/api/remote`.
   - `true`: Menggunakan Backend kustom lokal (`http://localhost:4000/api/v1`).

```typescript
const USE_CUSTOM_BACKEND = false; // Ubah ke true untuk beralih ke backend kustom

## Struktur Folder

Proyek ini menggunakan **Next.js App Router** dengan struktur folder yang mengutamakan pemisahan tanggung jawab (*Separation of Concerns*):

```text
├── app/
│   ├── api/remote/           # Implementasi API Proxy (Next.js API Routes)
│   ├── login/                # Halaman Autentikasi Login
│   ├── register/             # Halaman Autentikasi Register
│   └── products/             # Halaman Dashboard & Manajemen Produk
├── components/               # Komponen UI (Re-usable Components)
├── lib/
│   └── auth.ts               # Utilitas Manajemen Token (LocalStorage)
├── services/
│   ├── api.ts                # Konfigurasi Axios & Interceptors
│   └── product.service.ts    # Layer Abstraksi untuk pemanggilan API
└── public/                   # Aset Statis (Logo, Ikon)

