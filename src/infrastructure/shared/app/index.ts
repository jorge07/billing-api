import { Application } from "hollywood-js";
import IMiddleware from "hollywood-js/src/Application/Bus/Middelware";
import { injectable, multiInject } from "inversify";

@injectable()
export default class App {
    private readonly app: Application.App;

    constructor(
        @multiInject("application.command.handler")
        private readonly commandHandlers: Application.ICommandHandler[],
        @multiInject("application.query.handler")
        private readonly queryHandlers: Application.IQueryHandler[],
        @multiInject("application.command.middleware")
        private readonly commandMiddleware: IMiddleware[] = [],
        @multiInject("application.query.middleware")
        private readonly queryMiddleware: IMiddleware[] = [],
    ) {
        const commands = new Map<any, Application.ICommandHandler>();
        const queries = new Map<any, Application.IQueryHandler>();

        const commandName = (target: any ): string => {
            if (!target.command) {
                throw new Error(`Missinng @autowiring annotation in ${target.constructor.name} command`);
            }

            return target.command ;
        };

        commandHandlers.forEach((handler: Application.ICommandHandler) => {
            commands.set(
                commandName(handler),
                handler,
            );
        });

        queryHandlers.forEach((handler: Application.IQueryHandler) => {
            queries.set(
                commandName(handler),
                handler,
            );
        });

        this.app = new Application.App(commands, queries);
    }

    public async ask(query: Application.IQuery): Promise<Application.IAppResponse|Application.IAppError|null> {

        return await this.app.ask(query);
    }

    public async handle(command: Application.ICommand): Promise<void|Application.IAppError> {

        return await this.app.handle(command);
    }
}
