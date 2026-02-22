import { inject, injectable } from "inversify";
import { EventSourcing } from "hollywood-js";
import type Transaction from "@Transaction/Domain/Transaction";
import type TransactionId from "@Transaction/Domain/ValueObject/TransactionId";

/**
 * Write-model test double. Loads the aggregate directly from the event store
 * for use in command-side tests. Not an IRepository implementation — this is
 * intentionally separate from the read model.
 */
@injectable()
export class InMemoryTransactionRepository {
    constructor(
       @inject("infrastructure.transaction.eventStore") private readonly eventStore: EventSourcing.EventStore<Transaction>,
    ) {}

    public async save(transaction: Transaction): Promise<void> {
        return await this.eventStore.save(transaction);
    }

    public async get(id: TransactionId): Promise<Transaction | null> {
        return await this.eventStore.load(id.toIdentity());
    }
}
