import type { Framework } from 'hollywood-js';
import { UniqueParameterIdentifier, Parameter } from 'hollywood-js/src/Framework/Container/Items/Parameter';
import * as writeModel from "./packages/orm/writeModel/config"
import * as readModel from "./packages/orm/readModel/config"
import rabbitmq from "./packages/rabbitmq/config"

export const parameters: Framework.ParametersList = new Map<UniqueParameterIdentifier, Parameter>([
    [
        "appName", 
        'billing-api'
    ],
    [
        "logLevel",
        process.env.LOG_LEVEL || 'info'
    ],
    [
        "orm.writeModel",
        writeModel
    ],
    [
        "orm.readModel",
        readModel
    ],
    [
        "rabbitmq",
        rabbitmq
    ],
    [
        "env",
        process.env.NODE_ENV || 'development'
    ],
    [
        "port", 
        process.env.PORT || 8080
    ],
    [
        "eventStore.margin", 
        10
    ],
    [
        "metricsConfig", 
        { }
    ],
]);
