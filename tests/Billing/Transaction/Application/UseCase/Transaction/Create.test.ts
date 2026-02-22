import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import { v4 } from "uuid";
import {TestKernelFactory} from "../../../../../TestKernelFactory";
import CreateCommand from "@Transaction/Application/Create/Command";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import {InMemoryTransactionRepository} from "@Tests/Transaction/Infrastructure/InMemoryRepository";
import {EventCollectorListener} from "@Tests/Shared/Infrastructure/EventCollectorListener";

function getCounterValue(name: string): number {
    const metric = prom.register.getSingleMetric(name) as any;
    if (!metric) { return 0; }
    return metric.hashMap[""]?.value ?? 0;
}

describe("Create Transaction", () => {
    let kernel: Framework.Kernel;

    beforeEach(async () => {
        prom.register.clear();
        kernel = await TestKernelFactory();
        kernel.container.snapshot();
    });
    afterEach(() => {
        kernel.container.restore();
    });

    test("Create a Transaction valid and get collected by the event bus", async () => {
        expect.assertions(4);
        const txuuid = v4();
        await kernel.app.handle(new CreateCommand(txuuid, "", { amount: 12, currency: "EUR" }));

        const repository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
        const transaction = await repository.get(new TransactionId(txuuid)) as Transaction;

        expect(transaction).not.toBe(undefined);
        expect(transaction.getAggregateRootId().toString()).toBe(txuuid);

        const eventCollector = kernel.container.get<EventCollectorListener>("infrastructure.shared.eventCollector");

        expect(eventCollector.collected.length).toBe(1);
        expect(eventCollector.collected[0].constructor.name).toBe(TransactionWasCreated.name);
    });

    test("Duplicate transaction increments conflict counter only — error counter stays at zero", async () => {
        expect.assertions(2);
        const txuuid = v4();

        await kernel.app.handle(new CreateCommand(txuuid, "", { amount: 12, currency: "EUR" }));

        try {
            await kernel.app.handle(new CreateCommand(txuuid, "", { amount: 12, currency: "EUR" }));
        } catch (_) {
            // ConflictException expected — we only care about the counters
        }

        expect(getCounterValue("transaction_create_conflict")).toBe(1);
        expect(getCounterValue("transaction_create_error")).toBe(0);
    });
});
