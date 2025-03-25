import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateLessonDto {
    @ApiProperty({ example: "Lesson Title" })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ example: "Lesson Content" })
    @IsString()
    @IsNotEmpty()
    content: string

    @ApiProperty({ example: "Course id: 67daa8881f4c61f101046612" })
    @IsMongoId()
    @IsNotEmpty()
    moduleId: string

    @ApiProperty({ example: "https://example.com/video.mp4" })
    @IsString()
    @IsNotEmpty()
    videoUrl: string

    @ApiProperty({ example: ["Question 1", "Question 2"] })
    @IsArray()
    @IsOptional()
    quiz: [string]
}