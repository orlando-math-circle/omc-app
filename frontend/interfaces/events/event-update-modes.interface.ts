import { UpdateEventDto } from '../../../backend/src/event/dto/update-event.dto'
import { UpdateEventsDto } from '../../../backend/src/event/dto/update-events.dto'
import { DTO } from '../date-to-string.interface'

export type AddFile<T> = Omit<T, 'picture'> & { picture: string | File }

export interface EventUpdateModes {
  single?: DTO<UpdateEventDto>
  future?: DTO<UpdateEventsDto>
  all?: DTO<UpdateEventsDto>
}

export interface EventUpdateModesAndFile {
  single?: AddFile<DTO<UpdateEventDto>>
  future?: AddFile<DTO<UpdateEventsDto>>
  all?: AddFile<DTO<UpdateEventsDto>>
}
