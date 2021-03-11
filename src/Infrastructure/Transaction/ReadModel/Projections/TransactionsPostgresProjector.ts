import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";
import { EventSourcing } from "hollywood-js";
import PostgresRepository from "Infrastructure/Transaction/ReadModel/Repository/PostgresRepository";
import { inject, injectable } from "inversify";
import { Transactions } from "../Mapping/Transactions";

@injectable()
export default class TransactionPostgresProjector extends EventSourcing.EventSubscriber {
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
