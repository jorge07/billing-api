import Transaction from 'domain/transaction/transaction';
import { Container } from 'inversify';
import { Domain } from 'hollywood-js';
import TransactionWasCreated from 'domain/transaction/events/transactionWasCreated';
import Price from 'domain/transaction/valueObject/price';

describe("Transaction", () => {
    test("Create transaction", () => {
        const price = new Price(2, 'EUR');
        const instance = Transaction.create("111", "product", price);
        const stream = instance.getUncommitedEvents();

        expect(instance.getAggregateRootId()).toBe("111");
        expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
        expect((stream.events[0].event as TransactionWasCreated).product).toBe('product');
        expect((stream.events[0].event as TransactionWasCreated).price).toBe(price);
        expect(instance.version()).toBe(0);
    });
});
