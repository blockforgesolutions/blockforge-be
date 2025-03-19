import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../user/user.schema';
import { MailMessages } from '../common/enums/messages.enum';

@Injectable()
export class MailService {
  private oauth2Client: OAuth2Client;
  private gmail: any;

  constructor(private configService: ConfigService) {
    this.initializeOAuthClient();
  }

  private initializeOAuthClient() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Eksik Google OAuth konfigürasyonu');
    }

    this.oauth2Client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri: 'http://localhost:8080/mail/callback',
    });

    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this.oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        this.configService.set('GOOGLE_REFRESH_TOKEN', tokens.refresh_token);
      }
    });
 
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async loadTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(process.cwd(), 'src', 'resources', 'email-templates', `${templateName}.html`);
      return fs.promises.readFile(templatePath, 'utf8');
    } catch (error) {
      console.log(error);

      throw new BadRequestException(MailMessages.TEMPLATE_NOT_FOUND);
    }
  }

  replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    try {
      return Object.entries(variables).reduce((result, [key, value]) => {
        return result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }, template);
    } catch (error) {
      console.log(error);

      throw new BadRequestException(MailMessages.TEMPLATE_RENDERING_ERROR);
    }
  }

  private encodeMessage(message: { to: string; subject: string; html: string }): string {
    if (!message.to || !message.subject || !message.html) {
      throw new BadRequestException(MailMessages.INVALID_TEMPLATE_DATA);
    }

    // Subject'i base64 ile encode et
    const encodedSubject = Buffer.from(message.subject).toString('base64');

    const str = [
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `To: ${message.to}`,
      `Subject: =?UTF-8?B?${encodedSubject}?=`,
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(message.html).toString('base64')
    ].join('\n');

    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async sendMail(to: string, subject: string, html: string): Promise<{ message: string }> {
    if (!to || !this.isValidEmail(to)) {
      throw new BadRequestException(MailMessages.INVALID_EMAIL_ADDRESS);
    }

    const message = {
      to,
      subject,
      html,
    };

    const encodedMessage = this.encodeMessage(message);

    try {
      const { token } = await this.oauth2Client.getAccessToken();
      if (!token) {
        throw new Error('Access token alınamadı');
      }

      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      return { message: MailMessages.EMAIL_SENT_SUCCESS };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(MailMessages.EMAIL_SEND_FAILED);
    }
  }

  async sendVerificationEmail(user: User, token: string): Promise<{ message: string }> {
    const verificationUrl = `${this.configService.get('EMAIL_VERIFICATION_URL')}?token=${token}`;

    const template = await this.loadTemplate('verification');
    const html = this.replaceTemplateVariables(template, {
      name: user.name,
      verificationUrl,
    });

    return this.sendMail(
      user.email,
      'E-posta Adresinizi Doğrulayın - Easy Portföy',
      html,
    );
  }

  // Method to get the authorization URL for Gmail API
  getAuthUrl(): string {
    try {
      const scopes = ['https://www.googleapis.com/auth/gmail.send'];
      return this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
      });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(MailMessages.SMTP_CONNECTION_ERROR);
    }
  }

  // Method to get tokens using the authorization code
  async getTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(MailMessages.SMTP_CONNECTION_ERROR);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const template = await this.loadTemplate('password-reset');
    const html = this.replaceTemplateVariables(template, {
      name,
      token,
    });

    return this.sendMail(
      email,
      'Şifre Sıfırlama - Easy Portföy',
      html,
    );
  }
} 