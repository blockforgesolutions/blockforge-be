import { Types } from "mongoose"

export interface Module {
    title:string
    course: Types.ObjectId
}