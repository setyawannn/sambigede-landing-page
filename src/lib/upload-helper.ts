import { compressImage } from './image-compressor'
import type { CompressOptions } from './image-compressor'
import { uploadFileToServer } from './r2'

export interface UploadResult {
  success: boolean
  fileUrl?: string
  fileKey?: string
  error?: string
}

/**
 * Konversi File menjadi base64 string (tanpa prefix data:image/...)
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1] // hilangkan "data:image/png;base64,"
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

/**
 * Helper komprehensif untuk mengunggah file ke Cloudflare R2 via Server Function
 */
export async function uploadFileHelper(
  file: File,
  options: CompressOptions = { maxWidthOrHeight: 1200, quality: 0.8 },
): Promise<UploadResult> {
  try {
    let fileToUpload = file

    // 1. Lakukan kompresi otomatis jika tipe file adalah gambar
    if (file.type.startsWith('image/')) {
      fileToUpload = await compressImage(file, options)
    }

    // 2. Konversi ke base64 agar aman ditransfer ke server function
    const base64Data = await fileToBase64(fileToUpload)

    // 3. Panggil fungsi server yang akan meneruskan ke Cloudflare R2
    const uploadResult = await uploadFileToServer({
      data: {
        filename: fileToUpload.name,
        contentType: fileToUpload.type,
        base64Data,
      },
    })

    if (!uploadResult.success) {
      throw new Error(
        uploadResult.error || 'Gagal mengunggah file ke R2 melalui server.',
      )
    }

    return {
      success: true,
      fileUrl: uploadResult.fileUrl,
      fileKey: uploadResult.fileKey,
    }
  } catch (error: any) {
    console.error('Kesalahan unggah:', error)
    return {
      success: false,
      error:
        error.message ||
        'Terjadi kesalahan yang tidak diketahui saat mengunggah file.',
    }
  }
}
