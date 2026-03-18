import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  IsIn,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @Length(17, 17)
  vin: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

  @IsString()
  type: string;

  @IsString()
  color: string;

  @IsInt()
  mileage: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  title_status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Continuously Variable (CVT)', 'Automatic (AT)', 'Manual (MT)'])
  transmission?: string;

  @IsOptional()
  @IsString()
  engine?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  specs?: any;

  @IsOptional()
  @IsString()
  image_main?: string;

  @IsOptional()
  images?: any;

  @IsOptional()
  @IsString()
  status?: string;
}
