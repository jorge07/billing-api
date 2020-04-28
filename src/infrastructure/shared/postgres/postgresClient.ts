import { injectable } from "inversify";
import { Connection, createConnection, getConnectionManager } from "typeorm";

@injectable()
export default class PostgresClient {

    private signals = [
        "SIGINT",
        "SIGTERM",
        "SIGQUIT",
    ];
    private connection?: Connection;

    constructor(
        private config: any,
    ) {}

    public async connect(): Promise<Connection>  {

        if (getConnectionManager().has(this.config.name)) {
            return;
        }

        this.connection = await createConnection(this.config);


        this.signals.forEach((sig: any) => process.on(sig, () => this.close()));

        return this.connection;
    }

    public async close() {
        if (this.connection) {
            await this.connection.close();
        }
    }
}
