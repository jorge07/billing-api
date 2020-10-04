import IRepository from "domain/transaction/Repository";
import Transaction from "domain/transaction/Transaction";
import TransactionID from "domain/transaction/valueObject/transactionId";
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

    public async get(id: TransactionID): Promise<Transaction | null> {
        return await this.eventStore.load(id.toString());
    }
}
