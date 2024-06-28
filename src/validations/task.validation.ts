import { IsString } from "class-validator";

export class TaskDTO {
    @IsString()
    title!: string;

    @IsString()
    description!: string;
}