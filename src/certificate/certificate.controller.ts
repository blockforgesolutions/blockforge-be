import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CertificateResponse } from './model/certificate.response';
import { CertificateMessages } from 'src/common/enums/certificate-message.enum';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@ApiTags('Certificate')
@Controller('certificate')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class CertificateController {
    constructor(
        private readonly certificateService: CertificateService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create certificate', description: 'Returns created certificate' })
    @ApiResponse({
        status: 201,
        description: CertificateMessages.CREATED,
        type: CertificateResponse
    })
    @ApiResponse({ status: 400, description: CertificateMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 409, description: CertificateMessages.ALREADY_EXISTS })
    async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
        return await this.certificateService.createCertificate(createCertificateDto);
    }

    @Get(':certificateId')
    @ApiOperation({ summary: 'Get certificate by id', description: 'Returns certificate by id' })
    @ApiParam({ name: 'certificateId', type: String })
    @ApiResponse({
        status: 200,
        description: "Returns certificate by id",
        type: CertificateResponse
    })
    @ApiResponse({ status: 400, description: CertificateMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CertificateMessages.NOT_FOUND })
    async getCertificateById(@Param('certificateId') certificateId: string) {
        return await this.certificateService.getCertificateById(certificateId);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get user certificates', description: 'Returns user certificates' })
    @ApiParam({ name: 'userId', type: String })
    @ApiResponse({
        status: 200,
        description: "Returns user certificates",
        type: CertificateResponse
    })
    @ApiResponse({ status: 400, description: CertificateMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    async getUserCertificates(@Param('userId') userId: string) {
        return await this.certificateService.getUserCertificates(userId);
    }

    @Put()
    @ApiOperation({ summary: 'Update certificate', description: 'Returns updated certificate' })
    @ApiResponse({
        status: 200,
        description: "Returns updated certificate",
        type: CertificateResponse
    })
    @ApiResponse({ status: 400, description: CertificateMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CertificateMessages.NOT_FOUND })
    async updateCertificate(@Param('certificateId') certificateId: string, @Body() updateCertificateDto: UpdateCertificateDto) {
        return await this.certificateService.updateCertificate(certificateId, updateCertificateDto);
    }

    @Delete(':certificateId')
    @ApiOperation({ summary: 'Delete certificate', description: 'Returns deleted certificate' })
    @ApiParam({ name: 'certificateId', type: String })
    @ApiResponse({
        status: 200,
        description: "Returns deleted certificate",
        type: CertificateResponse
    })
    @ApiResponse({ status: 400, description: CertificateMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CertificateMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CertificateMessages.NOT_FOUND })
    async deleteCertificate(@Param('certificateId') certificateId: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.certificateService.deleteCertificate(certificateId);
    }
}
