import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProgressDto {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsMongoId()
    userId: string
    
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsMongoId()
    courseId: string
    
    @ApiPropertyOptional({ example: ["67daa8881f4c61f101046612", "67daa8881f4c61f101046612"] })
    @IsOptional()  
    @IsArray()
    @IsMongoId({ each: true })
    completedLessons: string[];
}