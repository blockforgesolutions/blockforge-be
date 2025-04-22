import { Schema } from "mongoose";
import { Status } from "src/common/enums/status-enums";

export interface Course {
    title: string,
    description: string,
    instructor: Schema.Types.ObjectId,
    thumbnail?: string,
    price: number,
    slug:string,
    status: Status,
    categories: Schema.Types.ObjectId[],
}