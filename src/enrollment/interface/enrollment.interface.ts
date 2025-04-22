import { Schema } from "mongoose";

export enum EnrollmentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface Enrollment {
    userId: Schema.Types.ObjectId
    courseId: Schema.Types.ObjectId
    paymentStatus: EnrollmentStatus
    amount: number
    transaction: string | null
}