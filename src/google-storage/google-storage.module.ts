import { Module } from '@nestjs/common';
import { GoogleStorageService } from './google-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule],
  providers: [GoogleStorageService],
  exports:[GoogleStorageService]
})
export class GoogleStorageModule {}
