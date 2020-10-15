import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";
import { EventStore, Framework, ReadModel } from "hollywood-js";
import EventCollectorListener from "../tests/Infrastructure/Shared/EventCollectorListener";
import GenericInMemoryRepository from "../tests/Infrastructure/Shared/GenericInMemoryRepository";
import TransactionInMemoryProjector from "../tests/Infrastructure/Transaction/InMemoryProjector";
import InMemoryTransactionRepository from "../tests/Infrastructure/Transaction/InMemoryRepository";

export const testServices: Framework.ServiceList = new Map([
    [
        "domain.transaction.repository",
        { instance: InMemoryTransactionRepository },
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_SNAPSHOT_DBAL,
        { instance: EventStore.InMemorySnapshotStoreDBAL },
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_DBAL,
        { instance: EventStore.InMemoryEventStore },
    ],
    [
        "infrastructure.transaction.readModel.repository",
        { instance: GenericInMemoryRepository },
    ],
    [
        "infrastructure.orm.readModel.postgresConnection",  // Fake connection on tests
        {
            constant: true,
            async: async () => {
                return { connected: true };
            },
        },
    ],
    [
        "infrastructure.orm.writeModel.postgresConnection",  // Fake connection on tests
        {
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
        },
    ],
    [
        "infrastructure.rabbitmq.connection",
        {
            constant: true,
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
        { instance: ReadModel.InMemoryReadModelRepository },
    ],
]);
