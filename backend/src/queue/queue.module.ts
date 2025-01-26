import { Module } from '@nestjs/common';
import { BullModule } from "@nestjs/bullmq";
import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.getOrThrow('REDIS_HOST'),
                    port: parseInt(configService.getOrThrow('REDIS_PORT')),
                    password: configService.get('REDIS_PASSWORD') || undefined,
                    tls: configService.get('REDIS_TLS') || undefined
                },
                defaultJobOptions: {
                }
            }),
            inject: [ConfigService]
        }),
        BullModule.registerQueue({
            'name': 'heartbeat',
        }),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter
        }),
        BullBoardModule.forFeature({
            name: 'heartbeat',
            adapter: BullMQAdapter
        })
    ],
    exports: [BullModule]
})
export class QueueModule { }
