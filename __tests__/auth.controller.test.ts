import request from 'supertest';
import app from '../src/app';
import { AuthService } from '../src/services/auth.service';

describe('AuthController', () => {
    const authService = new AuthService();

    describe('POST /login', () => {
        it('should login successfully', async () => {
            await authService.register('test.controller@example.com', 'Password123!');

            const response = await request(app)
                .post('/login')
                .send({ email: 'test.controller@example.com', password: 'Password123!' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Succesfully logged in');
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should return 404 if user is not found', async () => {
            const response = await request(app)
                .post('/login')
                .send({ email: 'nonexistent@example.com', password: 'Password123!' });

            expect(response.status).toBe(404);
        });

        it('should return 400 if password is incorrect', async () => {
            await authService.register('test.login@example.com', 'Password123!');

            const response = await request(app)
                .post('/login')
                .send({ email: 'test.login@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/register')
                .send({ email: 'newuser@example.com', password: 'Password123!' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Succesfully registered');
        });

        it('should return 400 if user already exists', async () => {
            await authService.register('test.register@example.com', 'Password123!');

            const response = await request(app)
                .post('/register')
                .send({ email: 'test.register@example.com', password: 'Password123!' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
    });
});