import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateModel, CertificateSchema } from './model/certificate.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CertificateModel.name, schema: CertificateSchema }]),
  ],
  providers: [CertificateService],
  controllers: [CertificateController]
})
export class CertificateModule { }
