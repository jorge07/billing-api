import InMemoryMiddlewareCache from "@Shared/Application/Middlewares/InMemoryMiddlewareCache";
import LoggerMiddleware from "@Shared/Application/Middlewares/LoggerMiddleware";
import {SharedModule} from "@Shared/Infrastructure/SharedModule";
import Create from "@Transaction/Application/Create/Handler";
import GetOne from "@Transaction/Application/GetOne/Handler";
import TransactionWasCreated from "@Transaction/Domain/Events/TransactionWasCreated";
import Transaction from "@Transaction/Domain/Transaction";
import {Transactions} from "@Transaction/Infrastructure/ReadModel/Mapping/Transactions";
import PostgresProjector from "@Transaction/Infrastructure/ReadModel/Projections/PostgresProjector";
import PostgresRepository from "@Transaction/Infrastructure/ReadModel/Repository/PostgresRepository";
import { EventSourcing, Framework} from "hollywood-js";
import type {interfaces} from "inversify";
import {getRepository} from "typeorm";

export const services = (new Map())
    .set("infrastructure.transaction.async.eventBus", { instance: EventSourcing.EventBus })
    .set("infrastructure.transaction.readModel.dbal", { custom: ({ container }: interfaces.Context) => {
            // Ensure connection is always present
            container.get("infrastructure.orm.readModel.postgresConnection");
            return getRepository<Transactions>(Transactions, "readModel");
        },
    })
    .set("infrastructure.transaction.readModel.repository", { instance: PostgresRepository })
    .set("infrastructure.transaction.readModel.projector", {
        bus: "infrastructure.transaction.async.eventBus",
        instance: PostgresProjector,
        subscriber: [
            TransactionWasCreated,
        ],
    })
    .set("infrastructure.transaction.eventStore", { eventStore: Transaction })
    .set(Framework.SERVICES_ALIAS.COMMAND_MIDDLEWARE, { collection: [
        LoggerMiddleware,
    ]})
    .set(Framework.SERVICES_ALIAS.QUERY_MIDDLEWARE, { collection: [
        InMemoryMiddlewareCache,
        LoggerMiddleware,
    ]})
;

export const TransactionModule = new Framework.ModuleContext({
    commands: [ Create ],
    modules: [ SharedModule ],
    queries: [ GetOne ],
    services,
});
