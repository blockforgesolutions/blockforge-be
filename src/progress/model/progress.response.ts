import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class ProgressResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    userId: Types.ObjectId

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    courseId: Types.ObjectId

    @ApiProperty({ example: ["67daa8881f4c61f101046612", "67daa8881f4c61f101046612"] })
    completedLessons: Types.ObjectId[]

    @ApiProperty({ example: 50 })
    progressPercentage: number

    @ApiProperty({ example: new Date() })
    createdAt: Date

    @ApiProperty({ example: new Date() })
    updatedAt: Date
}