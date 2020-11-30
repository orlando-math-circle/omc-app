import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CreateWorkDto } from './dto/create-work.dto';
import { FindAllWorksDto } from './dto/find-all-works.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { VolunteerWorkService } from './volunteer-work.service';

@Controller('volunteer-work')
export class VolunteerWorkController {
  constructor(private readonly volunteerWorkService: VolunteerWorkService) {}

  @UserAuth('volunteer-work', 'create:own')
  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.volunteerWorkService.create(createWorkDto);
  }

  @UserAuth('volunteer-work', 'read:any')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.volunteerWorkService.findOneOrFail(id, true);
  }

  @UserAuth('volunteer-work', 'read:any')
  @Get()
  findAll(@Query() { limit, offset, contains, orderBy }: FindAllWorksDto) {
    return this.volunteerWorkService.findAll(
      {},
      // This no work good, big sad, try again later.
      // contains
      //   ? {
      //       $or: [
      //         Object.assign({}, isNumber(+contains) && { hours: +contains }),
      //         {
      //           [expr("e1.lower(first || ' ' || last)")]: {
      //             $like: `%${contains}%`,
      //           },
      //         },
      //         {
      //           [expr('e2.lower(name)')]: { $like: `%${contains}%` },
      //         },
      //         {
      //           [expr('e2.lower(description)')]: { $like: `%${contains}%` },
      //         },
      //       ],
      //     }
      //   : {},
      true,
      limit,
      offset,
      orderBy,
    );
  }

  @UserAuth('volunteer-work', 'update:any')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateWorkDto: UpdateWorkDto) {
    return this.volunteerWorkService.update(id, updateWorkDto);
  }

  @UserAuth('volunteer-job', 'delete:any')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.volunteerWorkService.delete(id);
  }
}
