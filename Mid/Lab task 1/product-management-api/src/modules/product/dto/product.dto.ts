import { PartialType } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "Name is mandatory" })
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "Category is mandatory" })
  @MaxLength(50)
  category!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a number with at most 2 decimals" })
  @Min(0)
  price!: number;

  @IsInt({ message: "Quantity must be a whole number" })
  @Min(0)
  quantity!: number;
}

// Every create field becomes optional, with the same validation rules.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
