import { ManyToOne } from "@mikro-orm/core";
import { User } from "@server/user/user.entity";
import { IsNumber, IsString } from "class-validator";

export class AuditLogDto {
    @IsNumber()
    userId!: number;
    
    @ManyToOne(() => User)
    user!: User;

    @IsString()
    readonly message!: string;
}