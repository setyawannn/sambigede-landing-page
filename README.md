# Sambigede Landing Page

Website pendaratan dan portal informasi Desa Sambigede, dibangun menggunakan arsitektur frontend termodern:

- **Framework:** React 19 + Vite + TanStack Start (SSR/SPA)
- **Routing:** TanStack Router
- **Data & State:** TanStack Query + Convex (Real-time Database)
- **Styling:** Tailwind CSS v4 + Shadcn UI

## Arsitektur & Panduan

Harap tinjau [architecture.md](./architecture.md) atau `C:\Users\Setyawannn\.gemini\antigravity\brain\<conversation-id>/architecture.md` untuk pedoman standar pengkodean mendalam.
Aturan tambahan asisten AI tersimpan di `.agents/AGENTS.md`.

## Instalasi & Menjalankan Lokal

1. **Install dependensi (Gunakan Bun):**

   ```bash
   bun install
   ```

2. **Inisialisasi Lingkungan (Env):**
   Pastikan file `.env.local` sudah ada dengan isi (minimal):

   ```
   VITE_CONVEX_URL=https://robust-grasshopper-700.convex.site
   ```

3. **Jalankan Development Server:**
   ```bash
   bun --bun run dev
   ```

## Skrip Utama

- `bun run dev` - Menjalankan server pengembangan.
- `bun run build` - Melakukan build production.
- `bun run lint` - Melakukan linting (menggunakan ESLint, Convex dan Mockup telah di-ignore).
- `bun run format` - Menjalankan Prettier.
- `bun run check` - Memeriksa format kode.

## Struktur Repositori Utama

- `src/routes/`: Router TanStack (hanya definisi route & loaders).
- `src/components/pages/`: UI halaman secara penuh dan dipecah per rute (e.g., `home/`, `berita/`).
- `src/components/shared/`: Komponen yang bisa dipakai di semua halaman (Header, Footer).
- `src/components/ui/`: Primitif antarmuka (Shadcn-UI).
- `convex/`: Logika backend dan database real-time.
