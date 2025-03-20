import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CourseResponse {
    @ApiProperty({example: "67daa8881f4c61f101046612"})
    id:string

    @ApiProperty({example: "Course Title"})
    title:string

    @ApiProperty({example: "Course Description"})
    description:string

    @ApiProperty({example: ["Module 1", "Module 2"]})
    modules: string[]

    @ApiProperty({example: "Instructor id: 67daa8881f4c61f101046612"})
    instructor: Types.ObjectId

    @ApiProperty({example:'2025-01-01T00:00:00.000Z'})
    createdAt:Date

    @ApiProperty({example:'2025-01-01T00:00:00.000Z'})
    updatedAt:Date
}

