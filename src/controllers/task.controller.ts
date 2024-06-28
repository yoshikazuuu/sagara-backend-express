import { User } from "@prisma/client";
import { Response } from "express";
import { Body, Controller, CurrentUser, Delete, Get, Param, Post, Put, Res } from "routing-controllers";
import { TaskService } from "services/task.service";
import { Service } from "typedi";
import { UserPayload } from "types/auth";
import { sendResponse } from "utils/api.util";
import { TaskDTO } from "validations/task.validation";

@Service()
@Controller()
export class TaskController {
    constructor(
        private readonly taskService: TaskService
    ) { }

    @Post("/tasks")
    async addTask(
        @CurrentUser({ required: true }) user: UserPayload,
        @Res() res: Response,
        @Body() dto: TaskDTO
    ) {
        const task = await this.taskService.createTask(user.userId, dto, res);
        return sendResponse(res, { message: "Task added", data: task });
    }

    @Get("/tasks")
    async getTasks(
        @CurrentUser({ required: true }) user: UserPayload,
        @Res() res: Response
    ) {
        const tasks = await this.taskService.getAllTaskByUserId(user.userId, res);
        if (!tasks) {
            return sendResponse(res, { message: "No tasks found", data: tasks });
        }
        return sendResponse(res, { message: "Successfully get all tasks", data: tasks });
    }

    @Get("/tasks/:id")
    async getTask(
        @CurrentUser({ required: true }) user: UserPayload,
        @Res() res: Response,
        @Param("id") id: string
    ) {
        const task = await this.taskService.getTaskById(user.userId, parseInt(id), res);
        if (!task) {
            return sendResponse(res, { message: `Task not found`, data: task });
        }
        return sendResponse(res, { message: `Successfully get task`, data: task });
    }

    @Put("/tasks/:id")
    async updateTask(
        @CurrentUser({ required: true }) user: UserPayload,
        @Res() res: Response,
        @Param("id") id: string,
        @Body() dto: TaskDTO
    ) {
        const task = await this.taskService.updateTask(user.userId, parseInt(id), dto, res);
        return sendResponse(res, { message: `Successfully updated the task`, data: task });
    }

    @Delete("/tasks/:id")
    async deleteTask(
        @CurrentUser({ required: true }) user: UserPayload,
        @Res() res: Response,
        @Param("id") id: string
    ) {
        await this.taskService.deleteTask(user.userId, parseInt(id), res);
        return sendResponse(res, { message: `Successfully deleted the task` });
    }

}