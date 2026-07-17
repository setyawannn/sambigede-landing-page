# Aturan Proyek & Standar Pengkodean (Sambigede Landing Page)

Aturan ini harus dipatuhi oleh asisten AI saat berkontribusi pada repositori ini.

## Arsitektur & Manajemen Berkas
1. **Pemisahan UI dan Routing**:
   - `src/routes/`: Hanya untuk routing, loaders (TanStack Query), dan inisialisasi state awal.
   - `src/components/pages/`: Berisi semua implementasi UI spesifik dari halaman tersebut. Subkomponen halaman (seperti `Card`, `Hero`) harus ditempatkan pada masing-masing foldernya, e.g., `src/components/pages/berita/BeritaCard.tsx`.
2. **Komponen Bersama**: 
   - `src/components/shared/`: Layout global (Header, Footer).
   - `src/components/ui/`: Komponen primitives (menggunakan Shadcn).

## Styling
- Proyek ini menggunakan **Tailwind CSS v4**. Tidak ada `tailwind.config.js`. Tema, base colors, dan utilitas dikustomisasi langsung dalam `src/styles.css` melalui instruksi `@theme` dan `--color-*`.
- Semua gaya utilitas inline sebaiknya direfaktor menggunakan komponen UI yang bersih jika sudah terlalu padat.

## Data Fetching
- Gunakan integrasi `@convex-dev/react-query` untuk menangani *caching* dan pembacaan state via **TanStack Query**.
- Real-time/live updates ditangani menggunakan `useQuery` langsung dari `convex/react` secara bijaksana agar tidak membocorkan logika backend ke frontend.

## TypeScript & Kualitas Kode
- Hindari `any`. Pastikan antarmuka/struktur didefinisikan secara eksplisit.
- Jika import digunakan secara eksklusif untuk typing, wajib memakai format `import type { ... }` untuk memudahkan eliminasi saat bundler bekerja.
- Pastikan berkas UI tidak melampaui ~300 baris kode dengan memecahnya ke dalam sub-komponen fungsional secara modular.
