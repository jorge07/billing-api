import CreateCommand from "Application/UseCase/Transaction/Create/Command";
import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";
import Transaction from "Domain/Transaction/Transaction";
import TransactionId from "Domain/Transaction/ValueObject/TransactionId";
import { Framework } from "hollywood-js";
import { EventCollectorListener}  from "tests/Infrastructure/Shared/EventCollectorListener";
import { InMemoryTransactionRepository } from "tests/Infrastructure/Transaction/InMemoryRepository";
import { v4 } from "uuid";
import { TestKernelFactory } from "../../../TestKernelFactory";


describe("Create Transaction", () => {
    let kernel: Framework.Kernel;

    beforeEach(async () => {
        kernel = await TestKernelFactory(false);
        kernel.container.snapshot();
    });
    afterEach(() => {
        kernel.container.restore();
    });

    test("Create Transactiona valid and get collected by the event bus", async () => {
        expect.assertions(4);
        const txuuid = v4();
        await kernel.handle(new CreateCommand(txuuid, "", { amount: 12, currency: "EUR" }));

        const repository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
        const transaction = await repository.get(new TransactionId(txuuid)) as Transaction;

        expect(transaction).not.toBe(undefined);
        expect(transaction.getAggregateRootId()).toBe(txuuid);

        const eventCollector = kernel.container.get<EventCollectorListener>("infrastructure.shared.eventCollector");

        expect(eventCollector.collected.length).toBe(1);
        expect(eventCollector.collected[0].domainEventName()).toBe(TransactionWasCreated.name);
    });
});
