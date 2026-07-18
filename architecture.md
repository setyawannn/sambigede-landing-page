# Arsitektur Proyek: Website Desa Sambigede

Dokumen ini menjelaskan aliran data, sistem routing, styling, dan standar pengelolaan *state* (manajemen keadaan) pada aplikasi Sambigede Landing Page.

## 1. Teknologi Dasar (Tech Stack)
- **Framework Frontend**: React 19 + Vite (SSR / SPA mode hybrid)
- **Routing & State**: TanStack Router & TanStack Query (via `@tanstack/react-router` dan `@tanstack/react-query`)
- **Backend & Database**: Convex (untuk real-time data & serverless functions)
- **Styling**: Tailwind CSS v4, dikustomisasi secara murni melalui `src/styles.css`
- **UI Primitives**: Shadcn-UI (terletak di `src/components/ui`)
- **Linting & Formatting**: ESLint (TanStack Config) + Prettier

## 2. Struktur Routing & Render (TanStack Router)
Routing dibangun menggunakan **file-based routing** di folder `src/routes/`.
- File **tidak** digunakan untuk meletakkan kode presentasi visual yang panjang.
- File route (misal `index.tsx`, `berita/$id.tsx`) bertugas sebagai kontroler. Mereka mendeklarasikan `loader` (data fetching), validasi pra-render, dan me-*return* pemanggilan komponen halaman dari `src/components/pages/`.
- Data dipanggil melalui **TanStack Query** (di-_wrap_ oleh `@convex-dev/react-query`) di dalam loader, memastikan data sudah siap saat halaman dimuat (prefetching).

## 3. Komposisi Antarmuka Pengguna (UI)
Seluruh halaman dibangun mengikuti konsep modular:
- **Pages** (`src/components/pages/`): Berisi komposisi utuh spesifik sebuah halaman (contoh: `Home.tsx`, `Profil.tsx`, dan sub-komponen terkait seperti `ProfilHeader.tsx`).
- **Shared** (`src/components/shared/`): Komponen utilitas global seperti Header, Footer, Menu Navigasi, atau Container.
- **UI** (`src/components/ui/`): Komponen dasar (primitives) yang di-generate dari Shadcn-UI (Button, Alert, Tabs, dll).

## 4. Manajemen State (State Management)
- **Server State**: Ditangani oleh **Convex** sebagai *Single Source of Truth*.
- **Sync State**: Di-manage oleh **TanStack Query** untuk optimasi pemanggilan REST/HTTP-like calls (loaders). Untuk data yang memerlukan reaktivitas instan (live dashboard/chart), gunakan `useQuery` milik Convex secara langsung.
- **Client State**: Sangat diminimalkan. Gunakan React Context murni atau TanStack Store hanya jika diperlukan untuk *state* UI murni yang sangat kompleks (misal: state pengaturan *theme* warna secara global).

## 5. Styling dengan Tailwind CSS v4
- Konfigurasi diletakkan secara terpusat di `src/styles.css` (tanpa `tailwind.config.js`).
- Warna utama (seperti `--lagoon`, `--sea-ink`) dikelola menggunakan *CSS Variables*.
- **Tidak** menggunakan utilitas gaya acak. Gunakan kelas tailwind yang mereferensikan variabel tema (contoh: `bg-[var(--sea-ink)]`).

## 6. Pengembangan Ke Depan
- Lakukan refactor besar dari *mockup* UI (misal yang berada dalam `website-desa-sambigede-ui`) secara bertahap.
- Jangan salin-tempel (copy-paste) halaman berukuran ratusan kilobytes (seperti `Admin.tsx`); pecah menjadi komponen UI diskrit dan tautkan datanya melalui mekanisme *loader* di Convex.
