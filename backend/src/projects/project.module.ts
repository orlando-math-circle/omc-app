import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [], // Import ONLY other modules.
  providers: [ProjectService], // Any class decorated with the @Injectable() decorator.
  controllers: [ProjectController], // Routers, decorated by the @Controller() decorator.
  exports: [], // Providers you wish to reuse elsewhere in the application.
})
export class ProjectModule {}
