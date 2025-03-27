import { ApiProperty } from "@nestjs/swagger"


export class CategoryResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: "tech" })
    readonly name: string

    @ApiProperty({ example: "COURSE" })
    readonly type: string
    
    @ApiProperty({ example: "tech" })
    readonly slug: string

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    updatedAt: Date
}