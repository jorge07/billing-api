import type IMiddleware from "hollywood-js/src/Application/Bus/Middleware";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ILog } from "../../Infrastructure/Audit/Logger";

@injectable()
export default class LoggerMiddleware implements IMiddleware {

    constructor(@inject("logger") private readonly logger: ILog) {}

    public async execute(command: any, next: (command: any) => any) {
        this.logger.info(`Starting ${command.constructor.name}`);
        try {
            const result = await next(command);
            this.logger.info(`${command.constructor.name} finished without errors`);
            return result;
        } catch (err) {
            this.logger.warn(`${command.constructor.name} finished with error: ${err.message}`);
            throw err;
        }
    }
}
