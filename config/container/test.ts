import { IContainerServiceItem, ServiceList } from './items/service';
import InMemoryTransactionRepository from '../../tests/infrastructure/transaction/inMemoryRepository';
import EventCollectorListener from '../../tests/infrastructure/shared/EventCollectorListener';
import { EventStore } from 'hollywood-js';

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
]);
