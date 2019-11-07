import * as bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import App from "../../infrastructure/shared/app/index";
import Log from "../../infrastructure/shared/audit/logger";
import transactionPost from "./routing/transaction/post";
import transactionGet from "./routing/transaction/get";

@injectable()
export default class HTTPServer {
    private readonly express: express.Express;
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

    private bindRouting(): void {
        transactionGet(this.express, this.app);
        transactionPost(this.express, this.app);
    }
}
