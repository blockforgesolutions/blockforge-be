import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Enrollment, EnrollmentStatus } from "../interface/enrollment.interface";

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class EnrollmentModel extends Document implements Enrollment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId
    
    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId
    
    @Prop({ enum: EnrollmentStatus, default: EnrollmentStatus.PENDING })
    paymentStatus: EnrollmentStatus
    
    @Prop({ required: true })
    amount: number
    
    @Prop({ required: false, type: String })
    transaction: string | null

    @Prop()
    createdAt: Date
    
    @Prop()
    updatedAt: Date
}

export const EnrollmentSchema = SchemaFactory.createForClass(EnrollmentModel);