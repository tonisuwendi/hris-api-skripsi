import envConfig from '@/config/env.config';
import { s3Client } from '@/config/s3Client.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadFile = async (
  buffer: Buffer,
  key: string,
  contentType: string,
) => {
  const command = new PutObjectCommand({
    Bucket: envConfig.s3Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  return `${envConfig.s3Endpoint}/${envConfig.s3Bucket}/${key}`;
};
