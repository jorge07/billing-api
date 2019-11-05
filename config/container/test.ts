import { IContainerServiceItem, ServiceList } from './items/service';
import InMemoryTransactionRepository from '../../tests/src/infrastructure/transaction/inMemoryRepository';
import EventCollectorListener from '../../tests/src/infrastructure/shared/EventCollectorListener';

export const testServices: ServiceList = new Map([
    [
        "domain.transaction.repository",
        { instance: InMemoryTransactionRepository }
    ],
    [
        "infrastructure.shared.eventCollector", 
        { instance: EventCollectorListener, listener: true }
    ],
]);
