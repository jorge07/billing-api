import InMemoryMiddlewareCache from "Application/Middlewares/InMemoryMiddlewareCache";
import LoggerMiddleware from "Application/Middlewares/LoggerMiddleware";
import Create from "Application/UseCase/Transaction/Create/Handler";
import GetOne from "Application/UseCase/Transaction/GetOne/Handler";
import TransactionWasCreated from "Domain/Transaction/Events/TransactionWasCreated";
import Transaction from "Domain/Transaction/Transaction";
import { EventSourcing, Framework} from "hollywood-js";
import {SharedModule} from "Infrastructure/Shared/SharedModule";
import {Transactions} from "Infrastructure/Transaction/ReadModel/Mapping/Transactions";
import TransactionPostgresProjector from "Infrastructure/Transaction/ReadModel/Projections/TransactionsPostgresProjector";
import PostgresRepository from "Infrastructure/Transaction/ReadModel/Repository/PostgresRepository";
import {interfaces} from "inversify";
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
        instance: TransactionPostgresProjector,
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
