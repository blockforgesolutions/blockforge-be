import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
    constructor(
       private readonly courseService: CourseService 
    ) {}

    @Post()
    async createCourse(@Body() course: CreateCourseDto) {
        const newCourse = await this.courseService.createCourse(course);
        return new ApiResponseDto(true, newCourse);
    }

    @Get()
    async getCourses() {
        const courses = await this.courseService.getCourses();
        return new ApiResponseDto(true, courses);
    }

    @Get(':courseId')
    async getCourseById(@Param('courseId') courseId: string) {
        const course = await this.courseService.getCourseById(courseId);
        return new ApiResponseDto(true, course);
    }

    @Put(':courseId')
    async updateCourse(@Param('courseId') courseId: string, @Body() course: UpdateCourseDto) {
        const updatedCourse = await this.courseService.updateCourse(courseId, course);
        return new ApiResponseDto(true, updatedCourse);
    }

    @Delete(':courseId')
    async deleteCourse(@Param('courseId') courseId: string) {
        const deletedCourse = await this.courseService.deleteCourse(courseId);
        return new ApiResponseDto(true, deletedCourse);
    }
}
