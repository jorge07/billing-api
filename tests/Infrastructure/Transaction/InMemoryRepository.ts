import IRepository from "Domain/Transaction/Repository";
import Transaction from "Domain/Transaction/Transaction";
import TransactionId from "Domain/Transaction/ValueObject/TransactionId";
import { EventStore } from "hollywood-js";
import { inject, injectable } from "inversify";

@injectable()
export default class InMemoryTransactionRepository implements IRepository {
    constructor(
       @inject("infrastructure.transaction.eventStore") private readonly eventStore: EventStore.EventStore<Transaction>,
    ) {}

    public async save(transaction: Transaction): Promise<void> {
        return await this.eventStore.save(transaction);
    }

    public async get(id: TransactionId): Promise<Transaction | null> {
        return await this.eventStore.load(id.toString());
    }
}
