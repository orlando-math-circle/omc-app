import {
  Body,
  Controller,
  Delete,
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
import { UpdateEventsDto } from './dtos/update-events.dto';
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

  @UserAuth('event', 'read:any')
  @Get()
  findAll(@Query() { start, end }: FindAllEventsDto) {
    return this.eventService.findAll(start, end);
  }

  @UserAuth('event', 'read:any')
  @Get(':id')
  findOne(@Param() { id }: FindEventDto) {
    return this.eventService.findOneOrFail(id);
  }

  @UserAuth('event', 'update:any')
  @Patch(':id/single')
  updateSingleEvent(
    @Param() { id }: FindEventDto,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateSingleEvent(id, updateEventDto);
  }

  @UserAuth('event', 'update:any')
  @Patch(':id/future')
  updateFutureEvents(
    @Param() { id }: FindEventDto,
    @Body() updateEventsDto: UpdateEventsDto,
  ) {
    return this.eventService.updateFutureEvents(id, updateEventsDto);
  }

  @UserAuth('event', 'update:any')
  @Patch(':id/all')
  updateAllEvents(
    @Param() { id }: FindEventDto,
    @Body() updateEventsDto: UpdateEventsDto,
  ) {
    return this.eventService.updateAllEvents(id, updateEventsDto);
  }

  @UserAuth('event', 'delete:any')
  @Delete(':id/single')
  delete(@Param() { id }: FindEventDto) {
    return this.eventService.deleteSingleEvent(id);
  }

  @UserAuth('event', 'delete:any')
  @Delete(':id/future')
  deleteFutureEvents(@Param() { id }: FindEventDto) {
    return this.eventService.deleteFutureEvents(id);
  }

  @UserAuth('event', 'delete:any')
  @Delete(':id/all')
  deleteAllEvents(@Param() { id }: FindEventDto) {
    return this.eventService.deleteAllEvents(id);
  }
}
