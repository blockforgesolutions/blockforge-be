import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Enrollment, EnrollmentStatus } from "../interface/enrollment.interface";

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class EnrollmentModel extends Document implements Enrollment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserModel', required: true })
    userId: MongooseSchema.Types.ObjectId
    
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseModel', required: true })
    courseId: MongooseSchema.Types.ObjectId
    
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