import { PartialType } from "@nestjs/mapped-types";
import { CreateCourseDto } from "./create-course.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";


export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @ApiProperty({ example: "Course Title" })
    @IsString()
    @IsNotEmpty()
    readonly title: string

    @ApiProperty({ example: "Course Description" })
    @IsString()
    @IsNotEmpty()
    readonly description: string

    @ApiProperty({ example: ["Module 1", "Module 2"] })
    @IsArray()
    @IsNotEmpty()
    readonly modules: [string]

    @ApiProperty({ example: "Instructor id: 67daa8881f4c61f101046612" })
    @IsMongoId()
    @IsNotEmpty()
    readonly instructor: string
}