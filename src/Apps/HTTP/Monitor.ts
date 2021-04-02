import HTTPServer from "@Apps/HTTP/AbstractServer";
import type {ILog} from "@Shared/Infrastructure/Audit/Logger";
import {FastifyPluginCallback} from "fastify";
import metricsPlugin from "fastify-metrics";

export default class Monitor extends HTTPServer {
    public readonly metricsPlugin: FastifyPluginCallback;

    constructor(
        port: number,
        logger: ILog,
    ) {
        super(port, logger);
        this.metricsPlugin = this.bindMonitor();
    }

    public async preUp(): Promise<void> {
        await this.http.ready();
    }

    private bindMonitor() {
        this.http.register(metricsPlugin, {
            enableDefaultMetrics: false,
            enableRouteMetrics: false,
            endpoint: "/metrics",
            groupStatusCodes: false,
        });

        return metricsPlugin;
    }
}
