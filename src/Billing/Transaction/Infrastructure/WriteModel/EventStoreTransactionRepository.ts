import Transaction from "@Transaction/Domain/Transaction";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import ITransactionWriteRepository from "@Transaction/Domain/WriteRepository";
import { EventSourcing } from "hollywood-js";
import { inject, injectable } from "inversify";

/**
 * Write-side repository implementation backed by the EventStore.
 *
 * Encapsulates the catch-to-check existence pattern in one place so that
 * command handlers can call exists() without relying on exception control flow.
 */
@injectable()
export default class EventStoreTransactionRepository implements ITransactionWriteRepository {
    constructor(
        @inject("infrastructure.transaction.eventStore")
        private readonly eventStore: EventSourcing.EventStore<Transaction>,
    ) {}

    public async exists(id: TransactionId): Promise<boolean> {
        try {
            await this.eventStore.load(id.toIdentity());
            return true;
        } catch (err) {
            if (err instanceof EventSourcing.AggregateRootNotFoundException) {
                return false;
            }
            throw err;
        }
    }

    public async load(id: TransactionId): Promise<Transaction> {
        return await this.eventStore.load(id.toIdentity()) as Transaction;
    }

    public async save(transaction: Transaction): Promise<void> {
        await this.eventStore.save(transaction);
    }
}
