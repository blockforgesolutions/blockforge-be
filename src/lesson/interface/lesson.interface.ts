import { Types } from "mongoose";


export interface Lesson {
    title: string;
    content: string; // video or document
    moduleId: Types.ObjectId;
    videoUrl: string;
    quiz?: [string];
    slug:string
}