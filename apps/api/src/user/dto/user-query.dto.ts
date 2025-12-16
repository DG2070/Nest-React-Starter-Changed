import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TestSortables } from 'src/common/constants/test-sortables.constant';
import { SortingOrder } from 'src/common/enums/sorting-order.enum';

export enum Status {
  TRUE = 'true',
  FALSE = 'false',
}

export enum Role {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export class UserQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Status, {
    message: 'Paginated status must be either true or false',
  })
  isPaginated?: Status;

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
  limit?: number

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

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status, {
    message: 'onlyActive value must be either true or false',
  })
  onlyActive?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Role, {
    message: 'role must be one of: admin and employee',
  })
  role?: Role;
}
