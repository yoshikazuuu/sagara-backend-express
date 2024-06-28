"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("winston-daily-rotate-file");
const config_1 = __importDefault(require("../configs/config"));
const winston_1 = require("winston");
const luxon_1 = require("luxon");
function customPrintFormat() {
    return winston_1.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`);
}
const customTimestampFormat = (0, winston_1.format)((info) => {
    const loggerDateFormat = 'yyyy-MM-dd - HH:mm:ss ZZ';
    const currDate = luxon_1.DateTime.now();
    info.timestamp = currDate.toFormat(loggerDateFormat);
    return info;
});
const logger = (0, winston_1.createLogger)({
    level: (config_1.default.isDev ? 'debug' : 'info'),
    format: customTimestampFormat(),
    transports: [
        new winston_1.transports.DailyRotateFile({
            dirname: './logs',
            filename: '%DATE%.log',
            format: customPrintFormat(),
        }),
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), customPrintFormat()),
        }),
    ],
});
exports.default = logger;
