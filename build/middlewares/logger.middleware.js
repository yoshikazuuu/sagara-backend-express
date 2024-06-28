"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
let LoggerMiddleware = class LoggerMiddleware {
    constructor() {
        this.logFormat =
            '":method :url" :status - ' +
                ':response-time ms ":user-agent"';
        this.streamOption = {
            write(str) {
                logger_util_1.default.info(str.trim());
            },
        };
    }
    use(req, res, next) {
        const logging = (0, morgan_1.default)(this.logFormat, { stream: this.streamOption });
        return logging(req, res, next);
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: 'after' }),
    __metadata("design:paramtypes", [])
], LoggerMiddleware);
