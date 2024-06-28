import dotenv from 'dotenv';
import type { CorsOptions } from 'cors';

dotenv.config();

const { env } = process;
const whitelistOrigin = ['http://localhost:3000', 'http://localhost:3001'];

// (OPTIONAL) If we wanted to develop it for the frontend
const corsOption: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || !whitelistOrigin.includes(origin)) {
            return callback(null, false);
        }

        return callback(null, origin);
    },
    /** Some legacy browsers (IE11, various SmartTVs) choke on 204 */
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true,
};

const config = {
    jwt: {
        accessSecret: env.JWT_SECRET!,

        accessExpire: env.JWT_ACCESS_EXPIRE!,
    },
    hashRounds: 12,
    cors: corsOption,
    isDev: (env.NODE_ENV === 'development'),
};

export default config;