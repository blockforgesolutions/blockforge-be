import { ApiProperty } from "@nestjs/swagger";

export class LessonResponse {
    @ApiProperty({ example: "Lesson Title" })
    title: string

    @ApiProperty({ example: "Lesson Content" })
    content: string

    @ApiProperty({ example: "Course id: 67daa8881f4c61f101046612" })
    course: string

    @ApiProperty({ example: "https://example.com/video.mp4" })
    videoUrl: string

    @ApiProperty({ example: ["Question 1", "Question 2"] })
    quiz: [string]
}