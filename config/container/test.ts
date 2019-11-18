import { IContainerServiceItem, ServiceList } from './items/service';
import InMemoryTransactionRepository from '../../tests/infrastructure/transaction/inMemoryRepository';
import EventCollectorListener from '../../tests/infrastructure/shared/EventCollectorListener';
import { EventStore, ReadModel } from 'hollywood-js';
import TransactionInMemoryProjector from '../../tests/infrastructure/transaction/InMemoryProjector';
import TransactionWasCreated from 'domain/transaction/events/transactionWasCreated';
import GenericInMemoryRepository from '../../tests/infrastructure/shared/GenericInMemoryRepository';
import { injectable, decorate, interfaces } from 'inversify';
import Transaction from '../../src/domain/transaction/transaction';

decorate(injectable(), ReadModel.InMemoryReadModelRepository);

export const testServices: ServiceList = new Map([
    [
        "domain.transaction.repository",
        { instance: InMemoryTransactionRepository }
    ],
    [
        "infrastructure.eventStore.DBAL", 
        { instance: EventStore.InMemoryEventStore }
    ],
    [
        "infrastructure.transaction.eventStore", 
        { custom: ({ container } : interfaces.Context): EventStore.EventStore<Transaction> => (
            new EventStore.EventStore<Transaction>(
                Transaction,
                container.get<EventStore.IEventStoreDBAL>("infrastructure.eventStore.DBAL"),
                container.get<EventStore.EventBus>("infrastructure.eventBus"),
                undefined,
                container.get<number>("eventStore.margin"),
            ))
        }
    ],
    [
        "infrastructure.transaction.readModel.repository", 
        { instance: GenericInMemoryRepository }
    ],
    [
        "infrastructure.orm.postgresConnection", 
        { 
            constant: true,
            async: async () => {
                return { connected: true }
            }
        }
    ],
    [
        "infrastructure.shared.eventCollector", 
        { instance: EventCollectorListener, listener: true }
    ],    
    [
        "infrastructure.transaction.readModel.projector", 
        { instance: TransactionInMemoryProjector, subscriber: [TransactionWasCreated] }
    ],   
    [
        "infrastructure.test.inMemory.dbal", 
        { instance: ReadModel.InMemoryReadModelRepository }
    ],
]);
