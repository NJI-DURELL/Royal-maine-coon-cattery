import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/** Pull the S3 object key out of a stored proof URL (or accept a bare key). */
export function extractKey(urlOrKey: string): string {
  try {
    const u = new URL(urlOrKey);
    return decodeURIComponent(u.pathname.replace(/^\//, ''));
  } catch {
    return urlOrKey.replace(/^\//, '');
  }
}

/**
 * Generate a short-lived, signed GET URL so an admin can view a *private*
 * proof-of-funds document. Returns null if storage isn't configured or signing
 * fails — callers should treat that as "no viewable document".
 */
export async function presignProofView(proofUrl: string, expiresIn = 3600): Promise<string | null> {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !bucket || !accessKeyId || !secretAccessKey) return null;

  try {
    const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
    return await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: extractKey(proofUrl) }), { expiresIn });
  } catch {
    return null;
  }
}
