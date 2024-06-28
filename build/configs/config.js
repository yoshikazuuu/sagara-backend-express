"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { env } = process;
const whitelistOrigin = ['http://localhost:3000', 'http://localhost:3001'];
const corsOption = {
    origin: (origin, callback) => {
        if (!origin || !whitelistOrigin.includes(origin)) {
            return callback(null, false);
        }
        return callback(null, origin);
    },
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true,
};
const config = {
    jwt: {
        accessSecret: env.JWT_SECRET,
        accessExpire: env.JWT_ACCESS_EXPIRE,
    },
    hashRounds: 12,
    cors: corsOption,
    isDev: (env.NODE_ENV === 'development'),
};
exports.default = config;
