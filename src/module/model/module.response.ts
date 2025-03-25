import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"


export class ModuleResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: "Module Title" })
    readonly title: string

    @ApiProperty({ example: '67daa8881f4c61f101046612' })
    readonly course: Types.ObjectId

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    updatedAt: Date
}