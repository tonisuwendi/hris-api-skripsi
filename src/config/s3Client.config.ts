import { S3Client } from '@aws-sdk/client-s3';
import envConfig from './env.config';

export const s3Client = new S3Client({
  region: envConfig.s3Region,
  endpoint: envConfig.s3Endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: envConfig.s3AccessKey,
    secretAccessKey: envConfig.s3SecretKey,
  },
});
