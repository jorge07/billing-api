import InMemoryMiddlewareCache from "application/middlewares/InMemoryMiddlewareCache";
import LoggerMiddleware from "application/middlewares/LoggerMiddleware";
import Create from "application/useCase/transaction/create/Handler";
import Get from "application/useCase/transaction/get/Handler";
import TransactionWasCreated from "domain/transaction/events/TransactionWasCreated";
import Transaction from "domain/transaction/Transaction";
import { EventStore, Framework } from "hollywood-js";
import Log from "infrastructure/shared/audit/logger";
import Probe from "infrastructure/shared/audit/probe";
import RabbitMQEventPublisher from "infrastructure/shared/eventListener/RabbitMQEventPublisher";
import PostgresEventStoreDBAL from "infrastructure/shared/eventStore/dbal";
import { Events } from "infrastructure/shared/eventStore/mapping/events";
import { Snapshots } from "infrastructure/shared/eventStore/mapping/snapshots";
import PostgresEventStoreSnapshotDBAL from "infrastructure/shared/eventStore/snapshotDbal";
import PostgresClient from "infrastructure/shared/postgres/postgresClient";
import AMPQChannel from "infrastructure/shared/rabbitmq/channel";
import RabbitMQChannelClientFactory from "infrastructure/shared/rabbitmq/channelFactory";
import { Transactions } from "infrastructure/transaction/readModel/mapping/transactions";
import TransactionPostgresProjector from "infrastructure/transaction/readModel/projections/transactionsPostgresProjector";
import PostgresRepository from "infrastructure/transaction/readModel/repository/PostgresRepository";
import type { interfaces } from "inversify";
import { getRepository } from "typeorm";
import BillingAPI from "ui/http/BillingAPI";
import Monitor from "ui/http/Monitor";
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
            Get,
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
