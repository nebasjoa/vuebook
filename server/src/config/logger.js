import pino from 'pino';
import { config } from './env.js';


export const logger = pino({
level: config.isProd ? 'info' : 'debug',
transport: config.isProd ? undefined : { target: 'pino-pretty', options: { translateTime: 'SYS:standard' } }
});