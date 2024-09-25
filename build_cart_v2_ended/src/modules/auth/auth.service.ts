import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserStatus } from 'src/modules/user/models/user.model';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayLoad } from './types';
import { EmailService } from '../email/email.service';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from '../vendor/models/vendor.model';
import { ExpiryUnit, generateJwtExpiry } from 'src/util/util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private emailService: EmailService,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.verifyPassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.userService.updateLastLogin(user.id);

    return this.checkUser(user);
  }

  async validateLoggedInUser(id: string) {
    return this.checkUser(await this.userService.getUserById(id));
  }

  checkUser(user: User) {
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    if (user.status === UserStatus.PAUSED) {
      throw new UnauthorizedException(
        'Your account has been disabled by the admin of your Team. Please contact your admin for more information.',
      );
    }
    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException(
        `Your account is ${user.status.toLocaleLowerCase()}`,
      );

    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    let isVerified = await argon2.verify(user.password, password);
    if (isVerified) return isVerified;

    isVerified = await bcrypt.compare(password, user.password);
    if (isVerified) {
      await this.userService.updatePassword(user.id, password);
    }
    return isVerified;
  }

  async login(user: Partial<User>) {
    let vendor: Vendor | null;
    if (user.userType === 'SUPPLIER') {
      vendor = await this.vendorModel.findOne({ where: { email: user.email } });
    }
    const configExp: string =
      this.configService.get('JWT_EXPIRATION').replace('_', ' ') || '2 days';
    const configExpDate = configExp.split(' ');
    const expires = generateJwtExpiry(
      Number(configExpDate[0]),
      configExpDate[1] as ExpiryUnit,
    );

    const userTeams = await this.userService.getUserTeams(user.email);

    const payload: UserPayLoad = {
      sub: user.id,
      status: user.status,
      logo: user?.Builder
        ? user?.Builder?.logo
        : user?.Vendor
        ? user?.Vendor?.logo
        : user?.FundManager?.logo || '',
      userName: user.name || user.businessName,
      id: user.id,
      email: user.email,
      userType: user.userType,
      market_vendor: vendor ? vendor.market_vendor : false,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: configExp,
    });

    if (user.twoFactorAuthEnabled || user.emailNotificationEnabled) {
      try {
        await this.emailService.loginNotification({
          email: user.email,
          name: user.name,
        });
      } catch (error) {}
    }

    return {
      token,
      expires,
      ...payload,
      teams: userTeams.teams,
      firstLogin: user.lastLogin ? false : true,
    };
  }

  async loginWithSSO(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user || !user.sso_user) {
      throw new UnauthorizedException(
        'Email has not been registered with a social account. Please sign up with the social client to continue',
      );
    }

    await this.userService.updateLastLogin(user.id);

    let vendor;
    if (user.userType === 'SUPPLIER') {
      vendor = await this.vendorModel.findOne({ where: { email: user.email } });
    }
    const configExp: string =
      this.configService.get('JWT_EXPIRATION').replace('_', ' ') || '2 days';
    const configExpDate = configExp.split(' ');
    const expires = generateJwtExpiry(
      Number(configExpDate[0]),
      configExpDate[1] as ExpiryUnit,
    );
    const payload: UserPayLoad = {
      sub: user.id,
      status: user.status,
      logo: user?.Builder
        ? user?.Builder?.logo
        : user?.Vendor
        ? user?.Vendor?.logo
        : user?.FundManager?.logo || '',
      userName: user.name,
      id: user.id,
      email: user.email,
      userType: user.userType,
      market_vendor: vendor ? vendor.market_vendor : false,
    };

    const token = this.jwtService.sign(payload, { expiresIn: configExp });
    if (user.twoFactorAuthEnabled || user.emailNotificationEnabled) {
      try {
        await this.emailService.loginNotification({
          email: user.email,
          name: user.name,
        });
      } catch (error) {}
    }

    return { token, expires, ...payload };
  }
}
