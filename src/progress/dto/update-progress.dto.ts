import { PartialType } from "@nestjs/mapped-types";
import { CreateProgressDto } from "./create-progress.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsOptional } from "class-validator";

export class UpdateProgressDto extends PartialType(CreateProgressDto) {
    @ApiPropertyOptional({ example: ["67daa8881f4c61f101046612", "67daa8881f4c61f101046612"] })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    completedLessons: string[];
}