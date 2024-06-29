import request from 'supertest';
import app from '../src/app';
import { TaskService } from '../src/services/task.service';
import { AuthService } from '../src/services/auth.service';
import { Response } from 'express';

describe('TaskController', () => {
    let authToken: string;
    let userId: 1;
    let authService: AuthService;
    let taskService: TaskService;
    let mockResponse: Partial<Response>;

    beforeAll(async () => {
        authService = new AuthService();
        const loginResponse = await authService.login("user1@example.com", "Password123!");
        authToken = loginResponse.accessToken;
    });

    beforeEach(() => {
        taskService = new TaskService();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<Response>;
    });


    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const response = await request(app)
                .post('/tasks')
                .set('Cookie', [`accessToken=${authToken}`])
                .send({ title: 'Test Task', description: 'Test Description' });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.title).toBe('Test Task');
            expect(response.body.data.description).toBe('Test Description');
        });
    });

    describe('GET /tasks', () => {
        it('should return all tasks for the user', async () => {
            const response = await request(app)
                .get('/tasks')
                .set('Cookie', [`accessToken=${authToken}`]);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(3);
        });
    });

    describe('GET /tasks/:id', () => {
        // TODO: Use service to create a task not using the existing task
        it('should return a specific task', async () => {
            const response = await request(app)
                .get(`/tasks/7`)
                .set('Cookie', [`accessToken=${authToken}`]);


            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(7);
            expect(response.body.data.title).toBe('Test Task');
        });

        it('should return 200 and null for non-existent task', async () => {
            const response = await request(app)
                .get('/tasks/999999')
                .set('Cookie', [`accessToken=${authToken}`]);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeNull();
        });
    });

    describe('PUT /tasks/:id', () => {
        // TODO: Use service to create a task not using the existing task
        it('should update an existing task', async () => {
            const response = await request(app)
                .put(`/tasks/7`)
                .set('Cookie', [`accessToken=${authToken}`])
                .send({ title: 'Updated Task', description: 'Updated Description' });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe('Updated Task');
            expect(response.body.data.description).toBe('Updated Description');
        });
    });

    describe('DELETE /tasks/:id', () => {
        // TODO: Use service to create a task not using the existing task
        it('should delete an existing task', async () => {
            const response = await request(app)
                .delete(`/tasks/7`)
                .set('Cookie', [`accessToken=${authToken}`]);

            expect(response.status).toBe(200);

            // Verify the task was deleted
            const deletedTask = await taskService.getTaskById(userId, 7, mockResponse as Response);
            expect(deletedTask).toBeNull();
        });
    });
});
