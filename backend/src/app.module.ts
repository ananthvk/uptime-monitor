import { MiddlewareConsumer, Module } from '@nestjs/common';
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
    imports: [DatabaseModule, MonitorModule, QueueModule, HeartbeatModule, StatusModule, ConfigModule.forRoot({
        envFilePath: envFilePath,
        isGlobal: true
    }), AuthModule],
    controllers: [AppController],
    providers: [AppService],
})


export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*')
    }
}
