import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "@server/user/user.entity";

@Entity()
export class AuditLog extends BaseEntity<AuditLog, 'id'> {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Property()
    readonly message!: string;
}
