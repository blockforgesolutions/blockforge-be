import { Schema, Types } from "mongoose"

export interface Blog {
    title:{
        tr:string,
        en:string
    },
    slug:string,
    heroUrl:string,
    categories?: Schema.Types.ObjectId[],
    coverUrl:string
    duration:string
    description:{
        tr:string,
        en:string
    }
    author:Types.ObjectId,
    content:{
        tr:string,
        en:string
    }
}