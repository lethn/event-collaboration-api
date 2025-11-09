import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event-dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  createEvent(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Post('merge-all/:userId')
  mergeAllEventsByUserId(@Param('userId') userId: string) {
    return this.eventsService.mergeAllEventsByUserId(userId);
  }

  @Get()
  getAllEvents() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Get('conflicts/:userId')
  getEventConflicts(@Param('userId') userId: string) {
    return this.eventsService.findConflictsByUserId(userId);
  }

  @Patch(':id')
  updateEventById(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.updateById(id, body);
  }

  @Delete(':id')
  deleteEventById(@Param('id') id: string) {
    return this.eventsService.removeById(id);
  }
}
