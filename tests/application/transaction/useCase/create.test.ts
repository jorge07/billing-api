import CreateCommand from 'application/useCase/transaction/create/command';
import Transaction from 'domain/transaction/transaction';
import { Framework } from "hollywood-js";
import InMemoryTransactionRepository from '../../../infrastructure/transaction/InMemoryRepository';
import EventCollectorListener from '../../../infrastructure/shared/EventCollectorListener';
import TransactionWasCreated from "domain/transaction/events/transactionWasCreated";
import KernelFactory from '../../../../src/kernel';
import TransactionID from 'domain/transaction/valueObject/transactionId';
import { v4 } from 'uuid';


describe("Create Transaction", () => {
    let kernel: Framework.Kernel;

    beforeEach(async () => {
        kernel = await KernelFactory(false);
        kernel.container.snapshot();
    })
    afterEach(() => {
        kernel.container.restore();
    });
    
    test("Create Transactiona valid and get collected by the event bus", async () => {
        expect.assertions(4);
        const txuuid = v4();
        await kernel.handle(new CreateCommand(txuuid, "", { amount: 12, currency: "EUR" }));

        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        const transaction = await repository.get(new TransactionID(txuuid)) as Transaction;

        expect(transaction).not.toBe(undefined)
        expect(transaction.getAggregateRootId()).toBe(txuuid);

        const eventCollector = kernel.container.get<EventCollectorListener>("infrastructure.shared.eventCollector");

        expect(eventCollector.collected.length).toBe(1);
        expect(eventCollector.collected[0].domainEventName()).toBe(TransactionWasCreated.name);
    });
});
