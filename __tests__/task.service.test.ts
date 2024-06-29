import { TaskService } from '../src/services/task.service';
import { prismaMock } from './singleton';
import { ResponseError } from '../src/utils/api.util';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('TaskService', () => {
    let taskService: TaskService;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        taskService = new TaskService();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<Response>;
    });

    describe('getAllTaskByUserId', () => {
        it('should return all tasks for a user', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1 for User 1', description: 'Description for Task 1 for User 1', userId: 1 },
                { id: 2, title: 'Task 2 for User 1', description: 'Description for Task 2 for User 1', userId: 1 },
            ];
            prismaMock.task.findMany.mockResolvedValue(mockTasks);

            const result = await taskService.getAllTaskByUserId(1, mockResponse as Response);

            expect(result).toEqual(mockTasks);
        });

        it('should handle database errors', async () => {
            const error = new PrismaClientKnownRequestError('Database error', { code: 'P2002', clientVersion: '2.19.0' });
            prismaMock.task.findMany.mockRejectedValue(error);

            await expect(taskService.getAllTaskByUserId(10, mockResponse as Response)).resolves.toEqual([]);
        });
    });

    describe('getTaskById', () => {
        it('should return a task if found', async () => {
            const mockTask = { id: 1, title: 'Task 1 for User 1', description: 'Description for Task 1 for User 1', userId: 1 };
            prismaMock.task.findUnique.mockResolvedValue(mockTask);

            const result = await taskService.getTaskById(1, 1, mockResponse as Response);

            expect(result).toEqual(mockTask);
        });

        it('should return null if task is not found', async () => {
            prismaMock.task.findUnique.mockResolvedValue(null);

            const result = await taskService.getTaskById(1, 999, mockResponse as Response);

            expect(result).toBeNull();
        });
    });

    describe('createTask', () => {
        it('should create a new task', async () => {
            const newTask = { title: 'New Task', description: 'New Description' };
            const createdTask = { id: 5, ...newTask, userId: 1 };
            prismaMock.task.create.mockResolvedValue(createdTask);

            const result = await taskService.createTask(1, newTask, mockResponse as Response);

            expect(result).toEqual(createdTask);
        });

        it('should handle task creation errors', async () => {
            const error = new PrismaClientKnownRequestError('Creation error', { code: 'P2002', clientVersion: '2.19.0' });
            prismaMock.task.create.mockRejectedValue(error);

            await expect(taskService.createTask(10, { title: 'user id is non existent', description: 'user id is non existent' }, mockResponse as Response)).rejects.toThrow(ResponseError);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', async () => {
            const updatedTask = { id: 1, title: 'Updated Task', description: 'Updated Description', userId: 1 };
            prismaMock.task.update.mockResolvedValue(updatedTask);

            const result = await taskService.updateTask(1, 1, { title: 'Updated Task', description: 'Updated Description' }, mockResponse as Response);

            expect(result).toEqual(updatedTask);
        });

        it('should handle update errors', async () => {
            const error = new PrismaClientKnownRequestError('Update error', { code: 'P2025', clientVersion: '2.19.0' });
            prismaMock.task.update.mockRejectedValue(error);

            await expect(taskService.updateTask(10, 10, { title: 'user id and task id is non existent', description: 'user id and task id is non existent' }, mockResponse as Response)).rejects.toThrow(ResponseError);
        });
    });

    describe('deleteTask', () => {
        it('should delete an existing task', async () => {
            const mockTask = { id: 1, title: 'Updated Task', description: 'Updated Description', userId: 1 };
            prismaMock.task.delete.mockResolvedValue(mockTask);

            const result = await taskService.deleteTask(1, 1, mockResponse as Response);

            expect(result).toEqual(mockTask);
        });

        it('should handle delete errors', async () => {
            const error = new PrismaClientKnownRequestError('Delete error', { code: 'P2025', clientVersion: '2.19.0' });
            prismaMock.task.delete.mockRejectedValue(error);

            await expect(taskService.deleteTask(1, 1, mockResponse as Response)).rejects.toThrow(ResponseError);
        });
    });
});