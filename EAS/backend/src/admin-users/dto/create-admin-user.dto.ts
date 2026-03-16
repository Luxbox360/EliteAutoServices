import { IsString, Length } from 'class-validator';

export class CreateAdminUserDto {
  @IsString()
  @Length(3, 20)
  username: string;

  @IsString()
  password: string;

  @IsString()
  @Length(1, 30)
  first_name: string;

  @IsString()
  @Length(1, 30)
  last_name: string;
}
