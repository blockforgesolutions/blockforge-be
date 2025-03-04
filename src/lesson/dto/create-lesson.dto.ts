import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    content: string

    @IsMongoId()
    @IsNotEmpty()
    course: string

    @IsString()
    @IsNotEmpty()
    videoUrl: string

    @IsArray()
    @IsOptional()
    quiz: [string]
}