import Kernel from "../../../../src/kernel";
import CreateCommand from '../../../../src/application/transaction/create/command';
import Transaction from '../../../../src/domain/transaction/transaction';
import { Application } from "hollywood-js";
import InMemoryTransactionRepository from '../../infrastructure/transaction/inMemoryRepository';
import EventCollectorListener from '../../infrastructure/shared/EventCollectorListener';
import TransactionWasCreated from "../../../../src/domain/transaction/events/transactionWasCreated";

describe("Create Transaction", () => {

    const kernel: Kernel = new Kernel(false);

    beforeEach(() => {
        kernel.container.snapshot();
    })
    afterEach(() => {
        kernel.container.restore();
    });
    
    test("Create Transactiona valid and get collected by the event bus", async () => {
        expect.assertions(4);
        await kernel.app.handle(new CreateCommand("111", "", { amount: 12, currency: "EUR" }));
        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        const transaction = await repository.get("111") as Transaction;

        expect(transaction).not.toBe(undefined)
        expect(transaction.getAggregateRootId()).toBe("111");

        const eventCollector = kernel.container.get<EventCollectorListener>("infrastructure.shared.eventCollector");

        expect(eventCollector.collected.length).toBe(1);
        expect(eventCollector.collected[0].domainEventName()).toBe(TransactionWasCreated.name);
    });
});
