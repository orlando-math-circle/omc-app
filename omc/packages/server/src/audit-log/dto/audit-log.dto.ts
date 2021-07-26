import { IsNumber, IsString } from "class-validator";

export class AuditLogDto {
    @IsNumber()
    userId!: number;

    @IsString()
    readonly message!: string;
}