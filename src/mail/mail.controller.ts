import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { MailMessages } from '../common/enums/messages.enum';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('auth-url')
  @ApiOperation({ summary: 'Get Gmail API authorization URL' })
  @ApiResponse({ 
    status: 200, 
    description: MailMessages.AUTH_URL_RETRIEVED_SUCCESS,
    schema: {
      properties: {
        url: { type: 'string', example: 'https://accounts.google.com/o/oauth2/v2/auth?...' }
      }
    }
  })
  @ApiResponse({ status: 500, description: MailMessages.SMTP_CONNECTION_ERROR })
  getAuthUrl(): { url: string } {
    const url = this.mailService.getAuthUrl();
    return { url };
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle Gmail API callback and get tokens' })
  @ApiResponse({ 
    status: 200, 
    description: MailMessages.TOKENS_RETRIEVED_SUCCESS,
    schema: {
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
        scope: { type: 'string' },
        token_type: { type: 'string' },
        expiry_date: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: MailMessages.INVALID_TEMPLATE_DATA })
  @ApiResponse({ status: 500, description: MailMessages.SMTP_CONNECTION_ERROR })
  async handleCallback(@Query('code') code: string): Promise<any> {
    const tokens = await this.mailService.getTokens(code);
    return tokens;
  }
} 