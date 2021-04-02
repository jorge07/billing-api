import GracefulServer from "@gquittet/graceful-server";
import type IGracefulServer from "@gquittet/graceful-server/lib/types/interface/gracefulServer";
import type {ILog} from "@Shared/Infrastructure/Audit/Logger";
import fastify, {FastifyInstance} from "fastify";
import {Server} from "http";

export default abstract class HTTPServer {
    public readonly http: FastifyInstance;
    public readonly health: IGracefulServer;

    protected constructor(
        private readonly port: number,
        protected readonly logger: ILog,
    ) {
        this.http = fastify({
            disableRequestLogging: true,
            logger: false,
        });
        this.health = this.stopWatch(this.http.server);
    }

    public async up(): Promise<void> {
        await this.preUp();
        await this.http.listen(this.port, "0.0.0.0", (error, address) => {
            if (error) {
                this.logger.error(`${error.message}`);
                process.exit(1);
            }
            this.logger.info(`🚀 Server is running in ${address}`);
            this.postUp();
        });
    }

    protected abstract preUp(): void;

    protected async postUp(): Promise<void> {
        this.health.setReady();
    }

    private stopWatch(server: Server): IGracefulServer {
        const gracefulServer = GracefulServer(server);

        gracefulServer.on(GracefulServer.READY, () => {
            this.logger.info("up");
        });

        gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
            this.logger.info("Server is shutting down");
        });

        gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
            this.logger.info(`Server is down because of ${error.message}`);
        });

        return gracefulServer;
    }
}
