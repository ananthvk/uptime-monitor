import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerMiddleware } from './logger.middleware';
import { DatabaseModule } from './database/database.module';
import { MonitorModule } from './monitor/monitor.module';

@Module({
    imports: [DatabaseModule, MonitorModule],
    controllers: [AppController],
    providers: [AppService],
})


export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*')
    }
}
