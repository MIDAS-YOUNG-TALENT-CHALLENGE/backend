import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  mention: number;

  @IsBoolean()
  important: boolean;
}
