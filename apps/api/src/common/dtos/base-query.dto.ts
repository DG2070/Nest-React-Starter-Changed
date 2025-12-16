import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TestSortables } from '../constants/test-sortables.constant';
import { SortingOrder } from '../enums/sorting-order.enum';

export enum Status {
  TRUE = 'true',
  FALSE = 'false',
}

export class BaseQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Status, {
    message: 'Paginated status must be either true or false',
  })
  isPaginated?: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsIn(TestSortables, {
    message: `sortBy must be one of: ${TestSortables.join(', ')}`,
  })
  sortBy?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortingOrder, { message: 'orderBy must be ASC or DESC' })
  orderBy?: SortingOrder;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;
}
