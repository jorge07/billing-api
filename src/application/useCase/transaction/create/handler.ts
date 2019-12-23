import ConflictException from "domain/shared/exceptions/ConflictException";
import Transaction from "domain/transaction/transaction";
import { Application, EventStore } from "hollywood-js";
import { ILog } from "infrastructure/shared/audit/logger";
import { inject, injectable } from "inversify";
import CreateCommand from "./command";

@injectable()
export default class Create implements Application.ICommandHandler {
    constructor(
        @inject("logger") private readonly logger: ILog,
        @inject(
            "infrastructure.transaction.eventStore",
        ) private readonly writeModel: EventStore.EventStore<Transaction>,
    ) {}

    @Application.autowiring
    public async handle(command: CreateCommand): Promise<void | Application.IAppError> {

        try {
            await this.writeModel.load(command.uuid.toString());
            throw new ConflictException("Already exists");

        } catch (err) {
            if (!(err instanceof EventStore.AggregateRootNotFoundException)) {
                throw err;
            }
        }

        const transaction: Transaction = Transaction.create(
            command.uuid,
            command.product,
            command.price,
        );

        await this.writeModel.save(transaction);
    }
}
