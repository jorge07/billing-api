import InMemoryMiddlewareCache from "Application/Middlewares/InMemoryMiddlewareCache";
import LoggerMiddleware from "Application/Middlewares/LoggerMiddleware";
import Create from "Application/UseCase/Transaction/Create/Handler";
import GetOne from "Application/UseCase/Transaction/GetOne/Handler";
import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";
import Transaction from "Domain/Transaction/Transaction";
import { EventStore, Framework } from "hollywood-js";
import Log from "Infrastructure/Shared/Audit/Logger";
import Probe from "Infrastructure/Shared/Audit/Probe";
import RabbitMQEventPublisher from "Infrastructure/Shared/EventListener/RabbitMQEventPublisher";
import PostgresEventStoreDBAL from "Infrastructure/Shared/EventStore/DBAL";
import {Events} from "Infrastructure/Shared/EventStore/Mapping/Events";
import {Snapshots} from "Infrastructure/Shared/EventStore/Mapping/Snapshots";
import PostgresEventStoreSnapshotDBAL from "Infrastructure/Shared/EventStore/SnapshotDbal";
import PostgresClient from "Infrastructure/Shared/Postgres/PostgresClient";
import AMPQChannel from "Infrastructure/Shared/Rabbitmq/Channel";
import RabbitMQChannelClientFactory from "Infrastructure/Shared/Rabbitmq/ChannelFactory";
import {Transactions} from "Infrastructure/Transaction/ReadModel/Mapping/Transactions";
// tslint:disable-next-line:import-spacing
import TransactionPostgresProjector
    from "Infrastructure/Transaction/ReadModel/Projections/TransactionsPostgresProjector";
import PostgresRepository from "Infrastructure/Transaction/ReadModel/Repository/PostgresRepository";
import type { interfaces } from "inversify";
import {getRepository} from "typeorm";
import BillingAPI from "UI/HTTP/BillingAPI";
import Monitor from "UI/HTTP/Monitor";
import { parameters } from "./parameters";

export const services: Framework.ServiceList = new Map([
    [
        "logger",
        { instance: Log },
    ],
    [
        Framework.SERVICES_ALIAS.COMMAND_HANDLERS,
        { collection: [
            Create,
        ]},
    ],
    [
        Framework.SERVICES_ALIAS.QUERY_HANDLERS,
        { collection: [
            GetOne,
        ]},
    ],
    [
        Framework.SERVICES_ALIAS.COMMAND_MIDDLEWARE,
        {
            collection: [
                LoggerMiddleware,
            ],
        },
    ],
    [
        Framework.SERVICES_ALIAS.QUERY_MIDDLEWARE,
        {
            collection: [
                InMemoryMiddlewareCache,
                LoggerMiddleware,
            ],
        },
    ],
    [
        "infrastructure.shared.audit.probe",
        { instance: Probe },
    ],
    [
        "infrastructure.transaction.async.eventBus",
        { instance: EventStore.EventBus },
    ],
    [
        "infrastructure.orm.writeModel.postgresConnection",
        {
            constant: true,
            async: async () => {
                const connection = new PostgresClient(Object.assign({}, parameters.get("orm.writeModel")));
                try {
                    await connection.connect();
                } catch (err) {
                    throw new Error(`PG connection to write model  error: ${err.message}`);
                }

                return { connected: true };
            },
        },
    ],
    [
        "infrastructure.orm.readModel.postgresConnection",
        {
            constant: true,
            async: async () => {
                const connection = new PostgresClient(Object.assign({}, parameters.get("orm.readModel")));
                try {
                    await connection.connect();
                } catch (err) {
                    console.error(`PG connection to read model error: ${err.message}`);
                    throw new Error(`PG connection to read model error: ${err.message}`);
                }

                return { connected: true };
            },
        },
    ],
    [
        "infrastructure.eventStore.postgresRepository",
        { custom: ({ container }: interfaces.Context) => {
                // Ensure connection is always present
                container.get("infrastructure.orm.writeModel.postgresConnection");
                return getRepository<Events>(Events);
            },
        },
    ],
    [
        "infrastructure.transaction.readModel.dbal",
        { custom: ({ container }: interfaces.Context) => {
                // Ensure connection is always present
                container.get("infrastructure.orm.readModel.postgresConnection");
                return getRepository<Transactions>(Transactions, "readModel");
            },
        },
    ],
    [
        "infrastructure.transaction.readModel.repository",
        { instance: PostgresRepository },
    ],
    [
        "infrastructure.transaction.readModel.projector",
        {
            instance: TransactionPostgresProjector,
            bus: "infrastructure.transaction.async.eventBus",
            subscriber: [
                TransactionWasCreated,
            ],
        },
    ],
    [
        "infrastructure.eventStore.postgresSnapshotsConnection",
        { custom: ({ container }: interfaces.Context) => {
                // Ensure connection is always present
                container.get("infrastructure.orm.writeModel.postgresConnection");
                return getRepository<Snapshots>(Snapshots);
            },
        },
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_DBAL,
        { instance: PostgresEventStoreDBAL },
    ],
    [
        Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_SNAPSHOT_DBAL,
        { instance: PostgresEventStoreSnapshotDBAL },
    ],
    [
        "infrastructure.eventBus.publisher",
        {
            instance: RabbitMQEventPublisher,
            bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS,
            listener: true,
        },
    ],
    [
        "infrastructure.transaction.eventStore",
        { eventStore: Transaction },
    ],
    [
        "infrastructure.rabbitmq.connection",
        {
            async: async () => {
                const factory = new RabbitMQChannelClientFactory(Object.assign({}, parameters.get("rabbitmq")));
                let client: AMPQChannel;

                try {
                    const { channel, connection } = await factory.createChannel();
                    client = new AMPQChannel(connection, channel);
                } catch (err) {
                    throw new Error(`RabbitMQ connection error: ${err.message}`);
                }

                return client;
            },
        },
    ],
    [
        "ui.httpServer",
        { instance: BillingAPI },
    ],
    [
        "ui.monitor",
        { instance: Monitor },
    ],
]);
