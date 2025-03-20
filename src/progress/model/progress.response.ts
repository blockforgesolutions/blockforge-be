import { ApiProperty } from "@nestjs/swagger";

export class ProgressResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    userId: string

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    courseId: string

    @ApiProperty({ example: ["67daa8881f4c61f101046612", "67daa8881f4c61f101046612"] })
    completedLessons: string[]

    @ApiProperty({ example: 50 })
    progressPercentage: number
}