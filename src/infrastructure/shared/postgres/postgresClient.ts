import { inject, injectable } from "inversify";
import { Connection, createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

@injectable()
export default class PostgresClient {
    constructor(
        private config: any,
    ) {}

    public async connect(): Promise<Connection>  {
        return await createConnection(this.config);
    }
}
