import { PartialType } from "@nestjs/swagger";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: "Name is mandatory" })
  @MaxLength(100)
  name!: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  @MaxLength(150)
  email!: string;

  @Matches(/^\+?[0-9]{7,15}$/, {
    message: "Phone must be 7-15 digits, optionally starting with +",
  })
  phone!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;

  @IsInt({ message: "Age must be a whole number" })
  @Min(18)
  @Max(100)
  age!: number;

  @IsInt({ message: "Years of working must be a whole number" })
  @Min(0)
  yearsOfWorking!: number;
}

// Every create field becomes optional, with the same validation rules.
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
