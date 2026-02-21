import { EventSourcing, ReadModel } from "hollywood-js";
import { inject, injectable } from "inversify";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import {Transactions} from "@Transaction/Infrastructure/ReadModel/Mapping/Transactions";

@injectable()
export class TransactionInMemoryProjector extends EventSourcing.EventSubscriber {
    constructor(
        @inject("infrastructure.transaction.readModel.repository")
        private readonly readModel: ReadModel.InMemoryReadModelRepository<any>,
    ) {
        super();
    }

    protected onTransactionWasCreated(event: TransactionWasCreated): void {
        this.readModel
            .save(event.aggregateId, Transactions.fromCreated(event))
        ;
    }
}
