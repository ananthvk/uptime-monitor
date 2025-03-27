import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        PassportModule.register({defaultStrategy: 'jwt'})
    ],
    providers: [
        JwtStrategy
    ],
    exports: [
        PassportModule
    ]
})
export class AuthModule { }
