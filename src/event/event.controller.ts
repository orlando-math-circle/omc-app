import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { FindAllEventsDto } from './dtos/find-all-events.dto';
import { FindEventDto } from './dtos/find-one-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventService } from './event.service';
import { EventValidationPipe } from './pipes/event-validation.pipe';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UserAuth('event', 'create:any')
  @Post()
  @UsePipes(new EventValidationPipe())
  create(@Usr() user: User, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto, user);
  }

  @Get()
  findAll(@Query() { start, end }: FindAllEventsDto) {
    return this.eventService.findAll(start, end);
  }

  @Patch(':id/single')
  updateSingleEvent(
    @Param() { id }: FindEventDto,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateSingleEvent(id, updateEventDto);
  }

  @Patch(':id/future')
  updateFutureEvents(
    @Param() { id }: FindEventDto,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateFutureEvents(id, updateEventDto);
  }

  @Patch(':id/all')
  updateAllEvents(
    @Param() { id }: FindEventDto,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateAllEvents(id, updateEventDto);
  }

  // @UserAuth('event', 'delete:any')
  // @Delete(':id')
  // delete(@Param() { id }: FindEventDto) {
  //   return this.eventService.delete(id);
  // }
}
