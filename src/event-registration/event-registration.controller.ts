import { Controller, Post } from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';
import { UserAuth } from '../auth/decorators/auth.decorator';

@Controller('/registration')
export class EventRegistrationController {
  constructor(private readonly registrationService: EventRegistrationService) {}

  @UserAuth('event-registration', 'create:own')
  @Post()
  create() {}
}
