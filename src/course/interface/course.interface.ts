import { Schema } from "mongoose";

export interface Course {
    title: string,
    description: string,
    instructor: Schema.Types.ObjectId,
    thumbnail?: string,
    price: number,
    slug:string,
    categories: Schema.Types.ObjectId[],
}