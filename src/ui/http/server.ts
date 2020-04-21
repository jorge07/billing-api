import * as bodyParser from "body-parser";
import * as express from "express";
import type { Express, Request, Response } from "express";
import * as prometheus from "express-prom-bundle";
import { Framework } from "hollywood-js";
import type { Server } from "http";
import Log from "infrastructure/shared/audit/logger";
import { inject, injectable } from "inversify";
import errorHandler from "./middleware/errorHandler";
import { IRoute, routes } from "./routing";

@injectable()
export default class HTTPServer {
    private readonly http: Express;
    private readonly monitor: Express;

    constructor(
        @inject("port") private readonly port: number,
        @inject("logger") private readonly logger: Log,
        @inject("hollywood.app.bridge") private readonly app: Framework.AppBridge,
    ) {
        this.http = express();
        this.monitor = express();

        this.http.use(
            bodyParser.json({
                type: "application/json",
            }),
        );
        this.bindMonitor();
        this.bindRouting();
        this.http.use(errorHandler);
    }

    public async up(): Promise<void> {
        const server: Server = await this.http.listen(this.port, () => {
            this.logger.info(`🚀 Server is running in http://localhost:${this.port}`);
        });
        const monitor: Server = await this.monitor.listen(9800, () => {
            this.logger.info(`🚀 Monitor is running in http://localhost:9800/metrics`);
        });

        this.stopWatch([server, monitor]);
    }

    public getExpress(): express.Express {
        return this.http;
    }

    private stopWatch(servers: Server[]): void {
        const sigs = [
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
        ];

        sigs.forEach((sig: any) => {
            process.on(sig, () => {
                this.logger.warn("Shutting down...");

                const errors: any[] = [];

                for (const server of servers) {
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
                }
            });
        });
    }

    private wrapAsyncRoutes(action: (req: Request, res: Response) => Promise<void>) {
        return (req: Request, res: Response, next: (err: any) => void) => action(req, res).catch(next);
    }

    private bindRouting(): void {
        routes.forEach((context) => {
            const route: IRoute = context(this.app);

            switch (route.method.toLocaleLowerCase()) {
                case "get":
                    this.http.get(route.path, this.wrapAsyncRoutes(route.action));
                    break;
                case "post":
                    this.http.post(route.path, this.wrapAsyncRoutes(route.action));
                    break;
                default:
                    throw new Error("No valid method for:" + JSON.stringify(route));
            }
        });
    }

    private bindMonitor(): void {
        // Any, yes. Workaround for https://github.com/jochen-schweizer/express-prom-bundle/pull/57
        const metricsRequestMiddleware: any = prometheus({
            autoregister: false,
            includeMethod: true,
            includePath: true,
            normalizePath: [
                ["^/transaction/.*", "/transaction/:uuid"],
                ["/transaction", "/transaction"],
            ],
            promClient: {
                collectDefaultMetrics: {},
            },
        });

        this.http.use(metricsRequestMiddleware);
        this.monitor.use(metricsRequestMiddleware.metricsMiddleware);
    }
}
