import { Parameter, UniqueParameterIdentifier } from "hollywood-js/src/Framework/Container/Items/Parameter";
import * as readModel from "./packages/orm/readModel/config";
import * as writeModel from "./packages/orm/writeModel/config";
import rabbitmq from "./packages/rabbitmq/config";

export const parameters = new Map<UniqueParameterIdentifier, Parameter>([
    [
        "appName",
        "billing-api",
    ],
    [
        "logLevel",
        process.env.LOG_LEVEL || "info",
    ],
    [
        "orm.writeModel",
        writeModel,
    ],
    [
        "orm.readModel",
        readModel,
    ],
    [
        "rabbitmq",
        rabbitmq,
    ],
    [
        "env",
        process.env.NODE_ENV || "development",
    ],
    [
        "port",
        process.env.PORT || 8080,
    ],
    [
        "metrics.port",
        process.env.METRICS_PORT || 9800,
    ],
    [
        "eventStore.margin",
        10,
    ],
    [
        "metricsConfig",
        { },
    ],
]);
