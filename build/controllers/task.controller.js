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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.TaskController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const task_service_1 = require("../services/task.service");
const api_util_1 = require("../utils/api.util");
const task_validation_1 = require("../validations/task.validation");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    addTask(user, res, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskService.createTask(user.userId, dto, res);
            return (0, api_util_1.sendResponse)(res, { message: "Task added", data: task });
        });
    }
    getTasks(user, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskService.getAllTaskByUserId(user.userId, res);
            if (!tasks) {
                return (0, api_util_1.sendResponse)(res, { message: "No tasks found", data: tasks });
            }
            return (0, api_util_1.sendResponse)(res, { message: "Successfully get all tasks", data: tasks });
        });
    }
    getTask(user, res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskService.getTaskById(user.userId, parseInt(id), res);
            if (!task) {
                return (0, api_util_1.sendResponse)(res, { message: `Task not found`, data: task });
            }
            return (0, api_util_1.sendResponse)(res, { message: `Successfully get task`, data: task });
        });
    }
    updateTask(user, res, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskService.updateTask(user.userId, parseInt(id), dto, res);
            return (0, api_util_1.sendResponse)(res, { message: `Successfully updated the task`, data: task });
        });
    }
    deleteTask(user, res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.taskService.deleteTask(user.userId, parseInt(id), res);
            return (0, api_util_1.sendResponse)(res, { message: `Successfully deleted the task` });
        });
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, routing_controllers_1.Post)("/tasks"),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Res)()),
    __param(2, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, task_validation_1.TaskDTO]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "addTask", null);
__decorate([
    (0, routing_controllers_1.Get)("/tasks"),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasks", null);
__decorate([
    (0, routing_controllers_1.Get)("/tasks/:id"),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Res)()),
    __param(2, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTask", null);
__decorate([
    (0, routing_controllers_1.Put)("/tasks/:id"),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Res)()),
    __param(2, (0, routing_controllers_1.Param)("id")),
    __param(3, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, task_validation_1.TaskDTO]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, routing_controllers_1.Delete)("/tasks/:id"),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Res)()),
    __param(2, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
exports.TaskController = TaskController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Controller)(),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
