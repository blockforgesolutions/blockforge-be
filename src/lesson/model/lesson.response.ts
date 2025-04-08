import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class LessonResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id:string

    @ApiProperty({ example: "Lesson Title" })
    title: string

    @ApiProperty({ example: "Lesson Content" })
    content: string

    @ApiProperty({ example: "Course id: 67daa8881f4c61f101046612" })
    moduleId: Types.ObjectId

    @ApiProperty({ example: "lesson-slug" })
    slug: string

    @ApiProperty({ example: "https://example.com/video.mp4" })
    videoUrl: string

    @ApiProperty({ example: ["Question 1", "Question 2"] })
    quiz?: [string]

    @ApiProperty({example:'2025-01-01T00:00:00.000Z'})
    createdAt:Date

    @ApiProperty({example:'2025-01-01T00:00:00.000Z'})
    updatedAt:Date
}