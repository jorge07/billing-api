import { inject, injectable } from "inversify";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

@injectable()
export default class PostgresClient {

    private connection?: Connection;

    constructor(
        private config: any,
    ) {}

    public async connect(): Promise<Connection>  {

        if (getConnectionManager().has(this.config.name)) {
            return;
        }

        try {

            this.connection = await createConnection(this.config);
        } catch (err) {
            throw err;
        }

        const sigs = [
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
        ];

        sigs.forEach((sig: any) => process.on(sig, () => this.close()));

        return this.connection;
    }

    public close() {
        if (this.connection) {
            this.connection.close();
        }
    }
}
