import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { CreateMonitorDto } from './dto/create-monitor.dto';

@Injectable()
export class MonitorService {
    private monitors = [
        {
            id: 1,
            user_id: 101,
            name: 'Example.com get check',
            date_created: new Date(),
            type: 'HTTP',
            url: 'https://example.com',
            port: '80',
            method: 'GET',
        },
        {
            id: 2,
            user_id: 101,
            name: 'Google.com check',
            date_created: new Date(),
            type: 'HTTP',
            url: 'https://google.com',
            port: '443',
            method: 'GET',
        },
        {
            id: 3,
            user_id: 101,
            name: 'Check TCP Service',
            date_created: new Date(),
            type: 'TCP',
            url: '1.1.1.1',
            port: '53',
            method: '',
        },
        {
            id: 4,
            user_id: 101,
            name: 'Check Local IP',
            date_created: new Date(),
            type: 'TCP',
            url: '192.168.1.1',
            port: '1024',
            method: '',
        },
        {
            id: 5,
            user_id: 102,
            name: 'Arch website check',
            date_created: new Date(),
            type: 'HTTP',
            url: 'https://archlinux.org',
            port: '80',
            method: 'HEAD',
        },
    ];
    private nextMonitorId = 6;

    findAll(user_id: number) {
        return this.monitors.filter(x => x.user_id === user_id)
    }

    findOne(user_id: number, monitor_id: number) {
        const monitor = this.monitors.filter(x => x.id === monitor_id && x.user_id === user_id)
        if (monitor.length === 0)
            throw new NotFoundException('Monitor with given id not found')
        return monitor
    }

    update(user_id: number, monitor_id: number, updateMonitorDto: UpdateMonitorDto) {
        this.monitors = this.monitors.map((monitor) => {
            if (monitor.id === monitor_id && monitor.user_id === user_id) {
                console.log('Update')
                return { ...monitor, ...updateMonitorDto}
            }
            return monitor
        })
        return this.findOne(user_id, monitor_id)
    }

    delete(user_id: number, monitor_id: number) {
        const deletedMonitor = this.findOne(user_id, monitor_id)
        this.monitors = this.monitors.filter((monitor) => (monitor.user_id === user_id) && (monitor.id !== monitor_id))
        return deletedMonitor
    }

    create(user_id: number, createMonitorDto: CreateMonitorDto) {
        const newMonitor: any = createMonitorDto
        newMonitor.date_created = new Date()
        newMonitor.user_id = user_id
        newMonitor.id = this.nextMonitorId
        this.monitors.push(newMonitor)
        this.nextMonitorId++
        return newMonitor
    }
}

