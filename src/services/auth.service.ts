import { PrismaClient, User } from "@prisma/client";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import config from "../configs/config";
import { AuthToken } from "../types/auth";
import { ResponseError } from "../utils/api.util";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

@Service()
export class AuthService {
    async login(email: string, password: string): Promise<AuthToken> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ResponseError("User not found", StatusCodes.NOT_FOUND);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError("Incorrect password", StatusCodes.BAD_REQUEST);
        }

        const accessToken = await this.generateToken(user);
        return { accessToken };
    }

    async register(email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.user.create({
            data: { email, password: hashedPassword },
        });
    }

    private async generateToken(user: User): Promise<string> {
        return sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: config.jwt.accessExpire,
        });
    }
}
