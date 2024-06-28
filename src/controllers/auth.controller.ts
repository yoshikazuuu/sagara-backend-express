import "reflect-metadata";
import { Controller, Body, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import { sendResponse } from "../utils/api.util";
import { AuthService } from "../services/auth.service";
import { LoginDTO } from "../validations/user.validation";

@Service()
@Controller()
export class AuthController {
    // constructor(private readonly authService: AuthService) { }

    @Post("/login")
    async login(@Res() res: Response, @Body() dto: LoginDTO) {
        // const { accessToken } = await this.authService.login(dto.email, dto.password);

        return sendResponse(res, { message: "Succesfully logged in" });
    }
}
