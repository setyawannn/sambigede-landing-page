/**
 * Image Compressor Utility (Client-side)
 * Menggunakan HTML5 Canvas untuk meresize dan mengkompres gambar menjadi format WebP
 * yang sangat optimal tanpa memerlukan library pihak ketiga berukuran besar.
 */

export interface CompressOptions {
  maxWidthOrHeight?: number; // Batasan maksimum dimensi (default 1200px)
  quality?: number; // Kualitas kompresi (0 - 1, default 0.8)
  format?: 'image/webp' | 'image/jpeg'; // Format output (default WebP)
  maxSizeMB?: number; // Peringatan jika file asal terlalu besar (default 5MB)
}

export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const {
    maxWidthOrHeight = 1200,
    quality = 0.8,
    format = 'image/webp',
    maxSizeMB = 5
  } = options;

  // Validasi ukuran maksimal
  if (file.size / 1024 / 1024 > maxSizeMB) {
    throw new Error(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`);
  }

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    throw new Error("File yang diunggah harus berupa gambar.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Hitung rasio
        let width = img.width;
        let height = img.height;

        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi Canvas 2D Context"));
          return;
        }

        // Untuk gambar transparent (PNG) yang dikonversi ke JPEG, kita butuh background putih
        if (format === 'image/jpeg' && file.type === 'image/png') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas ke Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Gagal mengkompresi gambar"));
            return;
          }
          
          // Mempertahankan nama asli, tetapi dengan ekstensi sesuai format
          const ext = format === 'image/webp' ? '.webp' : '.jpg';
          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ext;
          
          const compressedFile = new File([blob], newFileName, {
            type: format,
            lastModified: Date.now(),
          });
          
          resolve(compressedFile);
        }, format, quality);
      };
      
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
    };
    
    reader.onerror = () => reject(new Error("Gagal membaca file"));
  });
}
