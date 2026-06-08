import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: 'S3 storage is not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { fileName, contentType, folder } = body;

  if (!fileName) {
    return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
  }

  // Some files (notably iPhone HEIC) report no MIME type — fall back to a default
  // rather than rejecting the upload.
  const resolvedContentType = contentType || 'application/octet-stream';

  // Kitten photos are shown publicly on the storefront; proof-of-funds stays private.
  const isKittenImage = folder === 'kittens';
  const prefix = isKittenImage ? 'kittens' : 'proof-of-funds';
  const acl = isKittenImage ? 'public-read' : 'private';
  const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey }
  });

  const key = `${prefix}/${Date.now()}-${safeName}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: resolvedContentType,
    ACL: acl
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 900 });
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  return NextResponse.json({ uploadUrl: url, key, bucket, publicUrl });
}
