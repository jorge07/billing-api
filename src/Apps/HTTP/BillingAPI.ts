import HTTPServer from "@Apps/HTTP/AbstractServer";
import Monitor from "@Apps/HTTP/Monitor";
import type {FastifyPluginCallback} from "fastify";
import fastifySwagger from "fastify-swagger";
import { Framework } from "hollywood-js";
import errorHandler from "./Middleware/ErrorHandler";
import { IRoute, routes } from "./Routing";

export default class BillingAPI extends HTTPServer {
    private monitor: Monitor;

    constructor(private readonly kernel: Framework.Kernel) {
        super(kernel.container.get("port"), kernel.container.get("logger"));
        this.monitor = new Monitor(this.kernel.container.get("metrics.port"), this.logger);
        this.bindMonitor(this.monitor.metricsPlugin);
        this.openApi();
        this.bindRouting();
        this.http.setErrorHandler(errorHandler(this.logger));
    }

    public async preUp(): Promise<void> {
        await this.monitor.up();
        await this.http.ready();
    }

    private bindRouting(): void {
        for (const context of routes) {
            const route: IRoute = context(this.kernel.app);

            switch (route.method.toLocaleLowerCase()) {
                case "get":
                    this.http.get(route.path, route.options || {}, route.action);
                    break;
                case "patch":
                    this.http.patch(route.path, route.options || {}, route.action);
                    break;
                case "post":
                    this.http.post(route.path, route.options || {}, route.action);
                    break;
                default:
                    throw new Error("No valid method for:" + JSON.stringify(route));
            }
        }
    }

    private bindMonitor(middleware: FastifyPluginCallback): void {
        this.http.register(middleware, {});
    }
    private openApi(): void {
        this.http.register(fastifySwagger, {
            exposeRoute: true,
            swagger: {
                consumes: ["application/json"],
                info: {
                    description: "Billing API",
                    title: "BillingAPI",
                    version: "1.0.0",
                },
                produces: ["application/json"],
            },
            uiConfig: {
                deepLinking: false,
                docExpansion: "full",
            },
        });
    }
}
