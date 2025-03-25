import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateEnrollmentDto {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsString()
    readonly userId: string

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsString()
    readonly courseId: string
    
    @ApiProperty({ example: 'PENDING' })
    @IsNotEmpty()
    @IsString()
    readonly paymentStatus: string

    @ApiProperty({ example: 0.00 })
    @IsNotEmpty()
    @IsNumber()
    readonly price: number

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsString()
    readonly transaction: string

}