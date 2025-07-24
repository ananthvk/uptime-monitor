import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerMiddleware } from './logger.middleware';
import { DatabaseModule } from './database/database.module';
import { MonitorModule } from './monitor/monitor.module';
import { QueueModule } from './queue/queue.module';
import { HeartbeatModule } from './heartbeat/heartbeat.module';
import { StatusModule } from './status/status.module';
import { ConfigModule } from '@nestjs/config';
import { envFilePath } from './constants';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envFilePath,
            isGlobal: true
        }),
        CacheModule.registerAsync({
            useFactory: async () => {
                const protocol = process.env.REDIS_SSL === 'true' ? 'rediss' : 'redis';
                const password = process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : '';
                const host = process.env.REDIS_HOST;
                const port = process.env.REDIS_PORT;
                const redisUrl = `${protocol}://${password}${host}:${port}`;

                return {
                    stores: [
                        createKeyv(redisUrl)
                    ],
                    ttl: 0,
                }
            },
            isGlobal: true
        }),
        DatabaseModule, MonitorModule, QueueModule, HeartbeatModule, StatusModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})


export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*')
    }
}
