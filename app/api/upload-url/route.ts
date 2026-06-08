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
  const { fileName, contentType } = body;

  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 });
  }

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey }
  });

  const key = `proof-of-funds/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ACL: 'private'
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 900 });
  return NextResponse.json({ uploadUrl: url, key, bucket });
}
