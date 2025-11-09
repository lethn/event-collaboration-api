import { Type } from 'class-transformer';
import {
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { CreateEventDto } from './create-event-dto';

export class BatchCreateEventsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[];
}
