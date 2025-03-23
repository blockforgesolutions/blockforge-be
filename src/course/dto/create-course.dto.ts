import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {
    @ApiProperty({ example: "Course Title" })
    @IsString()
    @IsNotEmpty()
    readonly title: string

    @ApiProperty({ example: "Course Description" })
    @IsString()
    @IsNotEmpty()
    readonly description: string

    @ApiProperty({example: "Instructor id: 67daa8881f4c61f101046612"})
    @IsMongoId()
    @IsNotEmpty()
    readonly instructor: string

}