import { inject, injectable } from "inversify";
import { EventSourcing } from "hollywood-js";
import type Transaction from "@Transaction/Domain/Transaction";
import type TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import type IRepository from "@Transaction/Domain/Repository";

@injectable()
export class InMemoryTransactionRepository implements IRepository {
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
