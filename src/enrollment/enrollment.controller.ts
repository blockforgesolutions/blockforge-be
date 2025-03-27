import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { EnrollmentMessages } from 'src/common/enums/enrollment-message.enum';
import { EnrollmentResponse } from './model/enrollment.response';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Controller('enrollment')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class EnrollmentController {
    constructor(
        private readonly enrollmentService: EnrollmentService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create enrollment', description: 'Returns the created enrollment' })
    @ApiResponse({
        status: 201,
        description: EnrollmentMessages.CREATED,
        type: EnrollmentResponse
    })
    @ApiResponse({ status: 400, description: EnrollmentMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    async createEnrollment(@Request() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
        return await this.enrollmentService.createEnrollment( req.user.id ,createEnrollmentDto);
    }


    @Get()
    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get all enrollments', description: 'Returns all enrollments' })
    @ApiResponse({
        status: 200,
        description: EnrollmentMessages.CREATED,
        type: [EnrollmentResponse]
    })
    async getEnrollments() {
        return await this.enrollmentService.getEnrollments();
    }

    @Get('/user')
    @ApiOperation({ summary: 'Get user enrollments', description: 'Returns user enrollments' })
    @ApiResponse({
        status: 200,
        description: "List of user's enrollments",
        type: [EnrollmentResponse]
    })
    @ApiResponse({ status: 401, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    async getUserEnrollments(@Request() req) {
        return await this.enrollmentService.getUserEnrollments(req.user.id);
    }

    @Get(':enrollmentId')
    @ApiOperation({ summary: 'Get enrollment by id', description: 'Returns the enrollment' })
    @ApiResponse({
        status: 200,
        description: "Enrollment details",
        type: EnrollmentResponse
    })
    @ApiResponse({ status: 400, description: EnrollmentMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: EnrollmentMessages.NOT_FOUND })
    async getEnrollmentById(@Param('enrollmentId') enrollmentId: string) {
        return await this.enrollmentService.getEnrollmentById(enrollmentId)
    }

    @Put(':enrollmentId')
    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update enrollment', description: 'Returns the updated enrollment' })
    @ApiResponse({
        status: 200,
        description: EnrollmentMessages.UPDATED,
        type: EnrollmentResponse
    })
    @ApiResponse({ status: 400, description: EnrollmentMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: EnrollmentMessages.NOT_FOUND })
    async updateEnrollment(@Param('enrollmentId') enrollmentId: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
        return await this.enrollmentService.updateEnrollment(enrollmentId, updateEnrollmentDto);
    }

    @Delete(':enrollmentId')
    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Delete enrollment', description: 'Returns the deleted enrollment' })
    @ApiResponse({
        status: 204,
        description: EnrollmentMessages.DELETED
    })
    @ApiResponse({ status: 401, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: EnrollmentMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: EnrollmentMessages.NOT_FOUND })
    async deleteEnrollment(@Param('enrollmentId') enrollmentId: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.enrollmentService.deleteEnrollment(enrollmentId);
    }
}
