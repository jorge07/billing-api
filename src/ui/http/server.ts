import * as bodyParser from "body-parser";
import { Express, Request, Response } from "express";
import * as express from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import App from "../../application/index";
import Log from "../../infrastructure/shared/audit/logger";
import errorHandler from "./middleware/errorHandler";
import { IRoute, routes } from "./routing";

@injectable()
export default class HTTPServer {
    private readonly express: Express;
    private server?: Server;

    constructor(
        @inject("port") private readonly port: number,
        @inject("logger") private readonly logger: Log,
        @inject("app") private readonly app: App,
    ) {
        this.express = express();
        this.express.use(
            bodyParser.json({
                type: "application/json",
            }),
        );

        this.bindRouting();
        this.express.use(errorHandler);
        this.stopWatch();
    }

    public async up(): Promise<void> {
        this.server = await this.express.listen(this.port, () => {
            this.logger.info(`🚀 Server is running in http://localhost:${this.port}`);
       });
    }

    public getExpress(): express.Express {
        return this.express;
    }

    private stopWatch(): void {
        const sigs = [
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
        ];

        sigs.forEach((sig: any) => {
            process.on(sig, () => {
                if (!this.server) {
                    return;
                }
                this.logger.warn("Shutting down...");
                this.server.close((err?: Error) => {
                    if (err) {
                        this.logger.error(err.message);
                        process.exit(1);
                    }
                });

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
                    this.express.get(route.path, this.wrapAsyncRoutes(route.action));
                    break;
                case "post":
                    this.express.post(route.path, this.wrapAsyncRoutes(route.action));
                    break;
                default:
                    throw new Error("No valid method for:" + JSON.stringify(route));
            }
        });
    }
}
