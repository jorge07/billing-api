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
import { Transactions } from 'infrastructure/transaction/readModel/mapping/transactions';
import PostgresEventStoreSnapshotDBAL from 'infrastructure/shared/eventStore/snapshotDbal';
import { Snapshots } from 'infrastructure/shared/eventStore/mapping/snapshots';
import TransactionPostgresProjector from 'infrastructure/transaction/readModel/projections/transactionsPostgresProjector';
import TransactionWasCreated from 'domain/transaction/events/transactionWasCreated';
import PostgresRepository from 'infrastructure/transaction/readModel/repository/PostgresRepository';
import RabbitMQChannelClientFactory from 'infrastructure/shared/rabbitmq/channelFactory';
import AMPQChannel from 'infrastructure/shared/rabbitmq/channel';

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
        "infrastructure.transaction.eventBus", 
        { instance: EventStore.EventBus }
    ],
    [
        "infrastructure.transaction.async.eventBus", 
        { instance: EventStore.EventBus }
    ],
    [
        "infrastructure.orm.writeModel.postgresConnection", 
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
        "infrastructure.orm.readModel.postgresConnection", 
        { 
            constant: true,
            async: async () => {
                const connection = new PostgresClient(Object.assign({}, config.get('orm.readModel')));
                
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
        "infrastructure.eventStore.postgresRepository", 
        { custom: ({ container } : interfaces.Context) => {
                // Ensure connection is always present
                container.get('infrastructure.orm.writeModel.postgresConnection');            
                return getRepository<Events>(Events);
            }
        }
    ],
    [
        "infrastructure.transaction.readModel.dbal", 
        { custom: ({ container } : interfaces.Context) => {
                // Ensure connection is always present
                container.get('infrastructure.orm.readModel.postgresConnection');            
                return getRepository<Transactions>(Transactions, 'readModel');
            }
        }
    ],
    [
        "infrastructure.transaction.readModel.repository", 
        { instance: PostgresRepository }
    ],
    [
        "infrastructure.transaction.readModel.projector", 
        { 
            instance: TransactionPostgresProjector, 
            bus: 'infrastructure.transaction.async.eventBus', 
            subscriber: [
                TransactionWasCreated
            ] 
        }
    ],
    [
        "infrastructure.eventStore.postgresSnapshotsConnection", 
        { custom: ({ container } : interfaces.Context) => {
                // Ensure connection is always present
                container.get('infrastructure.orm.writeModel.postgresConnection');            
                return getRepository<Snapshots>(Snapshots);
            }
        }
    ],
    [
        "infrastructure.eventStore.DBAL", 
        { instance: PostgresEventStoreDBAL }
    ],
    [
        "infrastructure.eventStore.snapshotStoreDBAL", 
        { instance: PostgresEventStoreSnapshotDBAL }
    ],
    [
        "infrastructure.transaction.eventStore", 
        { custom: ({ container } : interfaces.Context): EventStore.EventStore<Transaction> => (
            new EventStore.EventStore<Transaction>(
                Transaction,
                container.get<EventStore.IEventStoreDBAL>("infrastructure.eventStore.DBAL"),
                container.get<EventStore.EventBus>("infrastructure.transaction.eventBus"),
                container.get<EventStore.ISnapshotStoreDBAL>("infrastructure.eventStore.snapshotStoreDBAL"),
                container.get<number>("eventStore.margin"),
            ))
        }
    ],
    [
        "infrastructure.transaction.rabbitmq.connection", 
        { 
            constant: true,
            async: async () => {
                const factory = new RabbitMQChannelClientFactory(Object.assign({}, config.get('rabbitmq')));
                let client;

                try {
                    const { channel, connection } = await factory.createChannel();
                    client = new AMPQChannel(connection, channel);
                } catch (err) {
                    throw new Error('RabbitMQ connection error: ' + err.message);
                }

                return client;
            }
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
