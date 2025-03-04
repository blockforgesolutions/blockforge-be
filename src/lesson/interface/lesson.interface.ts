import { Types } from "mongoose";


export interface Lesson {
    title: string;
    content: string; // video or document
    course: Types.ObjectId;
    videoUrl: string;
    quiz?: [string];
}