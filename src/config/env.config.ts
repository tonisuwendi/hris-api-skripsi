import 'dotenv/config';

interface IEnvConfig {
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  jwtSecret: string;
  s3Region: string;
  s3Endpoint: string;
  s3Bucket: string;
  s3AccessKey: string;
  s3SecretKey: string;
  mlApiUrl: string;
  mlApiKey: string;
}

const envConfig: IEnvConfig = {
  dbHost: process.env.DB_HOST || '',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || '',
  jwtSecret: process.env.JWT_SECRET || '',
  s3Region: process.env.S3_REGION || '',
  s3Endpoint: process.env.S3_ENDPOINT || '',
  s3Bucket: process.env.S3_BUCKET || '',
  s3AccessKey: process.env.S3_ACCESS_KEY || '',
  s3SecretKey: process.env.S3_SECRET_KEY || '',
  mlApiUrl: process.env.ML_API_URL || '',
  mlApiKey: process.env.ML_API_KEY || '',
};

export default envConfig;
