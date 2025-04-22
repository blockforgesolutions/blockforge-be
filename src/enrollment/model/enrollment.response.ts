import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export class EnrollmentResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string
    
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    userId: Schema.Types.ObjectId
    
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    courseId: Schema.Types.ObjectId
    
    @ApiProperty({ example: 'PENDING' })
    paymentStatus: string
    
    @ApiProperty({ example: 0.00 })
    amount: number

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    transaction: string | null

    @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
    createdAt: Date
   
    @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
    updatedAt: Date
}