import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEnrollmentDto {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsString()
    readonly courseId: string

    @ApiProperty({ example: 0.00 })
    @IsNotEmpty()
    @IsNumber()
    readonly amount: number

}