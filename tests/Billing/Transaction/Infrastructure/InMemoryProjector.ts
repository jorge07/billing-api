import { EventSourcing, ReadModel } from "hollywood-js";
import { inject, injectable } from "inversify";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";

@injectable()
export class TransactionInMemoryProjector extends EventSourcing.EventSubscriber {
    constructor(
        @inject("infrastructure.transaction.readModel.repository")
        private readonly readModel: ReadModel.InMemoryReadModelRepository<any>,
    ) {
        super();
    }

    protected onTransactionWasCreated(event: TransactionWasCreated): void {
        this.readModel.save(event.aggregateId, {
            createdAt: new Date(),
            priceAmount: Number(event.amount),
            priceCurrency: event.currency,
            product: event.product,
            uuid: event.aggregateId,
        });
    }
}
