import TransactionWasCreated from "domain/transaction/events/transactionWasCreated";
import Transaction from "domain/transaction/transaction";
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

    protected onTransactionWasCreated(event: TransactionWasCreated): void {
        this.readModel
            .save(Transactions.fromCreated(event))
            .catch(
                (err) => { throw new Error("Error in Transaction Projector save: " + err.message); },
            )
        ;
    }
}
