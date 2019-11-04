import { EventStore } from "hollywood-js";
import IRepository from "../../../../src/domain/transaction/repository";
import Transaction from '../../../../src/domain/transaction/transaction';
import { TransactionID } from '../../../../src/domain/transaction/transactionId';
import { InMemoryEventStore, EventBus, InMemorySnapshotStoreDBAL } from "hollywood-js/src/EventStore";
import { injectable, inject } from 'inversify';

@injectable()
export default class InMemoryTransactionRepository implements IRepository {
    constructor(
       @inject("infrastructure.transaction.eventStore") private readonly eventStore: EventStore.EventStore<Transaction>
    ) {}

    public async save(transaction: Transaction): Promise<void> {
        return await this.eventStore.save(transaction);
    }

    public async get(id: string): Promise<Transaction | null> {
        return await this.eventStore.load(id);
    }
}
