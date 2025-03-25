import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateCertificateDto {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsString()
    readonly userId: string

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsNotEmpty()
    @IsString()
    readonly courseId: string

    @ApiProperty({ example: "Certificate Url" })
    @IsNotEmpty()
    @IsString()
    readonly certificateUrl: string

    
}