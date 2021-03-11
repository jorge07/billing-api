import type {ILog} from "@Shared/Infrastructure/Audit/Logger";
import * as express from "express";
import type {Express, Request, Response} from "express";
import type {Server} from "http";
import {injectable} from "inversify";

@injectable()
export default abstract class HTTPServer {
    public readonly http: Express;

    protected constructor(
        private readonly port: number,
        protected readonly logger: ILog,
    ) {
        this.http = express();
    }

    public async up(): Promise<void> {
        await this.preUp();

        const server: Server = await this.http.listen(this.port, () => {
            this.logger.info(`🚀 Server is running in http://localhost:${this.port}`);
        });

        this.stopWatch(server);
    }

    protected abstract preUp();


    protected wrapAsyncRoutes(action: (req: Request, res: Response) => Promise<void>) {
        return (req: Request, res: Response, next: (err: any) => void) => action(req, res).catch(next);
    }

    private stopWatch(server: Server): void {
        const signals = [
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
        ];

        signals.forEach((sig: any) => {
            process.on(sig, () => {
                this.logger.warn("Shutting down...");

                const errors: any[] = [];

                server.close((err?: Error) => {
                    if (err) {
                        errors.push(err);
                    }

                    if (errors.length > 0) {
                        for (const error of errors) {
                            this.logger.warn("The following errors encounter when shutting down");
                            this.logger.error(error.message);
                        }

                        process.exitCode = 1;
                    }

                    this.logger.warn("Bye!");
                    process.exit(0);
                });
            });
        });
    }
}
