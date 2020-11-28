import { UpdateEventDto } from '../../../backend/src/event/dto/update-event.dto'
import { UpdateEventsDto } from '../../../backend/src/event/dto/update-events.dto'
import { DTO } from '../date-to-string.interface'

export interface EventUpdateModes {
  single?: DTO<UpdateEventDto>
  future?: DTO<UpdateEventsDto>
  all?: DTO<UpdateEventsDto>
}
