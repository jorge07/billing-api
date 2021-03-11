import {Framework} from "hollywood-js";
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
import type {interfaces} from "inversify";
import {getRepository} from "typeorm";
import {parameters} from "../../../config/parameters";

export const services = (new Map())
    .set("logger", { instance: Log })
    .set("infrastructure.shared.audit.probe", { instance: Probe })
    .set("infrastructure.orm.writeModel.postgresConnection", {
        async: async () => {
            const connection = new PostgresClient(Object.assign({}, parameters.get("orm.writeModel")));
            try {
                await connection.connect();
            } catch (err) {
                throw new Error(`PG connection to write model  error: ${err.message}`);
            }

            return { connected: true };
        },
        constant: true,
    })
    .set("infrastructure.orm.readModel.postgresConnection", {
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
        constant: true,
    })
    .set("infrastructure.eventStore.postgresRepository", { custom: ({ container }: interfaces.Context) => {
            // Ensure connection is always present
            container.get("infrastructure.orm.writeModel.postgresConnection");
            return getRepository<Events>(Events);
        },
    })
    .set("infrastructure.eventStore.postgresSnapshotsConnection", { custom: ({ container }: interfaces.Context) => {
            // Ensure connection is always present
            container.get("infrastructure.orm.writeModel.postgresConnection");
            return getRepository<Snapshots>(Snapshots);
        },
    })
    .set(Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_DBAL, { instance: PostgresEventStoreDBAL })
    .set(Framework.SERVICES_ALIAS.DEFAULT_EVENT_STORE_SNAPSHOT_DBAL, { instance: PostgresEventStoreSnapshotDBAL })
    .set("infrastructure.eventBus.publisher", {
        bus: Framework.SERVICES_ALIAS.DEFAULT_EVENT_BUS,
        instance: RabbitMQEventPublisher,
        listener: true,
    })
    .set("infrastructure.rabbitmq.connection", {
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
    })
;

export const SharedModule = new Framework.ModuleContext({
    services,
});
