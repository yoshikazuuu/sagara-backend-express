import ms from "ms";
import "reflect-metadata";
import { Controller, Body, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import { ACCESS_TOKEN_COOKIE, sendResponse } from "../utils/api.util";
import { AuthService } from "../services/auth.service";
import { LoginDTO } from "../validations/user.validation";
import config from "../configs/config";

@Service()
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/login")
    async login(@Res() res: Response, @Body() dto: LoginDTO) {
        const { accessToken } = await this.authService.login(dto.email, dto.password);

        res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
            httpOnly: true,
            maxAge: ms(config.jwt.accessExpire),
        });

        return sendResponse(res, { message: "Succesfully logged in" });
    }

    @Post("/register")
    async register(@Res() res: Response, @Body() dto: LoginDTO) {
        await this.authService.register(dto.email, dto.password);
        return sendResponse(res, { message: "Succesfully registered" });
    }
}
