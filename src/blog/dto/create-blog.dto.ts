import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";


export class CreateBlogDto {
    @ApiProperty({ example: { tr: "Blog Başlık", en: "Blog Title" } })
    @IsObject()
    @IsNotEmpty()
    readonly title: {
        tr: string,
        en: string
    }

    @ApiProperty({ example: "/hero.jpg" })
    @IsString()
    @IsNotEmpty()
    readonly heroUrl: string

    @ApiProperty({example: ["67daa8881f4c61f101046612", "67daa8881f4c61f101046612"]})
    @IsArray()
    @IsOptional()
    readonly categories: string[]

    @ApiProperty({ example: "/cover.jpg" })
    @IsString()
    @IsNotEmpty()
    readonly coverUrl: string

    @ApiProperty({ example: "5 min" })
    @IsString()
    @IsNotEmpty()
    readonly duration: string

    @ApiProperty({ example: { tr: "Blog Açıklama", en: "Blog Description" } })
    @IsObject()
    @IsNotEmpty()
    readonly description: {
        tr: string,
        en: string
    }

    @ApiProperty({ example: { tr: "Blog İçeriği", en: "Blog Content" } })
    @IsObject()
    @IsNotEmpty()
    readonly content: {
        tr: string,
        en: string
    }

    @ApiProperty({ example: "67daa8881f4c61f101046612" })
    @IsString()
    @IsNotEmpty()
    readonly author: string
}