import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PaymentMessages } from 'src/common/enums/payment-message.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) { }

    @Post('create-session')
    @UseGuards(JwtAuthGuard)
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Create a payment session', description: 'Returns a payment session id' })
    @ApiResponse({
        status: 201,
        description: PaymentMessages.CREATED,
        type: String
    })
    @ApiResponse({ status: 400, description: PaymentMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: PaymentMessages.UNAUTHORIZED_ACCESS })
    async createPaymentSession(@Param('enrollmentId') enrollmentId: string) {
        return this.paymentService.createPaymentSession(enrollmentId);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Handle a payment webhook' })
    async handleWebhook(@Request() req: any) {
        await this.paymentService.handleWebhook(req.rawBody);
        return { received: true };
    }
}
