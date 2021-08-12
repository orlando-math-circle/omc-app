import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '@server/user/user.entity';
import { UserService } from '@server/user/user.service';
import { AuditLog } from './audit-log.entity';
import { AuditLogDto } from './dto/audit-log.dto';
import { AuditType } from './enums/audit-type.enum';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: EntityRepository<AuditLog>,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates an entry in the audit log based on the user and the role.
   *
   * @param dto Properties of the primary user.
   */
  async create({ userId, changes, type, target_id }: AuditLogDto, user: User) {
    var message: string | undefined;

    if (type === AuditType.VOLUNTEER_SWAP) {
      const coverUser = await this.userService.findOneOrFail(
        changes[0].new_value,
      );
      const swapUser = await this.userService.findOneOrFail(
        changes[0].old_value,
      );
      message =
        coverUser.name +
        ' swapped volunteer shifts with ' +
        swapUser.name +
        ' for event ' +
        target_id +
        '.';
    }

    const auditEntry = this.auditLogRepository.create({
      userId: userId,
      user: user,
      createdAt: new Date().toLocaleString(),
      message: message,
    });

    this.auditLogRepository.persist(auditEntry);
    return auditEntry;
  }

  public addLog(dto: AuditLogDto, user: User) {
    const log = this.create(dto, user);
    return log;
  }

  public findAll(limit: number, offset: number) {
    return this.auditLogRepository.findAndCount({}, { limit, offset });
  }

  public findOne(id: number) {
    return this.auditLogRepository.findOneOrFail(id);
  }

  public async delete(id: number) {
    const audit = await this.auditLogRepository.findOneOrFail(id);
    return this.auditLogRepository.remove(audit).flush();
  }
}
