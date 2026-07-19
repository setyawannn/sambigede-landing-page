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
 * Server Function: uploadFileToServer
 * Menerima file dalam bentuk base64 dan mengunggahnya langsung ke R2 dari server (menghindari isu CORS di browser)
 */
export const uploadFileToServer = createServerFn({ method: "POST" })
  .validator((d: { filename: string; contentType: string; base64Data: string }) => d)
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
      
      const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${uniqueFilename}`);
      
      // Convert base64 back to buffer
      // In Edge/Cloudflare, we might need atob and Uint8Array if Buffer is not available,
      // but Tanstack Start uses Node server initially. Let's use standard atob for edge compatibility.
      const binaryString = atob(data.base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const response = await aws.fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": data.contentType,
          "Content-Length": bytes.length.toString(),
        },
        body: bytes,
      });

      if (!response.ok) {
         throw new Error(`Upload gagal dengan status ${response.status}: ${await response.text()}`);
      }

      const fileUrl = `${publicUrl.replace(/\/$/, "")}/${uniqueFilename}`;

      return { success: true, fileUrl, fileKey: uniqueFilename };
    } catch (error: any) {
      console.error("Gagal mengunggah file via Server:", error);
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
