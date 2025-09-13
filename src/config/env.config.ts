import 'dotenv/config';

interface IEnvConfig {
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  jwtSecret: string;
}

const envConfig: IEnvConfig = {
  dbHost: process.env.DB_HOST || '',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || '',
  jwtSecret: process.env.JWT_SECRET || '',
};

export default envConfig;
