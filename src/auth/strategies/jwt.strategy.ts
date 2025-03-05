import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';

interface JwtPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel
      .findById(payload.sub)
      .select('-password')
      .populate({
        path: 'role',
        select: '_id name description',
        populate: {
          path: 'privileges',
          select: '_id name description resource action'
        }
      })
      .lean();

    if (!user) {
      throw new UnauthorizedException();
    }

    // Extract privilege names and add them to user object
    const privilegeNames = user.role?.privileges?.map(p => p.name) || [];

    // Create a new object with only the needed properties
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      role: user.role?.name,
      provider: user.provider,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      picture: user.picture,
      privileges: privilegeNames
    };

    return userResponse;
  }
} 