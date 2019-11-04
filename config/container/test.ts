import { IContainerServiceItem, ServiceList } from './items/service';
import InMemoryTransactionRepository from '../../tests/src/infrastructure/transaction/inMemoryRepository';

export const testServices: ServiceList = new Map([
    ["domain.transaction.repository", { instance: InMemoryTransactionRepository}]
]);
