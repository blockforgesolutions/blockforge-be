import { ApiProperty } from "@nestjs/swagger";
import { LessonResponse } from "./lesson.response";
import { ModuleResponse } from "src/module/model/module.response";
import { CourseResponse } from "src/course/model/course.response";

export class FullCourseResponse {
    @ApiProperty({ type: LessonResponse })
    lesson: LessonResponse

    @ApiProperty({ type: [ModuleResponse] })
    modules: ModuleResponse[]

    @ApiProperty({type:CourseResponse})
    course: CourseResponse
}