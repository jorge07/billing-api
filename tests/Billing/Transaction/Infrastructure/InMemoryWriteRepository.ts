import { EventSourcing } from "hollywood-js";
import { inject, injectable } from "inversify";
import Transaction from "@Transaction/Domain/Transaction";
import ITransactionWriteRepository from "@Transaction/Domain/WriteRepository";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";

/**
 * In-memory ITransactionWriteRepository for tests.
 * Shares the same InMemoryEventStore as InMemoryTransactionRepository
 * so both the write-side (handlers) and the test assertions see the same state.
 */
@injectable()
export class InMemoryWriteRepository implements ITransactionWriteRepository {
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
