import { AuthService } from '../src/services/auth.service';
import { prismaMock } from './singleton';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ResponseError } from '../src/utils/api.util';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const mockUser = { id: 1, email: 'user1@example.com', password: 'hashedPassword' };
            prismaMock.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (sign as jest.Mock).mockReturnValue('mockToken');

            const result = await authService.login('user1@example.com', 'password');

            expect(result).toEqual({ accessToken: 'mockToken' });
        });

        it('should throw an error if user is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(authService.login('test@example.com', 'password')).rejects.toThrow(ResponseError);
        });

        it('should throw an error if password is incorrect', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedPassword' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login('test@example.com', 'password')).rejects.toThrow(ResponseError);
        });
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({ id: 3, email: 'test@example.com', password: 'hashedPassword' });
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const result = await authService.register('test@example.com', 'password');

            expect(result).toEqual({ id: 3, email: 'test@example.com', password: 'hashedPassword' });
        });

        it('should throw an error if user already exists', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 3, email: 'test@example.com', password: 'hashedPassword' });

            await expect(authService.register('test@example.com', 'password')).rejects.toThrow(ResponseError);
        });
    });
});