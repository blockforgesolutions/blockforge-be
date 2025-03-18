import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) { }

    use(req: CustomRequest, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = this.jwtService.verify(token);
            req.user = decoded; 
            next();
        } catch (error) {
            console.log(error);

            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}
