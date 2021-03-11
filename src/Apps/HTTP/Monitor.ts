import HTTPServer from "@Apps/HTTP/AbstractServer";
import type {ILog} from "@Shared/Infrastructure/Audit/Logger";
import type { RequestHandler } from "express";
import * as prometheus from "express-prom-bundle";
import { Middleware } from "express-prom-bundle";

export default class Monitor extends HTTPServer {

    public readonly middleware: RequestHandler;

    constructor(
        port: number,
        logger: ILog,
    ) {
        super(port, logger);
        this.middleware = this.bindMonitor();
    }

    public async preUp(): Promise<void> {
        // noop
    }

    private bindMonitor(): RequestHandler {
        // Any, yes. Workaround for https://github.com/jochen-schweizer/express-prom-bundle/pull/57
        const metricsRequestMiddleware: Middleware = prometheus({
            autoregister: false, // This will prevent /metrics endpoint from being added on the app server
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

        this.http.use(metricsRequestMiddleware.metricsMiddleware);

        return metricsRequestMiddleware;
    }
}
