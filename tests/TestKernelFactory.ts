import { EventSourcing, Framework, ReadModel } from "hollywood-js";
import { TransactionModule } from "Infrastructure/Transaction/TransactionModule";
import { parameters } from "../config/parameters";
import { testParameters } from "../config/paramaters.test";
import { InMemoryTransactionRepository } from "./Infrastructure/Transaction/InMemoryRepository";
import { GenericInMemoryRepository } from "./Infrastructure/Shared/GenericInMemoryRepository";
import { EventCollectorListener } from "./Infrastructure/Shared/EventCollectorListener";
import { TransactionInMemoryProjector } from "./Infrastructure/Transaction/InMemoryProjector";
import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";

const testServices = new Map([
    [
        "domain.transaction.repository",

        { overwrite: true, instance: InMemoryTransactionRepository },
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_SNAPSHOT_DBAL,
        { overwrite: true, instance: EventSourcing.InMemorySnapshotStoreDBAL },
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_DBAL,
        { overwrite: true, instance: EventSourcing.InMemoryEventStore },
    ],
    [
        "infrastructure.transaction.readModel.repository",
        { overwrite: true, instance: GenericInMemoryRepository },
    ],
    [
        "infrastructure.orm.readModel.postgresConnection",  // Fake connection on tests
        {
            overwrite: true,
            constant: true,
            async: async () => {
                return { connected: true };
            },
        },
    ],
    [
        "infrastructure.orm.writeModel.postgresConnection",  // Fake connection on tests
        {
            overwrite: true,
            constant: true,
            async: async () => {
                return { connected: true };
            },
        },
    ],
    [
        "infrastructure.eventBus.publisher",
        {
            // tslint:disable-next-line:no-empty
            instance: class { public on() {}},
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS,
            listener: true,
            overwrite: true,
        },
    ],
    [
        "infrastructure.rabbitmq.connection",
        {
            constant: true,
            overwrite: true,
            async: async () => {
                return {};
            },
        },
    ],
    [
        "infrastructure.shared.eventCollector",
        {
            instance: EventCollectorListener,
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS,
            listener: true,
        },
    ],
    [
        "infrastructure.transaction.readModel.projector",
        {
            instance: TransactionInMemoryProjector,
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS,
            subscriber: [TransactionWasCreated],
        },
    ],
    [
        "infrastructure.test.inMemory.dbal",
        { overwrite: true, instance: ReadModel.InMemoryReadModelRepository },
    ],
]);

export async function TestKernelFactory(debug: boolean): Promise<Framework.Kernel> {
    const TestModule = new Framework.ModuleContext({
        services: testServices,
        modules: [TransactionModule]
    })

    return await Framework.Kernel.createFromModuleContext(
        process.env.NODE_ENV,
        debug,
        parameters,
        TestModule,
        testParameters,
    );
}
