import IMiddleware from "hollywood-js/src/Application/Bus/Middelware";
import { ILog } from "Infrastructure/Shared/Audit/Logger";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export default class LoggerMiddleware implements IMiddleware {

    constructor(@inject("logger") private readonly logger: ILog) {}

    public async execute(command: any, next: (command: any) => any) {

        this.logger.info(`Starting ${command.constructor.name}`);
        const result = await next(command);
        this.logger.info(`${command.constructor.name} finished without errors`);

        return result;
    }
}
