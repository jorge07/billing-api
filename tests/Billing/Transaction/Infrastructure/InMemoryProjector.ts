import { ReadModel } from "hollywood-js";
import { inject, injectable } from "inversify";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import {Transactions} from "@Transaction/Infrastructure/ReadModel/Mapping/Transactions";

@injectable()
export class TransactionInMemoryProjector extends ReadModel.Projector {
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
