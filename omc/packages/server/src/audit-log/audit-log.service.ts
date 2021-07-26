import { EntityRepository, FilterQuery, FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
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
  async create({userId, message}: AuditLogDto) {
    const auditEntry = this.auditLogRepository.create({
        user: userId,
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
    const attendance = await this.auditLogRepository.findOneOrFail(id);
    return this.auditLogRepository.remove(attendance).flush();
  }
}
