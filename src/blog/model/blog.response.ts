import { ApiProperty } from "@nestjs/swagger"

class Author {
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

export class BlogResponse {
    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    id: string

    @ApiProperty({ example: { tr: "Blog Başlık", en: "Blog Title" } })
    readonly title: {
        tr: string,
        en: string
    }

    @ApiProperty({ example: "blog-title" })
    readonly slug: string

    @ApiProperty({ example: "/hero.jpg" })
    readonly heroUrl: string

    @ApiProperty({ type: [CategoryDto] })
    categories: CategoryDto[]

    @ApiProperty({ example: "/cover.jpg" })
    readonly coverUrl: string

    @ApiProperty({ example: "5 min" })
    readonly duration: string

    @ApiProperty({ example: { tr: "Blog Açıklama", en: "Blog Description" } })
    readonly description: {
        tr: string,
        en: string
    }

    @ApiProperty({ example: { tr: "Blog İçeriği", en: "Blog Content" } })
    readonly content: {
        tr: string,
        en: string
    }

    @ApiProperty({ type: Author })
    readonly author: Author

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    updatedAt: Date
}