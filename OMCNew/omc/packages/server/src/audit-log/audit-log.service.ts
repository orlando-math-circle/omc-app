import { EntityRepository, FilterQuery, FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { User } from "@server/user/user.entity";
import { AuditLog } from "./audit-log.entity";
import { AuditLogDto } from "./dto/audit-log.dto";


@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: EntityRepository<AuditLog>,
  ) {}

  /**
   * Creates an entry in the audit log based on the user and the role.
   *
   * @param dto Properties of the primary user.
   */
  async create({userId, message}: AuditLogDto, user: User) {
    const auditEntry = this.auditLogRepository.create({
        userId: userId,
        user: user,
        message: message
    });
    
    this.auditLogRepository.persist(auditEntry).flush();
    return auditEntry;
  }

  public findAll(limit: number, offset: number) {
    return this.auditLogRepository.findAndCount(
      {},
      { limit, offset},
    );
  }

  public findOne(id: number) {
    return this.auditLogRepository.findOneOrFail(id);
  }

  public async delete(id: number) {
    const audit = await this.auditLogRepository.findOneOrFail(id);
    return this.auditLogRepository.remove(audit).flush();
  }
}
