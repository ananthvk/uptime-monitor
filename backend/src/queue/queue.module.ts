import { Module } from '@nestjs/common';
import { BullModule } from "@nestjs/bullmq";
import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";


@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT!),
            },
            defaultJobOptions: {
            }
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
