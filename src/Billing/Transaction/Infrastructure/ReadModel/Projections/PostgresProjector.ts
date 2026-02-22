import TransactionFailed from "@Transaction/Domain/Events/TransactionFailed";
import TransactionWasConfirmed from "@Transaction/Domain/Events/TransactionWasConfirmed";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import TransactionWasRefunded from "@Transaction/Domain/Events/TransactionWasRefunded";
import IRepository from "@Transaction/Domain/Repository";
import { TransactionStatus } from "@Transaction/Domain/ValueObject/TransactionStatus";
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
                status: TransactionStatus.PENDING,
                uuid: event.aggregateId,
            });
        } catch (error) {
            throw new Error("Error in Transaction Projector save: " + error.message);
        }
    }

    protected async onTransactionWasConfirmed(event: TransactionWasConfirmed): Promise<void> {
        await this.readModel.updateStatus(event.aggregateId, TransactionStatus.CONFIRMED);
    }

    protected async onTransactionFailed(event: TransactionFailed): Promise<void> {
        await this.readModel.updateStatus(event.aggregateId, TransactionStatus.FAILED);
    }

    protected async onTransactionWasRefunded(event: TransactionWasRefunded): Promise<void> {
        await this.readModel.updateStatus(event.aggregateId, TransactionStatus.REFUNDED);
    }
}
