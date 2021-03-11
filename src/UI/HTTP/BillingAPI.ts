import * as bodyParser from "body-parser";
import * as express from "express";
import type { Express, RequestHandler } from "express";
import { Framework } from "hollywood-js";
import HTTPServer from "UI/HTTP/AbstractServer";
import Monitor from "UI/HTTP/Monitor";
import errorHandler from "./Middleware/ErrorHandler";
import { IRoute, routes } from "./Routing";

export default class BillingAPI extends HTTPServer {
    public readonly http: Express;
    private readonly monitor: Monitor;

    constructor(private readonly kernel: Framework.Kernel) {
        super(kernel.container.get("port"), kernel.container.get("logger"));
        this.http = express();
        this.http.use(
            bodyParser.json({
                type: "application/json",
            }),
        );
        this.monitor = new Monitor(this.kernel.container.get("metrics.port"), this.logger);
        this.bindMonitor(this.monitor.middleware);
        this.bindRouting();
        this.http.use(errorHandler(this.logger));
    }

    public async preUp(): Promise<void> {
        await this.monitor.up();
    }

    private bindRouting(): void {
        routes.forEach((context) => {
            const route: IRoute = context(this.kernel);

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
