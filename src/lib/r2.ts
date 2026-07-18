import { createServerFn } from "@tanstack/react-start";
import { AwsClient } from "aws4fetch";

// Inisialisasi AWS Client (kompatibel penuh dengan Vite SSR dan Edge/Cloudflare)
const getAwsClient = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Kredensial Cloudflare R2 tidak lengkap di environment variables.");
  }

  return new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });
};

/**
 * Server Function: getPresignedUploadUrl
 */
export const getPresignedUploadUrl = createServerFn({ method: "POST" })
  .validator((d: { filename: string; contentType: string }) => d)
  .handler(async ({ data }) => {
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.VITE_R2_PUBLIC_URL;
    const accountId = process.env.R2_ACCOUNT_ID;

    if (!bucketName || !publicUrl || !accountId) {
      throw new Error("Konfigurasi R2 Bucket Name atau Public URL belum diatur.");
    }

    try {
      const aws = getAwsClient();
      const uniqueFilename = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      
      // Cloudflare R2 endpoint URL (Path Style)
      const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${uniqueFilename}`);
      
      // Menandatangani (sign) request untuk menghasilkan Presigned URL
      const signedRequest = await aws.sign(url, {
        method: "PUT",
        headers: {
          "Content-Type": data.contentType,
        },
        aws: { signQuery: true } // Mengharuskan signature di URL parameters, bukan header
      });

      const fileUrl = `${publicUrl.replace(/\/$/, "")}/${uniqueFilename}`;

      return { success: true, uploadUrl: signedRequest.url, fileUrl, fileKey: uniqueFilename };
    } catch (error: any) {
      console.error("Gagal membuat Presigned URL:", error);
      return { success: false, error: error.message };
    }
  });

/**
 * Server Function: deleteFileFromR2
 */
export const deleteFileFromR2 = createServerFn({ method: "POST" })
  .validator((d: { fileKey: string }) => d)
  .handler(async ({ data }) => {
    const bucketName = process.env.R2_BUCKET_NAME;
    const accountId = process.env.R2_ACCOUNT_ID;

    if (!bucketName || !accountId) {
      throw new Error("Konfigurasi R2 Bucket Name belum diatur.");
    }

    try {
      const aws = getAwsClient();
      const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${data.fileKey}`);

      // Eksekusi DELETE request
      const response = await aws.fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Gagal menghapus file: ${response.status} ${response.statusText}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Gagal menghapus file dari R2:", error);
      return { success: false, error: error.message };
    }
  });
