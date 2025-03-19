import { ApiProperty } from "@nestjs/swagger";

export class CourseResponse {
    @ApiProperty({example: "Course Title"})
    title:string

    @ApiProperty({example: "Course Description"})
    description:string

    @ApiProperty({example: ["Module 1", "Module 2"]})
    modules: string[]

    @ApiProperty({example: "Instructor id: 67daa8881f4c61f101046612"})
    instructor: string
}

