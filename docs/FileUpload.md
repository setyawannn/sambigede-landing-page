# Dokumentasi Pengelolaan Berkas & Unggahan (Cloudflare R2)

Sistem unggah berkas (file upload) pada proyek Desa Sambigede ini dirancang secara profesional dengan arsitektur **Serverless Presigned URL** dan **Client-Side Image Compression**. Pendekatan ini memastikan aplikasi berjalan sangat cepat, hemat bandwidth, dan mampu menangani gambar berkualitas tinggi tanpa membebani server backend (Convex) maupun edge functions (TanStack Start Server Functions).

## Arsitektur Sistem

1. **Kompresi Klien (Client-Side)**: Gambar dikompresi langsung di browser pengguna (menggunakan HTML5 Canvas) sebelum diunggah. Gambar resolusi besar diubah ukurannya maksimal `1200px` dan dikonversi ke format **WebP**, menjadikan ukuran file akhir biasanya hanya ~50-200 KB.
2. **Presigned URL**: Browser meminta izin unggah (URL khusus satu kali pakai) ke Cloudflare R2 melalui fungsi server (Server Functions).
3. **Direct Upload**: Browser mengunggah file langsung ke Cloudflare R2 (S3-compatible) menggunakan URL tersebut tanpa mem-proxy file melalui server aplikasi.
4. **Penyimpanan Meta**: URL publik yang dihasilkan disimpan ke dalam database Convex.

---

## Prasyarat Lingkungan (Environment Variables)

Pastikan file `.env.local` Anda memiliki konfigurasi berikut. Dapatkan nilainya dari [Cloudflare Dashboard -> R2](https://dash.cloudflare.com):

```env
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key"
R2_SECRET_ACCESS_KEY="your_r2_secret_key"
R2_BUCKET_NAME="sambigede-assets"
VITE_R2_PUBLIC_URL="https://pub-your-bucket-id.r2.dev"
```

> [!WARNING]
> Jangan pernah membagikan nilai `R2_SECRET_ACCESS_KEY` ke sisi klien (browser). Semua operasi otentikasi R2 dilakukan secara rahasia di dalam fungsi server (`src/lib/r2.ts`).

---

## API Reference

Sistem ini didukung oleh dua fungsi utilitas utama:

### 1. Utilitas Kompresi Gambar (`src/lib/image-compressor.ts`)

Menggunakan HTML5 API bawaan (`Canvas` & `FileReader`), fungsi ini tidak memerlukan dependensi eksternal, sehingga tidak menambah beban (bundle size) aplikasi Anda.

```typescript
import { compressImage } from '../lib/image-compressor'

// Penggunaan standar:
const compressedFile = await compressImage(rawFile, {
  maxWidthOrHeight: 1200, // Dimensi maksimal
  quality: 0.8, // Kualitas (0 - 1)
  format: 'image/webp', // Output ('image/webp' atau 'image/jpeg')
  maxSizeMB: 5, // Maksimal ukuran awal
})
```

### 2. Fungsi Server R2 (`src/lib/r2.ts`)

Menggunakan `@aws-sdk/client-s3` di sisi server TanStack Start.

- **`getPresignedUploadUrl({ filename, contentType })`**: Meminta URL unggahan dari R2.
- **`deleteFileFromR2({ fileKey })`**: Menghapus file di R2.

---

## Panduan Penggunaan Lengkap (Cara Pengkodingan)

Berikut adalah contoh praktis dari awal hingga akhir (_end-to-end_) cara membuat form komponen UI untuk mengunggah gambar dan menyimpannya di Convex.

### Contoh Implementasi pada Form (React Component)

```tsx
import { useState } from 'react'
import { compressImage } from '../../lib/image-compressor'
import { getPresignedUploadUrl } from '../../lib/r2'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export default function ContohFormUnggah() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const simpanDataKeConvex = useMutation(api.berita.createBerita) // Contoh mutasi

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadDanSimpan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert('Pilih gambar terlebih dahulu')

    setIsLoading(true)
    try {
      // 1. Kompresi gambar di sisi klien
      const compressedFile = await compressImage(file, {
        maxWidthOrHeight: 1200,
        quality: 0.8,
      })

      // 2. Minta URL Unggah (Presigned) dari Server
      const presignedData = await getPresignedUploadUrl({
        data: {
          filename: compressedFile.name,
          contentType: compressedFile.type,
        },
      })

      if (!presignedData.success) {
        throw new Error(
          presignedData.error || 'Gagal mendapatkan presigned URL',
        )
      }

      // 3. Unggah file yang sudah dikompresi langsung ke Cloudflare R2
      const uploadResponse = await fetch(presignedData.uploadUrl, {
        method: 'PUT',
        body: compressedFile,
        headers: {
          'Content-Type': compressedFile.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Gagal mengunggah file ke Cloudflare R2')
      }

      // 4. Simpan URL file publik ke database Convex
      await simpanDataKeConvex({
        judul: 'Judul Berita',
        konten: 'Konten berita...',
        gambar: presignedData.fileUrl, // URL publik yang siap di-render di <img>
        fileKey: presignedData.fileKey, // (Opsional) Simpan file key jika sewaktu-waktu ingin menghapus dari bucket
      })

      alert('Berhasil mengunggah file dan menyimpan data!')
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleUploadDanSimpan} className="flex flex-col gap-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#6B8E23] text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Mengunggah...' : 'Simpan Berita'}
      </button>
    </form>
  )
}
```

### Cara Mengelola Penghapusan Berkas

Ketika Anda menghapus baris data di Convex (misal: Menghapus Berita), sangat disarankan untuk ikut menghapus gambar fisiknya dari bucket R2 agar tidak memenuhi kapasitas penyimpanan.

**Langkah Penghapusan (Client-Side):**

```tsx
import { deleteFileFromR2 } from '../../lib/r2'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

const hapusDataBerita = async (idBerita: string, fileKeyGambar: string) => {
  try {
    // 1. Hapus gambar secara fisik di Cloudflare R2
    if (fileKeyGambar) {
      const deleteResult = await deleteFileFromR2({
        data: { fileKey: fileKeyGambar },
      })
      if (!deleteResult.success) console.warn('Gagal menghapus file dari R2')
    }

    // 2. Hapus dokumen di database Convex
    await hapusBeritaConvex({ id: idBerita })
  } catch (error) {
    console.error(error)
  }
}
```

---

## Best Practices & Tips Profesional

1. **Efisiensi Cloudflare R2**: Karena R2 tidak memungut biaya egress (gratis lalu lintas keluar data), teknik _direct client upload_ ini meminimalkan biaya _workers invocation_ dari Cloudflare Pages.
2. **UX (User Experience)**: Tampilkan _loading state_ (contoh: persentase angka unggahan atau spinner) karena proses pengunggahan PUT HTTP dapat memakan waktu selama 1-2 detik tergantung kecepatan koneksi klien.
3. **Pembersihan Rutin (Garbage Collection)**: Jika Anda khawatir ada "URL yatim piatu" (berkas terunggah tetapi data Convex gagal disimpan), sangat disarankan menyimpan riwayat `fileKey` sementara atau melakukan script pencocokan bucket & convex setiap bulan.
4. **Lebar Responsif (Frontend)**: Meskipun file sudah dikompresi menjadi WebP dengan kualitas tinggi, usahakan tetap memuat gambar tersebut dalam HTML menggunakan properti `loading="lazy"` agar performa _Lighthouse_ Google tetap optimal.

---

## Masalah Umum: Pemblokiran DNS & Gambar Tidak Tampil (Jaringan Telkom/Indihome)

Ketika menggunakan subdomain publik default dari Cloudflare R2 (`https://pub-*.r2.dev`), Anda mungkin menemukan masalah di mana berkas berhasil diunggah ke R2, namun gambar preview di halaman web tidak muncul (error koneksi / _Connection Refused_).

### Penyebab

Penyedia layanan internet (ISP) di Indonesia, khususnya **Telkom Group (Indihome & Telkomsel)**, memblokir domain bawaan `*.r2.dev` menggunakan sistem DNS hijacking mereka (Internet Positif). Hal ini mengakibatkan browser tidak dapat melakukan `GET` request untuk mengambil gambar tersebut dari jaringan lokal Indonesia.

### Cara Mengatasi

#### 1. Ujicoba di Lingkungan Lokal (Development)

Untuk keperluan pengembangan atau ujicoba lokal, aktifkan VPN atau **Cloudflare WARP (1.1.1.1)** pada komputer Anda. Dengan melompati DNS resolver milik ISP, gambar R2 akan langsung termuat secara normal.

#### 2. Kebutuhan Rilis Resmi (Production)

Agar warga desa (sebagai pengunjung umum) dapat melihat gambar berita tanpa harus menyalakan VPN/WARP, Anda wajib menggunakan **Custom Domain** untuk bucket R2 Anda:

1. Buka **Cloudflare Dashboard** -> **R2** -> pilih bucket `sambigede-landing-page`.
2. Klik tab **Settings**.
3. Cari bagian **Public Access** -> **Custom Domains**.
4. Klik **Connect Domain**, lalu masukkan subdomain Anda (misalnya: `media.sambigede.desa.id` atau `assets.sambigede.desa.id`).
5. DNS record akan dikonfigurasi secara otomatis oleh Cloudflare.
6. Perbarui nilai `VITE_R2_PUBLIC_URL` di file `.env.local` Anda menggunakan alamat domain baru tersebut:
   ```env
   VITE_R2_PUBLIC_URL="https://media.sambigede.desa.id"
   ```

> [!NOTE]
> Custom Domain tidak diblokir oleh ISP Indonesia karena tidak mengandung domain bawaan `r2.dev`, sehingga gambar dapat diakses oleh siapa saja dengan lancar.
