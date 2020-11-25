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
import { CreateEventDto } from './dto/create-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventsDto } from './dto/update-events.dto';
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
  findAll(@Query() findAllEventsDto: FindAllEventsDto) {
    return this.eventService.findAll(findAllEventsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventService.findOneOrFail(id, [
      'author',
      'fee',
      'course.fee',
      'recurrence',
    ]);
  }

  @UserAuth('event', 'update:any')
  @Patch(':id/single')
  updateSingleEvent(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateSingleEvent(id, updateEventDto);
  }

  @UserAuth('event', 'update:any')
  @Patch(':id/future')
  updateFutureEvents(
    @Param('id') id: number,
    @Body() updateEventsDto: UpdateEventsDto,
  ) {
    return this.eventService.updateFutureEvents(id, updateEventsDto);
  }

  @UserAuth('event', 'update:any')
  @Patch(':id/all')
  updateAllEvents(
    @Param('id') id: number,
    @Body() updateEventsDto: UpdateEventsDto,
  ) {
    return this.eventService.updateAllEvents(id, updateEventsDto);
  }

  @UserAuth('event', 'delete:any')
  @Delete(':id/single')
  delete(@Param('id') id: number) {
    return this.eventService.deleteSingleEvent(id);
  }

  @UserAuth('event', 'delete:any')
  @Delete(':id/future')
  deleteFutureEvents(@Param('id') id: number) {
    return this.eventService.deleteFutureEvents(id);
  }

  @UserAuth('event', 'delete:any')
  @Delete(':id/all')
  deleteAllEvents(@Param('id') id: number) {
    return this.eventService.deleteAllEvents(id);
  }
}
