import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FolderNames } from 'src/common/enums/folder-names.enum';

@Injectable()
export class GoogleStorageService {
    private storage: Storage
    private bucketName: string
    constructor(
        private configService: ConfigService
    ) {
        this.storage = new Storage({
            keyFile: this.configService.get<string>('GOOGLE_CLOUD_KEYFILE'),
        });
        this.bucketName = this.configService.get<string>('GOOGLE_CLOUD_BUCKET_NAME')!;
    }

    async uploadFile(file: any, folderName:FolderNames): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(`${folderName}/${Date.now()}-${file.originalname}`);
        const blobStream = blob.createWriteStream();


        return new Promise((resolve, reject) => {
            blobStream.on('finish', () => {
                resolve(`https://storage.googleapis.com/${this.bucketName}/${blob.name}`);
            });
            blobStream.on('error', (err) => reject(err));
            blobStream.end(file.buffer);
        });
    }

}
