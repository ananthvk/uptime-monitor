import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
@Injectable()
export class AppService {
    private dbService: DatabaseService;
    constructor(private db: DatabaseService) {
        this.dbService = db
    }
    getHello(): string {
        console.log(this.db.getDb().selectFrom('monitor').selectAll().execute())
        return 'Hello World!!';
    }
}
