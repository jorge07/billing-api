import { createConnection, Connection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { injectable, inject } from 'inversify';

@injectable()
export default class PostgresClient {
    constructor(
        private config: any
    ) {}

    public async connect(): Promise<Connection>  {
        return await createConnection(this.config);
    }
}
