import { Types } from "mongoose";

export interface Course {
    title:string,
    description:string,
    modules: [string],
    instructor: Types.ObjectId,
}