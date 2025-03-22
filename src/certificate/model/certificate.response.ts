import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Certificate } from "../interface/certificate.interface";

export class CertificateResponse implements Certificate{
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string;
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    userId: Types.ObjectId;
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    courseId: Types.ObjectId;
    @ApiProperty({ example: "Certificate Url" })
    certificateUrl: string;
    @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
    createdAt: Date;
    @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
    updatedAt: Date;
}