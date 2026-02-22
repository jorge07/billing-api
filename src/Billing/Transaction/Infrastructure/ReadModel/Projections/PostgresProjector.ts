import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import IRepository from "@Transaction/Domain/Repository";
import { EventSourcing } from "hollywood-js";
import { inject, injectable } from "inversify";

@injectable()
export default class PostgresProjector extends EventSourcing.EventSubscriber {
    constructor(
        @inject("infrastructure.transaction.readModel.repository") private readonly readModel: IRepository,
    ) {
        super();
    }

    protected async onTransactionWasCreated(event: TransactionWasCreated): Promise<void> {
        try {
            await this.readModel.save({
                createdAt: new Date(),
                priceAmount: Number(event.amount),
                priceCurrency: event.currency,
                product: event.product,
                uuid: event.aggregateId,
            });
        } catch (error) {
            throw new Error("Error in Transaction Projector save: " + error.message);
        }
    }
}
