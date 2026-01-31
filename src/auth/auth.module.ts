import { Module, Provider } from '@nestjs/common';
import { AuthService, REDIS_CLIENT } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { convertTimeToSeconds } from '../common/utils';
import { JwtStrategy } from './jwt.strategy';
import Redis from 'ioredis';

const redisClientFactory: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST') || 'localhost',
      port: configService.get<number>('REDIS_PORT') || 6379,
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('환경변수 JWT_SECRET이 설정되지 않았습니다.');
        }
        const expiresIn = configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME') || '15m';

        return {
          secret,
          signOptions: {
            expiresIn: convertTimeToSeconds(expiresIn),
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, redisClientFactory],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
