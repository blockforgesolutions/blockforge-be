import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProgressDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string
    
    @IsNotEmpty()
    @IsMongoId()
    courseId: string
    
    @IsOptional()  
    @IsArray()
    @IsMongoId({ each: true })
    completedLessons: string[];
}