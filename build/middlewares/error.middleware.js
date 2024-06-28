"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
const http_status_codes_1 = require("http-status-codes");
const api_util_1 = require("../utils/api.util");
let ErrorMiddleware = class ErrorMiddleware {
    error(error, _, res) {
        var _a;
        let customError;
        if (error.name === api_util_1.ResponseError.name) {
            customError = error;
        }
        else if (error instanceof routing_controllers_1.HttpError) {
            let { message } = error;
            if ((_a = error.errors) === null || _a === void 0 ? void 0 : _a.length) {
                const { constraints } = error.errors[0];
                message = Object.values(constraints)[0];
            }
            customError = new api_util_1.ResponseError(message, error.httpCode);
        }
        else {
            customError = api_util_1.Errors.SERVER;
            customError.stack = error.stack;
        }
        if (customError.statusCode === http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR) {
            logger_util_1.default.error(`${error}\n${error.stack}`);
        }
        return (0, api_util_1.sendResponse)(res, api_util_1.ResponseError.toResponse(customError));
    }
};
exports.ErrorMiddleware = ErrorMiddleware;
exports.ErrorMiddleware = ErrorMiddleware = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: 'after' })
], ErrorMiddleware);
