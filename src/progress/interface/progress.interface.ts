import { Types } from "mongoose";


export interface Progress {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    completedLessons: [Types.ObjectId];
    progressPercentage: number;
}