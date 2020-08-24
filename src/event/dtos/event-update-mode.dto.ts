import { IsEnum } from 'class-validator';
import { EventUpdateMode } from '../interfaces/event-update-mode.enum';

export class EventUpdateModeDto {
  @IsEnum(EventUpdateMode)
  readonly mode!: EventUpdateMode;
}
