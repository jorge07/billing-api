import TransactionWasCreated from "domain/transaction/events/transactionWasCreated";
import { EventStore } from "hollywood-js";
import PostgresRepository from "infrastructure/transaction/readModel/repository/PostgresRepository";
import { inject, injectable } from "inversify";
import { Transactions } from "../mapping/transactions";

@injectable()
export default class TransactionPostgresProjector extends EventStore.EventSubscriber {
    constructor(
        @inject("infrastructure.transaction.readModel.repository") private readonly readModel: PostgresRepository,
    ) {
        super();
    }

    protected async onTransactionWasCreated(event: TransactionWasCreated): Promise<void> {
        try {
            await this.readModel.save(Transactions.fromCreated(event));
        } catch (error) {
            throw new Error("Error in Transaction Projector save: " + error.message);
        }
    }
}
