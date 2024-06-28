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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const typedi_1 = require("typedi");
const api_util_1 = require("../utils/api.util");
const prisma = new client_1.PrismaClient();
let TaskService = class TaskService {
    getAllTaskByUserId(userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield prisma.task.findMany({ where: { userId } });
            }
            catch (error) {
                const prismaError = error;
                throw new api_util_1.ResponseError(((_a = prismaError.meta) === null || _a === void 0 ? void 0 : _a.cause) || "Internal Server Error", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        });
    }
    getTaskById(userId, taskId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield prisma.task.findUnique({ where: { userId, id: taskId } });
            }
            catch (error) {
                const prismaError = error;
                throw new api_util_1.ResponseError(((_a = prismaError.meta) === null || _a === void 0 ? void 0 : _a.cause) || "Internal Server Error", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        });
    }
    createTask(userId, dto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield prisma.task.create({ data: { userId, title: dto.title, description: dto.description } });
            }
            catch (error) {
                const prismaError = error;
                throw new api_util_1.ResponseError(((_a = prismaError.meta) === null || _a === void 0 ? void 0 : _a.cause) || "Internal Server Error", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        });
    }
    updateTask(userId, taskId, dto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield prisma.task.update({
                    where: { userId, id: taskId },
                    data: { title: dto.title, description: dto.description },
                });
            }
            catch (error) {
                const prismaError = error;
                throw new api_util_1.ResponseError(((_a = prismaError.meta) === null || _a === void 0 ? void 0 : _a.cause) || "Internal Server Error", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        });
    }
    deleteTask(userId, taskId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield prisma.task.delete({ where: { userId, id: taskId } });
            }
            catch (error) {
                const prismaError = error;
                throw new api_util_1.ResponseError(((_a = prismaError.meta) === null || _a === void 0 ? void 0 : _a.cause) || "Internal Server Error", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, typedi_1.Service)()
], TaskService);
