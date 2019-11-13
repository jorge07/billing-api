import Create from 'application/transaction/create/handler';
import Log from 'infrastructure/shared/audit/logger';
import Get from 'application/transaction/get/handler';
import App from 'application/index';
import { interfaces, decorate, injectable } from 'inversify';
import { EventStore } from 'hollywood-js';
import Transaction from 'domain/transaction/transaction';
import HTTPServer from 'ui/http/server';
import { IContainerServiceItem } from './items/service';
import LoggerMiddleware from 'application/middlewares/loggerMiddleware';
import InMemoryMiddlewareCache from 'application/middlewares/InMemoryMiddlewareCache';
import InMemoryTransactionRepository from '../../tests/infrastructure/transaction/inMemoryRepository';
import { getRepository, Connection, Repository } from 'typeorm';
import { Events } from 'infrastructure/shared/eventStore/mapping/events';
import PostgresEventStoreDBAL from 'infrastructure/shared/eventStore/dbal';
import PostgresClient from 'infrastructure/shared/postgres/postgresClient';
import * as config from 'config';

decorate(injectable(), EventStore.InMemoryEventStore);
decorate(injectable(), EventStore.InMemorySnapshotStoreDBAL);
decorate(injectable(), EventStore.EventListener);
decorate(injectable(), EventStore.EventSubscriber);
decorate(injectable(), EventStore.EventStore);
decorate(injectable(), EventStore.EventBus);
decorate(injectable(), Repository);
decorate(injectable(), Connection);

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
        "infrastructure.orm.postgresConnection", 
        { 
            constant: true,
            async: async () => {
                const connection = new PostgresClient(Object.assign({}, config.get('orm.writeModel')));
                
                try {
                    await connection.connect();
                } catch (err) {
                    throw new Error('PG connection error: ' + err.message);
                }

                return { connected: true }
            }
        }
    ],
    [
        "infrastructure.eventStore.postgresConnection", 
        { custom: ({ container } : interfaces.Context) => {
                // Ensure connection is always present
                container.get('infrastructure.orm.postgresConnection');            
                return getRepository<Events>(Events);
            }
        }
    ],
    [
        "infrastructure.eventStore.DBAL", 
        { instance: PostgresEventStoreDBAL }
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
