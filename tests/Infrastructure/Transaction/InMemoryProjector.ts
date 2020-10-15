import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";
import { ReadModel } from "hollywood-js";
import {Transactions} from "Infrastructure/Transaction/ReadModel/Mapping/Transactions";
import { inject, injectable } from "inversify";

@injectable()
export default class TransactionInMemoryProjector extends ReadModel.Projector {
    constructor(
        @inject("infrastructure.transaction.readModel.repository")
        private readonly readModel: ReadModel.InMemoryReadModelRepository,
    ) {
        super();
    }

    protected onTransactionWasCreated(event: TransactionWasCreated): void {
        this.readModel
            .save(event.uuid.toString(), Transactions.fromCreated(event))
        ;
    }
}
