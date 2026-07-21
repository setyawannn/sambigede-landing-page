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

## Cloudflare Pages

Untuk deploy ke Cloudflare Pages, gunakan konfigurasi berikut:

- Build command: `bun run build`
- Build output directory: `dist`
- Install command: `bun install`
- Root directory: folder repo ini

Output build menempatkan aset publik di `dist/client`, bundle SSR di `dist/server`, dan entry worker di `dist/_worker.js`, jadi direktori deploy yang benar adalah `dist`.

Jika ingin deploy via CLI, jalankan `bun run deploy:pages` setelah environment variable yang diperlukan sudah disiapkan di Cloudflare Pages.

### Agar Env Tidak Hilang Saat Build/Push

- `.env.local` hanya untuk lokal dan tidak ikut ke build Cloudflare Pages.
- Simpan semua variable di Cloudflare Pages project settings, lalu isi keduanya:
   - `Production`
   - `Preview`
- Untuk deploy Worker via Wrangler, file `wrangler.jsonc` sudah diset `keep_vars: true` agar variable yang disimpan di dashboard tidak dihapus saat deploy.
- Hindari menyimpan secret di repository. Gunakan dashboard Cloudflare atau secret manager CI/CD.

## Struktur Repositori Utama

- `src/routes/`: Router TanStack (hanya definisi route & loaders).
- `src/components/pages/`: UI halaman secara penuh dan dipecah per rute (e.g., `home/`, `berita/`).
- `src/components/shared/`: Komponen yang bisa dipakai di semua halaman (Header, Footer).
- `src/components/ui/`: Primitif antarmuka (Shadcn-UI).
- `convex/`: Logika backend dan database real-time.
