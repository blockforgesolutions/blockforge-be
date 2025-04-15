import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CategoryEnum } from "../model/category.model";

export class UpdateCategoryDto {
    @ApiProperty({ example: "tech" })
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @ApiProperty({ example: "COURSE" })
    @IsString()
    @IsNotEmpty()
    @IsEnum(CategoryEnum)
    readonly type: string
}