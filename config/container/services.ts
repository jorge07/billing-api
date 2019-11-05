import Create from '../../src/application/transaction/create/handler';
import Log from '../../src/infrastructure/shared/audit/logger';
import Get from '../../src/application/transaction/get/handler';
import App from '../../src/infrastructure/shared/app';
import InMemoryTransactionRepository from '../../tests/src/infrastructure/transaction/inMemoryRepository';
import { interfaces } from 'inversify';
import { EventStore } from 'hollywood-js';
import Transaction from '../../src/domain/transaction/transaction';
import HTTPServer from '../../src/ui/http/server';
import { IContainerServiceItem } from './items/service';
import LoggerMiddleware from '../../src/application/middlewares/loggerMiddleware';
import InMemoryMiddlewareCache from '../../src/application/middlewares/InMemoryMiddlewareCache';

export const services: Map<string, IContainerServiceItem> = new Map([
    [
        "logger", 
        { instance: Log }
    ],
    [
        "application.command.handler", 
        { collection: [
            Create, 
        ]}
    ],
    [
        "application.query.handler", 
        { collection: [
            Get
        ]}
    ],
    [
        "application.command.middleware",
        {
            collection: [
                LoggerMiddleware,
            ]
        }
    ],
    [
        "application.query.middleware",
        {
            collection: [
                InMemoryMiddlewareCache,
                LoggerMiddleware,
            ]
        }
    ],
    [
        "domain.transaction.repository", 
        { instance: InMemoryTransactionRepository }
    ],
    [
        "infrastructure.eventBus", 
        { instance: EventStore.EventBus }
    ],
    [
        "infrastructure.eventStore.DBAL", 
        { instance: EventStore.InMemoryEventStore }
    ],
    [
        "infrastructure.eventStore.snapshotStoreDBAL", 
        { instance: EventStore.InMemorySnapshotStoreDBAL }
    ],
    [
        "infrastructure.transaction.eventStore", 
        { custom: ({ container } : interfaces.Context): EventStore.EventStore<Transaction> => (
            new EventStore.EventStore<Transaction>(
                Transaction,
                container.get<EventStore.IEventStoreDBAL>("infrastructure.eventStore.DBAL"),
                container.get<EventStore.EventBus>("infrastructure.eventBus"),
                container.get<EventStore.ISnapshotStoreDBAL>("infrastructure.eventStore.snapshotStoreDBAL"),
                container.get<number>("eventStore.margin"),
            ))
        }
    ],
    [
        "app", 
        { instance: App }
    ],
    [
        "ui.httpServer", 
        { instance: HTTPServer }
    ],
]);
