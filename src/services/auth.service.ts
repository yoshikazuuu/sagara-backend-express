import { PrismaClient, User } from "@prisma/client";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import config from "../configs/config";
import { AuthToken, UserPayload } from "../types/auth";
import { ACCESS_TOKEN_COOKIE, ResponseError } from "../utils/api.util";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { isString } from "class-validator";

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
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            throw new ResponseError("User already exists", StatusCodes.BAD_REQUEST);
        }

        const hashedPassword = await this.hashPassword(password);
        return await prisma.user.create({
            data: { email, password: hashedPassword },
        });
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, config.hashRounds);
    }

    private async generateToken(user: User): Promise<string> {
        return sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: config.jwt.accessExpire,
        });
    }

    /**
     * Extracts a user data (payload) from a JWT token.
     * Before it extracts the payload, it'll verify the token first.
     */
    async getUserPayload(req: Request) {
        let secret: string;
        let token: string;

        token = req.cookies[ACCESS_TOKEN_COOKIE];
        secret = config.jwt.accessSecret;

        // the value from `cookies` can be undefined,
        // although I set it to `string` in the type because `class-validator`
        // doesn't force type after this condition.
        if (!isString(token)) {
            return;
        }

        try {
            const payload = verify(token, secret) as JwtPayload;
            return { userId: payload.userId } as UserPayload;
        } catch (err) {
            // token is invalid, so returning `undefined` instead
        }
    }
}
