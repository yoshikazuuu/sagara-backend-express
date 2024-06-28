import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Service } from "typedi";
import { ResponseError, sendResponse } from "utils/api.util";
import { TaskDTO } from "validations/task.validation";

const prisma = new PrismaClient();

@Service()
export class TaskService {
    async getAllTaskByUserId(userId: number, res: Response) {
        try {
            return await prisma.task.findMany({ where: { userId } });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            throw new ResponseError((prismaError.meta?.cause as string) || "Internal Server Error", StatusCodes.BAD_REQUEST);
        }
    }

    async getTaskById(userId: number, taskId: number, res: Response) {
        try {
            return await prisma.task.findUnique({ where: { userId, id: taskId } });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            throw new ResponseError((prismaError.meta?.cause as string) || "Internal Server Error", StatusCodes.BAD_REQUEST);
        }
    }

    async createTask(userId: number, dto: TaskDTO, res: Response) {
        try {
            return await prisma.task.create({ data: { userId, title: dto.title, description: dto.description } });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            throw new ResponseError((prismaError.meta?.cause as string) || "Internal Server Error", StatusCodes.BAD_REQUEST);
        }
    }

    async updateTask(userId: number, taskId: number, dto: TaskDTO, res: Response) {
        try {
            return await prisma.task.update({
                where: { userId, id: taskId },
                data: { title: dto.title, description: dto.description },
            });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            throw new ResponseError((prismaError.meta?.cause as string) || "Internal Server Error", StatusCodes.BAD_REQUEST);
        }
    }

    async deleteTask(userId: number, taskId: number, res: Response) {
        try {
            return await prisma.task.delete({ where: { userId, id: taskId } });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            throw new ResponseError((prismaError.meta?.cause as string) || "Internal Server Error", StatusCodes.BAD_REQUEST);
        }
    }

}