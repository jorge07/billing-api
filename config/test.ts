import InMemoryTransactionRepository from '../tests/infrastructure/transaction/InMemoryRepository';
import EventCollectorListener from '../tests/infrastructure/shared/EventCollectorListener';
import { EventStore, ReadModel, Framework } from 'hollywood-js';
import TransactionInMemoryProjector from '../tests/infrastructure/transaction/InMemoryProjector';
import TransactionWasCreated from 'domain/transaction/events/transactionWasCreated';
import GenericInMemoryRepository from '../tests/infrastructure/shared/GenericInMemoryRepository';

export const testServices: Framework.ServiceList = new Map([
    [
        "domain.transaction.repository",
        { instance: InMemoryTransactionRepository }
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_SNAPSHOT_DBAL, 
        { instance: EventStore.InMemorySnapshotStoreDBAL }
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_DBAL, 
        { instance: EventStore.InMemoryEventStore }
    ],
    [
        "infrastructure.transaction.readModel.repository",
        { instance: GenericInMemoryRepository }
    ],
    [
        "infrastructure.orm.readModel.postgresConnection",  // Fake connection on tests to avoid connections
        { 
            constant: true,
            async: async () => {
                return { connected: true }
            }
        }
    ],
    [
        "infrastructure.orm.writeModel.postgresConnection",  // Fake connection on tests to avoid connections
        { 
            constant: true,
            async: async () => {
                return { connected: true }
            }
        }
    ],
    [
        "infrastructure.eventBus.publisher", 
        { 
            instance: class { on() {}},
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS, 
            listener: true 
        }
    ],
    [
        "infrastructure.rabbitmq.connection", 
        { 
            constant: true,
            async: async () => {
                return {}
            }
        }
    ],
    [
        "infrastructure.shared.eventCollector", 
        { 
            instance: EventCollectorListener,
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS, 
            listener: true 
        }
    ],
    [
        "infrastructure.transaction.readModel.projector", 
        { 
            instance: TransactionInMemoryProjector, 
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS, 
            subscriber: [TransactionWasCreated] 
        }
    ],   
    [
        "infrastructure.test.inMemory.dbal", 
        { instance: ReadModel.InMemoryReadModelRepository }
    ],
]);
