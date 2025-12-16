import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class InitiatePaymentDto {
  @Transform(({ value }) => {
    const number = Number(value);
    return isNaN(number) ? value : number;
  })
  @IsNotEmpty({ message: `Product amount is required.` })
  @IsNumber({}, { message: 'Amount must be a valid number.' })
  @Min(10, { message: `Amount can not be less than Rs. 10.` })
  amount: number;

  //add information required about the product user is paying for.
}
