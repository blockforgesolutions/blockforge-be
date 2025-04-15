import { ApiProperty } from "@nestjs/swagger";

class InstructorDto {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: "John" })
    name: string

    @ApiProperty({ example: "Doe" })
    surname: string

    @ApiProperty({ example: "/picture.jpg" })
    picture?: string
}

class CategoryDto {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: "tech" })
    name: string

    @ApiProperty({ example: "COURSE" })
    type: string
}


export class CourseResponse{
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: "Course Title" })
    title: string

    @ApiProperty({ example: "Course Description" })
    description: string

    @ApiProperty({ example: "course-title" })
    slug: string

    @ApiProperty({ example: "/thumbnail.jpg" })
    thumbnail?: string

    @ApiProperty({ type: InstructorDto })
    instructor: InstructorDto

    @ApiProperty({ type: [CategoryDto] })
    categories: CategoryDto[]

    @ApiProperty({ example: 0 })
    price: number

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    updatedAt: Date
}

