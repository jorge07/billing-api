import { EventSourcing, Framework } from "hollywood-js";
import { TransactionModule } from "@Transaction/Infrastructure/TransactionModule";
import { parameters } from "../config/parameters";
import { testParameters } from "../config/parameters-test";
import TransactionFailed from "@Transaction/Domain/Events/TransactionFailed";
import TransactionWasConfirmed from "@Transaction/Domain/Events/TransactionWasConfirmed";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import TransactionWasRefunded from "@Transaction/Domain/Events/TransactionWasRefunded";
import {TransactionInMemoryProjector} from "@Tests/Transaction/Infrastructure/InMemoryProjector";
import {InMemoryReadModelRepository} from "@Tests/Transaction/Infrastructure/InMemoryReadModelRepository";
import {EventCollectorListener} from "@Tests/Shared/Infrastructure/EventCollectorListener";
import {InMemoryTransactionRepository} from "@Tests/Transaction/Infrastructure/InMemoryRepository";

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
        { overwrite: true, instance: InMemoryReadModelRepository },
    ],
    [
        "infrastructure.orm.readModel.postgresConnection",
        {
            overwrite: true,
            constant: true,
            async: async () => {
                return { connected: true };
            },
        },
    ],
    [
        "infrastructure.orm.writeModel.postgresConnection",
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
            subscriber: [
                TransactionFailed,
                TransactionWasConfirmed,
                TransactionWasCreated,
                TransactionWasRefunded,
            ],
        },
    ],
]);

export async function TestKernelFactory(): Promise<Framework.Kernel> {
    const TestModule = new Framework.ModuleContext({
        services: testServices,
        modules: [TransactionModule],
    });

    return await Framework.Kernel.createFromModuleContext(
        String(process.env.NODE_ENV),
        parameters,
        TestModule,
        testParameters,
    );
}
