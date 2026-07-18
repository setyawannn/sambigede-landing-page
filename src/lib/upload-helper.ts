import { compressImage } from "./image-compressor";
import type { CompressOptions } from "./image-compressor";
import { getPresignedUploadUrl } from "./r2";

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
}

/**
 * Helper komprehensif untuk mengunggah file ke Cloudflare R2
 * Proses yang terjadi:
 * 1. Jika file adalah gambar, lakukan kompresi sisi klien menggunakan Canvas.
 * 2. Meminta presigned URL unggah dari fungsi server.
 * 3. Melakukan upload (PUT HTTP) secara langsung dari browser ke R2.
 */
export async function uploadFileHelper(
  file: File, 
  options: CompressOptions = { maxWidthOrHeight: 1200, quality: 0.8 }
): Promise<UploadResult> {
  try {
    let fileToUpload = file;

    // 1. Lakukan kompresi otomatis jika tipe file adalah gambar
    if (file.type.startsWith("image/")) {
      fileToUpload = await compressImage(file, options);
    }

    // 2. Meminta Presigned URL dari server (melewati TanStack Start Server Function)
    const presignedData = await getPresignedUploadUrl({
      data: {
        filename: fileToUpload.name,
        contentType: fileToUpload.type,
      },
    });

    if (!presignedData.success || !presignedData.uploadUrl) {
      throw new Error(presignedData.error || "Gagal mendapatkan izin unggah dari server.");
    }

    // 3. Eksekusi unggahan langsung ke bucket R2
    const uploadResponse = await fetch(presignedData.uploadUrl, {
      method: "PUT",
      body: fileToUpload,
      headers: {
        "Content-Type": fileToUpload.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Gagal mengunggah file. Status: ${uploadResponse.status}`);
    }

    // Selesai, kembalikan URL publik dan Key (untuk identifikasi jika mau dihapus)
    return {
      success: true,
      fileUrl: presignedData.fileUrl,
      fileKey: presignedData.fileKey,
    };
    
  } catch (error: any) {
    console.error("Kesalahan unggah:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan yang tidak diketahui saat mengunggah file.",
    };
  }
}
