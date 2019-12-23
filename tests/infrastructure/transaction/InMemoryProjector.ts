import { injectable, inject } from 'inversify';
import { EventStore, ReadModel } from 'hollywood-js';
import { Transactions } from 'infrastructure/transaction/readModel/mapping/transactions';
import TransactionWasCreated from 'domain/transaction/events/transactionWasCreated';

@injectable()
export default class TransactionInMemoryProjector extends ReadModel.Projector {
    constructor(
        @inject('infrastructure.transaction.readModel.repository') private readonly readModel: ReadModel.InMemoryReadModelRepository,
    ) {
        super();
    }

    protected onTransactionWasCreated(event: TransactionWasCreated): void {
        this.readModel
            .save(event.uuid.toString(), Transactions.fromCreated(event))
        ;
    }
}
