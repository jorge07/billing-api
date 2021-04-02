import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import { EventSourcing } from "hollywood-js";
import { inject, injectable } from "inversify";
import { Transactions } from "../Mapping/Transactions";
import PostgresRepository from "../Repository/PostgresRepository";

@injectable()
export default class PostgresProjector extends EventSourcing.EventSubscriber {
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
