"use strict";
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
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./configs/config"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const typedi_1 = __importDefault(require("typedi"));
const logger_middleware_1 = require("./middlewares/logger.middleware");
const routing_controllers_1 = require("routing-controllers");
const auth_controller_1 = require("./controllers/auth.controller");
const error_middleware_1 = require("./middlewares/error.middleware");
const task_controller_1 = require("./controllers/task.controller");
const auth_service_1 = require("./services/auth.service");
const api_util_1 = require("./utils/api.util");
(0, routing_controllers_1.useContainer)(typedi_1.default);
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(config_1.default.cors));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [auth_controller_1.AuthController, task_controller_1.TaskController],
    middlewares: [logger_middleware_1.LoggerMiddleware, error_middleware_1.ErrorMiddleware],
    defaultErrorHandler: false,
    cors: config_1.default.cors,
    development: config_1.default.isDev,
    validation: {
        forbidUnknownValues: true,
        stopAtFirstError: true,
    },
    currentUserChecker: (action) => __awaiter(void 0, void 0, void 0, function* () {
        const req = action.request;
        const service = typedi_1.default.get(auth_service_1.AuthService);
        const payload = yield service.getUserPayload(req);
        if (!payload) {
            throw api_util_1.Errors.NO_SESSION;
        }
        return payload;
    }),
});
exports.default = app;
