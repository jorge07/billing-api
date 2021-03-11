import IMiddleware from "hollywood-js/src/Application/Bus/Middelware";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ILog } from "../../Infrastructure/Audit/Logger";

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
