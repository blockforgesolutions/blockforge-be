/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus } from '@nestjs/common';
import { transformMongoDocument } from './mongo.utils';

interface MongoDocument<T> {
    _id: any;
    __v?: any;
}

import { plainToInstance } from 'class-transformer';

export function transformMongoData<T extends MongoDocument<T>, R>(
    data: T,
    dtoClass: new () => R
): R {
    const transformedData = transformMongoDocument(data);
    if (!transformedData) {
        throw new HttpException(
            { message: 'Data not found', statusCode: HttpStatus.NOT_FOUND },
            HttpStatus.NOT_FOUND,
        );
    }
    return plainToInstance(dtoClass, transformedData);
}