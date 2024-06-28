"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const typedi_1 = require("typedi");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../configs/config"));
const api_util_1 = require("../utils/api.util");
const http_status_codes_1 = require("http-status-codes");
const class_validator_1 = require("class-validator");
const prisma = new client_1.PrismaClient();
let AuthService = class AuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new api_util_1.ResponseError("User not found", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new api_util_1.ResponseError("Incorrect password", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const accessToken = yield this.generateToken(user);
            return { accessToken };
        });
    }
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (user) {
                throw new api_util_1.ResponseError("User already exists", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const hashedPassword = yield this.hashPassword(password);
            return yield prisma.user.create({
                data: { email, password: hashedPassword },
            });
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hash(password, config_1.default.hashRounds);
        });
    }
    generateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, jsonwebtoken_1.sign)({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: config_1.default.jwt.accessExpire,
            });
        });
    }
    getUserPayload(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let secret;
            let token;
            token = req.cookies[api_util_1.ACCESS_TOKEN_COOKIE];
            secret = config_1.default.jwt.accessSecret;
            if (!(0, class_validator_1.isString)(token)) {
                return;
            }
            try {
                const payload = (0, jsonwebtoken_1.verify)(token, secret);
                return { userId: payload.userId };
            }
            catch (err) {
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)()
], AuthService);
