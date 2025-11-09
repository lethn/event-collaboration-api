import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  ownerId: string;

  @IsOptional()
  @IsArray()
  inviteeIds?: string[];
}
