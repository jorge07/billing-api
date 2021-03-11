import { Framework } from "hollywood-js";
import { v4 } from "uuid";
import {TestKernelFactory} from "../../../../../TestKernelFactory";
import CreateCommand from "@Transaction/Application/Create/Command";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import {InMemoryTransactionRepository} from "@Tests/Transaction/Infrastructure/InMemoryRepository";
import {EventCollectorListener} from "@Tests/Shared/Infrastructure/EventCollectorListener";

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
