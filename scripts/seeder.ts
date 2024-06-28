import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/services/auth.service';

const prisma = new PrismaClient();
const AUTH_SERVICE = new AuthService();

async function main() {
    // Hash password
    const { hashPassword } = AUTH_SERVICE;
    const password = await hashPassword('Password123!');

    // Create users
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            password,
            tasks: {
                create: [
                    {
                        title: 'Task 1 for User 1',
                        description: 'Description for Task 1 for User 1',
                    },
                    {
                        title: 'Task 2 for User 1',
                        description: 'Description for Task 2 for User 1',
                    },
                ],
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user2@example.com',
            password,
            tasks: {
                create: [
                    {
                        title: 'Task 1 for User 2',
                        description: 'Description for Task 1 for User 2',
                    },
                    {
                        title: 'Task 2 for User 2',
                        description: 'Description for Task 2 for User 2',
                    },
                ],
            },
        },
    });

    console.log({ user1, user2 });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
