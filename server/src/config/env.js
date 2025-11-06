import dotenv from 'dotenv';


dotenv.config();


const required = (key, fallback = undefined) => {
const v = process.env[key] ?? fallback;
if (v === undefined || v === '') throw new Error(`Missing required env: ${key}`);
return v;
};


export const config = {
env: process.env.NODE_ENV || 'development',
isProd: (process.env.NODE_ENV || 'development') === 'production',
port: parseInt(process.env.PORT || '3000', 10),
corsOrigin: process.env.CORS_ORIGIN || '*',
jwtSecret: required('JWT_SECRET', 'dev_only_secret'),
db: {
host: required('DB_HOST', 'localhost'),
port: parseInt(process.env.DB_PORT || '3306', 10),
user: required('DB_USER', 'root'),
password: required('DB_PASSWORD', ''),
database: required('DB_NAME', 'carvestigate'),
connectionLimit: parseInt(process.env.DB_CONN_LIMIT || '10', 10)
},
// redisUrl: process.env.REDIS_URL || ''
};