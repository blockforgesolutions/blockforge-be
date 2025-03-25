import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateModuleDto {
    @ApiProperty({ example: "Module Title" })
    @IsString()
    @IsNotEmpty()
    readonly title: string

    @ApiProperty({ example:'67daa8881f4c61f101046612'})
    @IsString()
    @IsNotEmpty()
    readonly course: string
}