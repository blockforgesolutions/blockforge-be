import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string
    
    @IsString()
    @IsNotEmpty()
    readonly description: string
    
    @IsArray()
    @IsNotEmpty()
    readonly modules: [string]
    
    @IsMongoId()
    @IsNotEmpty()
    readonly instructor: string

}