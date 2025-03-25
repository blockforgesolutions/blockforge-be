import { Types } from "mongoose";

export interface Course {
    title: string,
    description: string,
    instructor: Types.ObjectId,
    thumbnail?: string,
    price: number
}