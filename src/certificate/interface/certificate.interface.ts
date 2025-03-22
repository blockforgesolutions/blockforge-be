import { Types } from "mongoose";

export interface Certificate {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    certificateUrl: string;
    createdAt: Date;
    updatedAt: Date;
}