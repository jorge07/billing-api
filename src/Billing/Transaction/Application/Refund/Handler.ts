import { Application, EventSourcing } from "hollywood-js";
import type { IAppError } from "hollywood-js/src/Application/Bus/CallbackArg";
import { inject, injectable } from "inversify";
import NotFoundException from "../../../Shared/Domain/Exceptions/NotFoundException";
import Transaction from "../../Domain/Transaction";
import RefundCommand from "./Command";

@injectable()
export default class Refund implements Application.ICommandHandler {
    constructor(
        @inject("infrastructure.transaction.eventStore")
        private readonly writeModel: EventSourcing.EventStore<Transaction>,
    ) {}

    @Application.autowiring
    public async handle(command: RefundCommand): Promise<void | IAppError> {
        try {
            const transaction = await this.writeModel.load(command.uuid.toIdentity()) as Transaction;
            transaction.refund();
            await this.writeModel.save(transaction);
        } catch (err) {
            if (err instanceof EventSourcing.AggregateRootNotFoundException) {
                throw new NotFoundException("Transaction not found");
            }
            throw err;
        }
    }
}
