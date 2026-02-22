import { Application, EventSourcing } from "hollywood-js";
import type { IAppError } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import NotFoundException from "../../../Shared/Domain/Exceptions/NotFoundException";
import Transaction from "../../Domain/Transaction";
import FailCommand from "./Command";

@injectable()
export default class Fail implements Application.ICommandHandler {
    constructor(
        @inject("infrastructure.transaction.eventStore")
        private readonly writeModel: EventSourcing.EventStore<Transaction>,
    ) {}

    @Application.autowiring
    public async handle(command: FailCommand): Promise<void | IAppError> {
        try {
            const transaction = await this.writeModel.load(command.uuid.toIdentity()) as Transaction;
            transaction.fail(command.reason);
            await this.writeModel.save(transaction);
        } catch (err) {
            if (err instanceof EventSourcing.AggregateRootNotFoundException) {
                throw new NotFoundException("Transaction not found");
            }
            throw err;
        }
    }
}
