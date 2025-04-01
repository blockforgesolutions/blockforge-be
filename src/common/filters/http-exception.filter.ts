import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse();

        console.log(exception);

        let statusCode = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorResponseObj: { [key: string]: any } = exception instanceof HttpException
            ? exception.getResponse() as { [key: string]: any }
            : { message: 'Internal server error', statusCode: statusCode };

        if (exception instanceof MongoServerError && exception.code === 11000) {
            statusCode = HttpStatus.CONFLICT;
            const [[key, value]] = Object.entries(exception.keyValue);
            errorResponseObj = {
                message: 'Duplicate key error',
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                details: `The value '${value}' for field '${key}' already exists.`,
            };
        } else if (exception instanceof Error && exception.name === 'ValidationError') {
            errorResponseObj = {
                message: 'Validation error',
                details: exception.message,
            };
        }

        const responseObj = {
            ...errorResponseObj,
            statusCode: statusCode
        };

        response.status(statusCode).json(responseObj);
    }
}