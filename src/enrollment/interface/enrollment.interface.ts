import { Types } from "mongoose";

export enum EnrollmentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface Enrollment {
    userId: Types.ObjectId
    courseId: Types.ObjectId
    paymentStatus: EnrollmentStatus
    amount: number
    transaction: string | null
}