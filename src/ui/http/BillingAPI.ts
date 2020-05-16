import * as bodyParser from "body-parser";
import * as express from "express";
import type { Express, RequestHandler } from "express";
import { Framework } from "hollywood-js";
import type { ILog } from "infrastructure/shared/audit/logger";
import { inject, injectable } from "inversify";
import HTTPServer from "ui/http/AbstractServer";
import Monitor from "ui/http/Monitor";
import errorHandler from "./middleware/errorHandler";
import { IRoute, routes } from "./routing";

@injectable()
export default class BillingAPI extends HTTPServer {
    public readonly http: Express;

    constructor(
        @inject("port") port: number,
        @inject("logger") logger: ILog,
        @inject("ui.monitor") private readonly monitor: Monitor,
        @inject("hollywood.app.bridge") private readonly app: Framework.AppBridge,
    ) {
        super(port, logger);
        this.http = express();
        this.http.use(
            bodyParser.json({
                type: "application/json",
            }),
        );
        this.bindMonitor(this.monitor.middleware);
        this.bindRouting();
        this.http.use(errorHandler(this.logger));
    }

    public async preUp(): Promise<void> {
        await this.monitor.up();
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

    private bindMonitor(middleware: RequestHandler): void {
        this.http.use(middleware);
    }
}
